import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'livhome.app-state.v1';
const STORAGE_VERSION = 1;

type PersistedValue = null | boolean | number | string | PersistedValue[] | { [key: string]: PersistedValue };

type PersistedEnvelope = {
  version: number;
  values: Record<string, PersistedValue>;
};

const EMPTY_STATE: PersistedEnvelope = {
  version: STORAGE_VERSION,
  values: {},
};

let state: PersistedEnvelope = EMPTY_STATE;
let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
let writeQueue: Promise<void> = Promise.resolve();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const subscribePersistence = subscribe;

const emit = () => listeners.forEach((listener) => listener());

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isEnvelope = (value: unknown): value is PersistedEnvelope =>
  isPlainObject(value) && value.version === STORAGE_VERSION && isPlainObject(value.values);

const serialise = () => JSON.stringify(state);

const queueWrite = () => {
  // 一次存储失败不能阻断后续所有写入；下一次写入从已恢复的链继续执行。
  writeQueue = writeQueue
    .catch(() => undefined)
    .then(() => AsyncStorage.setItem(STORAGE_KEY, serialise()));
  return writeQueue;
};

export const isPersistenceHydrated = () => hydrated;
export const usePersistenceHydrated = () => useSyncExternalStore(subscribe, isPersistenceHydrated);

export function getPersistedValue<T extends PersistedValue>(key: string): T | undefined {
  return state.values[key] as T | undefined;
}

export async function hydratePersistence() {
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: unknown = JSON.parse(raw);
      if (isEnvelope(parsed)) {
        state = parsed;
        return;
      }

      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      state = EMPTY_STATE;
    } finally {
      hydrated = true;
      emit();
    }
  })();

  return hydrationPromise;
}

export function setPersistedValue<T extends PersistedValue>(key: string, value: T) {
  if (!hydrated) throw new Error('Persistent state must be hydrated before it is updated.');

  state = {
    version: STORAGE_VERSION,
    values: { ...state.values, [key]: value },
  };
  emit();

  return queueWrite();
}

export function removePersistedValue(key: string) {
  if (!hydrated) throw new Error('Persistent state must be hydrated before it is updated.');

  const { [key]: _removed, ...values } = state.values;
  state = { version: STORAGE_VERSION, values };
  emit();

  return queueWrite();
}

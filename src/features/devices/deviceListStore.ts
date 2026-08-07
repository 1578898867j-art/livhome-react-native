import { useSyncExternalStore } from 'react';
import type { DeviceSummary } from '../../contracts';
import {
  getPersistedValue,
  isPersistenceHydrated,
  setPersistedValue,
  subscribePersistence,
} from '../app/persistence';

const STORE_KEY = 'devices';

const INITIAL_DEVICES: DeviceSummary[] = [
  { id: 'living-room', name: 'Living Room', status: 'online' },
  { id: 'backyard', name: 'Backyard', status: 'online' },
  { id: 'bedroom-cam', name: 'Bedroom Cam', status: 'offline' },
];

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const emit = () => listeners.forEach((listener) => listener());

export const subscribeDeviceList = subscribe;

let devices = [...INITIAL_DEVICES];
let boundDeviceSequence = 0;
let selectedDeviceId = INITIAL_DEVICES[0].id;

type StoredDeviceList = {
  devices: DeviceSummary[];
  boundDeviceSequence: number;
  selectedDeviceId: string;
};

const isStoredDevice = (value: unknown): value is DeviceSummary => {
  if (!value || typeof value !== 'object') return false;
  const device = value as Partial<DeviceSummary>;
  return (
    typeof device.id === 'string' &&
    typeof device.name === 'string' &&
    (device.status === 'online' || device.status === 'offline')
  );
};

const isStoredDeviceList = (value: unknown): value is StoredDeviceList => {
  if (!value || typeof value !== 'object') return false;
  const snapshot = value as Partial<StoredDeviceList>;
  return (
    Array.isArray(snapshot.devices) &&
    snapshot.devices.every(isStoredDevice) &&
    typeof snapshot.boundDeviceSequence === 'number' &&
    Number.isInteger(snapshot.boundDeviceSequence) &&
    snapshot.boundDeviceSequence >= 0 &&
    typeof snapshot.selectedDeviceId === 'string'
  );
};

const getSelectedDeviceSnapshot = () =>
  devices.find((device) => device.id === selectedDeviceId) ?? null;

const snapshot = (): StoredDeviceList => ({
  devices,
  boundDeviceSequence,
  selectedDeviceId,
});

const persist = () => {
  if (!isPersistenceHydrated()) return;
  void setPersistedValue(STORE_KEY, snapshot()).catch(() => {});
};

let loadedFromPersistence = false;
const restoreFromPersistence = () => {
  if (loadedFromPersistence || !isPersistenceHydrated()) return;
  loadedFromPersistence = true;
  const stored = getPersistedValue<StoredDeviceList>(STORE_KEY);
  if (!isStoredDeviceList(stored)) return;

  devices = stored.devices.length ? stored.devices : [...INITIAL_DEVICES];
  boundDeviceSequence = stored.boundDeviceSequence;
  selectedDeviceId = devices.some((device) => device.id === stored.selectedDeviceId)
    ? stored.selectedDeviceId
    : devices[0].id;
  emit();
};

subscribePersistence(restoreFromPersistence);
restoreFromPersistence();

export const useDeviceList = () => useSyncExternalStore(subscribe, () => devices);
export const useSelectedDevice = () => useSyncExternalStore(subscribe, getSelectedDeviceSnapshot);

export const getSelectedDevice = getSelectedDeviceSnapshot;

export function selectDevice(deviceId: string) {
  if (deviceId === selectedDeviceId || !devices.some((device) => device.id === deviceId)) return;
  selectedDeviceId = deviceId;
  emit();
  persist();
}

export function addBoundDevice(name: string) {
  const device: DeviceSummary = {
    id: `bound-device-${++boundDeviceSequence}`,
    name: name.trim() || 'Living Room Camera',
    status: 'online',
  };

  devices = [device, ...devices];
  selectedDeviceId = device.id;
  emit();
  persist();
  return device;
}

export function renameDevice(deviceId: string, name: string) {
  const nextName = name.trim();
  if (!nextName || !devices.some((device) => device.id === deviceId)) return;

  devices = devices.map((device) => (device.id === deviceId ? { ...device, name: nextName } : device));
  emit();
  persist();
}

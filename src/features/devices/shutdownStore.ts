import { useSyncExternalStore } from 'react';
import {
  getPersistedValue,
  isPersistenceHydrated,
  setPersistedValue,
  subscribePersistence,
} from '../app/persistence';
import { getSelectedDevice, subscribeDeviceList } from './deviceListStore';

const STORE_KEY = 'shutdown-schedules';
const DAY_MINUTES = 24 * 60;
const WEEK_MINUTES = 7 * DAY_MINUTES;

export type TM = { h: number; m: number };
export type Sched = { off: TM; on: TM; days: boolean[] };
type Interval = { start: number; end: number };

const INITIAL_SCHEDULES: Sched[] = [
  { off: { h: 23, m: 0 }, on: { h: 7, m: 0 }, days: [true, true, true, true, true, true, true] },
  { off: { h: 19, m: 0 }, on: { h: 20, m: 0 }, days: [false, true, true, true, true, true, false] },
];
const DEFAULT_DRAFT_DAYS = [true, true, true, true, true, true, true];

let schedulesByDeviceId: Record<string, Sched[]> = {};
let draftDaysByDeviceId: Record<string, boolean[]> = {};
let editingScheduleIndexByDeviceId: Record<string, number | null> = {};
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emit = () => listeners.forEach((listener) => listener());

const isTime = (value: unknown): value is TM => {
  if (!value || typeof value !== 'object') return false;
  const time = value as Partial<TM>;
  return (
    typeof time.h === 'number' && Number.isInteger(time.h) && time.h >= 0 && time.h < 24 &&
    typeof time.m === 'number' && Number.isInteger(time.m) && time.m >= 0 && time.m < 60
  );
};

const isSchedule = (value: unknown): value is Sched => {
  if (!value || typeof value !== 'object') return false;
  const schedule = value as Partial<Sched>;
  return (
    isTime(schedule.off) &&
    isTime(schedule.on) &&
    Array.isArray(schedule.days) &&
    schedule.days.length === 7 &&
    schedule.days.every((day) => typeof day === 'boolean')
  );
};

const isSchedulesByDevice = (value: unknown): value is Record<string, Sched[]> =>
  !!value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.values(value).every((schedules) => Array.isArray(schedules) && schedules.every(isSchedule));

const selectedDeviceId = () => getSelectedDevice()?.id;

const schedulesFor = (deviceId: string | undefined) =>
  deviceId ? schedulesByDeviceId[deviceId] ?? INITIAL_SCHEDULES : INITIAL_SCHEDULES;

const draftDaysFor = (deviceId: string | undefined) =>
  deviceId ? draftDaysByDeviceId[deviceId] ?? DEFAULT_DRAFT_DAYS : DEFAULT_DRAFT_DAYS;

const editingScheduleIndexFor = (deviceId: string | undefined) =>
  (deviceId ? editingScheduleIndexByDeviceId[deviceId] : null) ?? null;

const getSchedulesSnapshot = () => schedulesFor(selectedDeviceId());
const getDraftDaysSnapshot = () => draftDaysFor(selectedDeviceId());

const subscribeSelectedDevice = (listener: () => void) => {
  const unsubscribeSchedules = subscribe(listener);
  const unsubscribeDevices = subscribeDeviceList(listener);
  return () => {
    unsubscribeSchedules();
    unsubscribeDevices();
  };
};

const persist = () => {
  if (!isPersistenceHydrated()) return;
  void setPersistedValue(STORE_KEY, schedulesByDeviceId).catch(() => {});
};

let loadedFromPersistence = false;
const restoreFromPersistence = () => {
  if (loadedFromPersistence || !isPersistenceHydrated()) return;
  loadedFromPersistence = true;
  const stored = getPersistedValue<Record<string, Sched[]>>(STORE_KEY);
  if (!isSchedulesByDevice(stored)) return;
  schedulesByDeviceId = stored;
  emit();
};

subscribePersistence(restoreFromPersistence);
restoreFromPersistence();

export const useSchedules = () => useSyncExternalStore(subscribeSelectedDevice, getSchedulesSnapshot);
export const useDraftDays = () => useSyncExternalStore(subscribeSelectedDevice, getDraftDaysSnapshot);

export function formatRepeatLabel(days: boolean[]) {
  const enabledDays = days.filter(Boolean).length;
  if (enabledDays === 7) return 'Everyday';
  if (enabledDays === 0) return 'Once';
  if (days[1] && days[2] && days[3] && days[4] && days[5] && !days[0] && !days[6]) return 'Weekdays';
  if (days[0] && days[6] && enabledDays === 2) return 'Weekends';
  return 'Custom';
}

export function beginNewSchedule() {
  const deviceId = selectedDeviceId();
  if (!deviceId) return;
  editingScheduleIndexByDeviceId = { ...editingScheduleIndexByDeviceId, [deviceId]: null };
  draftDaysByDeviceId = { ...draftDaysByDeviceId, [deviceId]: [true, true, true, true, true, true, true] };
  emit();
}

export function beginScheduleEdit(index: number) {
  const deviceId = selectedDeviceId();
  const schedule = schedulesFor(deviceId)[index];
  if (!deviceId || !schedule) return;
  editingScheduleIndexByDeviceId = { ...editingScheduleIndexByDeviceId, [deviceId]: index };
  draftDaysByDeviceId = { ...draftDaysByDeviceId, [deviceId]: [...schedule.days] };
  emit();
}

export function getEditingSchedule() {
  const deviceId = selectedDeviceId();
  const index = editingScheduleIndexFor(deviceId);
  return index === null ? null : schedulesFor(deviceId)[index] ?? null;
}

export function getEditingScheduleIndex() {
  return editingScheduleIndexFor(selectedDeviceId());
}

export function saveSchedule(schedule: Sched) {
  const deviceId = selectedDeviceId();
  if (!deviceId) return;
  const current = schedulesFor(deviceId);
  const editingIndex = editingScheduleIndexFor(deviceId);
  const savedSchedule = { ...schedule, off: { ...schedule.off }, on: { ...schedule.on }, days: [...schedule.days] };
  const next = editingIndex === null
    ? [...current, savedSchedule]
    : current.map((item, index) => (index === editingIndex ? savedSchedule : item));

  schedulesByDeviceId = { ...schedulesByDeviceId, [deviceId]: next };
  editingScheduleIndexByDeviceId = { ...editingScheduleIndexByDeviceId, [deviceId]: null };
  emit();
  persist();
}

const toMinutes = (time: TM) => time.h * 60 + time.m;

function intervalsFor(schedule: Sched): Interval[] {
  const off = toMinutes(schedule.off);
  const on = toMinutes(schedule.on);
  return schedule.days.flatMap((enabled, day) => {
    if (!enabled) return [];
    const start = day * DAY_MINUTES + off;
    return [{ start, end: day * DAY_MINUTES + on + (on <= off ? DAY_MINUTES : 0) }];
  });
}

export function hasScheduleConflict(candidate: Sched, ignoreIndex: number | null = null) {
  const candidateIntervals = intervalsFor(candidate);
  return schedulesFor(selectedDeviceId()).some((schedule, index) =>
    index !== ignoreIndex &&
    candidateIntervals.some((candidateInterval) =>
      intervalsFor(schedule).some((scheduleInterval) =>
        [-WEEK_MINUTES, 0, WEEK_MINUTES].some((weekOffset) => {
          const start = scheduleInterval.start + weekOffset;
          const end = scheduleInterval.end + weekOffset;
          return candidateInterval.start < end && start < candidateInterval.end;
        }),
      ),
    ),
  );
}

export function removeSchedule(index: number) {
  const deviceId = selectedDeviceId();
  if (!deviceId) return;
  schedulesByDeviceId = {
    ...schedulesByDeviceId,
    [deviceId]: schedulesFor(deviceId).filter((_, scheduleIndex) => scheduleIndex !== index),
  };
  emit();
  persist();
}

export function setDraftDays(days: boolean[]) {
  const deviceId = selectedDeviceId();
  if (!deviceId || days.length !== 7 || !days.every((day) => typeof day === 'boolean')) return;
  draftDaysByDeviceId = { ...draftDaysByDeviceId, [deviceId]: [...days] };
  emit();
}

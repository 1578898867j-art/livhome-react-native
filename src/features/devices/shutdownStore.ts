// 关机计划(Device off Time)共享 store —— List / Edit / Repeat 三屏共用。
// demo 内存版:Save 真正把新方案加进列表,Repeat 的选择带回 Edit。
import { useSyncExternalStore } from 'react';

export type TM = { h: number; m: number };
export type Sched = { off: TM; on: TM; days: boolean[] };
type Interval = { start: number; end: number };

const DAY_MINUTES = 24 * 60;
const WEEK_MINUTES = 7 * DAY_MINUTES;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const sub = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

let schedules: Sched[] = [
  { off: { h: 23, m: 0 }, on: { h: 7, m: 0 }, days: [true, true, true, true, true, true, true] },
  { off: { h: 19, m: 0 }, on: { h: 20, m: 0 }, days: [false, true, true, true, true, true, false] },
];
// Edit 页正在编辑的重复日(Repeat 页改这里)
let draftDays: boolean[] = [true, true, true, true, true, true, true];
let editingScheduleIndex: number | null = null;

export const useSchedules = () => useSyncExternalStore(sub, () => schedules);
export const useDraftDays = () => useSyncExternalStore(sub, () => draftDays);

export function formatRepeatLabel(days: boolean[]) {
  const enabledDays = days.filter(Boolean).length;
  if (enabledDays === 7) return 'Everyday';
  if (enabledDays === 0) return 'Once';
  if (days[1] && days[2] && days[3] && days[4] && days[5] && !days[0] && !days[6]) return 'Weekdays';
  if (days[0] && days[6] && enabledDays === 2) return 'Weekends';
  return 'Custom';
}

export function beginNewSchedule() {
  editingScheduleIndex = null;
  draftDays = [true, true, true, true, true, true, true];
  emit();
}

export function beginScheduleEdit(index: number) {
  const schedule = schedules[index];
  if (!schedule) return;
  editingScheduleIndex = index;
  draftDays = [...schedule.days];
  emit();
}

export function getEditingSchedule() {
  return editingScheduleIndex === null ? null : schedules[editingScheduleIndex] ?? null;
}

export function getEditingScheduleIndex() {
  return editingScheduleIndex;
}

export function saveSchedule(schedule: Sched) {
  if (editingScheduleIndex === null) schedules = [...schedules, schedule];
  else if (schedules[editingScheduleIndex]) {
    schedules = schedules.map((item, index) => (index === editingScheduleIndex ? schedule : item));
  }
  editingScheduleIndex = null;
  emit();
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
  return schedules.some((schedule, index) =>
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

export function removeSchedule(i: number) {
  schedules = schedules.filter((_, idx) => idx !== i);
  emit();
}

export function setDraftDays(days: boolean[]) {
  draftDays = [...days];
  emit();
}

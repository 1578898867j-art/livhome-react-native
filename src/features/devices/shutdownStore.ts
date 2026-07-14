// 关机计划(Device off Time)共享 store —— List / Edit / Repeat 三屏共用。
// demo 内存版:Save 真正把新方案加进列表,Repeat 的选择带回 Edit。
import { useSyncExternalStore } from 'react';

export type TM = { h: number; m: number };
export type Sched = { off: TM; on: TM; days: boolean[] };

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

export const useSchedules = () => useSyncExternalStore(sub, () => schedules);
export const useDraftDays = () => useSyncExternalStore(sub, () => draftDays);

export function addSchedule(s: Sched) {
  schedules = [...schedules, s];
  emit();
}

export function removeSchedule(i: number) {
  schedules = schedules.filter((_, idx) => idx !== i);
  emit();
}

export function setDraftDays(days: boolean[]) {
  draftDays = [...days];
  emit();
}

export function resetDraftDays() {
  setDraftDays([true, true, true, true, true, true, true]);
}

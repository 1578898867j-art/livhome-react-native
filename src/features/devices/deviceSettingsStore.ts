import { useSyncExternalStore } from 'react';

export type NightVisionMode = 'auto' | 'on' | 'off';

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const emit = () => listeners.forEach((listener) => listener());

let nightVisionMode: NightVisionMode = 'auto';
let smartTrackingEnabled = false;
let motionDetectionEnabled = false;
let soundDetectionEnabled = false;

export const useNightVisionMode = () =>
  useSyncExternalStore(subscribe, () => nightVisionMode);

export const useSmartTrackingEnabled = () =>
  useSyncExternalStore(subscribe, () => smartTrackingEnabled);

export const useMotionDetectionEnabled = () =>
  useSyncExternalStore(subscribe, () => motionDetectionEnabled);

export const useSoundDetectionEnabled = () =>
  useSyncExternalStore(subscribe, () => soundDetectionEnabled);

export function setNightVisionMode(mode: NightVisionMode) {
  if (mode === nightVisionMode) return;
  nightVisionMode = mode;
  emit();
}

export function setSmartTrackingEnabled(enabled: boolean) {
  if (enabled === smartTrackingEnabled) return;
  smartTrackingEnabled = enabled;
  emit();
}

export function setMotionDetectionEnabled(enabled: boolean) {
  if (enabled === motionDetectionEnabled) return;
  motionDetectionEnabled = enabled;
  emit();
}

export function setSoundDetectionEnabled(enabled: boolean) {
  if (enabled === soundDetectionEnabled) return;
  soundDetectionEnabled = enabled;
  emit();
}

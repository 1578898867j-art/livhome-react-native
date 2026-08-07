import { useSyncExternalStore } from 'react';
import {
  getPersistedValue,
  isPersistenceHydrated,
  setPersistedValue,
  subscribePersistence,
} from '../app/persistence';
import { getSelectedDevice, subscribeDeviceList } from './deviceListStore';

const STORE_KEY = 'device-settings';

export type NightVisionMode = 'auto' | 'on' | 'off';
export type ImageFlip = 'normal' | 'flipped';
export type TimezoneSelection = { city: string; gmt: string };

export type DeviceSettings = {
  antiFlicker: '50' | '60';
  idleTime: '5' | '10' | '15';
  imageFlip: ImageFlip;
  motionDetectionEnabled: boolean;
  motionSensitivity: 0 | 1 | 2;
  nightVisionMode: NightVisionMode;
  smartTrackingEnabled: boolean;
  soundDetectionEnabled: boolean;
  soundSensitivity: 0 | 1 | 2;
  timezone: TimezoneSelection;
  volume: number;
};

const DEFAULT_SETTINGS: DeviceSettings = {
  antiFlicker: '50',
  idleTime: '5',
  imageFlip: 'normal',
  motionDetectionEnabled: false,
  motionSensitivity: 1,
  nightVisionMode: 'auto',
  smartTrackingEnabled: false,
  soundDetectionEnabled: false,
  soundSensitivity: 1,
  timezone: { city: 'Beijing', gmt: 'GMT+8:00' },
  volume: 10,
};

let settingsByDeviceId: Record<string, DeviceSettings> = {};
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emit = () => listeners.forEach((listener) => listener());

const isSensitivity = (value: unknown): value is 0 | 1 | 2 => value === 0 || value === 1 || value === 2;

const isTimezoneSelection = (value: unknown): value is TimezoneSelection =>
  !!value &&
  typeof value === 'object' &&
  typeof (value as Partial<TimezoneSelection>).city === 'string' &&
  typeof (value as Partial<TimezoneSelection>).gmt === 'string';

const normalizeDeviceSettings = (value: unknown): DeviceSettings | null => {
  if (!value || typeof value !== 'object') return null;
  const settings = value as Partial<DeviceSettings>;
  const hasRequiredValues =
    (settings.antiFlicker === '50' || settings.antiFlicker === '60') &&
    (settings.idleTime === '5' || settings.idleTime === '10' || settings.idleTime === '15') &&
    (settings.imageFlip === 'normal' || settings.imageFlip === 'flipped') &&
    typeof settings.motionDetectionEnabled === 'boolean' &&
    isSensitivity(settings.motionSensitivity) &&
    (settings.nightVisionMode === 'auto' || settings.nightVisionMode === 'on' || settings.nightVisionMode === 'off') &&
    typeof settings.smartTrackingEnabled === 'boolean' &&
    typeof settings.soundDetectionEnabled === 'boolean' &&
    isSensitivity(settings.soundSensitivity) &&
    typeof settings.volume === 'number' &&
    Number.isInteger(settings.volume) &&
    settings.volume >= 1 &&
    settings.volume <= 10;
  if (!hasRequiredValues) return null;

  return {
    ...settings,
    timezone: isTimezoneSelection(settings.timezone) ? settings.timezone : DEFAULT_SETTINGS.timezone,
  } as DeviceSettings;
};

const normalizeSettingsByDevice = (value: unknown): Record<string, DeviceSettings> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const entries = Object.entries(value).map(([deviceId, settings]) => [deviceId, normalizeDeviceSettings(settings)] as const);
  if (entries.some(([, settings]) => !settings)) return null;
  return Object.fromEntries(entries) as Record<string, DeviceSettings>;
};

const getSelectedSettings = () => {
  const deviceId = getSelectedDevice()?.id;
  return deviceId ? settingsByDeviceId[deviceId] ?? DEFAULT_SETTINGS : DEFAULT_SETTINGS;
};

const subscribeSelectedSettings = (listener: () => void) => {
  const unsubscribeSettings = subscribe(listener);
  const unsubscribeDevices = subscribeDeviceList(listener);
  return () => {
    unsubscribeSettings();
    unsubscribeDevices();
  };
};

const persist = () => {
  if (!isPersistenceHydrated()) return;
  void setPersistedValue(STORE_KEY, settingsByDeviceId).catch(() => {});
};

let loadedFromPersistence = false;
const restoreFromPersistence = () => {
  if (loadedFromPersistence || !isPersistenceHydrated()) return;
  loadedFromPersistence = true;
  const stored = getPersistedValue<Record<string, DeviceSettings>>(STORE_KEY);
  const normalized = normalizeSettingsByDevice(stored);
  if (!normalized) return;
  settingsByDeviceId = normalized;
  emit();
};

subscribePersistence(restoreFromPersistence);
restoreFromPersistence();

const updateSelectedSettings = (patch: Partial<DeviceSettings>) => {
  const deviceId = getSelectedDevice()?.id;
  if (!deviceId) return;

  const current = settingsByDeviceId[deviceId] ?? DEFAULT_SETTINGS;
  const next = { ...current, ...patch };
  if (Object.keys(patch).every((key) => current[key as keyof DeviceSettings] === next[key as keyof DeviceSettings])) {
    return;
  }

  settingsByDeviceId = { ...settingsByDeviceId, [deviceId]: next };
  emit();
  persist();
};

export const useDeviceSettings = () =>
  useSyncExternalStore(subscribeSelectedSettings, getSelectedSettings);

export const useNightVisionMode = () => useDeviceSettings().nightVisionMode;
export const useSmartTrackingEnabled = () => useDeviceSettings().smartTrackingEnabled;
export const useMotionDetectionEnabled = () => useDeviceSettings().motionDetectionEnabled;
export const useSoundDetectionEnabled = () => useDeviceSettings().soundDetectionEnabled;

export const setIdleTime = (idleTime: DeviceSettings['idleTime']) => updateSelectedSettings({ idleTime });
export const setImageFlip = (imageFlip: ImageFlip) => updateSelectedSettings({ imageFlip });
export const setNightVisionMode = (nightVisionMode: NightVisionMode) => updateSelectedSettings({ nightVisionMode });
export const setAntiFlicker = (antiFlicker: DeviceSettings['antiFlicker']) => updateSelectedSettings({ antiFlicker });
export const setVolume = (volume: number) => updateSelectedSettings({ volume });
export const setSmartTrackingEnabled = (smartTrackingEnabled: boolean) => updateSelectedSettings({ smartTrackingEnabled });
export const setMotionDetectionEnabled = (motionDetectionEnabled: boolean) => updateSelectedSettings({ motionDetectionEnabled });
export const setMotionSensitivity = (motionSensitivity: number) => {
  if (isSensitivity(motionSensitivity)) updateSelectedSettings({ motionSensitivity });
};
export const setSoundDetectionEnabled = (soundDetectionEnabled: boolean) => updateSelectedSettings({ soundDetectionEnabled });
export const setSoundSensitivity = (soundSensitivity: number) => {
  if (isSensitivity(soundSensitivity)) updateSelectedSettings({ soundSensitivity });
};
export const setTimezone = (timezone: TimezoneSelection) => updateSelectedSettings({ timezone });

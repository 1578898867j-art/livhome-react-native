import { useSyncExternalStore } from 'react';
import {
  getPersistedValue,
  isPersistenceHydrated,
  setPersistedValue,
  subscribePersistence,
} from '../app/persistence';
import { getSelectedDevice, subscribeDeviceList } from './deviceListStore';

const STORE_KEY = 'device-alert-settings';

export type AlarmRecording = { id: string; name: string };
export type TripWireDirection = 'both' | 'ab' | 'ba';
export type TripWirePoint = { x: number; y: number };
export type RecordingMode = 'off' | 'alert' | 'allday';

export type DeviceAlertSettings = {
  alarmNotificationEnabled: boolean;
  alarmPeriod: string;
  alarmVoice: 'system' | 'custom';
  alarmVoiceEnabled: boolean;
  detectionAreaCells: boolean[];
  detectionAreaNotify: boolean;
  dndEnabled: boolean;
  dndEnd: number;
  dndStart: number;
  geofenceEnabled: boolean;
  lineCrossingEnabled: boolean;
  lineCrossingSensitivity: 0 | 1 | 2;
  notificationAlarmEnabled: boolean;
  notificationCustom: number | null;
  notificationFrequency: string;
  notificationsEnabled: boolean;
  recordings: AlarmRecording[];
  recordingMode: RecordingMode;
  selectedRecordingId: string | null;
  storageUsed: number;
  tripWireA: TripWirePoint;
  tripWireB: TripWirePoint;
  tripWireDirection: TripWireDirection;
};

const DEFAULT_CELLS = [false, true, true, false, false, true, true, false, false, true, true, false];
const DEFAULT_SETTINGS: DeviceAlertSettings = {
  alarmNotificationEnabled: true,
  alarmPeriod: 'All Day',
  alarmVoice: 'system',
  alarmVoiceEnabled: true,
  detectionAreaCells: DEFAULT_CELLS,
  detectionAreaNotify: false,
  dndEnabled: false,
  dndEnd: 7,
  dndStart: 22,
  geofenceEnabled: true,
  lineCrossingEnabled: true,
  lineCrossingSensitivity: 1,
  notificationAlarmEnabled: true,
  notificationCustom: null,
  notificationFrequency: '10',
  notificationsEnabled: true,
  recordings: [],
  recordingMode: 'allday',
  selectedRecordingId: null,
  storageUsed: 2.19,
  tripWireA: { x: 26, y: 26 },
  tripWireB: { x: 72, y: 74 },
  tripWireDirection: 'both',
};

let settingsByDeviceId: Record<string, DeviceAlertSettings> = {};
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const emit = () => listeners.forEach((listener) => listener());

const isPoint = (value: unknown): value is TripWirePoint =>
  !!value && typeof value === 'object' &&
  typeof (value as Partial<TripWirePoint>).x === 'number' &&
  typeof (value as Partial<TripWirePoint>).y === 'number';

const isSettings = (value: unknown): value is DeviceAlertSettings => {
  if (!value || typeof value !== 'object') return false;
  const settings = value as Partial<DeviceAlertSettings>;
  return (
    typeof settings.alarmNotificationEnabled === 'boolean' &&
    typeof settings.alarmPeriod === 'string' &&
    (settings.alarmVoice === 'system' || settings.alarmVoice === 'custom') &&
    typeof settings.alarmVoiceEnabled === 'boolean' &&
    Array.isArray(settings.detectionAreaCells) && settings.detectionAreaCells.length === 12 && settings.detectionAreaCells.every((value) => typeof value === 'boolean') &&
    typeof settings.detectionAreaNotify === 'boolean' &&
    typeof settings.dndEnabled === 'boolean' && Number.isInteger(settings.dndEnd) && settings.dndEnd! >= 0 && settings.dndEnd! < 24 &&
    Number.isInteger(settings.dndStart) && settings.dndStart! >= 0 && settings.dndStart! < 24 &&
    typeof settings.geofenceEnabled === 'boolean' && typeof settings.lineCrossingEnabled === 'boolean' &&
    (settings.lineCrossingSensitivity === 0 || settings.lineCrossingSensitivity === 1 || settings.lineCrossingSensitivity === 2) &&
    typeof settings.notificationAlarmEnabled === 'boolean' &&
    (settings.notificationCustom === null || (Number.isInteger(settings.notificationCustom) && settings.notificationCustom! > 0)) &&
    typeof settings.notificationFrequency === 'string' && typeof settings.notificationsEnabled === 'boolean' &&
    Array.isArray(settings.recordings) && settings.recordings.every((recording) => !!recording && typeof recording.id === 'string' && typeof recording.name === 'string') &&
    (settings.recordingMode === 'off' || settings.recordingMode === 'alert' || settings.recordingMode === 'allday') &&
    (settings.selectedRecordingId === null || typeof settings.selectedRecordingId === 'string') &&
    typeof settings.storageUsed === 'number' && settings.storageUsed >= 0 && settings.storageUsed <= 100 &&
    isPoint(settings.tripWireA) && isPoint(settings.tripWireB) &&
    (settings.tripWireDirection === 'both' || settings.tripWireDirection === 'ab' || settings.tripWireDirection === 'ba')
  );
};

const isSettingsByDevice = (value: unknown): value is Record<string, DeviceAlertSettings> =>
  !!value && typeof value === 'object' && !Array.isArray(value) && Object.values(value).every(isSettings);

const selectedDeviceId = () => getSelectedDevice()?.id;
const getSelectedSettings = () => {
  const deviceId = selectedDeviceId();
  return deviceId ? settingsByDeviceId[deviceId] ?? DEFAULT_SETTINGS : DEFAULT_SETTINGS;
};
const subscribeSelectedDevice = (listener: () => void) => {
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

let hydratedFromPersistence = false;
const restoreFromPersistence = () => {
  if (hydratedFromPersistence || !isPersistenceHydrated()) return;
  hydratedFromPersistence = true;
  const stored = getPersistedValue<Record<string, DeviceAlertSettings>>(STORE_KEY);
  if (!isSettingsByDevice(stored)) return;
  settingsByDeviceId = stored;
  emit();
};
subscribePersistence(restoreFromPersistence);
restoreFromPersistence();

const update = (patch: Partial<DeviceAlertSettings>) => {
  const deviceId = selectedDeviceId();
  if (!deviceId) return;
  const current = settingsByDeviceId[deviceId] ?? DEFAULT_SETTINGS;
  settingsByDeviceId = { ...settingsByDeviceId, [deviceId]: { ...current, ...patch } };
  emit();
  persist();
};

export const useDeviceAlertSettings = () => useSyncExternalStore(subscribeSelectedDevice, getSelectedSettings);
export const setAlarmNotificationEnabled = (alarmNotificationEnabled: boolean) => update({ alarmNotificationEnabled });
export const setAlarmVoiceEnabled = (alarmVoiceEnabled: boolean) => update({ alarmVoiceEnabled });
export const setAlarmVoice = (alarmVoice: DeviceAlertSettings['alarmVoice']) => update({ alarmVoice });
export const setAlarmPeriod = (alarmPeriod: string) => update({ alarmPeriod });
export const setNotificationSettings = (patch: Partial<Pick<DeviceAlertSettings, 'notificationsEnabled' | 'notificationAlarmEnabled' | 'dndEnabled' | 'dndStart' | 'dndEnd' | 'notificationFrequency' | 'notificationCustom'>>) => update(patch);
export const setLineCrossing = (lineCrossingEnabled: boolean, lineCrossingSensitivity?: 0 | 1 | 2) => update({ lineCrossingEnabled, ...(lineCrossingSensitivity === undefined ? {} : { lineCrossingSensitivity }) });
export const setTripWire = (patch: Partial<Pick<DeviceAlertSettings, 'tripWireA' | 'tripWireB' | 'tripWireDirection'>>) => update(patch);
export const setDetectionArea = (patch: Pick<DeviceAlertSettings, 'detectionAreaCells' | 'detectionAreaNotify'>) => update(patch);
export const setGeofenceEnabled = (geofenceEnabled: boolean) => update({ geofenceEnabled });
export const setStorageSettings = (patch: Pick<DeviceAlertSettings, 'recordingMode' | 'storageUsed'>) => update(patch);

export const addAlarmRecording = (name: string) => {
  const settings = getSelectedSettings();
  const id = `r${Date.now()}`;
  const recordings = [...settings.recordings, { id, name }];
  update({ recordings, selectedRecordingId: settings.selectedRecordingId ?? id, alarmVoice: settings.selectedRecordingId ? settings.alarmVoice : 'custom' });
  return id;
};
export const selectAlarmRecording = (selectedRecordingId: string) => update({ selectedRecordingId, alarmVoice: 'custom' });
export const renameAlarmRecording = (id: string, name: string) => update({ recordings: getSelectedSettings().recordings.map((recording) => recording.id === id ? { ...recording, name } : recording) });
export const removeAlarmRecording = (id: string) => {
  const settings = getSelectedSettings();
  const selected = settings.selectedRecordingId === id ? null : settings.selectedRecordingId;
  update({ recordings: settings.recordings.filter((recording) => recording.id !== id), selectedRecordingId: selected, alarmVoice: selected ? settings.alarmVoice : 'system' });
};

import { useSyncExternalStore } from 'react';
import type { DeviceSummary } from '../../contracts';

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

let devices = [...INITIAL_DEVICES];
let boundDeviceSequence = 0;
let selectedDeviceId = INITIAL_DEVICES[0].id;

const getSelectedDeviceSnapshot = () =>
  devices.find((device) => device.id === selectedDeviceId) ?? null;

export const useDeviceList = () => useSyncExternalStore(subscribe, () => devices);
export const useSelectedDevice = () => useSyncExternalStore(subscribe, getSelectedDeviceSnapshot);

export const getSelectedDevice = getSelectedDeviceSnapshot;

export function selectDevice(deviceId: string) {
  if (deviceId === selectedDeviceId) return;
  selectedDeviceId = deviceId;
  emit();
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
  return device;
}

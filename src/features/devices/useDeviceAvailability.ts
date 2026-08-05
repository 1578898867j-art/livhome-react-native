import { getDemoFlags, useDemoFlags } from '../app/demoStore';
import { getSelectedDevice, useSelectedDevice } from './deviceListStore';

export function useDeviceAvailability() {
  const device = useSelectedDevice();
  const { deviceOffline } = useDemoFlags();

  return {
    device,
    isOffline: deviceOffline || device?.status === 'offline',
  };
}

export function getDeviceIsOffline() {
  return getDemoFlags().deviceOffline || getSelectedDevice()?.status === 'offline';
}

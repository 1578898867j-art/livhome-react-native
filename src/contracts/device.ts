import type { EntityId, ISODateTime } from './common';

export type DeviceStatus = 'online' | 'offline';
export type DevicePrivacyStatus = 'off' | 'enabling' | 'on' | 'disabling';
export type DeviceCommand = 'speaker' | 'microphone' | 'recording' | 'snapshot' | 'siren' | 'privacy';

export type DeviceSummary = {
  id: EntityId;
  name: string;
  room?: string;
  status: DeviceStatus;
  privacyStatus?: DevicePrivacyStatus;
  lastSeenAt?: ISODateTime;
  thumbnailUrl?: string;
};

export type DeviceCommandInput = {
  command: DeviceCommand;
  enabled?: boolean;
};

export type DeviceCommandResult = {
  accepted: boolean;
  commandId: EntityId;
};

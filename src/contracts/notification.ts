import type { EntityId, ISODateTime } from './common';

export type NotificationKind = 'motion' | 'sound' | 'line-crossing' | 'geofence';

export type DeviceNotification = {
  id: EntityId;
  deviceId: EntityId;
  kind: NotificationKind;
  title: string;
  occurredAt: ISODateTime;
  thumbnailUrl?: string;
  read: boolean;
};

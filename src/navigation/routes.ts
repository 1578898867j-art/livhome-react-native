// Every route id in the app (mirrors the prototype's screen ids). The three tab
// screens (dev-home / agent-chat / me-home) live in the bottom tabs; everything
// else is pushed on the root stack.
export const TAB_ROUTES = ['dev-home', 'agent-chat', 'me-home'] as const;

export const STACK_ROUTES: string[] = [
  'dev-detail', 'dev-playback', 'dev-download', 'dev-messages', 'dev-config', 'dev-settings', 'dev-info',
  'notif-center', 'notif-detail', 'notif-image', 'notif-settings', 'notif-frequency', 'alert-settings',
  'motion-detection', 'detection-area', 'sound-detection', 'line-crossing', 'trip-wire', 'geofence',
  'agent-history',
  'album', 'album-detail',
  'alarm-reminder', 'shutdown-list', 'shutdown-edit', 'shutdown-repeat',
  'edit-profile', 'settings', 'about', 'feedback', 'language', 'timezone', 'storage-settings',
  'email-login', 'apple-bind', 'privacy-terms', 'privacy-agreement',
  'bind-find', 'bind-none', 'bind-prep', 'bind-wifi', 'bind-wifi-pick',
  'bind-connecting', 'bind-success', 'bind-fail', 'bind-qr',
];

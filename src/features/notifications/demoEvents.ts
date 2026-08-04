import { NT_CROSSING, NT_FENCE, NT_MOTION, NT_OBSTRUCTED } from '../../icons/notifIcons';

export type EventIconKey = 'activity' | 'obstructed' | 'lineCrossing' | 'intrusion';
export type EventSource = 'cloud' | 'sd';
export type NotificationDayKey = '21' | '22' | '23' | '24';

export type DemoNotificationEvent = {
  id: number;
  iconKey: EventIconKey;
  icon: string;
  tag: 'Info' | 'Critical';
  title: string;
  time: string;
  src: EventSource;
  unread?: boolean;
  preview?: boolean;
};

export type DemoNotificationDay = {
  day: NotificationDayKey;
  mon: 'Apr';
  events: DemoNotificationEvent[];
};

export const EVENT_ICON_TILES: Record<EventIconKey, string> = {
  activity: NT_MOTION,
  obstructed: NT_OBSTRUCTED,
  lineCrossing: NT_CROSSING,
  intrusion: NT_FENCE,
};

export const EVENT_ICON_FILTERS: {
  key: EventIconKey;
  label: string;
  icon: string;
}[] = [
  { key: 'activity', label: 'Activity Events', icon: NT_MOTION },
  { key: 'obstructed', label: 'Camera Obstructed', icon: NT_OBSTRUCTED },
  { key: 'lineCrossing', label: 'Line Crossing Detection', icon: NT_CROSSING },
  { key: 'intrusion', label: 'Intrusion Zone', icon: NT_FENCE },
];

const EVENT_TYPES = [
  { iconKey: 'activity', icon: NT_MOTION, tag: 'Info', title: 'Human Activity Detected', src: 'cloud' },
  { iconKey: 'activity', icon: NT_MOTION, tag: 'Info', title: 'Motion Detected', src: 'sd' },
  { iconKey: 'activity', icon: NT_MOTION, tag: 'Info', title: 'Abnormal Sound Detected', src: 'cloud' },
  { iconKey: 'obstructed', icon: NT_OBSTRUCTED, tag: 'Critical', title: 'Camera Obstructed', src: 'sd' },
  { iconKey: 'lineCrossing', icon: NT_CROSSING, tag: 'Critical', title: 'Line Crossing Detection', src: 'cloud' },
  { iconKey: 'intrusion', icon: NT_FENCE, tag: 'Critical', title: 'Intrusion Zone', src: 'sd' },
] as const;

const TIMES_BY_DAY = {
  '24': ['18:42:15', '17:58:06', '16:21:43', '14:05:12', '12:38:29', '09:16:54'],
  '23': ['19:12:08', '17:44:31', '15:27:19', '13:03:47', '10:36:22', '08:14:05'],
  '22': ['20:05:17', '18:36:42', '16:08:25', '13:47:09', '11:22:34', '07:55:18'],
  '21': ['19:31:46', '17:02:13', '14:44:58', '12:16:21', '09:48:37', '06:39:04'],
} as const;

function eventsForDay(day: NotificationDayKey): DemoNotificationEvent[] {
  return EVENT_TYPES.map((event, index) => ({
    ...event,
    id: Number(`${day}${index + 1}`),
    time: TIMES_BY_DAY[day][index],
    unread: day === '24' && index === 0,
    preview: true,
  }));
}

export const NOTIFICATION_DAYS: DemoNotificationDay[] = [
  { day: '24', mon: 'Apr', events: eventsForDay('24') },
  { day: '23', mon: 'Apr', events: eventsForDay('23') },
  { day: '22', mon: 'Apr', events: eventsForDay('22') },
  { day: '21', mon: 'Apr', events: eventsForDay('21') },
];

export const ALL_NOTIFICATION_EVENTS = NOTIFICATION_DAYS.flatMap((group) => group.events);

import { useState } from 'react';
import { NOTIFICATION_DAYS, type EventIconKey } from '../notifications/demoEvents';

export type DeviceDetailTab = 'messages' | 'controls' | 'tilt' | 'playback';
export type DeviceMessage = { day: number; icon: EventIconKey; title: string; time: string };
export type TiltKey = 'motionOn' | 'soundOn' | 'sirenOn' | 'privacyOn';
export type ControlKey = 'ctlSpk' | 'ctlMic' | 'ctlRec' | 'ctlSnap';

const INITIAL_MESSAGES: DeviceMessage[] = NOTIFICATION_DAYS.flatMap((group) =>
  group.events.map((event) => ({
    day: Number(group.day),
    icon: event.iconKey,
    title: event.title,
    time: event.time.slice(0, 5),
  })),
);

export function useDeviceDetailPrototype() {
  const [tab, setTab] = useState<DeviceDetailTab>('tilt');
  const [ctl, setCtl] = useState<Record<ControlKey, boolean>>({
    ctlSpk: false,
    ctlMic: false,
    ctlRec: false,
    ctlSnap: false,
  });
  const [ctrlView, setCtrlView] = useState<'pad' | 'presets'>('pad');
  const [cruising, setCruising] = useState(false);
  const [resetting, setResetting] = useState(false);
  // 预置位(原型 S.presets / S.activePreset)
  const [presets, setPresets] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const addPreset = () => setPresets((current) => current.concat(`Preset ${current.length + 1}`));
  const removePreset = (i: number) => {
    setPresets((current) => current
      .filter((_, index) => index !== i)
      .map((_, index) => `Preset ${index + 1}`));
    setActivePreset((a) => (a === i ? null : a != null && a > i ? a - 1 : a));
  };
  // 进入页面默认全部关闭
  const [tilt, setTilt] = useState<Record<TiltKey, boolean>>({
    motionOn: false,
    soundOn: false,
    sirenOn: false,
    privacyOn: false,
  });
  const [msgs, setMsgs] = useState(INITIAL_MESSAGES);
  const [msgChecked, setMsgChecked] = useState<number[]>([]);

  const toggleCtl = (key: ControlKey) => setCtl((state) => ({ ...state, [key]: !state[key] }));
  const toggleTilt = (key: TiltKey) => setTilt((state) => ({ ...state, [key]: !state[key] }));
  const toggleChecked = (index: number) => setMsgChecked((checked) => (
    checked.includes(index) ? checked.filter((value) => value !== index) : [...checked, index]
  ));
  const clearChecked = () => setMsgChecked([]);
  const deleteCheckedMessages = () => {
    setMsgs((messages) => messages.filter((_, index) => !msgChecked.includes(index)));
    clearChecked();
  };

  return {
    activePreset,
    addPreset,
    clearChecked,
    cruising,
    ctl,
    ctrlView,
    deleteCheckedMessages,
    msgChecked,
    msgs,
    presets,
    resetting,
    removePreset,
    setActivePreset,
    setCruising,
    setResetting,
    setCtrlView,
    setTab,
    tab,
    tilt,
    toggleChecked,
    toggleCtl,
    toggleTilt,
  };
}

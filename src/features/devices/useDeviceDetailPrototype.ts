import { useState } from 'react';

export type DeviceDetailTab = 'messages' | 'controls' | 'tilt' | 'playback';
export type DeviceMessage = { icon: string; title: string; time: string };
export type TiltKey = 'smartTrack' | 'nightVision' | 'motionOn' | 'soundOn' | 'sirenOn' | 'privacyOn';
export type ControlKey = 'ctlSpk' | 'ctlMic' | 'ctlRec' | 'ctlSnap';

const INITIAL_MESSAGES: DeviceMessage[] = [
  { icon: 'cross', title: 'Line Crossing Detected', time: '09:41' },
  { icon: 'motion', title: 'Motion Detected', time: '09:41' },
  { icon: 'sound', title: 'Sound Detected', time: '08:12' },
  { icon: 'fence', title: 'Geofence Alert', time: '07:15' },
];

export function useDeviceDetailPrototype() {
  const [tab, setTab] = useState<DeviceDetailTab>('controls');
  const [ctl, setCtl] = useState<Record<ControlKey, boolean>>({
    ctlSpk: false,
    ctlMic: false,
    ctlRec: false,
    ctlSnap: false,
  });
  const [ctrlView, setCtrlView] = useState<'pad' | 'presets'>('pad');
  const [cruising, setCruising] = useState(false);
  // 预置位(原型 S.presets / S.activePreset)
  const [presets, setPresets] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const addPreset = () => setPresets((p) => p.concat(`Preset ${p.length + 1}`));
  const removePreset = (i: number) => {
    setPresets((p) => p.filter((_, idx) => idx !== i));
    setActivePreset((a) => (a === i ? null : a != null && a > i ? a - 1 : a));
  };
  // 进入页面默认全部关闭
  const [tilt, setTilt] = useState<Record<TiltKey, boolean>>({
    smartTrack: false,
    nightVision: false,
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
    removePreset,
    setActivePreset,
    setCruising,
    setCtrlView,
    setTab,
    tab,
    tilt,
    toggleChecked,
    toggleCtl,
    toggleTilt,
  };
}

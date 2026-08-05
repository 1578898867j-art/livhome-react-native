import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Header, Eyebrow, Card, Row, Tap, SettingRow, ToggleRow } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';
import { CAMGLYPH } from '../icons/protoIcons';
import {
  setNightVisionMode,
  setSmartTrackingEnabled,
  useNightVisionMode,
  useSmartTrackingEnabled,
} from '../features/devices/deviceSettingsStore';
import {
  SettingsOptionDoneButton,
  SettingsOptionRow,
  SettingsOptionSheet,
} from '../components/SettingsOptionSheet';
import { useSchedules } from '../features/devices/shutdownStore';

// Label maps mirrored from the prototype
const IDLE_LABELS: Record<string, string> = { '5': '5 min', '10': '10 min', '15': '15 min' };
const NV_LABELS: Record<string, string> = { auto: 'Auto', on: 'On', off: 'Off' };

type SheetKey = null | 'idle' | 'flip' | 'nv' | 'af' | 'vol';

/* ---- flip preview card — port of flipCard() ---- */
function FlipCard({
  label,
  rot,
  on,
  onPress,
}: {
  label: string;
  rot: number;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <Tap
      onPress={onPress}
      style={[st.flipCard, on && { borderColor: colors.brand, backgroundColor: colors.brandSoft }]}
    >
      {on && (
        <View style={st.flipBadge}>
          <Icon name="check" size={12} color="#fff" sw={3} />
        </View>
      )}
      <View style={[st.flipGlyphBox, { backgroundColor: on ? '#EEF2FA' : '#F4F4F6' }]}>
        <View style={{ transform: [{ rotate: `${rot}deg` }] }}>
          <SvgXml xml={CAMGLYPH} width={52} height={46} />
        </View>
      </View>
      <Text style={[st.flipLabel, on && { color: colors.brand }]}>{label}</Text>
    </Tap>
  );
}

export default function DevConfig({ navigation }: AppScreenProps) {
  // Local state seeded from the prototype S defaults
  const [tzGmt] = useState('GMT+8:00'); // tzSel:'Beijing' → GMT+8:00
  const schedules = useSchedules();
  const offTime = schedules.length === 0 ? 'None' : '';
  const [idleTime, setIdleTime] = useState('5');
  const [imgFlip, setImgFlip] = useState<'normal' | 'flipped'>('normal');
  const nvMode = useNightVisionMode();
  const smartTrack = useSmartTrackingEnabled();
  const [antiFlicker, setAntiFlicker] = useState('50');
  const [volume, setVolume] = useState(10);
  const [sheet, setSheet] = useState<SheetKey>(null);

  const closeSheet = () => setSheet(null);

  return (
    <Screen
      header={<Header title="Device Settings" onBack={() => navigation.goBack()} />}
      contentStyle={st.wrap}
    >
      <Eyebrow>Basic settings</Eyebrow>
      <Card style={st.card}>
        <SettingRow
          icon="globe"
          name="Device Time Zone"
          value={tzGmt}
          onPress={() => navigation.navigate('timezone')}
          last
        />
      </Card>

      <Eyebrow>Power and standby</Eyebrow>
      <Card style={st.card}>
        <SettingRow
          icon="power"
          name="Device off Time"
          value={offTime}
          onPress={() => navigation.navigate('shutdown-list')}
        />
        <SettingRow
          icon="timer"
          name="Idle Time"
          value={IDLE_LABELS[idleTime]}
          onPress={() => setSheet('idle')}
          last
        />
      </Card>

      <Eyebrow>Picture settings</Eyebrow>
      <Card style={st.card}>
        <SettingRow
          icon="flip"
          name="Image Flip 180°"
          value={imgFlip === 'flipped' ? 'Flipped' : 'Normal'}
          onPress={() => setSheet('flip')}
        />
        <SettingRow icon="moon" name="Night Vision" value={NV_LABELS[nvMode]} onPress={() => setSheet('nv')} />
        <SettingRow
          icon="bulb"
          name="Anti-Flicker Setting"
          value={`${antiFlicker}Hz`}
          onPress={() => setSheet('af')}
          last
        />
      </Card>

      <Eyebrow>Sound and tracking</Eyebrow>
      <Card style={st.card}>
        <SettingRow icon="volume" name="Volume" value={`${volume}`} onPress={() => setSheet('vol')} />
        <ToggleRow
          name="Smart Tracking"
          sub="The camera will automatically follow moving targets"
          on={smartTrack}
          onToggle={() => setSmartTrackingEnabled(!smartTrack)}
          last
        />
      </Card>

      <View style={{ height: 54 }} />

      {/* Idle Time — 与其他弹层一致:点选只切换选中,Done 确认关闭 */}
      <SettingsOptionSheet
        visible={sheet === 'idle'}
        title="Idle Time"
        desc="Choose how long the device waits before entering standby mode."
        onClose={closeSheet}
      >
        {(['5', '10', '15'] as const).map((v) => (
          <SettingsOptionRow
            key={v}
            label={`${v} minutes`}
            selected={idleTime === v}
            onPress={() => setIdleTime(v)}
          />
        ))}
        <SettingsOptionDoneButton onPress={closeSheet} />
      </SettingsOptionSheet>

      {/* Image Flip 180° */}
      <SettingsOptionSheet
        visible={sheet === 'flip'}
        title="Image Flip 180°"
        desc="Turn this on if the camera is installed upside down."
        onClose={closeSheet}
      >
        <Row style={{ gap: 12, alignItems: 'stretch', marginTop: 16 }}>
          <FlipCard label="Normal" rot={0} on={imgFlip === 'normal'} onPress={() => setImgFlip('normal')} />
          <FlipCard
            label="Flipped 180°"
            rot={180}
            on={imgFlip === 'flipped'}
            onPress={() => setImgFlip('flipped')}
          />
        </Row>
        <SettingsOptionDoneButton onPress={closeSheet} />
      </SettingsOptionSheet>

      {/* Night Vision */}
      <SettingsOptionSheet
        visible={sheet === 'nv'}
        title="Night Vision"
        desc="Used to improve picture visibility in low-light conditions for clear 24-hour monitoring."
        onClose={closeSheet}
      >
        <SettingsOptionRow
          label="Auto"
          sub="Automatically switch night vision mode based on ambient light."
          selected={nvMode === 'auto'}
          onPress={() => setNightVisionMode('auto')}
        />
        <SettingsOptionRow
          label="On"
          sub="Always on night vision."
          selected={nvMode === 'on'}
          onPress={() => setNightVisionMode('on')}
        />
        <SettingsOptionRow
          label="Off"
          sub="Turn off night vision."
          selected={nvMode === 'off'}
          onPress={() => setNightVisionMode('off')}
        />
        <SettingsOptionDoneButton onPress={closeSheet} />
      </SettingsOptionSheet>

      {/* Anti-Flicker */}
      <SettingsOptionSheet
        visible={sheet === 'af'}
        title="Anti-Flicker Setting"
        desc="Used to reduce picture flickering or horizontal lines. If unsure, keep the default setting."
        onClose={closeSheet}
      >
        <SettingsOptionRow
          label="50Hz"
          sub="Suitable for most regions; try this option first if the picture flickers."
          selected={antiFlicker === '50'}
          onPress={() => setAntiFlicker('50')}
        />
        <SettingsOptionRow
          label="60Hz"
          sub="If flickering persists after switching to 50Hz, try this option."
          selected={antiFlicker === '60'}
          onPress={() => setAntiFlicker('60')}
        />
        <SettingsOptionDoneButton onPress={closeSheet} />
      </SettingsOptionSheet>

      {/* Volume — 1..10 grid, 5 per row */}
      <SettingsOptionSheet
        visible={sheet === 'vol'}
        title="Volume Setting"
        desc="Adjust the sound volume of the camera speaker."
        onClose={closeSheet}
      >
        {[
          [1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10],
        ].map((rowVals, ri) => (
          <Row key={ri} style={{ gap: 10, marginTop: ri === 0 ? 16 : 10 }}>
            {rowVals.map((n) => {
              const on = volume === n;
              return (
                <Tap
                  key={n}
                  onPress={() => setVolume(n)}
                  style={[st.volCell, on && { backgroundColor: colors.brand }]}
                >
                  <Text style={[st.volCellTxt, on && { color: '#fff' }]}>{n}</Text>
                </Tap>
              );
            })}
          </Row>
        ))}
        <SettingsOptionDoneButton onPress={closeSheet} />
      </SettingsOptionSheet>
    </Screen>
  );
}

const st = StyleSheet.create({
  wrap: {},
  card: { marginHorizontal: 18 },

  /* flip cards */
  flipCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  flipBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipGlyphBox: { height: 76, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  flipLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    color: colors.textPrimary,
  },

  /* volume grid */
  volCell: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volCellTxt: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
});

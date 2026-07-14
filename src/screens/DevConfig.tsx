import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated, Easing } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Header, Eyebrow, Card, Row, Tap, SettingRow, ToggleRow } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';
import { CAMGLYPH } from '../icons/protoIcons';

// Label maps mirrored from the prototype
const IDLE_LABELS: Record<string, string> = { '5': '5 min', '10': '10 min', '15': '15 min' };
const NV_LABELS: Record<string, string> = { auto: 'Auto', on: 'On', off: 'Off' };

type SheetKey = null | 'idle' | 'flip' | 'nv' | 'af' | 'vol';

/* ---- bottom sheet shell — port of cfgSheet() ---- */
// 交互:遮罩原地淡入淡出,白色面板单独从屏幕底部滑入/滑出。
// (Modal 自带的 slide 会把遮罩连同内容整体滑动,观感是"幕布"在动 —— 不用)
function CfgSheet({
  visible,
  title,
  desc,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  desc?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(visible);
  const [sheetH, setSheetH] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => setMounted(false));
    }
  }, [visible, anim]);

  if (!mounted) return null;
  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFillObject, st.backdrop, { opacity: anim }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      <View style={st.ovl} pointerEvents="box-none">
        <Animated.View
          onLayout={(e) => setSheetH(e.nativeEvent.layout.height)}
          style={{
            transform: [
              { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [sheetH || 600, 0] }) },
            ],
          }}
        >
          <View style={st.sheet}>
            <View style={st.grabberWrap}>
              <View style={st.grabber} />
            </View>
            <Text style={st.sheetTitle}>{title}</Text>
            {!!desc && <Text style={st.sheetDesc}>{desc}</Text>}
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---- radio option row — port of cfgRadio() ---- */
function CfgRadio({
  label,
  sub,
  on,
  onPress,
}: {
  label: string;
  sub?: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <Tap onPress={onPress} style={[st.radioRow, { alignItems: sub ? 'flex-start' : 'center' }]}>
      <View style={{ flex: 1 }}>
        <Text style={[st.radioLabel, on && { color: colors.brand }]}>{label}</Text>
        {!!sub && <Text style={st.radioSub}>{sub}</Text>}
      </View>
      <View style={[st.radioCircle, on && { borderColor: colors.brand }, sub ? { marginTop: 2 } : null]}>
        {on && <View style={st.radioDot} />}
      </View>
    </Tap>
  );
}

function DoneBtn({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [st.doneBtn, pressed && { opacity: 0.85 }]}>
      <Text style={st.doneBtnTxt}>Done</Text>
    </Pressable>
  );
}

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
  const [offTime] = useState('None');
  const [idleTime, setIdleTime] = useState('5');
  const [imgFlip, setImgFlip] = useState<'normal' | 'flipped'>('normal');
  const [nvMode, setNvMode] = useState<'auto' | 'on' | 'off'>('auto');
  const [antiFlicker, setAntiFlicker] = useState('50');
  const [volume, setVolume] = useState(10);
  const [smartTrack, setSmartTrack] = useState(true);
  const [sheet, setSheet] = useState<SheetKey>(null);

  const closeSheet = () => setSheet(null);

  return (
    <Screen contentStyle={st.wrap}>
      <Header title="Device Settings" onBack={() => navigation.goBack()} />

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
          onToggle={() => setSmartTrack((v) => !v)}
          last
        />
      </Card>

      <View style={{ height: 54 }} />

      {/* Idle Time — selecting an option applies and closes (per prototype) */}
      <CfgSheet
        visible={sheet === 'idle'}
        title="Idle Time"
        desc="Choose how long the device waits before entering standby mode."
        onClose={closeSheet}
      >
        {(['5', '10', '15'] as const).map((v) => (
          <CfgRadio
            key={v}
            label={`${v} minutes`}
            on={idleTime === v}
            onPress={() => {
              setIdleTime(v);
              closeSheet();
            }}
          />
        ))}
        <Pressable onPress={closeSheet} style={({ pressed }) => [st.cancelBtn, pressed && { opacity: 0.85 }]}>
          <Text style={st.cancelBtnTxt}>Cancel</Text>
        </Pressable>
      </CfgSheet>

      {/* Image Flip 180° */}
      <CfgSheet
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
        <DoneBtn onPress={closeSheet} />
      </CfgSheet>

      {/* Night Vision */}
      <CfgSheet
        visible={sheet === 'nv'}
        title="Night Vision"
        desc="Used to improve picture visibility in low-light conditions for clear 24-hour monitoring."
        onClose={closeSheet}
      >
        <CfgRadio
          label="Auto"
          sub="Automatically switch night vision mode based on ambient light."
          on={nvMode === 'auto'}
          onPress={() => setNvMode('auto')}
        />
        <CfgRadio label="On" sub="Always on night vision." on={nvMode === 'on'} onPress={() => setNvMode('on')} />
        <CfgRadio label="Off" sub="Turn off night vision." on={nvMode === 'off'} onPress={() => setNvMode('off')} />
        <DoneBtn onPress={closeSheet} />
      </CfgSheet>

      {/* Anti-Flicker */}
      <CfgSheet
        visible={sheet === 'af'}
        title="Anti-Flicker Setting"
        desc="Used to reduce picture flickering or horizontal lines. If unsure, keep the default setting."
        onClose={closeSheet}
      >
        <CfgRadio
          label="50Hz"
          sub="Suitable for most regions; try this option first if the picture flickers."
          on={antiFlicker === '50'}
          onPress={() => setAntiFlicker('50')}
        />
        <CfgRadio
          label="60Hz"
          sub="If flickering persists after switching to 50Hz, try this option."
          on={antiFlicker === '60'}
          onPress={() => setAntiFlicker('60')}
        />
        <DoneBtn onPress={closeSheet} />
      </CfgSheet>

      {/* Volume — 1..10 grid, 5 per row */}
      <CfgSheet
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
        <DoneBtn onPress={closeSheet} />
      </CfgSheet>
    </Screen>
  );
}

const st = StyleSheet.create({
  wrap: {},
  card: { marginHorizontal: 18 },

  /* sheet shell */
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  ovl: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  grabberWrap: { alignItems: 'center', paddingTop: 10, paddingBottom: 8 },
  grabber: { width: 38, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  sheetTitle: { fontSize: 19, fontWeight: '800', color: colors.textPrimary },
  sheetDesc: { fontSize: 13, fontWeight: '500', color: colors.textTertiary, marginTop: 5, lineHeight: 19 },

  /* radio rows */
  radioRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  radioLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  radioSub: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 3, lineHeight: 17 },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.brand },

  /* buttons */
  doneBtn: {
    width: '100%',
    height: 50,
    borderRadius: 99,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  doneBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: {
    width: '100%',
    height: 50,
    borderRadius: 99,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  cancelBtnTxt: { color: colors.textSecondary, fontSize: 16, fontWeight: '700' },

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

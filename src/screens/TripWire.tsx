import type { AppScreenProps } from '../navigation/types';
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Screen, NavBar, Row, Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';
import { setTripWire, useDeviceAlertSettings } from '../features/devices/deviceAlertStore';

type Pt = { x: number; y: number };
type Dir = 'both' | 'ab' | 'ba';

const FRAME_H = 210;
const DEFAULT_A: Pt = { x: 26, y: 26 };
const DEFAULT_B: Pt = { x: 72, y: 74 };
const DEFAULT_DIR: Dir = 'both';

const clamp = (v: number) => Math.max(4, Math.min(96, v));

export default function TripWire({ navigation }: AppScreenProps) {
  const {
    tripWireA: twA,
    tripWireB: twB,
    tripWireDirection: twDir,
  } = useDeviceAlertSettings();
  const setTwA = (tripWireA: Pt) => setTripWire({ tripWireA });
  const setTwB = (tripWireB: Pt) => setTripWire({ tripWireB });
  const setTwDir = (tripWireDirection: Dir) => setTripWire({ tripWireDirection });

  // frame size (width measured on layout, height is fixed)
  const frame = useRef({ w: 1, h: FRAME_H });
  const start = useRef<Pt>({ x: 0, y: 0 });

  const onFrameLayout = (e: LayoutChangeEvent) => {
    frame.current.w = e.nativeEvent.layout.width;
    frame.current.h = e.nativeEvent.layout.height;
  };

  // 端点坐标用 ref 镜像;PanResponder 只创建一次 —— 每次渲染重建会在手势中途
  // 换掉实例,move 事件全部丢失(之前拖不动的原因)
  const twARef = useRef(twA);
  const twBRef = useRef(twB);
  twARef.current = twA;
  twBRef.current = twB;

  const makeResponder = (ptRef: React.MutableRefObject<Pt>, set: (p: Pt) => void) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        start.current = { x: ptRef.current.x, y: ptRef.current.y };
      },
      onPanResponderMove: (
        _e: GestureResponderEvent,
        g: PanResponderGestureState
      ) => {
        const nx = clamp(start.current.x + (g.dx / frame.current.w) * 100);
        const ny = clamp(start.current.y + (g.dy / frame.current.h) * 100);
        set({ x: nx, y: ny });
      },
    });

  const panA = useRef(makeResponder(twARef, setTwA)).current;
  const panB = useRef(makeResponder(twBRef, setTwB)).current;

  const dirs: { key: Dir; label: string }[] = [
    { key: 'both', label: 'A ⇄ B' },
    { key: 'ab', label: 'A → B' },
    { key: 'ba', label: 'A ← B' },
  ];

  const goBack = () => navigation.goBack();
  const refresh = () => {
    setTwA(DEFAULT_A);
    setTwB(DEFAULT_B);
    setTwDir(DEFAULT_DIR);
  };

  return (
    <Screen
      scroll={false}
      header={
        <NavBar
          title="Trip Wire"
          onBack={goBack}
          action={{ label: 'Done', onPress: goBack }}
        />
      }
    >
      {/* camera frame with line + endpoints */}
      <View style={st.frame} onLayout={onFrameLayout}>
        <Svg
          style={StyleSheet.absoluteFill}
          viewBox="0 0 394 210"
          preserveAspectRatio="none"
        >
          <Line
            x1={twA.x * 3.94}
            y1={twA.y * 2.1}
            x2={twB.x * 3.94}
            y2={twB.y * 2.1}
            stroke={colors.brand}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </Svg>

        <AreaLabel side="left" label="A" />
        <AreaLabel side="right" label="B" />

        <View
          {...panA.panHandlers}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          style={[st.dot, { left: `${twA.x}%`, top: `${twA.y}%` }]}
        />
        <View
          {...panB.panHandlers}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          style={[st.dot, { left: `${twB.x}%`, top: `${twB.y}%` }]}
        />
      </View>

      <Text style={st.help}>
        Drag the dots at both ends to adjust the trip wire position; select the
        direction of the target crossing the trip wire, and an alarm will be
        triggered when it occurs.
      </Text>

      <Row style={st.dirRow}>
        {dirs.map((d) => {
          const on = twDir === d.key;
          return (
            <View key={d.key} style={st.dirItem}>
              <Tap
                onPress={() => setTwDir(d.key)}
                style={[
                  st.dirBtn,
                  {
                    backgroundColor: on ? colors.brand : colors.surface,
                    borderColor: on ? colors.brand : colors.borderStrong,
                  },
                  on && st.dirBtnOn,
                ]}
              >
                <DirGlyph dir={d.key} color={on ? '#fff' : colors.textSecondary} />
              </Tap>
              <Text
                style={[
                  st.dirLabel,
                  { color: on ? colors.brand : colors.textTertiary },
                ]}
              >
                {d.label}
              </Text>
            </View>
          );
        })}
      </Row>

      <View style={st.refreshWrap}>
        <Tap onPress={refresh} style={st.refreshBtn}>
          <Icon name="refresh" size={15} color={colors.brand} />
          <Text style={st.refreshTxt}>Refresh</Text>
        </Tap>
      </View>
    </Screen>
  );
}

function AreaLabel({ side, label }: { side: 'left' | 'right'; label: string }) {
  return (
    <View style={[st.areaLabel, side === 'left' ? st.areaLabelLeft : st.areaLabelRight]} pointerEvents="none">
      <Text style={st.areaLabelText}>{label}</Text>
    </View>
  );
}

function DirGlyph({ dir, color }: { dir: Dir; color: string }) {
  if (dir === 'both') {
    return (
      <Text style={[st.glyphSm, { color }]}>
        {'A→'}
        {'\n'}
        {'←B'}
      </Text>
    );
  }
  return (
    <Text style={[st.glyph, { color }]}>
      {dir === 'ab' ? 'A→B' : 'A←B'}
    </Text>
  );
}

const st = StyleSheet.create({
  frame: {
    marginHorizontal: 18,
    marginTop: 8,
    height: FRAME_H,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#211d18',
  },
  dot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand,
    borderWidth: 3,
    borderColor: '#fff',
    marginLeft: -12,
    marginTop: -12,
    zIndex: 3,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  areaLabel: {
    position: 'absolute',
    top: FRAME_H / 2 - 17,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(26,26,26,0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.44)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  areaLabelLeft: { left: 12 },
  areaLabelRight: { right: 12 },
  areaLabelText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  help: {
    paddingHorizontal: 22,
    paddingTop: 14,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    lineHeight: 18,
  },
  dirRow: {
    justifyContent: 'center',
    gap: 26,
    paddingTop: 20,
  },
  dirItem: { alignItems: 'center', gap: 7 },
  dirBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dirBtnOn: {
    shadowColor: colors.brand,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  glyph: { fontSize: 11, fontWeight: '800' },
  glyphSm: { fontSize: 9, fontWeight: '800', lineHeight: 11, textAlign: 'center' },
  dirLabel: { fontSize: 11, fontWeight: '700' },
  refreshWrap: { alignItems: 'center', paddingTop: 22 },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 42,
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: 99,
  },
  refreshTxt: { fontSize: 14, fontWeight: '700', color: colors.brand },
});

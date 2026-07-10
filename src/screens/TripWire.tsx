import React, { useRef, useState } from 'react';
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

type Pt = { x: number; y: number };
type Dir = 'both' | 'ab' | 'ba';

const FRAME_H = 210;

const clamp = (v: number) => Math.max(4, Math.min(96, v));

export default function TripWire({ navigation }: any) {
  const [twA, setTwA] = useState<Pt>({ x: 26, y: 26 });
  const [twB, setTwB] = useState<Pt>({ x: 72, y: 74 });
  const [twDir, setTwDir] = useState<Dir>('both');

  // frame size (width measured on layout, height is fixed)
  const frame = useRef({ w: 1, h: FRAME_H });
  const start = useRef<Pt>({ x: 0, y: 0 });

  const onFrameLayout = (e: LayoutChangeEvent) => {
    frame.current.w = e.nativeEvent.layout.width;
    frame.current.h = e.nativeEvent.layout.height;
  };

  const makeResponder = (pt: Pt, set: (p: Pt) => void) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        start.current = { x: pt.x, y: pt.y };
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

  const panA = useRef(makeResponder(twA, setTwA));
  const panB = useRef(makeResponder(twB, setTwB));
  // keep responders reading latest points
  panA.current = makeResponder(twA, setTwA);
  panB.current = makeResponder(twB, setTwB);

  const dirs: { key: Dir; label: string }[] = [
    { key: 'both', label: 'A ⇄ B' },
    { key: 'ab', label: 'A → B' },
    { key: 'ba', label: 'A ← B' },
  ];

  const goBack = () => navigation.goBack();

  return (
    <Screen scroll={false}>
      <NavBar
        title="Trip Wire"
        onBack={goBack}
        action={{ label: 'Done', onPress: goBack }}
      />

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

        <Label pt={twA} ch="A" />
        <Label pt={twB} ch="B" />

        <View
          {...panA.current.panHandlers}
          style={[st.dot, { left: `${twA.x}%`, top: `${twA.y}%` }]}
        />
        <View
          {...panB.current.panHandlers}
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
        <Tap onPress={() => {}} style={st.refreshBtn}>
          <Icon name="refresh" size={15} color={colors.brand} />
          <Text style={st.refreshTxt}>Refresh</Text>
        </Tap>
      </View>
    </Screen>
  );
}

function Label({ pt, ch }: { pt: Pt; ch: string }) {
  return (
    <Text style={[st.label, { left: `${pt.x}%`, top: `${pt.y}%` }]}>{ch}</Text>
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
  label: {
    position: 'absolute',
    marginLeft: -6,
    marginTop: -30,
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
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

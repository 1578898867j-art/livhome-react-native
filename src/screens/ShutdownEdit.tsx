import type { AppScreenProps } from '../navigation/types';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Screen, Tap, Row, Card, Header, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';
import { addSchedule, useDraftDays } from '../features/devices/shutdownStore';
import type { TM } from '../features/devices/shutdownStore';

type Which = 'off' | 'on';
type Unit = 'h' | 'm';

const p2 = (n: number) => (n < 10 ? '0' : '') + n;

function repeatLabel(days: boolean[]) {
  const n = days.filter(Boolean).length;
  if (n === 7) return 'Everyday';
  if (n === 0) return 'Once';
  if (days[1] && days[2] && days[3] && days[4] && days[5] && !days[0] && !days[6]) return 'Weekdays';
  if (days[0] && days[6] && n === 2) return 'Weekends';
  return 'Custom';
}

const ITEM_H = 48;

// 可滑动滚轮列:snap 到行高,中间灰色胶囊为选中高亮
function WheelCol({ count, value, onChange }: { count: number; value: number; onChange: (v: number) => void }) {
  const ref = useRef<ScrollView>(null);
  const [active, setActive] = useState(value);

  const settle = (y: number) => {
    const i = Math.min(count - 1, Math.max(0, Math.round(y / ITEM_H)));
    setActive(i);
    onChange(i);
  };

  return (
    <View style={st.wheelColWrap}>
      <View style={st.wheelHighlight} pointerEvents="none" />
      <ScrollView
        ref={ref}
        style={{ height: ITEM_H * 3, alignSelf: 'stretch' }}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{ paddingVertical: ITEM_H }}
        contentOffset={{ x: 0, y: value * ITEM_H }}
        onLayout={() => ref.current?.scrollTo({ y: value * ITEM_H, animated: false })}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          if (i !== active && i >= 0 && i < count) setActive(i);
        }}
        onMomentumScrollEnd={(e) => settle(e.nativeEvent.contentOffset.y)}
        onScrollEndDrag={(e) => {
          // 缓慢拖动松手(无惯性)时也落位
          if (e.nativeEvent.velocity && Math.abs(e.nativeEvent.velocity.y) < 0.05) settle(e.nativeEvent.contentOffset.y);
        }}
      >
        {Array.from({ length: count }, (_, v) => (
          <View key={v} style={st.wheelItem}>
            <Text style={[v === active ? st.wheelCur : st.wheelSide, st.mono]}>{p2(v)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function ShutdownEdit({ navigation }: AppScreenProps) {
  const [edOff, setEdOff] = useState<TM>({ h: 22, m: 0 });
  const [edOn, setEdOn] = useState<TM>({ h: 7, m: 0 });
  const edDays = useDraftDays(); // Repeat 页的选择实时同步
  const [edErr] = useState(false);

  const save = () => {
    addSchedule({ off: edOff, on: edOn, days: edDays });
    navigation.goBack();
  };

  const setUnit = (which: Which, unit: Unit, v: number) => {
    const set = which === 'off' ? setEdOff : setEdOn;
    set((t) => ({ ...t, [unit]: v }));
  };

  const wheel = (which: Which, t: TM) => (
    <Row style={st.wheelRow}>
      <WheelCol count={24} value={t.h} onChange={(v) => setUnit(which, 'h', v)} />
      <Text style={st.colon}>:</Text>
      <WheelCol count={60} value={t.m} onChange={(v) => setUnit(which, 'm', v)} />
    </Row>
  );

  const timeCard = (label: string, which: Which, t: TM) => (
    <Card style={st.timeCard}>
      <Row style={{ marginBottom: 4 }}>
        <Text style={st.timeLabel}>{label}</Text>
        <Text style={[st.timeValue, st.mono]}>
          {p2(t.h)}:{p2(t.m)}
        </Text>
      </Row>
      {wheel(which, t)}
    </Card>
  );

  return (
    <Screen scroll={false}>
      <Header title="Device off Time" onBack={() => navigation.goBack()} />

      <View style={st.body}>
        {timeCard('Turn Off Time', 'off', edOff)}
        {timeCard('Turn On Time', 'on', edOn)}

        <Tap style={st.repeatRow} onPress={() => navigation.navigate('shutdown-repeat')}>
          <Text style={st.repeatName}>Repeat</Text>
          <Text style={st.repeatValue}>{repeatLabel(edDays)}</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>

        {edErr && (
          <View style={st.errBox}>
            <Text style={st.errText}>
              This time overlaps with an existing schedule. Please adjust the time or repeat days.
            </Text>
          </View>
        )}
      </View>

      <View style={st.footer}>
        <PrimaryBtn label="Save" onPress={save} style={{ backgroundColor: colors.brand }} />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  mono: { fontVariant: ['tabular-nums'] },
  body: { paddingHorizontal: 18, paddingTop: 8, gap: 14 },

  timeCard: { paddingVertical: 14, paddingHorizontal: 16 },
  timeLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  timeValue: { fontSize: 14, fontWeight: '700', color: colors.brand },

  wheelRow: { justifyContent: 'center', gap: 14, paddingVertical: 6 },
  wheelColWrap: { flex: 1, alignItems: 'center', height: 48 * 3 },
  wheelItem: { height: 48, alignItems: 'center', justifyContent: 'center' },
  wheelHighlight: {
    position: 'absolute', top: 48, alignSelf: 'center',
    width: 78, height: 48, borderRadius: 12, backgroundColor: colors.bgSecondary,
  },
  wheelSide: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textTertiary,
    opacity: 0.45,
  },
  wheelCur: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  colon: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, alignSelf: 'center', paddingTop: 2 },

  repeatRow: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  repeatValue: { fontSize: 14, fontWeight: '500', color: colors.textTertiary, marginRight: 8 },

  errBox: { backgroundColor: colors.criticalSoft, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16 },
  errText: { fontSize: 13, fontWeight: '600', color: colors.critical, lineHeight: 20 },

  footer: { marginTop: 'auto', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 40 },
});

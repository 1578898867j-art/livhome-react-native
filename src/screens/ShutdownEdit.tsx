import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap, Row, Card, Header, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

type TM = { h: number; m: number };
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

export default function ShutdownEdit({ navigation }: any) {
  const [edOff, setEdOff] = useState<TM>({ h: 22, m: 0 });
  const [edOn, setEdOn] = useState<TM>({ h: 7, m: 0 });
  const [edDays] = useState<boolean[]>([true, true, true, true, true, true, true]);
  const [edErr] = useState(false);

  const adj = (which: Which, unit: Unit, dir: 1 | -1) => {
    const mod = unit === 'h' ? 24 : 60;
    const set = which === 'off' ? setEdOff : setEdOn;
    set((t) => ({ ...t, [unit]: ((t[unit] + dir) % mod + mod) % mod }));
  };

  const wheelCol = (which: Which, cur: number, unit: Unit, mod: number) => (
    <View style={st.wheelCol}>
      <Tap onPress={() => adj(which, unit, -1)}>
        <Text style={[st.wheelSide, st.mono]}>{p2((cur + mod - 1) % mod)}</Text>
      </Tap>
      <Text style={[st.wheelCur, st.mono]}>{p2(cur)}</Text>
      <Tap onPress={() => adj(which, unit, 1)}>
        <Text style={[st.wheelSide, st.mono]}>{p2((cur + 1) % mod)}</Text>
      </Tap>
    </View>
  );

  const wheel = (which: Which, t: TM) => (
    <Row style={st.wheelRow}>
      {wheelCol(which, t.h, 'h', 24)}
      <Text style={st.colon}>:</Text>
      {wheelCol(which, t.m, 'm', 60)}
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
        <PrimaryBtn label="Save" onPress={() => navigation.goBack()} />
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
  wheelCol: { flex: 1, alignItems: 'center' },
  wheelSide: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textTertiary,
    opacity: 0.45,
    paddingVertical: 6,
  },
  wheelCur: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingVertical: 9,
    width: 78,
    textAlign: 'center',
    overflow: 'hidden',
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

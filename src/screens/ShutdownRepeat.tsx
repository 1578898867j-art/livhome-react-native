import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap, Row, Card, NavBar } from '../components/kit';
import { colors } from '../theme';

const NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Ported 1:1 from the prototype's repeatLabel().
function repeatLabel(days: boolean[]): string {
  const n = days.filter(Boolean).length;
  if (n === 7) return 'Everyday';
  if (n === 0) return 'Once';
  if (days[1] && days[2] && days[3] && days[4] && days[5] && !days[0] && !days[6]) return 'Weekdays';
  if (days[0] && days[6] && n === 2) return 'Weekends';
  return 'Custom';
}

export default function ShutdownRepeat({ navigation }: AppScreenProps) {
  const [days, setDays] = useState<boolean[]>([true, true, true, true, true, true, true]);

  const toggle = (i: number) =>
    setDays((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <Screen scroll={false}>
      <NavBar
        title="Device off Time"
        onBack={() => navigation.goBack()}
        action={{ label: 'Done', onPress: () => navigation.goBack() }}
      />

      <Card style={st.card}>
        {/* prototype: .eyebrow with text-align:center; font-size:11px */}
        <Text style={st.eyebrow}>Repeat</Text>
        <Text style={st.label}>{repeatLabel(days)}</Text>
        <Row style={st.daysRow}>
          {NAMES.map((d, i) => {
            const on = days[i];
            return (
              <Tap
                key={d}
                onPress={() => toggle(i)}
                style={[st.day, { backgroundColor: on ? colors.brand : colors.bgSecondary }]}
              >
                <Text style={[st.dayText, { color: on ? '#fff' : colors.textSecondary }]}>{d}</Text>
              </Tap>
            );
          })}
        </Row>
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    marginTop: 14,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  eyebrow: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  daysRow: {
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 4,
  },
  day: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

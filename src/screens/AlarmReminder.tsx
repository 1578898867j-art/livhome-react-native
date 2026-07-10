import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap, Card, Header, Eyebrow, ToggleRow, SettingRow } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

/* ---- av radio row (avRow) — hollow/filled circle + optional right value ---- */
function AvRow({
  label,
  value,
  on,
  onPress,
  last,
}: {
  label: string;
  value?: string;
  on: boolean;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <Tap onPress={onPress} style={st.avRow}>
      {!last && <View style={st.divider} />}
      <View style={[st.radio, { borderColor: on ? colors.brand : colors.borderStrong }]}>
        {on && <View style={st.radioDot} />}
      </View>
      <Text style={st.avLabel}>{label}</Text>
      {!!value && (
        <>
          <Text style={st.avValue}>{value}</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </>
      )}
    </Tap>
  );
}

export default function AlarmReminder({ navigation }: any) {
  const [notifOn, setNotifOn] = useState(true);
  const [voiceAlarm, setVoiceAlarm] = useState(true);
  const [alarmVoice, setAlarmVoice] = useState<'system' | 'custom'>('system');
  const [alarmPeriod] = useState('All Day');
  const cvSel: string | null = null;

  return (
    <Screen>
      <Header title="Alarm Reminder" onBack={() => navigation.goBack()} />

      <Eyebrow>Alarm settings</Eyebrow>
      <Card style={st.card}>
        <ToggleRow name="Alarm Notification" on={notifOn} onToggle={() => setNotifOn((v) => !v)} />
        <ToggleRow name="Voice Alarm" on={voiceAlarm} onToggle={() => setVoiceAlarm((v) => !v)} last />
      </Card>

      {voiceAlarm && (
        <>
          <Eyebrow>Alarm voice</Eyebrow>
          <Card style={st.card}>
            <AvRow
              label="System Voice"
              on={alarmVoice === 'system'}
              onPress={() => setAlarmVoice('system')}
            />
            <AvRow
              label="Custom Voice"
              value={cvSel ? cvSel : 'Not added'}
              on={alarmVoice === 'custom'}
              onPress={() => setAlarmVoice('custom')}
              last
            />
          </Card>
        </>
      )}

      <Eyebrow>Alarm period</Eyebrow>
      <Card style={st.card}>
        <SettingRow icon="clock" name="Alarm Period" value={alarmPeriod} last />
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { marginHorizontal: 18 },
  avRow: { flexDirection: 'row', alignItems: 'center', minHeight: 54, paddingHorizontal: 16, gap: 12 },
  divider: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
  avLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  avValue: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },
});

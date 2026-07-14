import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Screen, Header, Eyebrow, Hint, Card, RadioRow, Row } from '../components/kit';
import { colors } from '../theme';

// Ported 1:1 from the prototype's NF_OPTS.
const NF_OPTS: [string, string][] = [
  ['realtime', 'Real-time'],
  ['1', '1 minute'],
  ['5', '5 minutes'],
  ['10', '10 minutes'],
  ['30', '30 minutes'],
  ['60', '1 hour'],
];

export default function NotifFrequency({ navigation }: AppScreenProps) {
  const [notifFreq, setNotifFreq] = useState<string>('10');
  const [notifCustom, setNotifCustom] = useState<number | null>(null);
  const [dlgOpen, setDlgOpen] = useState(false);
  const [customVal, setCustomVal] = useState('');

  // prototype: valid = /^\d+$/ and > 0; error shown once something invalid is typed
  const trimmed = customVal.trim();
  const valid = /^\d+$/.test(trimmed) && parseInt(trimmed, 10) > 0;
  const showErr = trimmed !== '' && !valid;

  const openDlg = () => {
    setCustomVal(notifCustom ? String(notifCustom) : '');
    setDlgOpen(true);
  };
  const closeDlg = () => setDlgOpen(false);
  const confirmDlg = () => {
    if (!valid) return;
    setNotifCustom(parseInt(trimmed, 10));
    setNotifFreq('custom');
    setDlgOpen(false);
  };

  return (
    <Screen header={<Header title="Notification Frequency" onBack={() => navigation.goBack()} />}>
      <View style={st.page}>
        <Eyebrow>Select notification frequency</Eyebrow>

        <Card style={st.card}>
          {NF_OPTS.map((o) => (
            <RadioRow
              key={o[0]}
              name={o[1]}
              selected={notifFreq === o[0]}
              onPress={() => setNotifFreq(o[0])}
              last={false}
            />
          ))}
          <RadioRow
            name={notifCustom ? `${notifCustom} min` : 'Custom'}
            selected={notifFreq === 'custom'}
            onPress={openDlg}
            last
          />
        </Card>

        <Hint>
          Within the set time period, if motion or sound is detected multiple times, you will
          only be notified once to avoid frequent interruptions.
        </Hint>
      </View>

      {/* Custom Interval dialog — mirrors the prototype's nf-custom overlay */}
      <Modal transparent visible={dlgOpen} animationType="fade" onRequestClose={closeDlg}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <Pressable style={st.ovl} onPress={closeDlg}>
            <Pressable style={st.dialog} onPress={() => {}}>
              <Text style={st.dlgTitle}>Custom Interval</Text>
              <Row
                style={[
                  st.inputRow,
                  { borderBottomColor: showErr ? colors.critical : colors.brand },
                ]}
              >
                <TextInput
                  value={customVal}
                  onChangeText={setCustomVal}
                  placeholder="Enter minutes"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="number-pad"
                  autoFocus
                  style={st.input}
                />
                <Text style={st.inputUnit}>min</Text>
              </Row>
              {showErr && (
                <Text style={st.inputErr}>Only numbers greater than zero are allowed</Text>
              )}
              <Row style={{ gap: 12, marginTop: 20 }}>
                <Pressable style={[st.dlgBtn, st.dlgCancel]} onPress={closeDlg}>
                  <Text style={[st.dlgBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  disabled={!valid}
                  style={[st.dlgBtn, { backgroundColor: colors.brand, opacity: valid ? 1 : 0.45 }]}
                  onPress={confirmDlg}
                >
                  <Text style={[st.dlgBtnText, { color: '#fff' }]}>Confirm</Text>
                </Pressable>
              </Row>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  page: { paddingBottom: 54 },
  card: { marginHorizontal: 18 },

  ovl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  dialog: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingTop: 22,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  dlgTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  inputRow: {
    marginTop: 16,
    borderBottomWidth: 1.5,
    paddingBottom: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputUnit: { fontSize: 14, fontWeight: '600', color: colors.textTertiary },
  inputErr: { fontSize: 12, fontWeight: '600', color: colors.critical, marginTop: 8 },
  dlgBtn: { flex: 1, height: 46, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  dlgCancel: { backgroundColor: colors.bgSecondary },
  dlgBtnText: { fontSize: 15, fontWeight: '700' },
});

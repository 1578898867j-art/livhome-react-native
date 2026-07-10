import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Screen, Tap, Row, Header } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

export default function BindWifi({ navigation }: any) {
  const [password, setPassword] = useState('');
  const filled = password.length > 0;

  return (
    <Screen scroll={false} contentStyle={st.page}>
      <Header title="Wi-Fi Setup" onBack={() => navigation.goBack()} />

      {/* step indicator (bStepper(2) of 4) */}
      <Row style={st.stepper}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[st.stepBar, { backgroundColor: i <= 2 ? colors.brand : colors.borderStrong }]}
          />
        ))}
      </Row>

      <View style={st.fields}>
        {/* Network — select affordance → pick screen */}
        <View style={st.field}>
          <Text style={st.fieldLabel}>Network (2.4GHz)</Text>
          <Tap style={st.fieldRow} onPress={() => navigation.navigate('bind-wifi-pick')}>
            <Text style={[st.fieldVal, { color: colors.textTertiary, fontWeight: '400' }]}>
              Select a Wi-Fi network
            </Text>
            <Icon name="chevR" size={16} color={colors.textTertiary} sw={2} />
          </Tap>
        </View>

        {/* Password — secure text input */}
        <View style={st.field}>
          <Text style={st.fieldLabel}>Password</Text>
          <View style={st.fieldRow}>
            <TextInput
              style={st.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Wi-Fi password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
      </View>

      {/* 2.4GHz notice */}
      <Row style={st.noteRow}>
        <Icon name="info" size={13} color={colors.textTertiary} sw={2} />
        <Text style={st.noteText}>2.4GHz networks only (5GHz not supported).</Text>
      </Row>

      <View style={{ flex: 1 }} />

      {/* Connect / Next */}
      <View style={st.ctaWrap}>
        <Tap
          style={[
            st.btn,
            { backgroundColor: filled ? colors.btnPrimary : colors.bgSecondary },
            !filled && { opacity: 0.5 },
          ]}
          onPress={() => navigation.navigate('bind-connecting')}
        >
          <Text style={[st.btnText, { color: filled ? '#fff' : colors.textPrimary }]}>Connect</Text>
        </Tap>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  page: { paddingTop: 6, paddingBottom: 40 },
  stepper: { justifyContent: 'center', gap: 6, paddingVertical: 8, paddingTop: 8 },
  stepBar: { width: 20, height: 3, borderRadius: 2 },
  fields: { paddingTop: 18 },
  field: { marginHorizontal: 22, marginBottom: 12 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: 8,
    marginLeft: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  fieldVal: { flex: 1, fontSize: 16 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  noteRow: { marginHorizontal: 22, marginTop: 2, gap: 8, alignItems: 'flex-start' },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    lineHeight: 17,
  },
  ctaWrap: { paddingHorizontal: 24, paddingTop: 16 },
  btn: { width: '100%', height: 54, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});

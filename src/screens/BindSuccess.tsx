import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Screen, Header, Tap, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';


export default function BindSuccess({ navigation }: AppScreenProps) {
  const [name, setName] = useState('Living Room Camera');

  return (
    <Screen
      scroll={false}
      header={
        <View style={{ paddingTop: 8 }}>
          <Header title="Add Device" onBack={() => navigation.goBack()} />
        </View>
      }
    >
      {/* stepper — 4 of 4 */}
      <View style={st.stepper}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[st.step, { backgroundColor: i <= 4 ? colors.brand : colors.borderStrong }]} />
        ))}
      </View>

      {/* success check */}
      <View style={st.checkWrap}>
        <View style={st.checkCircle}>
          <Icon name="check" size={36} color={colors.success} sw={2.6} />
        </View>
      </View>

      {/* heading */}
      <View style={st.headWrap}>
        <Text style={st.title}>Connected</Text>
        <Text style={st.sub}>Vision / sound / IR are calibrated and ready. Name it and choose a room.</Text>
      </View>

      {/* device name field */}
      <View style={{ marginTop: 26 }}>
        <View style={st.fieldWrap}>
          <Text style={st.fieldLabel}>Device name</Text>
          <View style={st.fieldBox}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Living Room Camera"
              placeholderTextColor={colors.textTertiary}
              style={st.fieldInput}
            />
          </View>
        </View>
      </View>

      {/* save */}
      <View style={st.footer}>
        <PrimaryBtn label="Save" onPress={() => navigation.navigate('Main', { screen: 'dev-home' })} />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  stepper: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 8, paddingBottom: 4 },
  step: { width: 20, height: 3, borderRadius: 2 },
  checkWrap: { flexDirection: 'row', justifyContent: 'center', paddingTop: 26, paddingBottom: 4 },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headWrap: { alignItems: 'center', paddingHorizontal: 30, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.textPrimary },
  sub: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  fieldWrap: { marginHorizontal: 22, marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textTertiary, marginBottom: 8, marginLeft: 4 },
  fieldBox: {
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    justifyContent: 'center',
  },
  fieldInput: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  roomWrap: { paddingHorizontal: 22, paddingTop: 6 },
  roomLabel: { fontSize: 12, fontWeight: '600', color: colors.textTertiary, marginBottom: 12, marginLeft: 4 },
  roomRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1 },
  footer: { marginTop: 'auto', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
});

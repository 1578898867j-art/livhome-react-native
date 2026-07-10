import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Screen, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailLogin({ navigation }: any) {
  const [email, setEmail] = useState('');

  const trimmed = email.trim();
  const valid = EMAIL_RE.test(trimmed);
  const showErr = trimmed !== '' && !valid;
  const borderColor = showErr ? colors.critical : email ? colors.brand : colors.border;

  return (
    <Screen scroll={false} contentStyle={st.page}>
      {/* close / back */}
      <Row style={st.topRow}>
        <Pressable
          style={({ pressed }) => [st.iconbtn, pressed && { opacity: 0.55 }]}
          hitSlop={8}
          onPress={() => navigation.goBack()}
        >
          <Icon name="x" size={18} color={colors.textPrimary} sw={2} />
        </Pressable>
      </Row>

      {/* content */}
      <View style={st.body}>
        <Text style={st.title}>Add a Contact Email</Text>
        <Text style={st.subtitle}>Please enter your email to continue</Text>

        <Text style={st.eyebrow}>Email Address</Text>

        <View style={[st.inputRow, { borderColor }]}>
          <Icon name="mail" size={18} color={showErr ? colors.critical : colors.textTertiary} />
          <TextInput
            style={st.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {showErr && (
          <Row style={st.errRow}>
            <Icon name="warn" size={14} color={colors.critical} />
            <Text style={st.errText}>Invalid Email. Please try again</Text>
          </Row>
        )}
      </View>

      <View style={{ flex: 1 }} />

      {/* CTA */}
      <View style={st.ctaWrap}>
        <Pressable
          disabled={!valid}
          onPress={() => navigation.replace('Main')}
          style={({ pressed }) => [
            st.btn,
            { backgroundColor: valid ? colors.brand : colors.bgSecondary },
            valid && pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={[st.btnText, { color: valid ? '#fff' : colors.textTertiary }]}>
            Get Verification Code
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  page: { paddingTop: 6, paddingBottom: 54 },
  topRow: { paddingHorizontal: 18, paddingVertical: 8 },
  iconbtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 24, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, color: colors.textPrimary },
  subtitle: { fontSize: 15, fontWeight: '500', color: colors.textSecondary, marginTop: 8 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingTop: 26,
    paddingBottom: 8,
    paddingLeft: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    padding: 0,
  },
  errRow: { gap: 6, marginTop: 9, paddingLeft: 2 },
  errText: { fontSize: 13, fontWeight: '600', color: colors.critical },
  ctaWrap: { paddingHorizontal: 24 },
  btn: {
    width: '100%',
    height: 54,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontSize: 16, fontWeight: '700' },
});

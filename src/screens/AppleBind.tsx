import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Screen, Tap, Row, Eyebrow, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

export default function AppleBind({ navigation }: any) {
  const [email, setEmail] = useState('');

  return (
    <Screen scroll={false} contentStyle={st.page}>
      <Row style={st.topBar}>
        <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="x" size={18} color={colors.textPrimary} sw={2} />
        </Tap>
      </Row>

      <View style={st.body}>
        <Text style={st.title}>Add a Contact Email</Text>
        <Text style={st.sub}>Please enter your email to continue</Text>

        <Eyebrow>Email address</Eyebrow>

        <Row style={st.field}>
          <Icon name="mail" size={18} color={colors.textTertiary} />
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
        </Row>
      </View>

      <View style={{ flex: 1 }} />

      <View style={st.footer}>
        <PrimaryBtn label="Get Verification Code" onPress={() => navigation.replace('Main')} />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  page: { paddingBottom: 54 },
  topBar: { paddingHorizontal: 18, paddingVertical: 8 },
  iconbtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 24, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, color: colors.textPrimary },
  sub: { fontSize: 15, fontWeight: '500', color: colors.textSecondary, marginTop: 8 },
  field: {
    height: 54,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.textPrimary },
  footer: { paddingHorizontal: 24 },
});

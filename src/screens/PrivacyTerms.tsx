import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme';

// 欢迎/隐私同意页(Figma 4060:1921):浅灰底 + 大白卡,三段文案 + Agree/Disagree
// 文案按产品定位为居家看护(home),链接跳转用户协议全文页
export default function PrivacyTerms({ navigation }: AppScreenProps) {
  const openAgreement = () => navigation.navigate('privacy-agreement');
  const openPolicy = () => navigation.navigate('privacy-policy');
  return (
    <View style={st.page}>
      <View style={st.card}>
        <Text style={st.title}>Welcome to LIVHOME</Text>

        <Text style={st.body}>
          Thank you for choosing LIVHOME.{'\n'}
          We are committed to providing an intelligent and seamless lifestyle experience for you
          and your home.
        </Text>

        <Text style={[st.body, { marginTop: 18 }]}>
          Before using this app and its related services, please take a moment to read and agree
          to our <Text style={st.link} onPress={openAgreement}>《User Agreement》</Text> and{' '}
          <Text style={st.link} onPress={openPolicy}>《Privacy Policy》</Text>. We value your trust
          and will protect your personal information in accordance with applicable laws and
          regulations. Your data will only be used as necessary to deliver services, improve our
          products, and enhance your overall experience.
        </Text>

        <Text style={[st.body, { marginTop: 18 }]}>
          By tapping “Agree and continue”, you confirm that you have read, understood, and accepted
          all the terms of the User Agreement and Privacy Policy.
        </Text>

        <Pressable
          style={({ pressed }) => [st.agreeBtn, pressed && { opacity: 0.88 }]}
          onPress={() => navigation.replace('login')}
        >
          <Text style={st.agreeTxt}>Agree and continue</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [st.disagreeBtn, pressed && { opacity: 0.7 }]}>
          <Text style={st.disagreeTxt}>Disagree</Text>
        </Pressable>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingTop: 30,
    paddingBottom: 26,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.textPrimary,
    marginBottom: 22,
  },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 21, color: colors.textPrimary },
  link: { color: colors.brand },
  agreeBtn: {
    marginTop: 30,
    height: 50,
    borderRadius: 99,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreeTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disagreeBtn: {
    marginTop: 12,
    height: 50,
    borderRadius: 99,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disagreeTxt: { color: colors.textTertiary, fontSize: 16, fontWeight: '500' },
});

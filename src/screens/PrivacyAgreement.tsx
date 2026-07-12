import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header } from '../components/kit';
import { colors } from '../theme';

/* Static policy sections — headings + paragraphs for the document page. */
const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: '1. Introduction',
    p: [
      'Welcome to LIVHOME. This Privacy & User Agreement explains how we collect, use, and protect your information when you use our smart home-care camera and related services.',
      'By using LIVHOME, you agree to the terms described below. Please read them carefully before continuing.',
    ],
  },
  {
    h: '2. Information We Collect',
    p: [
      'We collect account information you provide, such as your name and email address, as well as device data and camera recordings needed to deliver our services.',
      'We may also collect diagnostic and usage information to improve app performance and reliability.',
    ],
  },
  {
    h: '3. How We Use Your Information',
    p: [
      'Your data is used solely to provide, maintain, and improve LIVHOME services, including live streaming, notifications, and cloud storage.',
      'We do not sell your personal information to third parties.',
    ],
  },
  {
    h: '4. Data Security',
    p: [
      'We use encryption and industry-standard safeguards to protect your recordings and account data both in transit and at rest.',
      'You are responsible for keeping your account credentials confidential.',
    ],
  },
  {
    h: '5. Your Rights',
    p: [
      'You may access, update, or delete your personal information at any time through the app settings.',
      'You may also withdraw consent for optional data processing where applicable.',
    ],
  },
  {
    h: '6. Contact Us',
    p: [
      'If you have questions about this agreement or your data, please contact us at support@livhome.com.',
    ],
  },
];

export default function PrivacyAgreement({ navigation }: AppScreenProps) {
  return (
    <Screen contentStyle={{ paddingBottom: 54 }}>
      <Header title="Privacy & User Agreement" onBack={() => navigation.goBack()} />

      <View style={st.doc}>
        <Text style={st.updated}>Last updated: July 2026</Text>

        {SECTIONS.map((sec) => (
          <View key={sec.h} style={st.section}>
            <Text style={st.h}>{sec.h}</Text>
            {sec.p.map((para, i) => (
              <Text key={i} style={st.p}>
                {para}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  doc: { paddingHorizontal: 20, paddingTop: 12 },
  updated: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: 20,
  },
  section: { marginBottom: 22 },
  h: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  p: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
});

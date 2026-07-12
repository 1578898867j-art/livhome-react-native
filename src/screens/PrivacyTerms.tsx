import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme';

export default function PrivacyTerms({ navigation }: AppScreenProps) {
  return (
    <View style={st.overlay}>
      <View style={st.card}>
        <Text style={st.title}>Welcome to LIVHOME</Text>

        <Text style={st.body}>
          Thank you for choosing LIVHOME. We are committed to providing an
          intelligent and seamless experience for you and your smart home.
        </Text>

        <Text style={[st.body, { marginTop: 12 }]}>
          Before using this app, please read and agree to our{' '}
          <Text style={st.link}>User Agreement</Text> and{' '}
          <Text style={st.link}>Privacy Policy</Text>. Your data will only be
          used as necessary to deliver services.
        </Text>

        <View style={st.actions}>
          <Pressable
            onPress={() => navigation.replace('Main', { screen: 'dev-home' })}
            style={({ pressed }) => [st.btn, st.btnPri, pressed && { opacity: 0.85 }]}
          >
            <Text style={st.btnPriText}>Agree and continue</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [st.btn, st.btnSec, pressed && { opacity: 0.85 }]}
          >
            <Text style={st.btnSecText}>Disagree</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,20,22,.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingVertical: 26,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 24 },
    elevation: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 14,
    lineHeight: 22,
  },
  link: {
    color: colors.brand,
    fontWeight: '700',
  },
  actions: {
    marginTop: 20,
    gap: 10,
  },
  btn: {
    width: '100%',
    height: 54,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPri: {
    backgroundColor: colors.brand,
  },
  btnPriText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  btnSec: {
    backgroundColor: colors.bgSecondary,
  },
  btnSecText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { SunLogo } from '../components/SunLogo';
import { colors } from '../theme';

// Real brand logos from the prototype (multi-color Google, dark Apple) — used verbatim.
const GOOGLE_LOGO =
  '<svg width="28" height="28" viewBox="14.33 14.33 23.34 23.34" fill="none"><path d="M37.4397 23.7144H36.4999V23.666H25.9999V28.3326H32.5933C31.6314 31.0492 29.0467 32.9993 25.9999 32.9993C22.1342 32.9993 18.9999 29.8651 18.9999 25.9993C18.9999 22.1336 22.1342 18.9993 25.9999 18.9993C27.7843 18.9993 29.4078 19.6725 30.6438 20.7721L33.9438 17.4721C31.8601 15.5302 29.0729 14.3326 25.9999 14.3326C19.557 14.3326 14.3333 19.5564 14.3333 25.9993C14.3333 32.4422 19.557 37.666 25.9999 37.666C32.4428 37.666 37.6666 32.4422 37.6666 25.9993C37.6666 25.2171 37.5861 24.4535 37.4397 23.7144Z" fill="#FFC107"/><path d="M15.6782 20.5691L19.5113 23.3801C20.5485 20.8123 23.0603 18.9993 25.9997 18.9993C27.7841 18.9993 29.4076 19.6725 30.6436 20.7721L33.9436 17.4721C31.8599 15.5302 29.0727 14.3326 25.9997 14.3326C21.5186 14.3326 17.6324 16.8626 15.6782 20.5691Z" fill="#FF3D00"/><path d="M26 37.6677C29.0135 37.6677 31.7517 36.5144 33.8219 34.639L30.2111 31.5835C29.0004 32.5042 27.521 33.0022 26 33.001C22.9655 33.001 20.3889 31.0661 19.4183 28.3658L15.6138 31.2971C17.5446 35.0753 21.4658 37.6677 26 37.6677Z" fill="#4CAF50"/><path d="M37.4396 23.7135H36.4999V23.6651H25.9999V28.3318H32.5933C32.1332 29.6247 31.3043 30.7545 30.2092 31.5815L30.211 31.5803L33.8218 34.6358C33.5663 34.868 37.6665 31.8318 37.6665 25.9984C37.6665 25.2162 37.586 24.4526 37.4396 23.7135Z" fill="#1976D2"/></svg>';
const APPLE_LOGO =
  '<svg width="28" height="28" viewBox="14.48 14.79 22.42 22.42" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M34.9727 22.3157C33.818 20.8768 32.1979 20.0443 30.6686 20.0443C28.6453 20.0443 27.7904 21.0056 26.3868 21.0056C24.94 21.0056 23.8399 20.0457 22.0899 20.0457C20.371 20.0457 18.5434 21.0898 17.3848 22.8743C15.7544 25.3836 16.0304 30.105 18.6742 34.1283C19.6198 35.5669 20.8826 37.1848 22.5337 37.2002C24.0012 37.2136 24.4164 36.2641 26.4075 36.2529C28.3989 36.242 28.7755 37.2106 30.2427 37.1968C31.8938 37.1811 33.2261 35.3897 34.1711 33.9508C34.8484 32.9201 35.1007 32.3993 35.6268 31.2342C31.8045 29.79 31.1899 24.3891 34.9727 22.3157Z" fill="#111827"/><path fill-rule="evenodd" clip-rule="evenodd" d="M29.1338 18.4322C29.8688 17.4892 30.4271 16.157 30.2244 14.7956C29.0238 14.8785 27.6193 15.642 26.7995 16.638C26.0552 17.5418 25.4406 18.8822 25.6797 20.185C26.9904 20.2256 28.3467 19.4425 29.1338 18.4322Z" fill="#111827"/></svg>';

export default function Login({ navigation }: AppScreenProps) {
  const enterApp = () => navigation.navigate('email-login');

  return (
    <Screen scroll={false} contentStyle={st.page}>
      {/* Language pill row */}
      <Row style={st.langRow}>
        <View style={{ flex: 1 }} />
        <Tap style={st.langPill} onPress={() => navigation.navigate('language')}>
          <Icon name="globe" size={15} color={colors.textSecondary} />
          <Text style={st.langText}>English</Text>
          <Icon name="chevD" size={13} color={colors.textSecondary} sw={2} />
        </Tap>
      </Row>

      {/* Centered content */}
      <View style={st.center}>
        <SunLogo size={84} />

        <Text style={st.title}>Welcome to LIVHOME</Text>
        <Text style={st.subtitle}>Choose a way to sign in or sign up</Text>

        <View style={{ height: 42 }} />

        <View style={{ width: '100%' }}>
          <Tap style={st.emailBtn} onPress={enterApp}>
            <Text style={st.emailBtnText}>Continue with email</Text>
          </Tap>

          {/* Or divider */}
          <Row style={st.divRow}>
            <View style={st.divLine} />
            <Text style={st.divText}>Or</Text>
            <View style={st.divLine} />
          </Row>

          {/* Social buttons */}
          <Row style={st.socialRow}>
            <Tap style={st.socialBtn} onPress={enterApp}>
              <SvgXml xml={GOOGLE_LOGO} width={26} height={26} />
            </Tap>
            <Tap style={st.socialBtn} onPress={enterApp}>
              <SvgXml xml={APPLE_LOGO} width={26} height={26} />
            </Tap>
          </Row>

          {/* Legal */}
          <Text style={st.legal}>
            By continuing, you agree to our{' '}
            <Text style={st.legalLink} onPress={() => navigation.navigate('privacy-agreement')}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text style={st.legalLink} onPress={() => navigation.navigate('privacy-policy')}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  page: { paddingTop: 6, paddingBottom: 40 },
  langRow: { paddingHorizontal: 20, paddingVertical: 6 },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.bgSecondary,
  },
  langText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, marginTop: 24, color: colors.textPrimary },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  emailBtn: {
    width: '100%',
    height: 54,
    borderRadius: 99,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  divRow: { gap: 12, marginVertical: 22 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divText: { fontSize: 13, fontWeight: '600', color: colors.textTertiary },
  socialRow: { gap: 48, justifyContent: 'center' },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(120,120,128,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legal: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: 26,
    lineHeight: 18,
  },
  legalLink: { color: colors.brand, fontWeight: '700' },
});

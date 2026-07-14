import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { Screen, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { saveLoginState } from '../features/auth/session';
import { colors, spacing } from '../theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailLogin({ navigation }: AppScreenProps) {
  const [email, setEmail] = useState('');
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(show, () => setKeyboardShown(true));
    const hideSubscription = Keyboard.addListener(hide, () => setKeyboardShown(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const trimmed = email.trim();
  const valid = EMAIL_RE.test(trimmed);
  const showErr = trimmed !== '' && !valid;
  const borderColor = showErr ? colors.critical : email ? colors.brand : colors.border;

  const completeLogin = async () => {
    try {
      await saveLoginState();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'agent-chat' } }],
      });
    } catch {
      Alert.alert('Unable to sign in', 'The login state could not be saved. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen
        scroll={false}
        contentStyle={[st.page, keyboardShown && st.pageKeyboard]}
        header={
          <View style={st.headerInset}>
            <Row style={st.topRow}>
              <Pressable
                style={({ pressed }) => [st.iconbtn, pressed && { opacity: 0.55 }]}
                hitSlop={8}
                onPress={() => navigation.goBack()}
              >
                <Icon name="x" size={18} color={colors.textPrimary} sw={2} />
              </Pressable>
            </Row>
          </View>
        }
      >
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
            onPress={() => void completeLogin()}
            style={({ pressed }) => [
              st.btn,
              { backgroundColor: colors.brand },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[st.btnText, { color: colors.textInverse }]}>
              Get Verification Code
            </Text>
          </Pressable>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  headerInset: { paddingTop: 6 },
  page: { paddingBottom: 54 },
  pageKeyboard: { paddingBottom: spacing.md },
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

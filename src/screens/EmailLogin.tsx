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
import { Screen, Row, Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { saveLoginState } from '../features/auth/session';
import { getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';
import { colors, spacing } from '../theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailLogin({ navigation }: AppScreenProps) {
  const [email, setEmail] = useState('');
  const [keyboardShown, setKeyboardShown] = useState(false);

  // 验证码步骤:发送失败 / 倒计时重发 / 验证码错误(000000 触发)/ 登录失败
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState(false);
  const [cd, setCd] = useState(0);
  const cdTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(show, () => setKeyboardShown(true));
    const hideSubscription = Keyboard.addListener(hide, () => setKeyboardShown(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      if (cdTimer.current) clearInterval(cdTimer.current);
    };
  }, []);

  const trimmed = email.trim();
  const valid = EMAIL_RE.test(trimmed);
  const showErr = trimmed !== '' && !valid;
  const borderColor = showErr ? colors.critical : email ? colors.brand : colors.border;
  const codeBorder = codeErr ? colors.critical : code ? colors.brand : colors.border;

  const startCd = () => {
    setCd(60);
    if (cdTimer.current) clearInterval(cdTimer.current);
    cdTimer.current = setInterval(() => {
      setCd((v) => {
        if (v <= 1 && cdTimer.current) clearInterval(cdTimer.current);
        return Math.max(0, v - 1);
      });
    }, 1000);
  };

  // 发送验证码:断网/失败演示 → 错误提示;成功 → 进入验证码步骤 + 60s 倒计时
  const sendCode = () => {
    if (!valid) return;
    const f = getDemoFlags();
    if (f.offline || f.failOps) {
      showToast('Failed to send the code. Please try again.', 'error');
      return;
    }
    setStep('code');
    setCode('');
    setCodeErr(false);
    startCd();
  };

  // 登录:000000 演示「验证码错误」;断网/失败演示 → 登录失败提示
  const signIn = () => {
    if (code.length < 6) return;
    if (code === '000000') {
      setCodeErr(true);
      return;
    }
    const f = getDemoFlags();
    if (f.offline || f.failOps) {
      showToast('Sign-in failed. Please try again.', 'error');
      return;
    }
    void completeLogin();
  };

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
        {step === 'email' ? (
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
        ) : (
          <View style={st.body}>
            <Text style={st.title}>Enter Verification Code</Text>
            <Text style={st.subtitle}>We’ve sent a 6-digit code to {trimmed}</Text>

            <Text style={st.eyebrow}>Verification Code</Text>

            <View style={[st.inputRow, { borderColor: codeBorder }]}>
              <Icon name="key" size={18} color={codeErr ? colors.critical : colors.textTertiary} />
              <TextInput
                style={st.input}
                value={code}
                onChangeText={(v) => {
                  setCode(v.replace(/\D/g, '').slice(0, 6));
                  setCodeErr(false);
                }}
                placeholder="6-digit code"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {codeErr && (
              <Row style={st.errRow}>
                <Icon name="warn" size={14} color={colors.critical} />
                <Text style={st.errText}>Incorrect verification code. Please try again</Text>
              </Row>
            )}

            {/* 重发 + 倒计时(频率限制) */}
            <Row style={st.resendRow}>
              <Text style={st.resendHint}>Didn’t get the code?</Text>
              <Tap onPress={cd > 0 ? undefined : sendCode} hitSlop={8}>
                <Text style={[st.resendTxt, cd > 0 && { color: colors.textTertiary }]}>
                  {cd > 0 ? `Resend in ${cd}s` : 'Resend'}
                </Text>
              </Tap>
            </Row>
          </View>
        )}

        <View style={{ flex: 1 }} />

        {/* CTA */}
        <View style={st.ctaWrap}>
          <Pressable
            onPress={step === 'email' ? sendCode : signIn}
            style={({ pressed }) => [
              st.btn,
              { backgroundColor: colors.brand },
              ((step === 'email' && !valid) || (step === 'code' && code.length < 6)) && { opacity: 0.45 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[st.btnText, { color: colors.textInverse }]}>
              {step === 'email' ? 'Get Verification Code' : 'Sign In'}
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
  resendRow: { gap: 6, marginTop: 14, paddingLeft: 2 },
  resendHint: { fontSize: 13, fontWeight: '500', color: colors.textTertiary },
  resendTxt: { fontSize: 13, fontWeight: '700', color: colors.brand },
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

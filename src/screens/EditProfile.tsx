import type { AppScreenProps } from '../navigation/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, Header, Eyebrow, Row, Tap, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

const PHONE_KEYBOARD_GAP = 10;

export default function EditProfile({ navigation }: AppScreenProps) {
  const [nickname, setNickname] = useState('Jon Alishon');
  const [phone, setPhone] = useState('');
  const [keyboardFrame, setKeyboardFrame] = useState<{ top: number; inset: number } | null>(null);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const phoneFocusedRef = useRef(false);
  const phoneBottomRef = useRef(0);
  const headerHeightRef = useRef(0);

  const revealPhoneInput = useCallback((keyboardTop: number) => {
    const visibleBottom = keyboardTop - insets.top - headerHeightRef.current;
    const scrollY = Math.max(0, phoneBottomRef.current - visibleBottom + PHONE_KEYBOARD_GAP);
    scrollRef.current?.scrollTo({ y: scrollY, animated: false });
  }, [insets.top]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, ({ endCoordinates }) => {
      setKeyboardFrame({
        top: endCoordinates.screenY,
        inset: Platform.OS === 'ios' ? endCoordinates.height : 0,
      });
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardFrame(null);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: false }));
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardFrame && phoneFocusedRef.current) revealPhoneInput(keyboardFrame.top);
  }, [keyboardFrame, revealPhoneInput]);

  return (
    <Screen
      scroll={false}
      header={
        <View
          onLayout={({ nativeEvent }) => {
            headerHeightRef.current = nativeEvent.layout.height;
          }}
        >
          <Header title="Personal Account" onBack={() => navigation.goBack()} />
        </View>
      }
    >
      <ScrollView
        ref={scrollRef}
        style={st.content}
        contentContainerStyle={[
          st.contentContainer,
          { paddingBottom: 16 + (keyboardFrame?.inset ?? 0) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
          {/* Avatar */}
          <View style={st.avatarWrap}>
            <View style={st.avatarInner}>
              <LinearGradient
                colors={['#6A9BFA', '#2372F0'] as const}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={st.avatar}
              >
                <Text style={st.avatarLetter}>J</Text>
              </LinearGradient>
              <View style={st.camBadge}>
                <Icon name="camera" size={15} color={colors.textSecondary} />
              </View>
            </View>
          </View>

          {/* Nick name */}
          <View style={st.section}>
            <Eyebrow>Nick name</Eyebrow>
            <View style={[st.field, st.fieldActive]}>
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                maxLength={15}
                placeholder="Nick name"
                placeholderTextColor={colors.textTertiary}
                style={st.nicknameInput}
              />
              <Text style={st.counter}>{nickname.length}/15</Text>
            </View>
            <Text style={st.hint}>Nickname must be 1–15 characters long.</Text>
          </View>

          {/* Email */}
          <View style={st.section}>
            <Eyebrow>Email</Eyebrow>
            <Tap style={st.field}>
              <Text style={st.staticText}>Add backup email</Text>
            </Tap>
          </View>

          {/* WhatsApp */}
          <View
            style={st.section}
            onLayout={({ nativeEvent }) => {
              phoneBottomRef.current = nativeEvent.layout.y + nativeEvent.layout.height;
            }}
          >
            <Eyebrow>WhatsApp</Eyebrow>
            <Row style={{ gap: 10 }}>
              <Tap style={[st.field, st.countryField]}>
                <Text style={st.countryCode}>+81</Text>
                <Icon name="chevD" size={14} color={colors.textTertiary} sw={2.2} />
              </Tap>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                onFocus={() => {
                  phoneFocusedRef.current = true;
                  const keyboard = Keyboard.metrics();
                  if (keyboard) revealPhoneInput(keyboard.screenY);
                }}
                onBlur={() => { phoneFocusedRef.current = false; }}
                placeholder="Phone Number"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                style={[st.field, st.phoneInput]}
              />
            </Row>
          </View>

          {/* Save */}
          <View style={st.footer}>
            <PrimaryBtn label="Save" onPress={() => navigation.goBack()} style={st.saveBtn} />
          </View>
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  content: { flex: 1 },
  contentContainer: { flexGrow: 1, paddingBottom: 16 },
  avatarWrap: { alignItems: 'center', paddingTop: 14, paddingBottom: 6 },
  avatarInner: { position: 'relative' },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: 40, fontWeight: '700', color: '#fff' },
  camBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { paddingHorizontal: 22, paddingTop: 16 },
  field: {
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldActive: { borderColor: colors.brand },
  nicknameInput: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  counter: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  staticText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  hint: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 8, marginLeft: 4 },
  countryField: { width: 88, justifyContent: 'center', gap: 5, paddingHorizontal: 12 },
  countryCode: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 40,
  },
  saveBtn: { borderRadius: 99 },
});

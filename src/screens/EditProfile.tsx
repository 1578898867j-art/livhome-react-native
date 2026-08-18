import type { AppScreenProps } from '../navigation/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Keyboard, Modal, Platform, Pressable, ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, Header, Eyebrow, Row, Tap, PrimaryBtn } from '../components/kit';
import { getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';
import { Icon } from '../components/Icon';
import { colors, shadow } from '../theme';
import { INPUT_LIMITS } from '../features/app/inputLimits';

const PHONE_KEYBOARD_GAP = 10;

// 覆盖 App 已支持语言所对应的主要国家/地区，供 WhatsApp 手机号区号选择。
const PHONE_COUNTRIES = [
  { name: 'United States', code: '+1', maxDigits: 10, pattern: /^[2-9]\d{2}[2-9]\d{6}$/ },
  { name: 'China', code: '+86', maxDigits: 11, pattern: /^1[3-9]\d{9}$/ },
  { name: 'Saudi Arabia', code: '+966', maxDigits: 9, pattern: /^5\d{8}$/ },
  { name: 'Bulgaria', code: '+359', maxDigits: 9, pattern: /^8\d{8}$/ },
  { name: 'Czechia', code: '+420', maxDigits: 9, pattern: /^[2-9]\d{8}$/ },
  { name: 'Denmark', code: '+45', maxDigits: 8, pattern: /^\d{8}$/ },
  { name: 'Germany', code: '+49', maxDigits: 11, pattern: /^1\d{9,10}$/ },
  { name: 'Greece', code: '+30', maxDigits: 10, pattern: /^69\d{8}$/ },
  { name: 'Spain', code: '+34', maxDigits: 9, pattern: /^[67]\d{8}$/ },
  { name: 'Estonia', code: '+372', maxDigits: 8, pattern: /^5\d{6,7}$/ },
  { name: 'Finland', code: '+358', maxDigits: 10, pattern: /^4\d{8,9}$/ },
  { name: 'France', code: '+33', maxDigits: 9, pattern: /^[67]\d{8}$/ },
  { name: 'Israel', code: '+972', maxDigits: 9, pattern: /^5\d{8}$/ },
  { name: 'Croatia', code: '+385', maxDigits: 9, pattern: /^9\d{7,8}$/ },
  { name: 'Hungary', code: '+36', maxDigits: 9, pattern: /^(20|30|70)\d{7}$/ },
  { name: 'Iceland', code: '+354', maxDigits: 7, pattern: /^[6-8]\d{6}$/ },
  { name: 'Italy', code: '+39', maxDigits: 10, pattern: /^3\d{8,9}$/ },
  { name: 'Japan', code: '+81', maxDigits: 10, pattern: /^(70|80|90)\d{8}$/ },
  { name: 'South Korea', code: '+82', maxDigits: 11, pattern: /^10\d{8,9}$/ },
  { name: 'Lithuania', code: '+370', maxDigits: 8, pattern: /^6\d{7}$/ },
  { name: 'Latvia', code: '+371', maxDigits: 8, pattern: /^2\d{7}$/ },
  { name: 'Norway', code: '+47', maxDigits: 8, pattern: /^[49]\d{7}$/ },
  { name: 'Netherlands', code: '+31', maxDigits: 9, pattern: /^6\d{8}$/ },
  { name: 'Poland', code: '+48', maxDigits: 9, pattern: /^[4-8]\d{8}$/ },
  { name: 'Portugal', code: '+351', maxDigits: 9, pattern: /^9\d{8}$/ },
  { name: 'Romania', code: '+40', maxDigits: 9, pattern: /^7\d{8}$/ },
  { name: 'Russia', code: '+7', maxDigits: 10, pattern: /^9\d{9}$/ },
  { name: 'Slovakia', code: '+421', maxDigits: 9, pattern: /^9\d{8}$/ },
  { name: 'Slovenia', code: '+386', maxDigits: 8, pattern: /^4\d{7}$/ },
  { name: 'Sweden', code: '+46', maxDigits: 10, pattern: /^7\d{8,9}$/ },
  { name: 'Turkey', code: '+90', maxDigits: 10, pattern: /^5\d{9}$/ },
  { name: 'Ukraine', code: '+380', maxDigits: 9, pattern: /^(39|50|63|66|67|68|73|91|92|93|94|95|96|97|98|99)\d{7}$/ },
] as const;
type PhoneCountry = (typeof PHONE_COUNTRIES)[number];

export default function EditProfile({ navigation }: AppScreenProps) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [nickname, setNickname] = useState('Jon Alishon');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<PhoneCountry>(PHONE_COUNTRIES[0]);
  const [countryListOpen, setCountryListOpen] = useState(false);
  const [countryListTop, setCountryListTop] = useState(0);
  const [keyboardFrame, setKeyboardFrame] = useState<{ top: number; inset: number } | null>(null);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const phoneFocusedRef = useRef(false);
  const phoneRowRef = useRef<View>(null);
  const scrollOffsetRef = useRef(0);
  const countryFieldRef = useRef<View>(null);
  const countryListOpenRef = useRef(false);
  const normalizedPhone = phone.replace(/[^\d]/g, '');
  const phoneValid = country.pattern.test(normalizedPhone);
  const canSave = nickname.trim().length >= 1 && nickname.length <= 15 && phoneValid;

  const chooseAvatar = async (source: 'camera' | 'library') => {
    setAvatarPickerOpen(false);
    try {
      const permission = source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast(source === 'camera' ? 'Camera access is needed to take a profile photo.' : 'Photo library access is needed to choose a profile photo.', 'error');
        return;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], mediaTypes: ['images'], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], mediaTypes: ['images'], quality: 0.8 });
      const asset = result.canceled ? null : result.assets[0];
      if (!asset) return;
      setAvatarUri(asset.uri);
      showToast('Profile photo updated', 'success');
    } catch {
      showToast('Unable to update profile photo. Please try again.', 'error');
    }
  };

  const closeCountryList = () => {
    countryListOpenRef.current = false;
    setCountryListOpen(false);
  };

  const toggleCountryList = () => {
    if (countryListOpenRef.current) {
      closeCountryList();
      return;
    }
    countryListOpenRef.current = true;
    Keyboard.dismiss();
    phoneFocusedRef.current = false;
    requestAnimationFrame(() => {
      const field = countryFieldRef.current;
      if (!field) {
        countryListOpenRef.current = false;
        return;
      }
      field.measureInWindow((_x, y, _width, height) => {
        if (!countryListOpenRef.current) return;
        // measureInWindow 的 y 是窗口全局坐标，已包含状态栏和页面导航栏的高度；
        // Modal 同样以窗口原点定位，因此两者可直接对齐。
        const minContentTop = insets.top + 8;
        setCountryListTop(Math.max(minContentTop, y + height + 8));
        setCountryListOpen(true);
      });
    });
  };

  const revealPhoneInput = useCallback((keyboardTop: number) => {
    requestAnimationFrame(() => {
      phoneRowRef.current?.measureInWindow((_x, y, _width, height) => {
        const coveredByKeyboard = y + height - (keyboardTop - PHONE_KEYBOARD_GAP);
        if (coveredByKeyboard <= 0) return;
        scrollRef.current?.scrollTo({
          y: scrollOffsetRef.current + coveredByKeyboard,
          animated: true,
        });
      });
    });
  }, []);

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
    <>
    <Screen
      scroll={false}
      header={
        <Header title="Personal Account" onBack={() => navigation.goBack()} />
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
        onScroll={({ nativeEvent }) => { scrollOffsetRef.current = nativeEvent.contentOffset.y; }}
        scrollEventThrottle={16}
      >
          {/* Avatar */}
          <View style={st.avatarWrap}>
            <Tap
              style={st.avatarTap}
              onPress={() => setAvatarPickerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
              accessibilityHint="Opens options to take a photo or choose one from the photo library"
            >
              <View style={st.avatarInner}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={st.avatar} />
                ) : (
                  <LinearGradient
                    colors={['#6A9BFA', '#2372F0'] as const}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={st.avatar}
                  >
                    <Text style={st.avatarLetter}>J</Text>
                  </LinearGradient>
                )}
                <View style={st.camBadge} pointerEvents="none">
                  <Icon name="camera" size={15} color={colors.textSecondary} />
                </View>
              </View>
            </Tap>
          </View>

          {/* Nick name */}
          <View style={st.section}>
            <Eyebrow>Nick name</Eyebrow>
            <View style={[st.field, st.fieldActive]}>
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                maxLength={INPUT_LIMITS.nickname}
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
          <View style={st.section}>
            <Eyebrow>WhatsApp</Eyebrow>
            <View ref={phoneRowRef} collapsable={false}>
              <Row style={{ gap: 10 }}>
                <View ref={countryFieldRef} collapsable={false}>
                <Tap
                  style={[st.field, st.countryField, countryListOpen && st.fieldActive]}
                  onPress={toggleCountryList}
                  accessibilityRole="button"
                  accessibilityLabel={`Select country or region, currently ${country.name} ${country.code}`}
                  accessibilityState={{ expanded: countryListOpen }}
                >
                  <Text style={st.countryCode}>{country.code}</Text>
                  <Icon name={countryListOpen ? 'chevU' : 'chevD'} size={14} color={colors.textTertiary} sw={2.2} />
                </Tap>
                </View>
                <TextInput
                value={phone}
                onChangeText={(value) => setPhone(value.replace(/[^\d]/g, '').slice(0, country.maxDigits))}
                onFocus={() => {
                  phoneFocusedRef.current = true;
                  const keyboard = Keyboard.metrics();
                  if (keyboard) revealPhoneInput(keyboard.screenY);
                }}
                onBlur={() => { phoneFocusedRef.current = false; }}
                placeholder="Phone Number"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
                maxLength={country.maxDigits}
                autoComplete="tel"
                textContentType="telephoneNumber"
                style={[st.field, st.phoneInput, phone.length > 0 && !phoneValid && st.fieldInvalid]}
                />
              </Row>
            </View>
            {phone.length > 0 && !phoneValid && (
              <Text style={st.phoneError}>Enter a valid {country.name} mobile number for {country.code}.</Text>
            )}
          </View>

          {/* Save */}
          <View style={st.footer}>
            <PrimaryBtn
              label="Save"
              onPress={() => {
                // 资料保存失败演示:提示错误,保留已填内容
                if (getDemoFlags().failOps) {
                  showToast('Failed to save. Please try again.', 'error');
                  return;
                }
                navigation.goBack();
              }}
              disabled={!canSave}
              style={st.saveBtn}
            />
          </View>
      </ScrollView>
    </Screen>
    <Modal transparent visible={avatarPickerOpen} animationType="fade" onRequestClose={() => setAvatarPickerOpen(false)}>
      <View style={st.avatarActionSheetRoot} accessibilityViewIsModal>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setAvatarPickerOpen(false)} />
        <View style={st.avatarActionSheet}>
          <View style={st.avatarActionGroup}>
            <Tap style={st.avatarActionItem} onPress={() => void chooseAvatar('camera')} accessibilityRole="button">
              <Text style={st.avatarActionText}>Take a photo</Text>
            </Tap>
            <Tap style={[st.avatarActionItem, st.avatarActionItemLast]} onPress={() => void chooseAvatar('library')} accessibilityRole="button">
              <Text style={st.avatarActionText}>Select from the album</Text>
            </Tap>
          </View>
          <Tap style={st.avatarActionCancel} onPress={() => setAvatarPickerOpen(false)} accessibilityRole="button">
            <Text style={st.avatarActionCancelText}>Cancel</Text>
          </Tap>
        </View>
      </View>
    </Modal>
    <Modal transparent visible={countryListOpen} animationType="none" onRequestClose={closeCountryList}>
      <View style={st.countryModalRoot} accessibilityViewIsModal>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeCountryList} />
        <View style={[st.countryList, { top: countryListTop }]}>
          <Text style={st.countryListTitle}>Country or region</Text>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {PHONE_COUNTRIES.map((option, index) => {
              const selected = option.code === country.code;
              return (
                <Tap
                  key={option.name}
                  style={[st.countryOption, selected && st.countryOptionSelected]}
                  onPress={() => {
                    setCountry(option);
                    setPhone((current) => current.slice(0, option.maxDigits));
                    closeCountryList();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${option.name}, ${option.code}`}
                  accessibilityState={{ selected }}
                >
                  <Text style={[st.countryName, selected && st.countryTextSelected]}>{option.name}</Text>
                  <Row style={{ gap: 8 }}>
                    <Text style={[st.countryDialCode, selected && st.countryTextSelected]}>{option.code}</Text>
                    {selected && <Icon name="check" size={16} color={colors.brand} sw={2.5} />}
                  </Row>
                  {index < PHONE_COUNTRIES.length - 1 && <View style={st.countryDivider} />}
                </Tap>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
    </>
  );
}

const st = StyleSheet.create({
  content: { flex: 1 },
  contentContainer: { flexGrow: 1, paddingBottom: 16 },
  avatarWrap: { alignItems: 'center', paddingTop: 14, paddingBottom: 6 },
  avatarTap: { padding: 6 },
  avatarInner: { position: 'relative' },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  fieldInvalid: { borderColor: colors.critical },
  nicknameInput: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  counter: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  staticText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  hint: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 8, marginLeft: 4 },
  countryField: { width: 88, justifyContent: 'center', gap: 5, paddingHorizontal: 12 },
  countryCode: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  countryList: {
    position: 'absolute',
    left: 22,
    right: 22,
    maxHeight: 300,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    ...shadow.md,
  },
  countryModalRoot: { flex: 1 },
  avatarActionSheetRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.42)' },
  avatarActionSheet: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
  avatarActionGroup: { overflow: 'hidden', borderRadius: 14, backgroundColor: '#F8F9FC' },
  avatarActionItem: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D9DCE2',
  },
  avatarActionItemLast: { borderBottomWidth: 0 },
  avatarActionText: { fontSize: 17, fontWeight: '500', color: colors.brand },
  avatarActionCancel: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#F8F9FC' },
  avatarActionCancelText: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  countryListTitle: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  countryOption: { minHeight: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  countryOptionSelected: { backgroundColor: colors.brandSoft },
  countryName: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  countryDialCode: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  countryTextSelected: { color: colors.brand },
  countryDivider: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
  phoneError: { marginTop: 8, marginLeft: 4, fontSize: 12, fontWeight: '500', color: colors.critical },
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

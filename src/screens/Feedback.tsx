import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { Screen, Tap, Row, Card, NavBar } from '../components/kit';
import { getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';
import { Icon } from '../components/Icon';
import { colors } from '../theme';
import { INPUT_LIMITS } from '../features/app/inputLimits';

const FB_TYPES = ['App Issue', 'AI Assistant Issue', 'Device Issue', 'Other Issue'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORT_EMAIL = 'LivhomeTeam@explorex-ai.com';

type Overlay = null | 'type' | 'contact' | 'photo';

export default function Feedback({ navigation }: AppScreenProps) {
  const [fbType, setFbType] = useState<string | null>(null);
  const [fbText, setFbText] = useState('');
  const [fbEmail, setFbEmail] = useState('');
  const [fbImg, setFbImg] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [emailDraft, setEmailDraft] = useState('');

  const ready = !!fbType && !!fbEmail.trim();
  const len = fbText.length;
  const draftValid = EMAIL_RE.test(emailDraft.trim());

  const close = () => setOverlay(null);
  const openContact = () => {
    setEmailDraft(fbEmail);
    setOverlay('contact');
  };
  const confirmContact = () => {
    if (!draftValid) return;
    setFbEmail(emailDraft.trim());
    close();
  };
  const copySupportEmail = async () => {
    try {
      await Clipboard.setStringAsync(SUPPORT_EMAIL);
      showToast('Email copied', 'success');
    } catch {
      showToast('Unable to copy email. Please try again.', 'error');
    }
  };

  return (
    <Screen
      header={<NavBar title="My Feedback" onBack={() => navigation.goBack()} />}
    >
      <View style={st.container}>
        <View style={st.body}>
          <Text style={st.h1}>Report an Issue</Text>

          {/* Select Issue Type */}
          <Tap onPress={() => setOverlay('type')} style={st.selectRow}>
            <Text style={st.rowTitle}>
              Select Issue Type <Text style={{ color: colors.critical }}>*</Text>
            </Text>
            {fbType ? (
              <Text style={st.reqFilled}>{fbType}</Text>
            ) : (
              <Text style={st.reqEmpty}>Required</Text>
            )}
            <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
          </Tap>

          {/* Description + screenshot upload */}
          <Card style={st.descCard}>
            <TextInput
              value={fbText}
              onChangeText={setFbText}
              maxLength={INPUT_LIMITS.feedbackDescription}
              multiline
              placeholder="Please describe your issue in detail and provide necessary information such as the device name."
              placeholderTextColor={colors.textTertiary}
              style={st.textarea}
            />
            <View style={st.uploadArea}>
              <Row style={st.uploadRow}>
                {fbImg ? (
                  <Tap onPress={() => setFbImg(false)} style={st.thumb}>
                    <LinearGradient
                      colors={['#2A2E39', '#0E1116'] as const}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={st.thumbBg}
                    />
                    <Icon name="camera" size={22} color="#9BB4E8" />
                    <View style={st.thumbBadge}>
                      <Icon name="x" size={11} color="#fff" sw={2.8} />
                    </View>
                  </Tap>
                ) : (
                  <Tap onPress={() => setOverlay('photo')} style={st.addRow}>
                    <View style={st.addTile}>
                      <Icon name="plus" size={22} color={colors.textTertiary} sw={2} />
                    </View>
                    <View>
                      <Text style={st.addTitle}>Add Images or Videos</Text>
                      <Text style={st.addSub}>videos should be no longer than 1 minute</Text>
                    </View>
                  </Tap>
                )}
              </Row>
              <Text style={st.counter}>{len}/2000</Text>
            </View>
          </Card>

          {/* Contact Information */}
          <Tap onPress={openContact} style={st.contactRow}>
            <Text style={st.contactTitle}>
              Contact Information <Text style={{ color: colors.critical }}>*</Text>
            </Text>
            {fbEmail ? (
              <Text style={st.contactValue} numberOfLines={1} ellipsizeMode="tail">
                {fbEmail}
              </Text>
            ) : (
              <Text style={st.contactEmpty}>Required</Text>
            )}
            <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
          </Tap>

          {/* Contact Support */}
          <Card style={st.supportCard}>
            <Text style={st.supportTitle}>Contact Support</Text>
            <Text style={[st.supportSub, st.supportDivider]}>Questions? Contact us below:</Text>
            <Tap
              style={[st.supportLink, st.supportDivider]}
              onPress={() => { void copySupportEmail(); }}
              accessibilityRole="button"
              accessibilityLabel={`Copy support email, ${SUPPORT_EMAIL}`}
              accessibilityHint="Copies the support email address to the clipboard"
            >
              <Text style={st.supportLinkTxt}>{SUPPORT_EMAIL}</Text>
            </Tap>
            <Tap style={st.supportLink}>
              <Text style={st.supportLinkTxt}>WhatsApp Live Chat</Text>
            </Tap>
          </Card>
        </View>

        {/* Submit */}
        <View style={st.submitWrap}>
          <Tap
            onPress={() => {
              if (!ready) return;
              // 提交失败演示:提示错误,保留已填内容
              if (getDemoFlags().failOps) {
                showToast('Failed to submit. Please try again.', 'error');
                return;
              }
              showToast('Feedback submitted', 'success');
              navigation.goBack();
            }}
            style={[
              st.submitBtn,
              { backgroundColor: ready ? colors.brand : colors.bgSecondary },
            ]}
          >
            <Text
              style={[
                st.submitTxt,
                { color: ready ? '#fff' : colors.textTertiary },
              ]}
            >
              Submit
            </Text>
          </Tap>
        </View>
      </View>

      {/* Issue type bottom sheet */}
      <Modal transparent visible={overlay === 'type'} animationType="fade" onRequestClose={close}>
        <Pressable style={st.sheetOvl} onPress={close}>
          <Pressable style={st.sheetWrap} onPress={() => {}}>
            <View style={[st.sheetCard, { marginBottom: 8 }]}>
              <Text style={st.sheetTitle}>Issue Type</Text>
              <View style={st.sheetLine} />
              {FB_TYPES.map((t, i) => {
                const on = fbType === t;
                return (
                  <React.Fragment key={t}>
                    {i > 0 && <View style={st.sheetLine} />}
                    <Tap
                      style={st.typeRow}
                      onPress={() => {
                        setFbType(t);
                        close();
                      }}
                    >
                      <Text style={[st.typeRowText, on && st.typeRowTextOn]}>{t}</Text>
                    </Tap>
                  </React.Fragment>
                );
              })}
            </View>
            <View style={st.sheetCard}>
              <Tap style={st.cancelRow} onPress={close}>
                <Text style={st.cancelText}>Cancel</Text>
              </Tap>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Add photo action sheet (Take a photo / Select from the album / Cancel) */}
      <Modal transparent visible={overlay === 'photo'} animationType="fade" onRequestClose={close}>
        <Pressable style={st.sheetOvl} onPress={close}>
          <Pressable style={st.sheetWrap} onPress={() => {}}>
            <View style={[st.sheetCard, { marginBottom: 8 }]}>
              <Tap
                style={st.typeRow}
                onPress={() => {
                  setFbImg(true);
                  close();
                }}
              >
                <Text style={st.photoRowText}>Take a photo</Text>
              </Tap>
              <View style={st.sheetLine} />
              <Tap
                style={st.typeRow}
                onPress={() => {
                  setFbImg(true);
                  close();
                }}
              >
                <Text style={st.photoRowText}>Select from the album</Text>
              </Tap>
            </View>
            <View style={st.sheetCard}>
              <Tap style={st.cancelRow} onPress={close}>
                <Text style={st.photoRowText}>Cancel</Text>
              </Tap>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Contact information bottom sheet */}
      <Modal transparent visible={overlay === 'contact'} animationType="fade" onRequestClose={close}>
        <Pressable style={st.sheetOvl} onPress={close}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%' }}
          >
            <Pressable style={st.contactSheet} onPress={() => {}}>
              <Text style={st.contactSheetTitle}>Contact Information</Text>
              <View style={st.contactBody}>
                <View style={st.emailField}>
                  <TextInput
                    value={emailDraft}
                    onChangeText={setEmailDraft}
                    maxLength={INPUT_LIMITS.emailAddress}
                    placeholder="Please enter your email address"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={st.emailInput}
                  />
                </View>
                <Text style={st.noteText}>
                  Note:{'\n'}
                  1. Our engineers may contact you by email if necessary. Please make sure your
                  information is correct.{'\n'}
                  2. Customer support will keep you updated on the progress via email.
                </Text>
              </View>
              <Row style={st.contactBtns}>
                <Tap style={[st.contactBtn, st.contactBtnDivider]} onPress={close}>
                  <Text style={st.contactCancel}>Cancel</Text>
                </Tap>
                <Tap style={st.contactBtn} onPress={confirmContact}>
                  <Text
                    style={[
                      st.contactConfirm,
                      { color: draftValid ? colors.brand : colors.textTertiary },
                    ]}
                  >
                    Confirm
                  </Text>
                </Tap>
              </Row>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  container: { paddingBottom: 40 },
  body: { paddingHorizontal: 18, paddingTop: 4 },
  h1: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: colors.textPrimary,
    marginTop: 6,
    marginBottom: 20,
    marginHorizontal: 2,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    minHeight: 56,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  rowTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  reqFilled: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  reqEmpty: { fontSize: 16, fontWeight: '500', color: colors.textTertiary },
  descCard: { minHeight: 276, marginTop: 20, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  textarea: {
    flex: 1,
    minHeight: 72,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 22,
    textAlignVertical: 'top',
    padding: 0,
  },
  uploadArea: { position: 'relative', paddingTop: 12, paddingBottom: 6 },
  uploadRow: { alignItems: 'center' },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  thumbBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addTile: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  addSub: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 3 },
  counter: { position: 'absolute', top: -22, right: 0, fontSize: 12, fontWeight: '500', color: colors.textTertiary },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 16,
    minHeight: 56,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  contactValue: {
    maxWidth: 120,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  contactTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  contactEmpty: { fontSize: 16, fontWeight: '500', color: colors.textTertiary },
  supportCard: { minHeight: 216, marginTop: 20, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 2 },
  supportTitle: { textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  supportSub: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 12,
    paddingBottom: 18,
  },
  supportLink: { paddingVertical: 16 },
  supportDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  supportLinkTxt: { textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.brand },
  submitWrap: { marginTop: 24, paddingHorizontal: 18 },
  submitBtn: {
    width: '100%',
    height: 54,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitTxt: { fontSize: 16, fontWeight: '700' },

  /* ---- issue type bottom sheet ---- */
  sheetOvl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetWrap: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  sheetCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sheetTitle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  sheetLine: { height: 1, backgroundColor: colors.border },
  typeRow: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  typeRowText: { fontSize: 16, fontWeight: '400', color: colors.textPrimary },
  photoRowText: { fontSize: 16, fontWeight: '500', color: colors.brand },
  typeRowTextOn: { fontWeight: '600', color: colors.brand },
  cancelRow: { height: 56, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },

  /* ---- contact information bottom sheet ---- */
  contactSheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contactSheetTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactBody: { paddingTop: 16, paddingHorizontal: 20 },
  emailField: {
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    justifyContent: 'center',
  },
  emailInput: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    padding: 0,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: 14,
    lineHeight: 20,
  },
  contactBtns: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 16 },
  contactBtn: { flex: 1, height: 61, paddingBottom: 9, alignItems: 'center', justifyContent: 'center' },
  contactBtnDivider: { borderRightWidth: 1, borderRightColor: colors.border },
  contactCancel: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  contactConfirm: { fontSize: 16, fontWeight: '700' },
});

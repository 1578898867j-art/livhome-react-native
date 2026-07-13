import { navigateTo } from '../navigation/types';
import type { AppScreenProps, StackRouteName } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors, shadow } from '../theme';
import { ME_NOTIF, ME_ALBUM, ME_FEEDBACK, ME_HELP } from '../icons/meIcons';

type MeMenuRow = {
  svg: string;
  name: string;
  target: StackRouteName | null;
};

// Icons are the prototype's own SVGs, rendered at 18px in text-secondary.
const MENU: MeMenuRow[] = [
  { svg: ME_NOTIF, name: 'Notifications', target: 'notif-settings' },
  { svg: ME_ALBUM, name: 'Album', target: 'album' },
  { svg: ME_FEEDBACK, name: 'Feedback Center', target: 'feedback' },
  { svg: ME_HELP, name: 'Help Center', target: 'help-center' },
];

type Overlay = null | 'avatar-sheet' | 'uploading' | 'upgrade';

export default function MeHome({ navigation }: AppScreenProps) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const uploadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (uploadTimer.current) clearTimeout(uploadTimer.current);
    },
    [],
  );

  const close = () => setOverlay(null);

  // Prototype: picking either sheet option shows a brief uploading state, then closes.
  const pickPhoto = () => {
    setOverlay('uploading');
    if (uploadTimer.current) clearTimeout(uploadTimer.current);
    uploadTimer.current = setTimeout(() => setOverlay(null), 900);
  };

  return (
    <Screen contentStyle={{ paddingTop: 8, paddingBottom: 120 }}>
      {/* header */}
      <Row style={st.topRow}>
        <Text style={st.title}>Me</Text>
        <View style={{ flex: 1 }} />
        <Tap
          style={st.gearBtn}
          onPress={() => navigation.navigate('settings')}
          hitSlop={8}
        >
          <Icon name="gear" size={19} color={colors.textPrimary} />
        </Tap>
      </Row>

      {/* user card */}
      <Tap style={st.userCard} onPress={() => navigation.navigate('edit-profile')}>
        <Row style={{ gap: 12, minHeight: 60 }}>
          <Tap style={st.avatarShadow} onPress={() => setOverlay('avatar-sheet')}>
            <LinearGradient
              colors={['#6A9BFA', '#2372F0'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={st.avatar}
            >
              <Text style={st.avatarText}>J</Text>
            </LinearGradient>
          </Tap>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={st.name}>Jon Alishon</Text>
            <Text style={st.email}>jon.a@livhome.app</Text>
            <View style={st.badge}>
              <Text style={st.badgeText}>STANDARD</Text>
            </View>
          </View>
          <Tap style={st.upgradeBtn} onPress={() => setOverlay('upgrade')}>
            <Icon name="spark" size={12} color="#fff" />
            <Text style={st.upgradeText}>Upgrade</Text>
          </Tap>
        </Row>
      </Tap>

      {/* settings list */}
      <View style={st.listCard}>
        {MENU.map((r, i) => {
          const last = i === MENU.length - 1;
          return (
            <Tap
              key={r.name}
              style={st.menuRow}
              onPress={() => r.target && navigateTo(navigation, r.target)}
            >
              <View style={st.menuIcon}>
                <SvgXml xml={r.svg} width={18} height={18} color={colors.textSecondary} />
              </View>
              <Text style={st.menuName}>{r.name}</Text>
              <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
              {!last && <View style={st.rowLine} />}
            </Tap>
          );
        })}
      </View>

      {/* footer */}
      <Text style={st.footer}>
        LIVHOME has learned 32 behavior patterns in this home.{'\n'}
        Your 50 feedbacks raised triage accuracy by{' '}
        <Text style={st.footerHighlight}>+12%</Text>。
      </Text>
      <Tap style={st.manageBtn}>
        <Text style={st.manageText}>Manage or cancel subscription</Text>
      </Tap>

      {/* overlays */}
      <Modal
        transparent
        visible={overlay !== null}
        animationType="fade"
        onRequestClose={() => {
          if (overlay !== 'uploading') close();
        }}
      >
        {overlay === 'avatar-sheet' && (
          <Pressable style={st.sheetOvl} onPress={close}>
            <Pressable style={st.sheetWrap} onPress={() => {}}>
              <View style={[st.sheetCard, { marginBottom: 8 }]}>
                <Tap style={st.sheetRow} onPress={pickPhoto}>
                  <Text style={st.sheetRowText}>Take a photo</Text>
                </Tap>
                <View style={st.sheetLine} />
                <Tap style={st.sheetRow} onPress={pickPhoto}>
                  <Text style={st.sheetRowText}>Select from the album</Text>
                </Tap>
              </View>
              <View style={st.sheetCard}>
                <Tap style={st.sheetRow} onPress={close}>
                  <Text style={st.sheetCancelText}>Cancel</Text>
                </Tap>
              </View>
            </Pressable>
          </Pressable>
        )}

        {overlay === 'uploading' && (
          <View style={st.centerOvl}>
            <View style={st.uploadCard}>
              <ActivityIndicator size="small" color={colors.brand} />
              <Text style={st.uploadText}>Uploading photo…</Text>
            </View>
          </View>
        )}

        {overlay === 'upgrade' && (
          <Pressable style={st.centerOvl} onPress={close}>
            <Pressable style={st.csCard} onPress={() => {}}>
              <View style={st.csIcon}>
                <Icon name="sparkles" size={28} color="#fff" />
              </View>
              <Text style={st.csTitle}>Coming soon</Text>
              <Text style={st.csDesc}>
                LIVHOME Premium is on the way — richer AI insights, longer cloud storage and
                more. Stay tuned!
              </Text>
              <Tap style={st.csBtn} onPress={close}>
                <Text style={st.csBtnText}>Got it</Text>
              </Tap>
            </Pressable>
          </Pressable>
        )}
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  topRow: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  gearBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 24,
    padding: 14,
    backgroundColor: colors.surface,
    ...shadow.md,
  },
  avatarShadow: {
    borderRadius: 26,
    shadowColor: '#2382FF',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 7,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.brandSoft,
  },
  badgeText: {
    color: colors.brand,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.textPrimary,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  upgradeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  listCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  menuRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  rowLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 22,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    lineHeight: 19,
  },
  footerHighlight: {
    color: colors.success,
    fontWeight: '700',
  },
  manageBtn: {
    alignSelf: 'center',
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  manageText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },

  /* ---- avatar action sheet ---- */
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
  sheetRow: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetRowText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.brand,
  },
  sheetCancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sheetLine: {
    height: 1,
    backgroundColor: colors.border,
  },

  /* ---- centered overlays ---- */
  centerOvl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  uploadCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 26,
    paddingHorizontal: 30,
    alignItems: 'center',
    gap: 14,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  /* ---- Upgrade "Coming soon" dialog ---- */
  csCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 22,
    alignItems: 'center',
  },
  csIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  csTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  csDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 21,
    textAlign: 'center',
  },
  csBtn: {
    width: '100%',
    height: 48,
    marginTop: 20,
    borderRadius: 99,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  csBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

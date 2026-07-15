import { navigateTo } from '../navigation/types';
import type { AppScreenProps, StackRouteName } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { SvgXml } from 'react-native-svg';

// Huge-icon/interface/outline/mic(用户素材,描边改 currentColor 便于着色)
const MIC_ICON =
  '<svg viewBox="0 0 26 26" fill="none"><path d="M21.6667 13V15.1666C21.6667 19.9531 17.7865 23.8333 13 23.8333C8.21354 23.8333 4.33334 19.9531 4.33334 15.1666V13M18.4167 8.66663V7.58329C18.4167 4.59175 15.9916 2.16663 13 2.16663C10.0085 2.16663 7.58334 4.59175 7.58334 7.58329V15.1666C7.58334 18.1582 10.0085 20.5833 13 20.5833C15.9916 20.5833 18.4167 18.1582 18.4167 15.1666V14.0833V8.66663Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
import { colors } from '../theme';
import { CAMAVATAR } from '../assets/images';

type Prev = { tag: string; label: string };

export default function DevHome({ navigation }: AppScreenProps) {
  const go = (id: StackRouteName) => () => navigateTo(navigation, id);

  /* ---- camPreview({play:true, tag, label}) ---- */
  const CamPreview = ({ tag, label }: Prev) => (
    <View style={st.preview}>
      {/* motion box */}
      <View style={st.box}>
        <View style={st.boxTag}>
          <Text style={st.boxTagText}>{tag}</Text>
        </View>
      </View>
      {/* bottom timestamp label */}
      <Text style={st.previewLabel}>{label}</Text>
      {/* play button */}
      <View style={st.playWrap}>
        <View style={st.playBtn}>
          <Icon name="play" size={24} color="#fff" sw={1.6} />
        </View>
      </View>
    </View>
  );

  /* ---- devCard(name, status, online:true, prev) ---- */
  const DevCard = ({ name, status, prev }: { name: string; status: string; prev: Prev }) => (
    <View style={st.card}>
      <Tap style={st.cardHead} onPress={go('dev-detail')}>
        <View style={st.avatar}>
          <Image source={{ uri: CAMAVATAR }} resizeMode="contain" style={st.avatarImg} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={st.cardName}>{name}</Text>
          <Row style={{ gap: 6, marginTop: 2 }}>
            <View style={[st.dot, { backgroundColor: colors.success }]} />
            <Text style={st.statusOnline}>{status}</Text>
          </Row>
        </View>
        <Icon name="chevR" size={16} color={colors.textTertiary} sw={2.2} />
      </Tap>
      <CamPreview tag={prev.tag} label={prev.label} />
      <Row style={{ padding: 12, paddingHorizontal: 14, gap: 8 }}>
        <Pressable
          onPress={go('dev-detail')}
          style={({ pressed }) => [st.actBtn, st.actBtnDark, pressed && { opacity: 0.85 }]}
        >
          <Icon name="play" size={19} color="#fff" sw={1.6} />
          <Text style={[st.actText, { color: colors.textInverse }]}>Live view</Text>
        </Pressable>
        <View style={[st.actBtn, st.actBtnOutline]}>
          <SvgXml xml={MIC_ICON} width={18} height={18} color={colors.textPrimary} />
          <Text style={[st.actText, { color: colors.textPrimary }]}>Talk</Text>
        </View>
        <Pressable
          onPress={go('dev-messages')}
          style={({ pressed }) => [st.actBtn, st.actBtnOutline, pressed && { opacity: 0.85 }]}
        >
          <Icon name="bell" size={16} color={colors.textPrimary} />
          <Text style={[st.actText, { color: colors.textPrimary }]}>Alerts</Text>
        </Pressable>
      </Row>
    </View>
  );

  /* ---- devCardOffline(name) ---- */
  const DevCardOffline = ({ name }: { name: string }) => (
    <View style={st.card}>
      <Row style={st.cardHeadRow}>
        <View style={st.avatar}>
          <Image source={{ uri: CAMAVATAR }} resizeMode="contain" style={[st.avatarImg, { opacity: 0.55 }]} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={st.cardName}>{name}</Text>
          <Row style={{ gap: 6, marginTop: 2 }}>
            <View style={[st.dot, { backgroundColor: colors.textTertiary }]} />
            <Text style={st.statusOffline}>Offline</Text>
          </Row>
        </View>
        <Tap style={st.gearBtn} onPress={go('dev-settings')} hitSlop={8}>
          <Icon name="gear" size={16} color={colors.textTertiary} />
        </Tap>
      </Row>
      <View style={st.offlinePlaceholder}>
        <Icon name="cloudOff" size={34} color={colors.textTertiary} sw={1.6} />
        <Text style={st.offlineText}>The device is offline</Text>
      </View>
      <View style={{ padding: 12, paddingHorizontal: 14 }}>
        <View style={st.troubleBtn}>
          <Text style={st.troubleText}>Troubleshoot connection</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Screen
      header={
        <Row style={st.header}>
          <Text style={st.title}>Devices</Text>
          <View style={{ flex: 1 }} />
          <Tap style={st.iconbtn} onPress={go('notif-center')}>
            <Icon name="bell" size={18} color={colors.textPrimary} />
            <View style={st.badge} />
          </Tap>
          <Tap style={st.iconbtn} onPress={go('bind-find')}>
            <Icon name="plus" size={18} color={colors.textPrimary} sw={2} />
          </Tap>
        </Row>
      }
      contentStyle={{ paddingBottom: 108 }}
    >
      <View style={{ paddingHorizontal: 18, gap: 16 }}>
        <DevCard name="Living Room" status="Online" prev={{ tag: 'Person · sofa', label: '14:22' }} />
        <DevCard name="Backyard" status="Online" prev={{ tag: 'No motion', label: '14:20' }} />
        <DevCardOffline name="Bedroom Cam" />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14, gap: 10 },
  title: { fontSize: 24, fontWeight: '600', letterSpacing: -0.5, color: colors.textPrimary },
  iconbtn: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.critical,
  },

  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, paddingTop: 14, paddingBottom: 12 },
  cardHeadRow: { gap: 10, padding: 16, paddingTop: 14, paddingBottom: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 9,
  },
  avatarImg: { width: '100%', height: '100%' },
  cardName: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2, color: colors.textPrimary },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusOnline: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  statusOffline: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },

  preview: { position: 'relative', width: '100%', aspectRatio: 16 / 9, backgroundColor: '#1E1A16', overflow: 'hidden' },
  box: {
    position: 'absolute',
    left: '28%',
    top: '36%',
    width: '34%',
    height: '46%',
    borderWidth: 1.5,
    borderColor: 'rgba(74,222,128,.9)',
    borderRadius: 6,
  },
  boxTag: {
    position: 'absolute',
    top: -19,
    left: -1,
    backgroundColor: 'rgba(74,222,128,.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  boxTagText: { color: '#062018', fontSize: 10, fontWeight: '700' },
  previewLabel: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    color: 'rgba(255,255,255,.85)',
    fontSize: 10,
    fontWeight: '700',
  },
  playWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  playBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.35)',
  },

  actBtn: { flex: 1, height: 40, borderRadius: 99, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actBtnDark: { backgroundColor: colors.textPrimary },
  actBtnOutline: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong },
  actText: { fontSize: 12, fontWeight: '600' },

  gearBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  offlinePlaceholder: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  offlineText: { fontSize: 12, fontWeight: '700', color: colors.textTertiary },
  troubleBtn: {
    width: '100%',
    height: 40,
    borderRadius: 99,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  troubleText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
});

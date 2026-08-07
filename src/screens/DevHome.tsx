import { navigateTo } from '../navigation/types';
import type { AppScreenProps, StackRouteName } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { StateView, Spinner } from '../components/states';
import { DeviceOfflineDialog } from '../components/DeviceOfflineDialog';
import { useDemoFlags } from '../features/app/demoStore';
import { selectDevice, useDeviceList } from '../features/devices/deviceListStore';
import { requestTalk } from '../features/devices/talkIntent';
import { colors } from '../theme';
import { CAMAVATAR } from '../assets/images';

type Prev = { tag: string; label: string };

const DEVICE_PREVIEWS: Record<string, Prev> = {
  'living-room': { tag: 'Person · sofa', label: '14:22' },
  backyard: { tag: 'No motion', label: '14:20' },
};

const NEW_DEVICE_PREVIEW: Prev = { tag: 'No motion', label: 'Just now' };

export default function DevHome({ navigation }: AppScreenProps) {
  const go = (id: StackRouteName) => () => navigateTo(navigation, id);
  const openDevice = (deviceId: string, route: StackRouteName, beforeNavigate?: () => void) => () => {
    selectDevice(deviceId);
    beforeNavigate?.();
    navigateTo(navigation, route);
  };

  // 概率性状态:设备列表加载失败 / 无设备空态
  const { failLoad, noDevices } = useDemoFlags();
  const devices = useDeviceList();
  const [retrying, setRetrying] = useState(false);
  const [offlineDialogOpen, setOfflineDialogOpen] = useState(false);
  const showOfflineDialog = (deviceId: string) => {
    selectDevice(deviceId);
    setOfflineDialogOpen(true);
  };
  const retryLoad = () => {
    setRetrying(true);
    setTimeout(() => setRetrying(false), 800);
  };

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
  const DevCard = ({
    id,
    name,
    status,
    prev,
  }: {
    id: string;
    name: string;
    status: string;
    prev: Prev;
  }) => (
    <View style={st.card}>
      <Tap style={st.cardHead} onPress={openDevice(id, 'dev-detail')}>
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
          onPress={openDevice(id, 'dev-detail')}
          style={({ pressed }) => [st.actBtn, st.actBtnDark, pressed && { opacity: 0.85 }]}
        >
          <Icon name="play" size={19} color="#fff" sw={1.6} />
          <Text style={[st.actText, { color: colors.textInverse }]}>Live view</Text>
        </Pressable>
        <Pressable
          onPress={openDevice(id, 'dev-detail', requestTalk)}
          style={({ pressed }) => [st.actBtn, st.actBtnOutline, pressed && { opacity: 0.85 }]}
        >
          <Icon name="mic" size={18} color={colors.textPrimary} />
          <Text style={[st.actText, { color: colors.textPrimary }]}>Talk</Text>
        </Pressable>
        <Pressable
          onPress={openDevice(id, 'dev-messages')}
          style={({ pressed }) => [st.actBtn, st.actBtnOutline, pressed && { opacity: 0.85 }]}
        >
          <Icon name="bell" size={16} color={colors.textPrimary} />
          <Text style={[st.actText, { color: colors.textPrimary }]}>Alerts</Text>
        </Pressable>
      </Row>
    </View>
  );

  /* ---- devCardOffline(name) ---- */
  const DevCardOffline = ({ id, name }: { id: string; name: string }) => (
    <View style={st.card}>
      <Row style={st.cardHeadRow}>
        <Pressable
          style={({ pressed }) => [st.offlineHeadEntry, pressed && { opacity: 0.62 }]}
          onPress={() => showOfflineDialog(id)}
        >
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
        </Pressable>
        <Tap
          style={st.gearBtn}
          onPress={openDevice(id, 'dev-settings')}
          hitSlop={8}
          accessibilityLabel={`Open settings for ${name}`}
        >
          <Icon name="gear" size={16} color={colors.textTertiary} />
        </Tap>
      </Row>
      <Pressable
        style={({ pressed }) => [st.offlinePlaceholder, pressed && { opacity: 0.7 }]}
        onPress={() => showOfflineDialog(id)}
      >
        <Icon name="cloudOff" size={34} color={colors.textTertiary} sw={1.6} />
        <Text style={st.offlineText}>The device is offline</Text>
      </Pressable>
      <View style={{ padding: 12, paddingHorizontal: 14 }}>
        {/* 静态按钮:点击无响应 */}
        <Pressable
          style={({ pressed }) => [st.troubleBtn, pressed && { opacity: 0.7 }]}
          onPress={() => showOfflineDialog(id)}
        >
          <Text style={st.troubleText}>Please check the device</Text>
        </Pressable>
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
      {failLoad ? (
        retrying ? (
          <View style={{ alignItems: 'center', paddingTop: 130 }}>
            <Spinner size={28} />
          </View>
        ) : (
          <StateView
            variant="error"
            icon="warn"
            title="Failed to load devices"
            sub="Please check your network and try again."
            actionLabel="Retry"
            onAction={retryLoad}
            style={{ paddingTop: 180 }}
            titleStyle={{ fontSize: 19 }}
            subStyle={{ fontSize: 16, lineHeight: 22 }}
            actionTextStyle={{ fontSize: 17 }}
          />
        )
      ) : noDevices || devices.length === 0 ? (
        <StateView
          variant="brand"
          icon="camera"
          title="No devices yet"
          sub="Add your first camera to start monitoring your home."
          actionLabel="Add Device"
          onAction={go('bind-find')}
          style={{ paddingTop: 90 }}
        />
      ) : (
        <View style={{ paddingHorizontal: 18, gap: 16 }}>
          {devices.map((device) =>
            device.status === 'online' ? (
              <DevCard
                key={device.id}
                id={device.id}
                name={device.name}
                status="Online"
                prev={DEVICE_PREVIEWS[device.id] ?? NEW_DEVICE_PREVIEW}
              />
            ) : (
              <DevCardOffline key={device.id} id={device.id} name={device.name} />
            ),
          )}
        </View>
      )}
      <DeviceOfflineDialog visible={offlineDialogOpen} onClose={() => setOfflineDialogOpen(false)} />
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
  offlineHeadEntry: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 10 },

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

// 系统权限引导弹窗 —— 权限被拒后引导去系统设置(蓝牙未开启则引导打开蓝牙)。
// 视觉沿用 App 弹窗规范:0.42 黑色蒙层、白卡 22 圆角、双胶囊按钮。
import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Linking } from 'react-native';
import { Row } from './kit';
import { Icon } from './Icon';
import { colors } from '../theme';

export type PermType = 'bluetooth' | 'btPermission' | 'location' | 'microphone' | 'photos' | 'notifications';

const CFG: Record<PermType, { icon: string; title: string; desc: string; cta: string; openSettings: boolean }> = {
  bluetooth: {
    icon: 'bluetooth',
    title: 'Turn on Bluetooth',
    desc: 'Bluetooth is required to find and connect nearby cameras. Please turn on Bluetooth and try again.',
    cta: 'Turn On',
    openSettings: true,
  },
  btPermission: {
    icon: 'bluetooth',
    title: 'Bluetooth Permission Needed',
    desc: 'LIVHOME needs Bluetooth permission to search for nearby devices. Please allow it in Settings.',
    cta: 'Go to Settings',
    openSettings: true,
  },
  location: {
    icon: 'pin',
    title: 'Location Permission Needed',
    desc: 'Location permission is required to scan for nearby Bluetooth devices. Please allow it in Settings.',
    cta: 'Go to Settings',
    openSettings: true,
  },
  microphone: {
    icon: 'mic',
    title: 'Microphone Access Needed',
    desc: 'Microphone access is required for two-way talk. Please allow it in Settings.',
    cta: 'Go to Settings',
    openSettings: true,
  },
  photos: {
    icon: 'photo',
    title: 'Photos Access Needed',
    desc: 'Photo library access is required to save snapshots and recordings. Please allow it in Settings.',
    cta: 'Go to Settings',
    openSettings: true,
  },
  notifications: {
    icon: 'bell',
    title: 'Notifications Are Off',
    desc: 'Turn on notifications to receive device alerts and system reminders in time.',
    cta: 'Go to Settings',
    openSettings: true,
  },
};

export function PermissionDialog({
  type,
  visible,
  onClose,
}: {
  type: PermType;
  visible: boolean;
  onClose: () => void;
}) {
  const cfg = CFG[type];

  const onCta = () => {
    if (cfg.openSettings) Linking.openSettings().catch(() => {});
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.ovl} onPress={onClose}>
        <Pressable style={st.dialog} onPress={() => {}}>
          <View style={st.iconTile}>
            <Icon name={cfg.icon} size={24} color={colors.brand} sw={1.8} />
          </View>
          <Text style={st.title}>{cfg.title}</Text>
          <Text style={st.desc}>{cfg.desc}</Text>
          <Row style={{ gap: 12, marginTop: 20 }}>
            <Pressable style={[st.btn, st.btnCancel]} onPress={onClose}>
              <Text style={[st.btnTxt, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
            <Pressable style={[st.btn, { backgroundColor: colors.brand }]} onPress={onCta}>
              <Text style={[st.btnTxt, { color: '#fff' }]}>{cfg.cta}</Text>
            </Pressable>
          </Row>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const st = StyleSheet.create({
  ovl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 34,
  },
  dialog: {
    width: '100%',
    maxWidth: 322,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
  },
  iconTile: {
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  desc: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: 10,
    lineHeight: 20,
    textAlign: 'center',
  },
  btn: { flex: 1, height: 46, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: colors.bgSecondary },
  btnTxt: { fontSize: 15, fontWeight: '700' },
});

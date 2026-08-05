import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { Icon } from './Icon';
import { PrimaryBtn } from './kit';

export function DeviceOfflineDialog({
  visible,
  deviceName,
  onClose,
}: {
  visible: boolean;
  deviceName?: string;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.overlay} onPress={onClose}>
        <Pressable
          accessibilityRole="alert"
          accessibilityViewIsModal
          style={st.dialog}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={st.iconWrap}>
            <Icon name="cloudOff" size={26} color={colors.textSecondary} sw={1.8} />
          </View>
          <Text style={st.title}>Device offline</Text>
          <Text style={st.desc}>
            {deviceName ? `${deviceName} is offline. ` : 'This device is offline. '}
            Device controls and settings are unavailable. Check its power and network, then try again.
          </Text>
          <PrimaryBtn label="Got it" onPress={onClose} style={st.button} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: {
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
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: 16, fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  desc: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  button: { width: '100%', height: 46, marginTop: 20 },
});

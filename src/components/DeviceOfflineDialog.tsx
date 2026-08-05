import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Tap } from './kit';
import { colors } from '../theme';

const POWER_SOLUTION =
  '<svg viewBox="0 0 260 164" fill="none"><g stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="29" y="102" width="174" height="54" rx="8"/><path d="M29 142h174M203 122h38M203 136h38"/><rect x="43" y="112" width="33" height="32" rx="9"/><rect x="88" y="112" width="33" height="32" rx="9"/><rect x="133" y="112" width="33" height="32" rx="9"/><rect x="173" y="112" width="20" height="32" rx="7"/><path d="M55 123v8m10-8v8m34-8v8m10-8v8m34-8v8m10-8v8m30-11v8"/><path d="M132 112V88m12 24V88m-12 0h12"/><path d="M123 85c0-9 7-16 16-16s16 7 16 16v11h-32z"/><path d="M133 92h12m-12 6h12"/><path d="M138 69c3-13 16-24 31-24l45-3"/><path d="M133 69c5-13 15-22 27-27"/><path d="M163 53c9 4 16 9 21 16"/><path d="M183 69l8-14 10 5-8 14"/><path d="M73 91c-4-14 2-29 16-36" stroke-dasharray="5 6"/><path d="M83 96l-10-5 5-10"/></g></svg>';

const WIFI_SOLUTION =
  '<svg viewBox="0 0 260 196" fill="none"><g stroke="#1A1A1A" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><circle cx="130" cy="99" r="78" stroke-dasharray="4 5"/><path d="M91 127h78l-9-24h-60z"/><path d="M100 103l6-57m48 57l-6-57"/><path d="M102 128v8m17-8v8m17-8v8m17-8v8m17-8v8m17-8v8"/><circle cx="113" cy="115" r="2" fill="#1A1A1A"/><circle cx="121" cy="115" r="2" fill="#1A1A1A"/><circle cx="129" cy="115" r="2" fill="#1A1A1A"/><path d="M130 49v10m-9-7 9-9 9 9m27 9c6-6 15-6 21 0m-26 5c8-8 20-8 28 0m-19 4c3-3 7-3 10 0"/><circle cx="58" cy="154" r="20"/><path d="M58 143v22m-7-7 7 7 7-7"/><circle cx="201" cy="154" r="20"/><circle cx="201" cy="154" r="9"/><circle cx="201" cy="154" r="3"/><path d="M185 145c-4 6-4 13 0 19m32-19c4 6 4 13 0 19"/><path d="M70 158c8 0 11 7 16 7m-22-10c-7 0-10 3-10 9m4-15c-7 0-11 5-11 12"/></g></svg>';

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
      <View style={st.overlay}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close offline guidance"
        />
        <View style={st.sheet} accessibilityViewIsModal>
          <View style={st.content}>
            <Text style={st.title}>{deviceName ? `${deviceName} is offline` : 'Device offline'}</Text>
            <Text style={st.solution}>Solution:</Text>
            <Text style={st.step}>1. Please check if the device plug is properly connected and ensure it is powered on.</Text>
            <View style={st.illustration} accessible={false}>
              <SvgXml xml={POWER_SOLUTION} width={76} height={48} />
            </View>
            <Text style={st.step}>2. Check if the router is working and the device is within Wi-Fi range.</Text>
            <View style={[st.illustration, st.routerIllustration]} accessible={false}>
              <SvgXml xml={WIFI_SOLUTION} width={80} height={60} />
            </View>
          </View>
          <View style={st.footer}>
            <Tap style={st.confirm} onPress={onClose} accessibilityRole="button" accessibilityLabel="I Understand">
              <Text style={st.confirmText}>I Understand</Text>
            </Tap>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: 'rgba(20,20,22,0.34)' },
  sheet: {
    width: '86%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 22,
    overflow: 'hidden',
  },
  content: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', lineHeight: 28, color: colors.textPrimary, textAlign: 'center' },
  solution: { marginTop: 14, fontSize: 17, fontWeight: '700', lineHeight: 22, color: colors.textPrimary },
  step: { marginTop: 13, fontSize: 13, fontWeight: '500', lineHeight: 18, color: colors.textPrimary },
  illustration: { height: 46, marginTop: 3, alignItems: 'center', justifyContent: 'center' },
  routerIllustration: { height: 60, marginTop: 1 },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 18 },
  confirm: { height: 46, alignItems: 'center', justifyContent: 'center' },
  confirmText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
});

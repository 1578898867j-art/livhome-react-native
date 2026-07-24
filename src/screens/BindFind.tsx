import type { AppScreenProps } from '../navigation/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Modal, Pressable, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen, Tap, Row, Header } from '../components/kit';
import { Icon } from '../components/Icon';
import { PermissionDialog } from '../components/PermissionDialog';
import type { PermType } from '../components/PermissionDialog';
import { SvgXml } from 'react-native-svg';
import { getDemoFlags } from '../features/app/demoStore';
import { CAMAVATAR } from '../assets/images';
import { colors, shadow } from '../theme';

// Huge-icon/device/outline/bluetooth-off 素材,描白用于蓝色圆点内
const BT_ICON =
  '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="12" r="1" fill="#FFFFFF"/><path d="M4 8L14.8857 15.2571C15.4418 15.6279 15.4847 16.4295 14.9711 16.8574L11.6402 19.6332C10.9889 20.176 10 19.7128 10 18.865V5.13504C10 4.2872 10.9889 3.82405 11.6402 4.36682L14.9711 7.14262C15.4847 7.57055 15.4418 8.37211 14.8857 8.74289L4 16" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/><path d="M18.7746 8.72095C19.5379 9.5988 20 10.7455 20 12.0001C20 13.2806 19.5187 14.4486 18.7271 15.3332" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/></svg>';

// 搜索超时时长(无结果 → 未找到设备页)
const SEARCH_TIMEOUT = 12000;

/* manual-add device tile (bDeviceTile) → continue/next;图标为产品图(与首页设备头像同素材) */
function DeviceTile({ name, onPress }: { name: string; onPress?: () => void }) {
  return (
    <Tap style={st.tile} onPress={onPress}>
      <View style={st.tileIcon}>
        <Image source={{ uri: CAMAVATAR }} resizeMode="contain" style={st.tileImg} />
      </View>
      <Text style={st.tileLabel}>{name}</Text>
    </Tap>
  );
}

export default function BindFind({ navigation }: AppScreenProps) {
  // ping ripples (two rings staggered) + breathing dot
  const ping1 = useRef(new Animated.Value(0)).current;
  const ping2 = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  // 概率性状态:蓝牙未开启 / 权限被拒引导、搜索超时 → 未找到设备、设备已被绑定
  const [perm, setPerm] = useState<PermType | null>(null);
  const [boundDlg, setBoundDlg] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const flags = getDemoFlags();
      if (flags.btOff) setPerm('bluetooth');
      else if (flags.permsDenied) setPerm('btPermission');
      const timer = setTimeout(() => navigation.navigate('bind-none'), SEARCH_TIMEOUT);
      return () => clearTimeout(timer);
    }, [navigation]),
  );

  const pickDevice = () => {
    if (getDemoFlags().alreadyBound) {
      setBoundDlg(true);
      return;
    }
    navigation.navigate('bind-prep');
  };

  useEffect(() => {
    const mkPing = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, duration: 2600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ]),
      );
    const p1 = mkPing(ping1, 0);
    const p2 = mkPing(ping2, 1300);
    const br = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    p1.start();
    p2.start();
    br.start();
    return () => {
      p1.stop();
      p2.stop();
      br.stop();
    };
  }, [ping1, ping2, breathe]);

  const ringStyle = (v: Animated.Value) => ({
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
  });

  return (
    <Screen
      scroll={false}
      header={<Header title="Add Device" onBack={() => navigation.goBack()} />}
    >
      <View style={st.headBlock}>
        <Text style={st.title}>Bring your phone close to the device</Text>
        <Text style={st.sub}>LIVHOME is quietly detecting nearby cameras</Text>
      </View>

      {/* searching spinner */}
      <View style={st.radar}>
        <Animated.View style={[st.ring, ringStyle(ping1)]} />
        <Animated.View style={[st.ring, ringStyle(ping2)]} />
        {/* 白色圆 + 蓝点整体随呼吸节拍缩放 */}
        <Animated.View
          style={[
            st.core,
            {
              transform: [
                { scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) },
              ],
            },
          ]}
        >
          <View style={st.coreDot}>
            <SvgXml xml={BT_ICON} width={28} height={28} />
          </View>
        </Animated.View>
      </View>

      <Row style={st.searchRow}>
        <Animated.View
          style={[
            st.dot,
            { opacity: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
          ]}
        />
        <Text style={st.searchTxt}>Searching for nearby devices…</Text>
      </Row>

      <View style={st.qrRow}>
        <Tap onPress={() => navigation.navigate('bind-qr')}>
          <Text style={st.qrTxt}>Use QR Pairing instead</Text>
        </Tap>
      </View>

      {/* manual add card */}
      <View style={st.manual}>
        <Row style={st.divider}>
          <View style={st.line} />
          <Text style={st.dividerTxt}>Or add manually</Text>
          <View style={st.line} />
        </Row>
        <Row style={st.tileRow}>
          <DeviceTile name="Living Room Camera" onPress={pickDevice} />
          <DeviceTile name="Bedroom Camera" onPress={pickDevice} />
          <DeviceTile name="Backyard Camera" onPress={pickDevice} />
        </Row>
      </View>

      {/* 蓝牙未开启 / 蓝牙权限被拒 引导 */}
      <PermissionDialog type={perm ?? 'bluetooth'} visible={perm !== null} onClose={() => setPerm(null)} />

      {/* 设备已被其他账号绑定 */}
      <Modal transparent visible={boundDlg} animationType="fade" onRequestClose={() => setBoundDlg(false)}>
        <Pressable style={st.ovl} onPress={() => setBoundDlg(false)}>
          <Pressable style={st.dialog} onPress={() => {}}>
            <View style={st.dlgIcon}>
              <Icon name="warn" size={24} color={colors.warning} sw={1.8} />
            </View>
            <Text style={st.dlgTitle}>Device Already Bound</Text>
            <Text style={st.dlgDesc}>
              This camera is bound to another account. Unbind it from the original account, or reset the
              device and try again.
            </Text>
            <Pressable
              style={({ pressed }) => [st.dlgBtn, pressed && { opacity: 0.85 }]}
              onPress={() => setBoundDlg(false)}
            >
              <Text style={st.dlgBtnTxt}>Got it</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  headBlock: { alignItems: 'center', paddingHorizontal: 26, paddingTop: 22 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, lineHeight: 29, color: colors.textPrimary, textAlign: 'center' },
  sub: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, lineHeight: 21, marginTop: 10, textAlign: 'center' },

  radar: { width: 210, height: 210, alignSelf: 'center', marginTop: 30, marginBottom: 22, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: colors.brandSoft },
  core: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.md },
  coreDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchRow: { justifyContent: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand },
  searchTxt: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },

  qrRow: { alignItems: 'center', paddingTop: 14 },
  qrTxt: { fontSize: 13, fontWeight: '700', color: colors.brand },

  manual: { marginTop: 32, paddingHorizontal: 22 },
  divider: { gap: 10, marginBottom: 14 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerTxt: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  tileRow: { alignItems: 'stretch', gap: 10 },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },
  tileIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.bgSecondary, alignItems: 'center', justifyContent: 'center', padding: 8 },
  tileImg: { width: '100%', height: '100%' },
  tileLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center', lineHeight: 16 },

  // 已被绑定弹窗(App 弹窗规范)
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
  dlgIcon: {
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  dlgTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  dlgDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: 10,
    lineHeight: 20,
    textAlign: 'center',
  },
  dlgBtn: {
    marginTop: 20,
    height: 46,
    borderRadius: 99,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dlgBtnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

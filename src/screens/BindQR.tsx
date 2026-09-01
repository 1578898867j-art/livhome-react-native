import type { AppScreenProps } from '../navigation/types';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen, Header, SecondaryBtn, Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/states';
import { useDemoFlags } from '../features/app/demoStore';
import { colors } from '../theme';

// QR matrix from the prototype source (11 rows of 11 chars; '1' = filled).
const PAT = [
  '11111011111',
  '10001010001',
  '10111010111',
  '10111011101',
  '10001000101',
  '11111010101',
  '00000011000',
  '11101101110',
  '10010100011',
  '01101011010',
  '11011001011',
];

// Keep the QR modules large enough to scan comfortably from the device camera.
const CELL = 18;

export default function BindQR({ navigation }: AppScreenProps) {
  const { failLoad } = useDemoFlags();
  const [retrying, setRetrying] = useState(false);
  const [slowHint, setSlowHint] = useState(false);

  // 扫码超时提示:停留 20s 设备仍未扫走 → 提示调整距离(自然触发)
  useFocusEffect(
    useCallback(() => {
      setSlowHint(false);
      const timer = setTimeout(() => setSlowHint(true), 20000);
      return () => clearTimeout(timer);
    }, []),
  );

  // 二维码生成失败 → 错误态;Retry 转 0.8s(接后端后换真实请求)
  const retry = () => {
    setRetrying(true);
    setTimeout(() => setRetrying(false), 800);
  };

  return (
    <Screen
      scroll={false}
      header={<Header title="QR Pairing" onBack={() => navigation.goBack()} />}
    >
      <View style={st.intro}>
        <Text style={st.title}>Scan the QR code</Text>
        <Text style={st.sub}>
          Hold the QR code ~10cm from the device camera so it can read the Wi-Fi.
        </Text>
      </View>

      <View style={st.qrWrap}>
        <View style={st.qrCard}>
          {failLoad ? (
            <View style={st.qrError}>
              {retrying ? (
                <Spinner size={26} />
              ) : (
                <>
                  <View style={st.qrErrCircle}>
                    <Icon name="scan" size={22} color={colors.critical} sw={1.8} />
                  </View>
                  <Text style={st.qrErrTitle}>Failed to generate</Text>
                  <Tap onPress={retry} hitSlop={8}>
                    <Text style={st.qrErrRetry}>Retry</Text>
                  </Tap>
                </>
              )}
            </View>
          ) : (
            <>
              <View style={st.grid}>
                {PAT.map((row, r) =>
                  row.split('').map((v, c) => (
                    <View
                      key={`${r}-${c}`}
                      style={{
                        width: CELL,
                        height: CELL,
                        backgroundColor: v === '1' ? colors.textPrimary : 'transparent',
                      }}
                    />
                  )),
                )}
              </View>
            </>
          )}
        </View>
      </View>

      <View style={st.waitRow}>
        <View style={st.dot} />
        <Text style={st.waitText}>Waiting for the device to scan…</Text>
      </View>

      {slowHint && !failLoad && (
        <View style={st.hintPill}>
          <Text style={st.hintTxt}>Not scanned yet? Move the code closer to the camera lens.</Text>
        </View>
      )}

      <View style={st.footer}>
        <SecondaryBtn
          label="Can’t scan? Switch to Bluetooth"
          onPress={() => navigation.navigate('bind-find')}
          style={{ borderRadius: 99 }}
          textStyle={st.footerBtnText}
        />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  intro: { paddingHorizontal: 34, paddingTop: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.textPrimary },
  sub: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  qrWrap: { alignItems: 'center', paddingTop: 34 },
  qrCard: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CELL * 11,
    height: CELL * 11,
  },
  waitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 28,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand },
  waitText: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },
  footer: { marginTop: 'auto', paddingHorizontal: 24, paddingTop: 30, paddingBottom: 40 },
  footerBtnText: { fontWeight: '600' },

  // 二维码生成失败态(占位与二维码同尺寸,卡片不跳动)
  qrError: { width: CELL * 11, height: CELL * 11, alignItems: 'center', justifyContent: 'center' },
  qrErrCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.criticalSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrErrTitle: { marginTop: 10, fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  qrErrRetry: { marginTop: 8, fontSize: 13, fontWeight: '700', color: colors.brand },
  // 扫码超时提示(20s 未被扫走)
  hintPill: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginHorizontal: 34,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: colors.warningSoft,
  },
  hintTxt: {
    alignSelf: 'stretch',
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.warning,
    textAlign: 'center',
  },
});

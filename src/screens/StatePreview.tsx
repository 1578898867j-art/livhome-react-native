import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen, Tap, Card, Header, Eyebrow, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import {
  useDemoFlags,
  setDemoFlag,
  resetDemoFlags,
  triggerSessionExpired,
} from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';
import type { DemoFlags } from '../features/app/demoStore';
import { colors } from '../theme';

// 状态演示控制台 —— docs/edge-states-checklist.md 的开关面板。
// 打开开关后回到对应页面即可看到该「概率性状态」;接入后端后这些开关由真实请求结果替代。

type RowDef = { key: keyof DemoFlags; name: string; sub: string };

const GROUPS: { title: string; rows: RowDef[] }[] = [
  {
    title: 'Global',
    rows: [
      { key: 'offline', name: 'Offline', sub: 'Top banner · AI send fails · sign-in fails' },
      { key: 'failLoad', name: 'Lists fail to load', sub: 'Devices / notifications / album / Wi-Fi list / history' },
      { key: 'failOps', name: 'Operations fail', sub: 'Every save · delete · toggle · upload shows an error' },
      { key: 'permsDenied', name: 'Permissions denied', sub: 'Mic / photos / Bluetooth / notifications guides' },
    ],
  },
  {
    title: 'Live view',
    rows: [
      { key: 'failStream', name: 'Stream fails', sub: 'Live view / playback / album media error + retry' },
      { key: 'deviceOffline', name: 'Device offline', sub: 'Device detail player shows offline placeholder' },
      { key: 'noDevices', name: 'No devices', sub: 'Device list empty state with add guide' },
    ],
  },
  {
    title: 'Playback',
    rows: [
      { key: 'emptyDay', name: 'No recordings today', sub: 'Timeline empty state' },
      { key: 'noSdCard', name: 'No SD card', sub: 'Playback page + storage card status' },
      { key: 'cloudExpired', name: 'Cloud expired', sub: 'Playback cloud-storage expired page' },
    ],
  },
  {
    title: 'Pairing',
    rows: [
      { key: 'btOff', name: 'Bluetooth off', sub: 'Guide dialog when entering device search' },
      { key: 'alreadyBound', name: 'Already bound', sub: 'Picking a device shows the bound-conflict dialog' },
      { key: 'bindFail', name: 'Connection fails', sub: 'Connecting page fails into the failure page' },
    ],
  },
  {
    title: 'Firmware',
    rows: [{ key: 'otaUpdate', name: 'Update available', sub: 'Device details firmware row shows v2.5.0' }],
  },
];

/* 本地开关(不走设置项 guardSave,failOps 打开时也能操作) */
function RawToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      style={[st.tg, on && { backgroundColor: colors.brand, alignItems: 'flex-end' }]}
    >
      <View style={st.tgKnob} />
    </Pressable>
  );
}

export default function StatePreview({ navigation }: AppScreenProps) {
  const flags = useDemoFlags();

  return (
    <Screen
      header={<Header title="State Preview" onBack={() => navigation.goBack()} />}
      contentStyle={{ paddingBottom: 54 }}
    >
      <Text style={st.note}>
        Turn a state on, then open the related page to preview it. These switches stand in for real
        backend results and will be removed after integration.
      </Text>

      {GROUPS.map((g) => (
        <View key={g.title}>
          <Eyebrow>{g.title}</Eyebrow>
          <Card style={st.card}>
            {g.rows.map((r, i) => (
              <Row key={r.key} style={[st.row, i === g.rows.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={st.rowName}>{r.name}</Text>
                  <Text style={st.rowSub}>{r.sub}</Text>
                </View>
                <RawToggle on={flags[r.key]} onToggle={() => setDemoFlag(r.key, !flags[r.key])} />
              </Row>
            ))}
          </Card>
        </View>
      ))}

      <Eyebrow>One-off events</Eyebrow>
      <Card style={st.card}>
        <Tap style={st.actRow} onPress={() => showToast('Server error. Please try again later.', 'error')}>
          <Text style={st.actTxt}>Show server-error toast</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>
        <View style={st.line} />
        <Tap style={st.actRow} onPress={triggerSessionExpired}>
          <Text style={st.actTxt}>Show login-expired dialog</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>
        <View style={st.line} />
        <Tap style={st.actRow} onPress={() => navigation.navigate('bind-none')}>
          <Text style={st.actTxt}>Open “No device found” page</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>
        <View style={st.line} />
        <Tap style={st.actRow} onPress={() => navigation.navigate('bind-fail')}>
          <Text style={st.actTxt}>Open “Connection failed” page</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>
      </Card>

      <View style={st.resetWrap}>
        <Pressable
          onPress={resetDemoFlags}
          style={({ pressed }) => [st.resetBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={st.resetTxt}>Reset All States</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  note: {
    marginHorizontal: 22,
    marginTop: 4,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.textTertiary,
  },
  card: { marginHorizontal: 18 },
  row: {
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  rowSub: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 3, lineHeight: 16 },
  tg: {
    width: 42,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.borderStrong,
    padding: 2.5,
    justifyContent: 'center',
  },
  tgKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },

  actRow: { flexDirection: 'row', alignItems: 'center', minHeight: 54, paddingHorizontal: 16, gap: 10 },
  actTxt: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  line: { height: 1, marginHorizontal: 16, backgroundColor: colors.border },

  resetWrap: { paddingHorizontal: 18, paddingTop: 22 },
  resetBtn: {
    height: 54,
    borderRadius: 99,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetTxt: { fontSize: 15, fontWeight: '700', color: colors.critical },
});

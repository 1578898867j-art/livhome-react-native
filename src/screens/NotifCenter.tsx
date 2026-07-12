import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { colors, radius } from '../theme';

const EDIT_ICON =
  '<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 6C2.75 4.20507 4.20507 2.75 6 2.75H12C12.4142 2.75 12.75 2.41421 12.75 2C12.75 1.58579 12.4142 1.25 12 1.25H6C3.37665 1.25 1.25 3.37665 1.25 6V18C1.25 20.6234 3.37665 22.75 6 22.75H18C20.6234 22.75 22.75 20.6234 22.75 18V12C22.75 11.5858 22.4142 11.25 22 11.25C21.5858 11.25 21.25 11.5858 21.25 12V18C21.25 19.7949 19.7949 21.25 18 21.25H6C4.20507 21.25 2.75 19.7949 2.75 18V6ZM16.419 2.67708C17.3218 1.77431 18.7855 1.77431 19.6883 2.67708L21.3229 4.31171C22.2257 5.21449 22.2257 6.67818 21.3229 7.58096L19.8736 9.03028C19.7598 8.97394 19.6401 8.91302 19.516 8.84767C18.6806 8.40786 17.6892 7.79057 16.9493 7.05069C16.2095 6.31082 15.5922 5.31945 15.1524 4.48403C15.087 4.35989 15.0261 4.24018 14.9697 4.12639L16.419 2.67708ZM15.8887 8.11135C16.7642 8.98687 17.8777 9.67594 18.7595 10.1444L13.06 15.8438C12.7064 16.1975 12.2475 16.4269 11.7523 16.4977L8.31963 16.9881C7.5568 17.097 6.90295 16.4432 7.01193 15.6804L7.50231 12.2477C7.57305 11.7525 7.80248 11.2936 8.15616 10.94L13.8556 5.24053C14.3241 6.12234 15.0131 7.23582 15.8887 8.11135Z" fill="currentColor"/></svg>';

type Alert = {
  icon: string;
  color: string;
  soft: string;
  title: string;
  body: string;
  time: string;
  thumb: boolean;
};

const DEVICE: Alert[] = [
  {
    icon: 'walk',
    color: colors.brand,
    soft: colors.brandSoft,
    title: 'Motion Detected',
    body: 'Movement detected in Living Room',
    time: '09:41 · Living Room',
    thumb: true,
  },
  {
    icon: 'walk',
    color: colors.success,
    soft: colors.successSoft,
    title: 'Activity detected',
    body: 'Movement detected near the sofa',
    time: '08:12 · Living Room',
    thumb: true,
  },
  {
    icon: 'speaker',
    color: colors.warning,
    soft: colors.warningSoft,
    title: 'Sound Detected',
    body: 'Loud sound detected',
    time: 'Yesterday 22:03 · Backyard',
    thumb: false,
  },
];

const SYSTEM: Alert[] = [
  {
    icon: 'spark',
    color: colors.brand,
    soft: colors.brandSoft,
    title: 'Firmware updated',
    body: 'Living Room updated to v2.4.1',
    time: '10:00',
    thumb: false,
  },
  {
    icon: 'info',
    color: colors.info,
    soft: colors.infoSoft,
    title: 'Welcome to LIVHOME',
    body: 'Your account is ready. Add your first device.',
    time: 'Jun 20',
    thumb: false,
  },
];

export default function NotifCenter({ navigation }: AppScreenProps) {
  const [notifTab, setNotifTab] = useState<'device' | 'system'>('device');
  const [editMode, setEditMode] = useState(false);

  const isDev = notifTab === 'device';
  const list = isDev ? DEVICE : SYSTEM;

  const Tab = (k: 'device' | 'system', label: string) => {
    const active = notifTab === k;
    return (
      <Tap
        onPress={() => setNotifTab(k)}
        style={[st.tab, { backgroundColor: active ? colors.textPrimary : 'transparent' }]}
      >
        <Text style={[st.tabLabel, { color: active ? colors.textInverse : colors.textSecondary }]}>
          {label}
        </Text>
      </Tap>
    );
  };

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        {/* Nav bar */}
        <Row style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 10 }}>
          <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
          </Tap>
          <Text style={st.navTitle}>Notification Center</Text>
          <Tap style={st.iconbtnPlain} onPress={() => setEditMode((v) => !v)} hitSlop={8}>
            {editMode ? (
              <Icon name="x" size={17} color={colors.textPrimary} sw={2} />
            ) : (
              <SvgXml xml={EDIT_ICON} width={20} height={20} color={colors.textPrimary} />
            )}
          </Tap>
        </Row>

        {/* Tabs */}
        <Row style={{ gap: 8, paddingHorizontal: 18, paddingTop: 6, paddingBottom: 12 }}>
          {Tab('device', 'Device')}
          {Tab('system', 'System')}
        </Row>

        {/* Body list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: editMode ? 110 : 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Row style={{ paddingHorizontal: 2, paddingTop: 6, paddingBottom: 12, alignItems: 'baseline' }}>
            <Text style={st.dateNum}>24</Text>
            <Text style={st.dateMon}>Jun</Text>
          </Row>

          {list.map((a, i) => (
            <Tap
              key={i}
              onPress={() => navigation.navigate('notif-detail')}
              style={st.card}
            >
              {a.thumb ? (
                <View style={st.thumb}>
                  <CamPreview box={false} style={st.thumbCam} />
                </View>
              ) : (
                <View style={[st.iconWrap, { backgroundColor: a.soft }]}>
                  <Icon name={a.icon} size={20} color={a.color} />
                </View>
              )}
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={st.cardTop}>
                  <Text style={st.cardTitle}>{a.title}</Text>
                  {editMode && <View style={st.checkbox} />}
                </View>
                <Text style={st.cardBody}>{a.body}</Text>
                <Text style={st.cardTime}>{a.time}</Text>
              </View>
            </Tap>
          ))}
        </ScrollView>

        {/* Delete bar */}
        {editMode && (
          <View style={st.deleteBar}>
            <Pressable
              onPress={() => setEditMode(false)}
              style={({ pressed }) => [st.deleteBtn, pressed && { opacity: 0.85 }]}
            >
              <Text style={st.deleteLabel}>Delete selected</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  iconbtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconbtnPlain: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: { flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center', color: colors.textPrimary },
  tab: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 999 },
  tabLabel: { fontSize: 13, fontWeight: '700' },
  dateNum: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, color: colors.textPrimary },
  dateMon: { fontSize: 13, fontWeight: '700', color: colors.textTertiary, marginLeft: 6 },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  thumb: { width: 64, height: 64, borderRadius: 12, overflow: 'hidden', flexShrink: 0 },
  thumbCam: { height: 64 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  checkbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong },
  cardBody: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 3, lineHeight: 17 },
  cardTime: { fontSize: 11, fontWeight: '600', color: colors.textTertiary, marginTop: 5 },
  deleteBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 34,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteBtn: {
    width: '100%',
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.criticalSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteLabel: { fontSize: 15, fontWeight: '700', color: colors.critical },
});

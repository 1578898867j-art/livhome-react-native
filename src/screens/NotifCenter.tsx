import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { SELICON } from '../icons/protoIcons';
import { CAMAVATAR } from '../assets/images';
import { colors } from '../theme';

// 消息中心 —— 按 Figma 4527:581:Device/System 两级,日期分组,编辑态 Delete All,
// 删除确认弹窗,清空后空态。设备消息缩略图用 App 内设备图(CAMAVATAR)。
type Msg = { id: number; title: string; time: string; body: string; unread?: boolean };
type DayGroup = { day: string; mon: string; msgs: Msg[] };

const DEVICE_INIT: DayGroup[] = [
  {
    day: '24', mon: 'Jan',
    msgs: [
      { id: 1, title: 'Message Title', time: '17:40:20', body: 'Living Room | Congratulations! Your registration was succes', unread: true },
      { id: 2, title: 'Message Title', time: '17:40:20', body: 'Living Room | Congratulations! Your registration was succes' },
    ],
  },
  {
    day: '23', mon: 'Jan',
    msgs: [{ id: 3, title: 'Message Title', time: '17:40:20', body: 'Backyard | Congratulations! Your registration was succes' }],
  },
];

const SYSTEM_INIT: DayGroup[] = [
  {
    day: '24', mon: 'Jan',
    msgs: [
      { id: 11, title: 'Message Title', time: '17:40:20', body: 'Congratulations! Your registration was successful, Welcome abo.' },
      { id: 12, title: 'Message Title', time: '17:40:20', body: 'Congratulations! Your registration was successful, Welcome abo.' },
    ],
  },
  {
    day: '22', mon: 'Jan',
    msgs: [
      { id: 13, title: 'Message Title', time: '17:40:20', body: 'Congratulations! Your registration was successful, Welcome abo.' },
      { id: 14, title: 'Message Title', time: '17:40:20', body: 'Congratulations! Your registration was successful, Welcome abo.' },
    ],
  },
];

export default function NotifCenter({ navigation }: AppScreenProps) {
  const [tab, setTab] = useState<'device' | 'system'>('device');
  const [edit, setEdit] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [deviceMsgs, setDeviceMsgs] = useState<DayGroup[]>(DEVICE_INIT);
  const [systemMsgs, setSystemMsgs] = useState<DayGroup[]>(SYSTEM_INIT);
  const [confirm, setConfirm] = useState<null | 'all' | 'sel'>(null);

  const groups = tab === 'device' ? deviceMsgs : systemMsgs;
  const setGroups = tab === 'device' ? setDeviceMsgs : setSystemMsgs;
  const empty = groups.every((g) => g.msgs.length === 0);

  const toggleCheck = (id: number) =>
    setChecked((c) => (c.indexOf(id) >= 0 ? c.filter((v) => v !== id) : c.concat(id)));

  const exitEdit = () => {
    setEdit(false);
    setChecked([]);
  };

  const doDelete = () => {
    if (confirm === 'all') {
      setGroups((gs) => gs.map((g) => ({ ...g, msgs: [] })));
    } else {
      setGroups((gs) => gs.map((g) => ({ ...g, msgs: g.msgs.filter((m) => checked.indexOf(m.id) < 0) })));
    }
    setConfirm(null);
    exitEdit();
  };

  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      {/* nav:返回 + 居中标题 + 编辑态 Done */}
      <Row style={st.nav}>
        <View style={{ width: 44 }}>
          <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
          </Tap>
        </View>
        <Text style={st.navTitle}>Notification Center</Text>
        {edit ? (
          <Tap onPress={exitEdit} hitSlop={8} style={{ width: 44 }}>
            <Text style={st.doneTxt} numberOfLines={1}>Done</Text>
          </Tap>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </Row>

      {/* tabs + 编辑态 Delete All */}
      <Row style={st.tabRow}>
        <Tap style={[st.tabPill, tab === 'device' && st.tabPillOn]} onPress={() => { setTab('device'); exitEdit(); }}>
          <Text style={[st.tabTxt, tab === 'device' && st.tabTxtOn]}>Device</Text>
        </Tap>
        <View>
          <Tap style={[st.tabPill, tab === 'system' && st.tabPillOn]} onPress={() => { setTab('system'); exitEdit(); }}>
            <Text style={[st.tabTxt, tab === 'system' && st.tabTxtOn]}>System</Text>
          </Tap>
          <View style={st.tabDot} />
        </View>
        <View style={{ flex: 1 }} />
        {edit && !empty && (
          <Tap style={st.delAllRow} onPress={() => setConfirm('all')}>
            <Text style={st.delAllTxt}>Delete All</Text>
            <View style={st.selCircle} />
          </Tap>
        )}
      </Row>

      {/* 空态(设计稿:No camera messages yet.) */}
      {empty ? (
        <View style={st.emptyWrap}>
          <View style={st.emptyArt}>
            <Icon name="mail" size={44} color={colors.textTertiary} sw={1.4} />
          </View>
          <Text style={st.emptyTitle}>
            {tab === 'device' ? 'No camera messages yet.' : 'No system messages yet.'}
          </Text>
          <Text style={st.emptySub}>
            When your camera detects an event, the notification will be displayed here.
          </Text>
        </View>
      ) : (
        groups.map((g, gi) => (
          <View key={gi}>
            {g.msgs.length > 0 && (
              <Row style={st.dayRow}>
                <Text style={st.dayNum}>{g.day}</Text>
                <Text style={st.dayMon}> {g.mon}</Text>
                <View style={{ flex: 1 }} />
                {gi === 0 && !edit && (
                  <Tap style={st.selBtn} onPress={() => setEdit(true)} hitSlop={8}>
                    <SvgXml xml={SELICON} width={18} height={18} color={colors.textSecondary} />
                  </Tap>
                )}

              </Row>
            )}
            {g.msgs.map((m) => {
              const on = checked.indexOf(m.id) >= 0;
              return (
                <Row key={m.id} style={{ marginLeft: edit ? 0 : 18, marginRight: edit ? 36 : 18, marginBottom: 16 }}>
                  <Tap
                    style={[st.card, { flex: 1 }]}
                    onPress={() => (edit ? toggleCheck(m.id) : navigation.navigate('notif-detail'))}
                  >
                    {tab === 'device' && (
                      <View style={st.devThumb}>
                        <Image source={{ uri: CAMAVATAR }} style={st.devImg} resizeMode="contain" />
                      </View>
                    )}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Row style={{ gap: 8 }}>
                        <Text style={st.msgTitle}>{m.title}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={st.msgTime}>{m.time}</Text>
                        {m.unread && <View style={st.unreadDot} />}
                      </Row>
                      <Text style={st.msgBody} numberOfLines={2}>{m.body}</Text>
                    </View>
                    {edit && (
                      <Tap
                        style={[st.selOverlay, on && { backgroundColor: colors.brand, borderWidth: 0 }]}
                        onPress={() => toggleCheck(m.id)}
                        hitSlop={6}
                      >
                        {on && <Icon name="check" size={12} color="#fff" sw={3} />}
                      </Tap>
                    )}
                  </Tap>
                </Row>
              );
            })}
          </View>
        ))
      )}

      {/* 编辑态:删除选中(有勾选时出现) */}
      {edit && checked.length > 0 && (
        <Tap style={st.delSelBtn} onPress={() => setConfirm('sel')}>
          <Text style={st.delSelTxt}>Delete ({checked.length})</Text>
        </Tap>
      )}

      {/* 删除确认弹窗(设计稿两种文案) */}
      <Modal transparent visible={confirm !== null} animationType="fade" onRequestClose={() => setConfirm(null)}>
        <Pressable style={st.ovl} onPress={() => setConfirm(null)}>
          <Pressable style={st.dialog} onPress={(e) => e.stopPropagation()}>
            <Text style={st.dialogTxt}>
              {confirm === 'all'
                ? 'Are you sure you want to delete all notification?'
                : 'Are you sure you want to delete the notification?'}
            </Text>
            <View style={st.dialogBtns}>
              <Tap style={st.dialogBtn} onPress={() => setConfirm(null)}>
                <Text style={st.dialogCancel}>Cancel</Text>
              </Tap>
              <View style={st.dialogDivV} />
              <Tap style={st.dialogBtn} onPress={doDelete}>
                <Text style={st.dialogDelete}>Delete</Text>
              </Tap>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  nav: { paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  iconbtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.bgSecondary, alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  doneTxt: { fontSize: 15, fontWeight: '700', color: colors.brand, textAlign: 'right' },

  tabRow: { paddingHorizontal: 18, marginTop: 8, gap: 8 },
  tabPill: { paddingHorizontal: 16, height: 32, borderRadius: 16, backgroundColor: colors.bgSecondary, alignItems: 'center', justifyContent: 'center' },
  tabPillOn: { backgroundColor: colors.textPrimary },
  tabTxt: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tabTxtOn: { color: '#fff' },
  tabDot: { position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.critical },
  delAllRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  delAllTxt: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },

  dayRow: { paddingHorizontal: 18, marginTop: 8, marginBottom: 16, alignItems: 'baseline' },
  dayNum: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4, color: colors.textPrimary },
  dayMon: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  selBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bgSecondary,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
  },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 16, padding: 12,
  },
  devThumb: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.bgSecondary,
    alignItems: 'center', justifyContent: 'center', padding: 7, flexShrink: 0,
  },
  devImg: { width: '100%', height: '100%' },
  msgTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  msgTime: { fontSize: 11, fontWeight: '500', color: colors.textTertiary },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.critical },
  msgBody: { marginTop: 4, fontSize: 12, fontWeight: '500', lineHeight: 17, color: colors.textSecondary },

  selCircle: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
    borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  selOverlay: {
    position: 'absolute', right: -29, top: '50%', marginTop: -11,
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
    borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center',
  },

  emptyWrap: { alignItems: 'center', paddingTop: 90, paddingHorizontal: 40 },
  emptyArt: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: colors.bgSecondary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 22,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  emptySub: { marginTop: 8, fontSize: 12, fontWeight: '500', lineHeight: 18, color: colors.textTertiary, textAlign: 'center' },

  delSelBtn: {
    marginHorizontal: 18, marginTop: 16, height: 48, borderRadius: 99,
    backgroundColor: colors.criticalSoft, alignItems: 'center', justifyContent: 'center',
  },
  delSelTxt: { fontSize: 15, fontWeight: '700', color: colors.critical },

  ovl: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center', padding: 36 },
  dialog: { width: '100%', maxWidth: 300, backgroundColor: colors.surface, borderRadius: 18, overflow: 'hidden' },
  dialogTxt: {
    paddingHorizontal: 22, paddingTop: 24, paddingBottom: 20,
    fontSize: 14, fontWeight: '600', lineHeight: 21, color: colors.textPrimary, textAlign: 'center',
  },
  dialogBtns: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  dialogBtn: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center' },
  dialogDivV: { width: 1, backgroundColor: colors.border },
  dialogCancel: { fontSize: 15, fontWeight: '500', color: colors.textSecondary },
  dialogDelete: { fontSize: 15, fontWeight: '700', color: colors.critical },
});

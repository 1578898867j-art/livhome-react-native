import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { SELICON } from '../icons/protoIcons';
import { CAMAVATAR, MAILBOX_EMPTY } from '../assets/images';
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
      { id: 11, title: 'Message Title', time: '17:40:20', body: 'Congratulations! Your registration was successful, Welcome abo.', unread: true },
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

  const allIds = groups.reduce<number[]>((acc, g) => acc.concat(g.msgs.map((m) => m.id)), []);
  const allChecked = allIds.length > 0 && allIds.every((id) => checked.indexOf(id) >= 0);
  const toggleAll = () => setChecked(allChecked ? [] : allIds);

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

  // 红点挂在"有未读且未选中"的 tab 胶囊右上角(设计稿两帧规则)
  const hasUnread = (gs: DayGroup[]) => gs.some((g) => g.msgs.some((m) => m.unread));

  return (
    <Screen contentStyle={{ paddingBottom: 40 }} bg={colors.bgSecondary}>
      {/* nav:返回 + 居中标题 + 编辑态 Done */}
      <Row style={st.nav}>
        <View style={{ width: 44 }}>
          <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
          </Tap>
        </View>
        <Text style={st.navTitle}>Notification Center</Text>
        {edit ? (
          <Tap onPress={exitEdit} hitSlop={8} style={{ width: 44, paddingRight: 6 }}>
            <Text style={st.doneTxt} numberOfLines={1}>Done</Text>
          </Tap>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </Row>

      {/* tabs + 编辑态 Delete All */}
      <Row style={st.tabRow}>
        <View>
          <Tap style={[st.tabPill, tab === 'device' && st.tabPillOn]} onPress={() => { setTab('device'); exitEdit(); }}>
            <Text style={[st.tabTxt, tab === 'device' && st.tabTxtOn]}>Device</Text>
          </Tap>
          {tab !== 'device' && hasUnread(deviceMsgs) && <View style={st.tabDot} />}
        </View>
        <View>
          <Tap style={[st.tabPill, tab === 'system' && st.tabPillOn]} onPress={() => { setTab('system'); exitEdit(); }}>
            <Text style={[st.tabTxt, tab === 'system' && st.tabTxtOn]}>System</Text>
          </Tap>
          {tab !== 'system' && hasUnread(systemMsgs) && <View style={st.tabDot} />}
        </View>
        <View style={{ flex: 1 }} />
        {edit && !empty && (
          <Row style={st.delAllRow}>
            <Tap onPress={() => setConfirm(checked.length > 0 ? 'sel' : 'all')} hitSlop={8}>
              <Text style={st.delAllTxt}>Delete All</Text>
            </Tap>
            <Tap
              style={[st.selCircle, allChecked && { backgroundColor: colors.brand, borderWidth: 0 }]}
              onPress={toggleAll}
              hitSlop={8}
            >
              {allChecked && <Icon name="check" size={12} color="#fff" sw={3} />}
            </Tap>
          </Row>
        )}
      </Row>

      {/* 空态(设计稿:邮筒插画 + No camera messages yet.) */}
      {empty ? (
        <View style={st.emptyWrap}>
          <Image source={{ uri: MAILBOX_EMPTY }} style={st.emptyArt} resizeMode="contain" />
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
                  <Tap style={st.selBtn} onPress={() => setEdit(true)} hitSlop={10}>
                    <SvgXml xml={SELICON} width={22} height={22} color={colors.textPrimary} />
                  </Tap>
                )}

              </Row>
            )}
            {g.msgs.map((m) => {
              const on = checked.indexOf(m.id) >= 0;
              return (
                // 编辑态:整卡向左平移 38(宽度/内容不重排,左缘出屏被裁),
                // 右侧露出 60 空档,圆圈落在屏右 22 边距、垂直居中 —— Figma 4527:581 实测
                <Row key={m.id} style={[st.cardRow, edit && { transform: [{ translateX: -38 }] }]}>
                  <Tap
                    style={[st.card, { flex: 1 }, tab === 'system' && { paddingLeft: 20 }]}
                    onPress={() => (edit ? toggleCheck(m.id) : navigation.navigate('notif-detail'))}
                  >
                    {tab === 'device' && (
                      <View style={st.devThumb}>
                        <Image source={{ uri: CAMAVATAR }} style={st.devImg} resizeMode="contain" />
                      </View>
                    )}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Row style={{ gap: 8 }}>
                        <Text style={st.msgTitle} numberOfLines={1}>{m.title}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={st.msgTime}>{m.time}</Text>
                      </Row>
                      <Text style={st.msgBody} numberOfLines={2}>{m.body}</Text>
                    </View>
                    {m.unread && !edit && <View style={st.unreadDot} />}
                  </Tap>
                  {edit && (
                    <Tap
                      style={[st.selOverlay, on && { backgroundColor: colors.brand, borderWidth: 0 }]}
                      onPress={() => toggleCheck(m.id)}
                      hitSlop={10}
                    >
                      {on && <Icon name="check" size={12} color="#fff" sw={3} />}
                    </Tap>
                  )}
                </Row>
              );
            })}
          </View>
        ))
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
  doneTxt: { fontSize: 16, fontWeight: '600', color: colors.brand, textAlign: 'right' },

  // ↓ 数值均为 Figma 4527:581 逐像素实测(430pt 画板,1:1)
  tabRow: { paddingHorizontal: 22, marginTop: 8, marginBottom: 12, gap: 24 },
  tabPill: { paddingHorizontal: 16, height: 38, borderRadius: 19, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  tabPillOn: { backgroundColor: colors.textPrimary },
  tabTxt: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTxtOn: { color: '#fff' },
  tabDot: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.critical },
  delAllRow: { gap: 12 },
  delAllTxt: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },

  dayRow: { paddingHorizontal: 22, marginTop: 8, marginBottom: 16, alignItems: 'baseline' },
  dayNum: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.textPrimary },
  dayMon: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  selBtn: { alignSelf: 'center' },

  cardRow: { marginHorizontal: 22, marginBottom: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 16,
    padding: 16, paddingRight: 20,
  },
  devThumb: {
    width: 72, height: 72, borderRadius: 16, backgroundColor: '#FAFAFA',
    alignItems: 'center', justifyContent: 'center', padding: 6, flexShrink: 0,
  },
  devImg: { width: '100%', height: '100%' },
  msgTitle: { fontSize: 17, fontWeight: '600', lineHeight: 20, color: colors.textPrimary, flexShrink: 1 },
  msgTime: { fontSize: 12, fontWeight: '500', color: colors.textTertiary },
  // 红点对齐正文第一行、右缩进 20(编辑态隐藏)
  unreadDot: { position: 'absolute', right: 20, top: 55, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.critical },
  msgBody: { marginTop: 12, fontSize: 14, fontWeight: '500', lineHeight: 20, color: colors.textSecondary },

  selCircle: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1.5,
    borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  // 圈挂在卡行右外侧 38 处;整行 translateX(-38) 后恰好落在屏右 22 边距
  selOverlay: {
    position: 'absolute', right: -38, top: '50%', marginTop: -12,
    width: 24, height: 24, borderRadius: 12, borderWidth: 1.5,
    borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center',
  },

  emptyWrap: { alignItems: 'center', paddingTop: 72, paddingHorizontal: 40 },
  emptyArt: { width: 237, height: 190, marginBottom: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  emptySub: { marginTop: 12, fontSize: 14, fontWeight: '500', lineHeight: 22, color: colors.textTertiary, textAlign: 'center' },

  ovl: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center', padding: 36 },
  dialog: { width: '100%', maxWidth: 350, backgroundColor: colors.surface, borderRadius: 18, overflow: 'hidden' },
  dialogTxt: {
    paddingHorizontal: 22, paddingTop: 21, paddingBottom: 19,
    fontSize: 15, fontWeight: '600', lineHeight: 22, color: colors.textPrimary, textAlign: 'center',
  },
  dialogBtns: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  dialogBtn: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center' },
  dialogDivV: { width: 1, backgroundColor: colors.border },
  dialogCancel: { fontSize: 15, fontWeight: '500', color: colors.textSecondary },
  dialogDelete: { fontSize: 15, fontWeight: '700', color: colors.critical },
});

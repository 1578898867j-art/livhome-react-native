import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { NT_MOTION, NT_CROSSING, NT_FENCE, NT_OFFLINE } from '../icons/notifIcons';
import { colors, shadow } from '../theme';

// 设备消息列表(点击消息中心的设备卡进入,相当于加上该设备筛选)
// Figma 4531:944「设备消息详情页面」:日期 + All Read、All/Cloud/SD Card 分段、
// 时间线事件卡(图标 48 tile + 连接线 + 状态 tag + 标题 + 预览图)。
type Src = 'cloud' | 'sd';
type Ev = {
  id: number;
  icon: string;
  tag: 'Info' | 'Critical';
  title: string;
  time: string;
  src: Src;
  unread?: boolean;
};

const EVENTS: Ev[] = [
  { id: 1, icon: NT_MOTION, tag: 'Info', title: 'Motion detected', time: '18:00', src: 'cloud', unread: true },
  { id: 2, icon: NT_CROSSING, tag: 'Critical', title: 'Line Crossing', time: '18:00', src: 'sd' },
  { id: 3, icon: NT_FENCE, tag: 'Info', title: 'Virtual Fence', time: '18:00', src: 'cloud' },
  { id: 4, icon: NT_OFFLINE, tag: 'Critical', title: 'Device Offline', time: '17:32', src: 'sd' },
];

const FILTERS = ['All', 'Cloud', 'SD Card'] as const;

export default function NotifDetail({ navigation }: AppScreenProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [readIds, setReadIds] = useState<number[]>([]);

  const list = EVENTS.filter(
    (e) => filter === 'All' || (filter === 'Cloud' ? e.src === 'cloud' : e.src === 'sd'),
  );

  return (
    <Screen bg={colors.bgSecondary} contentStyle={{ paddingBottom: 40 }}>
      {/* nav:返回 + 居中标题(行高固定 50) */}
      <Row style={st.nav}>
        <View style={st.navSlot}>
          <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
          </Tap>
        </View>
        <Text style={st.navTitle} numberOfLines={1}>Notification Details</Text>
        <View style={st.navSlot} />
      </Row>

      {/* 日期 + All Read */}
      <Row style={st.dayRow}>
        <Text style={st.dayNum}>24</Text>
        <Text style={st.dayMon}> Jan</Text>
        <View style={{ flex: 1 }} />
        <Tap style={st.allReadPill} onPress={() => setReadIds(EVENTS.map((e) => e.id))}>
          <View style={st.allReadCheck}>
            <Icon name="check" size={10} color={colors.textTertiary} sw={2.4} />
          </View>
          <Text style={st.allReadTxt}>All Read</Text>
        </Tap>
      </Row>

      {/* All / Cloud / SD Card 分段筛选 */}
      <View style={st.segWrap}>
        {FILTERS.map((f) => (
          <Tap
            key={f}
            style={[st.segBtn, filter === f && st.segBtnOn]}
            onPress={() => setFilter(f)}
          >
            <Text style={[st.segTxt, filter === f && st.segTxtOn]}>{f}</Text>
          </Tap>
        ))}
      </View>

      {/* 时间线事件卡 */}
      <View style={st.eventCard}>
        {list.map((e, i) => {
          const unread = e.unread && readIds.indexOf(e.id) < 0;
          return (
            <Row key={e.id} style={[st.event, i === list.length - 1 && { marginBottom: 0 }]}>
              {/* 连接线挂在整行上:图标下 12 起,到下一个图标上方 12 止 */}
              {i < list.length - 1 && <View style={st.connector} />}
              <View style={{ width: 48 }}>
                <SvgXml xml={e.icon} width={48} height={48} />
              </View>

              {/* 事件内容 */}
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Row>
                  <View style={[st.tag, e.tag === 'Critical' ? st.tagCritical : st.tagInfo]}>
                    <View style={[st.tagDot, { backgroundColor: e.tag === 'Critical' ? colors.warning : colors.success }]} />
                    <Text style={[st.tagTxt, { color: e.tag === 'Critical' ? colors.warning : colors.success }]}>
                      {e.tag}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <Text style={st.evTime}>{e.time}</Text>
                </Row>
                {unread && <View style={st.unreadDot} />}
                <Text style={st.evTitle} numberOfLines={1}>{e.title}</Text>
                <Tap style={st.preview} onPress={() => navigation.navigate('notif-image')}>
                  <CamPreview box={false} style={{ width: '100%', height: '100%' }} />
                </Tap>
              </View>
            </Row>
          );
        })}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  nav: { paddingHorizontal: 16, height: 50, gap: 10 },
  navSlot: { width: 60, height: '100%', justifyContent: 'center' },
  iconbtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.bgSecondary, alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.textPrimary },

  dayRow: { paddingHorizontal: 20, marginTop: 12, height: 32 },
  dayNum: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.textPrimary },
  dayMon: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  allReadPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    height: 32, paddingHorizontal: 10, borderRadius: 16,
    backgroundColor: colors.surface,
  },
  allReadCheck: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.textTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  allReadTxt: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },

  segWrap: {
    marginHorizontal: 20, marginTop: 16, height: 42, borderRadius: 21,
    backgroundColor: '#F9F9FA', flexDirection: 'row', padding: 4,
  },
  segBtn: { flex: 1, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  segBtnOn: { backgroundColor: colors.surface, ...shadow.sm },
  segTxt: { fontSize: 15, fontWeight: '500', color: colors.textTertiary },
  segTxtOn: { color: colors.textPrimary, fontWeight: '600' },

  eventCard: {
    marginHorizontal: 20, marginTop: 16, borderRadius: 20,
    backgroundColor: colors.surface, padding: 12, paddingTop: 12, paddingBottom: 16,
  },
  event: { alignItems: 'flex-start', marginBottom: 38 },
  // 连接线(挂在事件行上):图标底(48)+12 起,越过 38 行距、止于下一图标上方 12
  connector: {
    position: 'absolute', left: 23, top: 60, bottom: -26, width: 2,
    borderRadius: 1, backgroundColor: colors.border,
  },

  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    height: 24, paddingHorizontal: 10, borderRadius: 12, marginTop: -2,
  },
  tagInfo: { backgroundColor: colors.successSoft },
  tagCritical: { backgroundColor: colors.warningSoft },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagTxt: { fontSize: 13, fontWeight: '600' },
  evTime: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },
  unreadDot: {
    position: 'absolute', right: 0, top: 24,
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.critical,
  },
  evTitle: { marginTop: 8, fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  preview: {
    marginTop: 6, height: 168, borderRadius: 12, overflow: 'hidden',
    backgroundColor: colors.bgSecondary,
  },
});

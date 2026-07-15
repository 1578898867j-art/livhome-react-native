import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { useDemoFlags, getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';
import { NT_MOTION, NT_CROSSING } from '../icons/notifIcons';
import { colors, shadow } from '../theme';

// 设备消息(DevHome Alerts 进入)—— 样式与消息中心的设备消息详情页(NotifDetail)完全一致:
// 灰底、白事件卡、48 图标 tile + 连接线、Info/Critical tag、右侧时间、未读点、深色预览图。
type Src = 'cloud' | 'sd';
type Ev = {
  id: number;
  icon?: string; // NT_ 系列 tile;无则用 glyph 合成灰底 tile
  glyph?: string;
  tag: 'Info' | 'Critical';
  title: string;
  time: string;
  src: Src;
  unread?: boolean;
  preview?: boolean;
};

const EVENTS: Ev[] = [
  { id: 1, icon: NT_MOTION, tag: 'Info', title: 'Motion Detected', time: '14:22:08', src: 'cloud', preview: true },
  { id: 2, icon: NT_CROSSING, tag: 'Critical', title: 'Person left the zone', time: '12:08:41', src: 'sd', unread: true, preview: true },
  { id: 3, glyph: 'volume', tag: 'Info', title: 'Sound Detected', time: '09:41:02', src: 'cloud' },
];

const FILTERS = ['All', 'Cloud', 'SD Card'] as const;

export default function DevMessages({ navigation }: AppScreenProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [readIds, setReadIds] = useState<number[]>([]);
  // 事件图片加载失败占位(failLoad 演示)
  const { failLoad } = useDemoFlags();

  const list = EVENTS.filter(
    (e) => filter === 'All' || (filter === 'Cloud' ? e.src === 'cloud' : e.src === 'sd'),
  );

  return (
    <Screen
      bg={colors.bgSecondary}
      contentStyle={{ paddingBottom: 40 }}
      header={
        <Row style={st.nav}>
          <View style={st.navSlot}>
            <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
              <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
            </Tap>
          </View>
          <Text style={st.navTitle} numberOfLines={1}>Notification Details</Text>
          <View style={st.navSlot} />
        </Row>
      }
    >
      {/* 日期 + All Read */}
      <Row style={st.dayRow}>
        <Text style={st.dayNum}>23</Text>
        <Text style={st.dayMon}> Apr</Text>
        <View style={{ flex: 1 }} />
        <Tap
          style={st.allReadPill}
          onPress={() => {
            // 全部已读失败演示:错误提示,不改状态
            if (getDemoFlags().failOps) {
              showToast('Failed to mark all as read.', 'error');
              return;
            }
            setReadIds(EVENTS.map((e) => e.id));
          }}
        >
          <View style={st.allReadCheck}>
            <Icon name="check" size={10} color={colors.textTertiary} sw={2.4} />
          </View>
          <Text style={st.allReadTxt}>All Read</Text>
        </Tap>
      </Row>

      {/* All / Cloud / SD Card 分段筛选 */}
      <View style={st.segWrap}>
        {FILTERS.map((f) => (
          <Tap key={f} style={[st.segBtn, filter === f && st.segBtnOn]} onPress={() => setFilter(f)}>
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
              {i < list.length - 1 && <View style={st.connector} />}
              <View style={{ width: 48 }}>
                {e.icon ? (
                  <SvgXml xml={e.icon} width={48} height={48} />
                ) : (
                  <View style={st.glyphTile}>
                    <Icon name={e.glyph!} size={24} color="#191B1F" sw={1.8} />
                  </View>
                )}
              </View>

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
                {e.preview &&
                  (failLoad ? (
                    <View style={[st.preview, st.previewFail]}>
                      <Icon name="photo" size={22} color={colors.textTertiary} sw={1.6} />
                      <Text style={st.previewFailTxt}>Failed to load</Text>
                    </View>
                  ) : (
                    <Tap style={st.preview} onPress={() => navigation.navigate('notif-image')}>
                      <CamPreview box={false} style={{ width: '100%', height: '100%' }} />
                    </Tap>
                  ))}
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
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
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
  connector: {
    position: 'absolute', left: 23, top: 48, bottom: -26, width: 2,
    borderRadius: 1, backgroundColor: colors.border,
  },
  glyphTile: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: '#F2F2F2',
    alignItems: 'center', justifyContent: 'center',
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
  previewFail: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  previewFailTxt: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
});

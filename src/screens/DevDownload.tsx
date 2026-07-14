import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { CLIPGRIP, CALICON } from '../icons/protoIcons';
import { colors } from '../theme';

// 剪辑保存页 —— Figma KGbQ…/1125:1525「相册页面」1:1 复刻。
// 图标为用户提供的 Huge-icon 素材,原样使用。

// Huge-icon/multimedia and audio/solid/speaker-disable
const SPEAKER_OFF =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.46967 3.46967C3.76256 3.17678 4.23732 3.17678 4.53022 3.46967L20.5302 19.4697C20.8231 19.7626 20.8231 20.2373 20.5302 20.5302C20.2373 20.8231 19.7626 20.8231 19.4697 20.5302L16.997 18.0576C16.9516 19.6672 15.102 20.5729 13.7997 19.5966L9.53315 16.3974C9.18718 16.1381 8.76626 15.9981 8.33393 15.998H5.99994C4.89537 15.998 3.99994 15.103 3.99994 13.999V10.0009C3.99998 8.89688 4.89539 8.0019 5.99994 8.0019H6.94135L3.46967 4.53022C3.17678 4.23732 3.17678 3.76256 3.46967 3.46967ZM13.7997 4.40326C15.1182 3.41491 16.9999 4.35558 16.9999 6.00287V13.9394L10.1787 7.11811L13.7997 4.40326Z" fill="#28303F"/></svg>';
// Editing (剪辑)
const EDITING =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.11111 20.0001C8.82933 20.0001 10.2222 18.6072 10.2222 16.8889C10.2222 15.1707 8.82933 13.7778 7.11111 13.7778C5.39289 13.7778 4 15.1707 4 16.8889C4 18.6072 5.39289 20.0001 7.11111 20.0001Z" fill="#28303F" stroke="#28303F" stroke-width="2"/><path d="M16.8889 20.0001C18.6072 20.0001 20.0001 18.6072 20.0001 16.8889C20.0001 15.1707 18.6072 13.7778 16.8889 13.7778C15.1707 13.7778 13.7778 15.1707 13.7778 16.8889C13.7778 18.6072 15.1707 20.0001 16.8889 20.0001Z" fill="#28303F" stroke="#28303F" stroke-width="2"/><path d="M4.88892 4L15.5556 13.7778" stroke="#28303F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.111 4L8.44434 13.7778" stroke="#28303F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// Huge-icon/multimedia and audio/solid/camera video
const CAMVIDEO =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4C14.2091 4 16 5.79086 16 8V16C16 18.2091 14.2091 20 12 20H6C3.79086 20 2 18.2091 2 16V8C2 5.79086 3.79086 4 6 4H12ZM18.541 7.68945C19.7811 6.36715 21.9999 7.24474 22 9.05762V14.9424C21.9999 16.7553 19.781 17.633 18.541 16.3105L17.5 15.2002V8.7998L18.541 7.68945Z" fill="#28303F"/></svg>';
// Extend (拓展)
const EXTEND =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.6667 4H5.33333C4.59695 4 4 4.59695 4 5.33333V18.6667C4 19.403 4.59695 20 5.33333 20H18.6667C19.403 20 20 19.403 20 18.6667V5.33333C20 4.59695 19.403 4 18.6667 4Z" fill="#28303F" stroke="#28303F" stroke-width="2"/><path d="M17.5 6H15.2071C14.7616 6 14.5385 6.53855 14.8535 6.85355L17.1464 9.14645C17.4614 9.46145 18 9.23835 18 8.7929V6.5C18 6.22385 17.7761 6 17.5 6Z" fill="white"/><path d="M6 6.5V8.7929C6 9.23835 6.53855 9.46145 6.85355 9.14645L9.14645 6.85355C9.46145 6.53855 9.23835 6 8.7929 6H6.5C6.22385 6 6 6.22385 6 6.5Z" fill="white"/><path d="M6.5 18H8.7929C9.23835 18 9.46145 17.4614 9.14645 17.1464L6.85355 14.8535C6.53855 14.5385 6 14.7616 6 15.2071V17.5C6 17.7761 6.22385 18 6.5 18Z" fill="white"/><path d="M18 17.5V15.2071C18 14.7616 17.4614 14.5385 17.1464 14.8535L14.8535 17.1464C14.5385 17.4614 14.7616 18 15.2071 18H17.5C17.7761 18 18 17.7761 18 17.5Z" fill="white"/></svg>';
// ⋮(设计稿 menu-circle-vertical)
const DOTS_V =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5.5" r="1.7" fill="#28303F"/><circle cx="12" cy="12" r="1.7" fill="#28303F"/><circle cx="12" cy="18.5" r="1.7" fill="#28303F"/></svg>';
// 播放器右下 expand(设计稿 zoom out 双向斜箭头)
const EXPAND =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M10.5 7.5L15.5 2.5M15.5 2.5H11.5M15.5 2.5V6.5M7.5 10.5L2.5 15.5M2.5 15.5H6.5M2.5 15.5V11.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// Return(设计稿 arrow-back-rectangle)
const RETURN_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3.1" y="3.1" width="17.8" height="17.8" rx="4.9" stroke="#28303F" stroke-width="1.8"/><path d="M14.2 8.4L10.6 12L14.2 15.6" stroke="#28303F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const TIME_LABELS: { t: string; x: number }[] = [
  { t: '17:37', x: 72 },
  { t: '17:38', x: 146 },
  { t: '17:39', x: 221 },
  { t: '17:40', x: 301 },
  { t: '17:41', x: 376 },
];

export default function DevDownload({ navigation }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const save = () => {
    setSaved(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  return (
    <Screen scroll={false} bg="#FAF8FC">
      {/* nav:返回 + 居中标题 + ⋮ */}
      <Row style={st.nav}>
        <View style={st.navSlot}>
          <Tap onPress={() => navigation.goBack()} hitSlop={10} style={st.navBtn}>
            <Icon name="chevL" size={18} color={colors.textPrimary} sw={2.2} />
          </Tap>
        </View>
        <Text style={st.navTitle} numberOfLines={1}>Home Camera</Text>
        <View style={[st.navSlot, { alignItems: 'flex-end' }]}>
          <Tap hitSlop={10} style={st.navBtn}>
            <SvgXml xml={DOTS_V} width={24} height={24} />
          </Tap>
        </View>
      </Row>

      {/* 播放器 + 白色控制条(一张圆角卡) */}
      <View style={st.playerCard}>
        <View style={st.video}>
          <Text style={st.stamp}>2025-11-15 02:23:52</Text>
          <View style={st.expand}>
            <SvgXml xml={EXPAND} width={18} height={18} />
          </View>
        </View>
        <Row style={st.ctrlBar}>
          <SvgXml xml={SPEAKER_OFF} width={24} height={24} />
          <SvgXml xml={EDITING} width={24} height={24} />
          <SvgXml xml={CAMVIDEO} width={24} height={24} />
          <SvgXml xml={EXTEND} width={24} height={24} />
        </Row>
      </View>

      {/* 日期行 */}
      <Row style={st.dateRow}>
        <SvgXml xml={CALICON} width={24} height={24} color={colors.textSecondary} />
        <Text style={st.dateTxt}>3月20日 | Today</Text>
      </Row>

      {/* 时间刻度 */}
      <View style={st.ticksRow}>
        {TIME_LABELS.map((l) => (
          <Text key={l.t} style={[st.tick, { left: l.x }]}>{l.t}</Text>
        ))}
      </View>

      {/* 剪辑时间轴:暗描边轨道(向右出血) + 白底选区 + 绿/红把手 */}
      <View style={st.timeline}>
        <View style={st.track} />
        <View style={st.selection}>
          <View style={[st.handle, { backgroundColor: '#2AE387' }]}>
            <SvgXml xml={CLIPGRIP} width={19} height={19} />
          </View>
          <View style={st.selMid} />
          <View style={[st.handle, { backgroundColor: '#FC414A' }]}>
            <SvgXml xml={CLIPGRIP} width={19} height={19} />
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      {/* 保存成功 toast(全局同款) */}
      {saved && (
        <View style={[st.toast, { bottom: 91 + insets.bottom + 16 }]} pointerEvents="none">
          <View style={st.toastCheck}>
            <Icon name="check" size={12} color="#fff" sw={3} />
          </View>
          <Text style={st.toastTxt}>Video saved to album</Text>
        </View>
      )}

      {/* 底部操作条 */}
      <View style={[st.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 6 }]}>
        <Tap style={st.bottomItem} onPress={save}>
          <Icon name="imageRect" size={22} color={colors.textPrimary} sw={1.8} />
          <Text style={st.bottomTxt}>Save to Album</Text>
        </Tap>
        <Tap style={st.bottomItem} onPress={() => navigation.goBack()}>
          <SvgXml xml={RETURN_ICON} width={24} height={24} />
          <Text style={st.bottomTxt}>Return</Text>
        </Tap>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  nav: { paddingHorizontal: 16, height: 50, gap: 10 },
  navSlot: { width: 44, height: '100%', justifyContent: 'center' },
  navBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: colors.textPrimary },

  playerCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 14, overflow: 'hidden' },
  video: { height: 206, backgroundColor: '#1E1A16' },
  stamp: {
    position: 'absolute', top: 12, right: 12,
    fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.85)',
    fontVariant: ['tabular-nums'],
  },
  expand: { position: 'absolute', right: 14, bottom: 12 },
  ctrlBar: { height: 60, backgroundColor: colors.surface, justifyContent: 'space-around' },

  dateRow: { marginTop: 32, marginHorizontal: 16, gap: 6 },
  dateTxt: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },

  ticksRow: { marginTop: 20, height: 16 },
  tick: { position: 'absolute', top: 0, fontSize: 11, fontWeight: '600', color: '#D5D6E0' },

  timeline: { marginTop: 12, height: 64 },
  // 轨道:2px 暗描边,右侧延伸出屏(左端藏在选区后)
  track: {
    position: 'absolute', left: 26, right: -24, top: 8, height: 48,
    borderWidth: 2, borderColor: '#6A7282', borderRadius: 10,
  },
  // 选区:白底圆角容器 + 阴影,内含把手与"透出轨道"的中段
  selection: {
    position: 'absolute', left: 19, top: 0, width: 282, height: 64,
    backgroundColor: colors.surface, borderRadius: 14, padding: 4,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  handle: { width: 45, height: 56, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  selMid: {
    flex: 1, height: 48, alignSelf: 'center',
    borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#6A7282',
  },

  toast: {
    position: 'absolute', alignSelf: 'center', zIndex: 90,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 36, paddingHorizontal: 12, borderRadius: 18, backgroundColor: colors.surface,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 22, shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  toastCheck: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#22A45D',
    alignItems: 'center', justifyContent: 'center',
  },
  toastTxt: { fontSize: 13, fontWeight: '500', color: colors.textTertiary },

  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: colors.surface, paddingTop: 12, paddingHorizontal: 47,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  bottomItem: { alignItems: 'center', gap: 2, minWidth: 88 },
  bottomTxt: { fontSize: 13, fontWeight: '500', color: colors.textPrimary },
});

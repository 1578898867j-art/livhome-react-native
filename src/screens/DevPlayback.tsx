import type { AppScreenProps } from '../navigation/types';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Modal, Pressable } from 'react-native';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { PHOTOICONS, PBTABICONS, FEICONS } from '../icons/protoSets';
import { CALICON, FILTERICON, CLIPGRIP } from '../icons/protoIcons';
import CalendarModal, { CAL_TODAY } from '../components/CalendarModal';
import { colors } from '../theme';

// ── Ported from the prototype's devPlayback() (SD PLAYBACK).
// Timeline segments (0..50 range → mapped to % of the 24h track).
type Seg = { s: number; e: number; t: 'reg' | 'evt'; ev?: string };
const PBSEGS: Seg[] = [
  { s: 0, e: 20, t: 'reg' },
  { s: 20, e: 24, t: 'evt', ev: 'motion' },
  { s: 24, e: 33, t: 'reg' },
  { s: 33, e: 37, t: 'evt', ev: 'sound' },
  { s: 37, e: 40, t: 'reg' },
  { s: 44, e: 50, t: 'reg' },
];
const PB_REG = 'rgba(35,130,255,0.22)';
const CLIP_RAIL = '#7C828C';
const TIME_LABELS = ['06:00', '06:10', '06:20', '06:30', '06:40', '06:50'];
const EVFILTER_COUNT = 4; // motion / sound / lineCross / geofence
// 原型 EVFILTERS + FEICONS 底部筛选面板
const EV_FILTERS = [
  { key: 'motion', label: 'Motion', icon: 'motion' },
  { key: 'sound', label: 'Sound', icon: 'sound' },
  { key: 'lineCross', label: 'Line Crossing', icon: 'lineCross' },
  { key: 'geofence', label: 'Geofence', icon: 'geofence' },
];
const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SCREEN_W = Dimensions.get('window').width;
const TL_MARGIN = 18; // 与视频卡 marginHorizontal 一致
const TL_W = SCREEN_W - TL_MARGIN * 2;
const PPM = 7.8; // 每分钟像素(10min ≈ 78px,对齐设计稿刻度密度)
const px = (v: number) => v * PPM;
const pad = (n: number) => (n < 10 ? '0' : '') + n;

// 连续时间域:自 2026-04-21 00:00 起的分钟数,可一直滑到 04-23 06:50(今天当前时段)
const DAY_MIN = 1440;
const T_MAX = 2 * DAY_MIN + 6 * 60 + 50;
const WIN = 90; // 渲染窗口半径(分钟)——只渲染可视区附近,支撑无限滑动
const fmtHM = (m: number) => `${pad(Math.floor((m % DAY_MIN) / 60))}:${pad(Math.floor(m) % 60)}`;

export default function DevPlayback({ navigation }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  // playhead position + active recording-event filters (mirrors S.pbHead / S.pbEvents)
  const [pbHead, setPbHead] = useState(2 * DAY_MIN + 6 * 60 + 23); // 04-23 06:23
  const [pbEvents, setPbEvents] = useState<string[]>(['motion', 'sound']);
  // date (mirrors S.pbM/pbD; TODAY = 2026-04-23) + overlays
  const [pbM, setPbM] = useState(3);
  const [pbD, setPbD] = useState(23);
  const [calOpen, setCalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const toggleEvt = (k: string) =>
    setPbEvents((ev) => (ev.indexOf(k) >= 0 ? ev.filter((v) => v !== k) : ev.concat(k)));
  const toggleAllEvt = () =>
    setPbEvents((ev) => (ev.length === EV_FILTERS.length ? [] : EV_FILTERS.map((e) => e.key)));
  const [ctlSpk, setCtlSpk] = useState(false);
  const [ctlMic, setCtlMic] = useState(false);
  const [ctlRec, setCtlRec] = useState(false);
  const [ctlSnap, setCtlSnap] = useState(false);

  // clip (trim) mode — mirrors S.pbClip / S.pbClipS / S.pbClipE
  const [clipMode, setClipMode] = useState(false);
  const [clipS, setClipS] = useState(15);
  const [clipE, setClipE] = useState(31);

  const headDay = Math.floor(pbHead / DAY_MIN); // 0=Apr21 1=Apr22 2=Apr23
  const tm = pbHead % DAY_MIN;
  const ss = Math.round((pbHead - Math.floor(pbHead)) * 60);
  const stamp = `2026-04-${pad(21 + headDay)} ${pad(Math.floor(tm / 60))}:${pad(Math.floor(tm % 60))}:${pad(ss)}`;

  const evtOn = (sg: Seg) => sg.t === 'evt' && !!sg.ev && pbEvents.indexOf(sg.ev) >= 0;
  const filterActive = pbEvents.length < EVFILTER_COUNT;

  // playhead on a recorded segment? (pbSegAt) — 录像段按小时平铺
  const tm60 = pbHead % 60;
  const segAt = PBSEGS.find((sg) => tm60 >= sg.s && tm60 < sg.e) || null;

  const enterClip = () => {
    setClipS(Math.max(0, pbHead - 8));
    setClipE(Math.min(T_MAX, pbHead + 8));
    setClipMode(true);
  };

  // ── NVR 式拖动:固定中线,滑动时间轴条带本体(左拖 = 时间前进)
  const pbHeadRef = useRef(pbHead);
  pbHeadRef.current = pbHead;
  const dragStart = useRef(0);
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStart.current = pbHeadRef.current;
      },
      onPanResponderMove: (_e, g) => {
        const v = Math.max(0, Math.min(T_MAX, dragStart.current - g.dx / PPM));
        setPbHead(Math.round(v * 10) / 10);
      },
    })
  ).current;

  const ctl = (name: string, on: boolean, toggle: () => void) => {
    const glyph = on ? (name === 'speaker' ? 'speakerSolid' : name === 'mic' ? 'micSolid' : name) : name;
    return (
      <Tap style={st.ctlBtn} onPress={toggle}>
        <SvgXml xml={PHOTOICONS[glyph]} width={18} height={18} color={on ? colors.brand : colors.textPrimary} />
      </Tap>
    );
  };

  return (
    <Screen scroll={false} edges={[]}>
      {/* nav row */}
      <Row style={[st.nav, { marginTop: insets.top }]}>
        <Tap style={st.navIcon} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
        </Tap>
        <Text style={st.navTitle}>Home Monitoring</Text>
        <Tap style={st.navIcon} onPress={() => navigation.navigate('dev-settings')} hitSlop={8}>
          <Icon name="gear" size={18} color={colors.textPrimary} />
        </Tap>
      </Row>

      {/* video + control cluster */}
      <View style={st.videoWrap}>
        <View style={st.video}>
          {segAt ? (
            <>
              {/* prototype dark gradient: linear-gradient(180deg,#2A2520,#15110d) */}
              <LinearGradient colors={['#2A2520', '#15110D'] as const} style={StyleSheet.absoluteFill} />
              <Text style={st.stamp}>{stamp}</Text>
              <Text style={st.quality}>1080P</Text>
              <View style={st.scanBtn}>
                <Icon name="scan" size={16} color="#fff" sw={2} />
              </View>
            </>
          ) : (
            <View style={st.noRecWrap}>
              <Text style={st.noRecTxt}>No recordings in this time period</Text>
            </View>
          )}
        </View>
        <Row style={st.ctlRow}>
          {ctl('speaker', ctlSpk, () => setCtlSpk((v) => !v))}
          {ctl('mic', ctlMic, () => setCtlMic((v) => !v))}
          {ctl('record', ctlRec, () => setCtlRec((v) => !v))}
          {ctl('camera', ctlSnap, () => setCtlSnap((v) => !v))}
        </Row>
      </View>

      {/* date + filter row */}
      <Row style={st.dateRow}>
        <Tap style={st.dateTap} onPress={() => setCalOpen(true)}>
          <SvgXml xml={CALICON} width={19} height={19} color={colors.textSecondary} />
          {/* 日期 + 当前时刻:跟随时间轴拖动实时变化 */}
          <Text style={st.dateText}>
            Apr {21 + headDay}
            <Text style={st.dateTime}> {pad(Math.floor(tm / 60))}:{pad(Math.floor(tm % 60))}</Text>
          </Text>
          {headDay === 2 && <Text style={st.todayText}>| Today</Text>}
        </Tap>
        <View style={{ flex: 1 }} />
        {!clipMode && (
          <Tap style={st.filterTap} onPress={() => setFilterOpen(true)}>
            <SvgXml
              xml={FILTERICON}
              width={18}
              height={18}
              color={filterActive ? colors.brand : colors.textSecondary}
            />
            <Text
              style={[st.filterText, { color: filterActive ? colors.brand : colors.textSecondary }]}
            >
              Recording Filter
            </Text>
          </Tap>
        )}
      </Row>

      {/* 连续时间轴 — 拖动条带本体、固定中线读值;窗口化渲染支持跨天滑动,两侧渐隐蒙版 */}
      {(() => {
        const winStart = Math.floor((pbHead - WIN) / 10) * 10;
        const winEnd = winStart + WIN * 2 + 20;
        const ticks: number[] = [];
        for (let m = Math.max(0, Math.ceil(winStart / 10) * 10); m <= Math.min(winEnd, T_MAX); m += 10) {
          ticks.push(m);
        }
        const trackS = Math.max(winStart, 0);
        const trackE = Math.min(winEnd, T_MAX);
        const tiles: { s: number; e: number; evt: boolean }[] = [];
        for (let h = Math.max(0, Math.floor(winStart / 60)); h <= Math.floor(winEnd / 60); h++) {
          for (const sg of PBSEGS) {
            const ts = h * 60 + sg.s;
            const te = Math.min(h * 60 + sg.e, T_MAX);
            if (te < winStart || ts > winEnd || ts >= T_MAX) continue;
            tiles.push({ s: ts, e: te, evt: evtOn(sg) });
          }
        }
        return (
          <View style={st.timelineWrap} {...(clipMode ? {} : pan.panHandlers)}>
            <View
              pointerEvents="none"
              style={[
                st.strip,
                {
                  width: px(winEnd - winStart),
                  transform: [{ translateX: TL_W / 2 - px(pbHead - winStart) }],
                },
              ]}
            >
              {ticks.map((m) => (
                <Text key={m} style={[st.label, { left: px(m - winStart) - 22 }]}>{fmtHM(m)}</Text>
              ))}
              <View
                style={[
                  st.stripTrack,
                  { left: px(trackS - winStart), width: px(trackE - trackS) },
                ]}
              >
                {clipMode ? (
                  <>
                    {/* trim bar: rails + kept span + green start / red end handles */}
                    <View style={st.clipRail} pointerEvents="none" />
                    <View
                      style={[st.clipSpan, { left: px(clipS - trackS), width: px(clipE - clipS) }]}
                      pointerEvents="none"
                    />
                    <View style={[st.clipHandle, { left: px(clipS - trackS), backgroundColor: '#22C55E' }]}>
                      <SvgXml xml={CLIPGRIP} width={17} height={17} />
                    </View>
                    <View style={[st.clipHandle, { left: px(clipE - trackS), backgroundColor: '#EF4444' }]}>
                      <SvgXml xml={CLIPGRIP} width={17} height={17} />
                    </View>
                  </>
                ) : (
                  tiles.map((t, i) => (
                    <View
                      key={i}
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: px(t.s - trackS),
                        width: px(t.e - t.s),
                        backgroundColor: t.evt ? colors.brand : PB_REG,
                      }}
                    />
                  ))
                )}
              </View>
            </View>
            {!clipMode && <View pointerEvents="none" style={st.centerHead} />}
          </View>
        );
      })()}

      {/* legend (hidden while trimming) */}
      {!clipMode && (
        <View style={st.legend}>
          <Row style={st.legendRow}>
            <View style={[st.swatch, { backgroundColor: PB_REG }]} />
            <Text style={st.legendText}>Regular Recording</Text>
          </Row>
          <Row style={st.legendRow}>
            <View style={[st.swatch, { backgroundColor: colors.brand }]} />
            <Text style={st.legendText}>Event Recording</Text>
          </Row>
        </View>
      )}

      <View style={{ flex: 1 }} />

      {/* bottom action bar — Album / Clip / Return (clip mode: Save to Album / Return) */}
      {clipMode ? (
        <Row style={[st.bottomBar, { paddingHorizontal: 64 }]}>
          <Tap style={st.barItem} onPress={() => navigation.navigate('dev-download')}>
            <SvgXml xml={PBTABICONS.album} width={21} height={21} color={colors.textSecondary} />
            <Text style={st.barLabel}>Save to Album</Text>
          </Tap>
          <Tap style={st.barItem} onPress={() => setClipMode(false)}>
            <SvgXml xml={PBTABICONS.return} width={21} height={21} color={colors.textSecondary} />
            <Text style={st.barLabel}>Return</Text>
          </Tap>
        </Row>
      ) : (
        <Row style={st.bottomBar}>
          <Tap style={st.barItem} onPress={() => navigation.navigate('album')}>
            <SvgXml xml={PBTABICONS.album} width={21} height={21} color={colors.textSecondary} />
            <Text style={st.barLabel}>Album</Text>
          </Tap>
          <Tap
            style={[st.barItem, !segAt && { opacity: 0.5 }]}
            onPress={segAt ? enterClip : undefined}
          >
            <SvgXml
              xml={PBTABICONS.clip}
              width={21}
              height={21}
              color={segAt ? colors.textSecondary : colors.textTertiary}
            />
            <Text style={[st.barLabel, !segAt && { color: colors.textTertiary }]}>Clip</Text>
          </Tap>
          <Tap style={st.barItem} onPress={() => navigation.goBack()}>
            <SvgXml xml={PBTABICONS.return} width={21} height={21} color={colors.textSecondary} />
            <Text style={st.barLabel}>Return</Text>
          </Tap>
        </Row>
      )}

            {/* 顶部渐变淡出蒙版(全局统一) */}
      <LinearGradient
        colors={[colors.bgPrimary, 'rgba(251,251,251,0.3)', 'rgba(251,251,251,0)']}
        locations={[0, 0.45, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 26, zIndex: 20 }}
        pointerEvents="none"
      />

{/* 日历选择(原型 pb-cal-open → msg-cal) */}
      <CalendarModal
        visible={calOpen}
        initM={pbM}
        initD={pbD}
        onClose={() => setCalOpen(false)}
        onConfirm={(m, d) => {
          setPbM(m);
          setPbD(d);
          setCalOpen(false);
        }}
      />

      {/* 事件筛选底部面板(原型 pb-filter) */}
      <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={st.sheetOvl} onPress={() => setFilterOpen(false)}>
          <Pressable style={st.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={st.grabber} />
            <Row style={{ paddingHorizontal: 22, paddingTop: 10, paddingBottom: 6 }}>
              <Text style={{ flex: 1, fontSize: 17, fontWeight: '800', color: colors.textPrimary }}>
                Filter Events
              </Text>
              <Tap
                onPress={() => {
                  setFilterOpen(false);
                  navigation.navigate('storage-settings');
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.brand }}>Storage Settings</Text>
              </Tap>
            </Row>
            <Tap style={st.feRow} onPress={toggleAllEvt}>
              <View style={st.feIcon}>
                <SvgXml xml={FEICONS.allMotion} width={18} height={18} color={colors.textSecondary} />
              </View>
              <Text style={st.feLabel}>All Motion</Text>
              {pbEvents.length === EV_FILTERS.length && <Icon name="check" size={18} color={colors.brand} sw={2.4} />}
            </Tap>
            {EV_FILTERS.map((e) => (
              <View key={e.key}>
                <View style={st.feDivider} />
                <Tap style={st.feRow} onPress={() => toggleEvt(e.key)}>
                  <View style={st.feIcon}>
                    <SvgXml xml={FEICONS[e.icon]} width={18} height={18} color={colors.textSecondary} />
                  </View>
                  <Text style={st.feLabel}>{e.label}</Text>
                  {pbEvents.indexOf(e.key) >= 0 && <Icon name="check" size={18} color={colors.brand} sw={2.4} />}
                </Tap>
              </View>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  sheetOvl: { flex: 1, backgroundColor: 'rgba(0,0,0,.4)', justifyContent: 'flex-end' },
  sheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: 40,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginTop: 9,
    marginBottom: 3,
  },
  feRow: { flexDirection: 'row', alignItems: 'center', height: 54, paddingHorizontal: 22, gap: 13 },
  feIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  feDivider: { height: 1, backgroundColor: colors.border, marginLeft: 69 },
  nav: { paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  navIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  navTitle: { flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center', color: colors.textPrimary },

  videoWrap: { marginHorizontal: 18, marginTop: 6, borderRadius: 18, overflow: 'hidden' },
  video: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#1E1A16' },
  noRecWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2E2E30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRecTxt: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '500' },
  stamp: {
    position: 'absolute',
    top: 10,
    right: 12,
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  quality: {
    position: 'absolute',
    bottom: 11,
    right: 42,
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  scanBtn: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctlRow: { gap: 8, padding: 12, backgroundColor: colors.surface },
  ctlBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },

  dateRow: { paddingHorizontal: 18, paddingTop: 20 },
  dateTap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  dateTime: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, fontVariant: ['tabular-nums'] },
  todayText: { fontSize: 16, fontWeight: '500', color: colors.textTertiary },
  filterTap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  filterText: { fontSize: 14, fontWeight: '500' },

  timelineWrap: { marginHorizontal: TL_MARGIN, marginTop: 18, height: 106, overflow: 'hidden' },
  strip: { position: 'absolute', top: 0, left: 0, height: 106 },
  label: {
    position: 'absolute', top: 0, width: 44, textAlign: 'center',
    fontSize: 12, fontWeight: '500', color: colors.textTertiary,
  },
  stripTrack: {
    position: 'absolute', top: 26, left: 0, right: 0, height: 80,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  // 固定中线(读值指针)
  centerHead: {
    position: 'absolute', left: TL_W / 2 - 1.5, top: 26, height: 80, width: 3,
    borderRadius: 2, backgroundColor: colors.brand,
  },

  // clip trim bar
  clipRail: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 26,
    height: 28,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: CLIP_RAIL,
  },
  clipSpan: {
    position: 'absolute',
    top: 26,
    height: 28,
    backgroundColor: colors.surface,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: CLIP_RAIL,
    zIndex: 2,
  },
  clipHandle: {
    position: 'absolute',
    top: 14,
    height: 52,
    width: 38,
    marginLeft: -19,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    borderWidth: 3,
    borderColor: colors.surface,
  },

  legend: { paddingHorizontal: 18, paddingTop: 18, gap: 12 },
  legendRow: { gap: 10 },
  swatch: { width: 16, height: 16, borderRadius: 3 },
  legendText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },

  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 26,
  },
  barItem: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 6 },
  barLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
});

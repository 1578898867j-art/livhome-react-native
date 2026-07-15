import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
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
// 浏览态 1.3px/min(1 小时一格 ≈ 78px,滑动一屏约 5.5 小时);剪辑态放大到 7.8 保证把手可操作
const PPM_BROWSE = 1.3;
const PPM_CLIP = 7.8;
const pad = (n: number) => (n < 10 ? '0' : '') + n;

// 控制条图标 —— Figma 1125:1525(用户素材原样)
const CTRL_SPEAKER_OFF =
  '<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.46967 3.46967C3.76256 3.17678 4.23732 3.17678 4.53022 3.46967L20.5302 19.4697C20.8231 19.7626 20.8231 20.2373 20.5302 20.5302C20.2373 20.8231 19.7626 20.8231 19.4697 20.5302L16.997 18.0576C16.9516 19.6672 15.102 20.5729 13.7997 19.5966L9.53315 16.3974C9.18718 16.1381 8.76626 15.9981 8.33393 15.998H5.99994C4.89537 15.998 3.99994 15.103 3.99994 13.999V10.0009C3.99998 8.89688 4.89539 8.0019 5.99994 8.0019H6.94135L3.46967 4.53022C3.17678 4.23732 3.17678 3.76256 3.46967 3.46967ZM13.7997 4.40326C15.1182 3.41491 16.9999 4.35558 16.9999 6.00287V13.9394L10.1787 7.11811L13.7997 4.40326Z" fill="currentColor"/></svg>';
const CTRL_EDITING =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M7.11111 20.0001C8.82933 20.0001 10.2222 18.6072 10.2222 16.8889C10.2222 15.1707 8.82933 13.7778 7.11111 13.7778C5.39289 13.7778 4 15.1707 4 16.8889C4 18.6072 5.39289 20.0001 7.11111 20.0001Z" fill="currentColor" stroke="currentColor" stroke-width="2"/><path d="M16.8889 20.0001C18.6072 20.0001 20.0001 18.6072 20.0001 16.8889C20.0001 15.1707 18.6072 13.7778 16.8889 13.7778C15.1707 13.7778 13.7778 15.1707 13.7778 16.8889C13.7778 18.6072 15.1707 20.0001 16.8889 20.0001Z" fill="currentColor" stroke="currentColor" stroke-width="2"/><path d="M4.88892 4L15.5556 13.7778" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.111 4L8.44434 13.7778" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CTRL_CAMVIDEO =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4C14.2091 4 16 5.79086 16 8V16C16 18.2091 14.2091 20 12 20H6C3.79086 20 2 18.2091 2 16V8C2 5.79086 3.79086 4 6 4H12ZM18.541 7.68945C19.7811 6.36715 21.9999 7.24474 22 9.05762V14.9424C21.9999 16.7553 19.781 17.633 18.541 16.3105L17.5 15.2002V8.7998L18.541 7.68945Z" fill="currentColor"/></svg>';
const CTRL_EXTEND =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M18.6667 4H5.33333C4.59695 4 4 4.59695 4 5.33333V18.6667C4 19.403 4.59695 20 5.33333 20H18.6667C19.403 20 20 19.403 20 18.6667V5.33333C20 4.59695 19.403 4 18.6667 4Z" fill="currentColor" stroke="currentColor" stroke-width="2"/><path d="M17.5 6H15.2071C14.7616 6 14.5385 6.53855 14.8535 6.85355L17.1464 9.14645C17.4614 9.46145 18 9.23835 18 8.7929V6.5C18 6.22385 17.7761 6 17.5 6Z" fill="white"/><path d="M6 6.5V8.7929C6 9.23835 6.53855 9.46145 6.85355 9.14645L9.14645 6.85355C9.46145 6.53855 9.23835 6 8.7929 6H6.5C6.22385 6 6 6.22385 6 6.5Z" fill="white"/><path d="M6.5 18H8.7929C9.23835 18 9.46145 17.4614 9.14645 17.1464L6.85355 14.8535C6.53855 14.5385 6 14.7616 6 15.2071V17.5C6 17.7761 6.22385 18 6.5 18Z" fill="white"/><path d="M18 17.5V15.2071C18 14.7616 17.4614 14.5385 17.1464 14.8535L14.8535 17.1464C14.5385 17.4614 14.7616 18 15.2071 18H17.5C17.7761 18 18 17.7761 18 17.5Z" fill="white"/></svg>';

// Full-screen(全局放大)—— 与设备详情页同款用户素材
const FULLSCREEN_ICON =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M16.5 3H19.5C20.3284 3 21 3.67157 21 4.5V7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 16.5V19.5C21 20.3284 20.3284 21 19.5 21H16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 21H4.5C3.67157 21 3 20.3284 3 19.5V16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7.5V4.5C3 3.67157 3.67157 3 4.5 3H7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// 时间域:单天。今天(2026-04-23)只到 06:50 当前时段;过去日期为完整 24h
const DAY_MIN = 1440;
const TODAY_MAX = 6 * 60 + 50;
const WIN = 360; // 渲染窗口半径(分钟)——只渲染可视区附近,支撑无限滑动
const fmtHM = (m: number) => `${pad(Math.floor((m % DAY_MIN) / 60))}:${pad(Math.floor(m) % 60)}`;

export default function DevPlayback({ navigation }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  // playhead position + active recording-event filters (mirrors S.pbHead / S.pbEvents)
  const [pbHead, setPbHead] = useState(6 * 60 + 23); // 06:23
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
  const [fsOpen, setFsOpen] = useState(false);
  const [clipS, setClipS] = useState(15);
  const [clipE, setClipE] = useState(31);

  // 选中日期(日历):今天只到当前时段,过去日期覆盖全天
  const isToday = pbM === CAL_TODAY.m && pbD === CAL_TODAY.d;
  const dayMax = isToday ? TODAY_MAX : DAY_MIN;
  const dayMaxRef = useRef(dayMax);
  dayMaxRef.current = dayMax;
  const tm = pbHead % DAY_MIN;
  const ss = Math.round((pbHead - Math.floor(pbHead)) * 60);
  const stamp = `2026-${pad(pbM + 1)}-${pad(pbD)} ${pad(Math.floor(tm / 60))}:${pad(Math.floor(tm % 60))}:${pad(ss)}`;

  const evtOn = (sg: Seg) => sg.t === 'evt' && !!sg.ev && pbEvents.indexOf(sg.ev) >= 0;
  const filterActive = pbEvents.length < EVFILTER_COUNT;

  // playhead on a recorded segment? (pbSegAt) — 录像段按小时平铺
  const tm60 = pbHead % 60;
  const segAt = PBSEGS.find((sg) => tm60 >= sg.s && tm60 < sg.e) || null;

  const enterClip = () => {
    setClipS(Math.max(0, pbHead - 8));
    setClipE(Math.min(dayMax, pbHead + 8));
    setClipMode(true);
  };

  // ── NVR 式拖动:固定中线,滑动时间轴条带本体(左拖 = 时间前进);松手带惯性
  const ppm = clipMode ? PPM_CLIP : PPM_BROWSE;
  const px = (v: number) => v * ppm;
  const ppmRef = useRef(ppm);
  ppmRef.current = ppm;
  const pbHeadRef = useRef(pbHead);
  pbHeadRef.current = pbHead;
  const dragStart = useRef(0);
  const flingRaf = useRef<number | null>(null);
  const stopFling = () => {
    if (flingRaf.current != null) cancelAnimationFrame(flingRaf.current);
    flingRaf.current = null;
  };
  useEffect(() => stopFling, []);
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        stopFling();
        dragStart.current = pbHeadRef.current;
      },
      onPanResponderMove: (_e, g) => {
        const v = Math.max(0, Math.min(dayMaxRef.current, dragStart.current - g.dx / ppmRef.current));
        setPbHead(Math.round(v * 10) / 10);
      },
      onPanResponderRelease: (_e, g) => {
        // 惯性:vx(px/ms)→ 分钟/秒,指数衰减
        let vel = (-g.vx * 1000) / ppmRef.current;
        if (Math.abs(vel) < 30) return;
        let last = Date.now();
        const step = () => {
          const now = Date.now();
          const dt = (now - last) / 1000;
          last = now;
          vel *= Math.pow(0.15, dt);
          const next = Math.max(0, Math.min(dayMaxRef.current, pbHeadRef.current + vel * dt));
          setPbHead(Math.round(next * 10) / 10);
          if (Math.abs(vel) > 4 && next > 0 && next < dayMaxRef.current) {
            flingRaf.current = requestAnimationFrame(step);
          } else {
            flingRaf.current = null;
          }
        };
        flingRaf.current = requestAnimationFrame(step);
      },
    })
  ).current;

  // ── 剪辑把手拖拽:绿(起点)/红(终点),互相夹逼、限制在当天时间域内
  const clipSRef = useRef(clipS);
  clipSRef.current = clipS;
  const clipERef = useRef(clipE);
  clipERef.current = clipE;
  const clipGrab = useRef(0);
  const panClipS = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        clipGrab.current = clipSRef.current;
      },
      onPanResponderMove: (_e, g) => {
        const v = Math.max(0, Math.min(clipERef.current - 2, clipGrab.current + g.dx / PPM_CLIP));
        setClipS(Math.round(v * 10) / 10);
      },
    })
  ).current;
  const panClipE = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        clipGrab.current = clipERef.current;
      },
      onPanResponderMove: (_e, g) => {
        const v = Math.max(clipSRef.current + 2, Math.min(dayMaxRef.current, clipGrab.current + g.dx / PPM_CLIP));
        setClipE(Math.round(v * 10) / 10);
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
    <Screen
      scroll={false}
      edges={[]}
      header={
        <View>
          <Row style={[st.nav, { marginTop: insets.top }]}>
            <Tap style={st.navIcon} onPress={() => navigation.goBack()} hitSlop={8}>
              <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
            </Tap>
            <Text style={st.navTitle}>Home Monitoring</Text>
            <Tap style={st.navIcon} onPress={() => navigation.navigate('dev-settings')} hitSlop={8}>
              <Icon name="gear" size={18} color={colors.textPrimary} />
            </Tap>
          </Row>
          <LinearGradient
            colors={[colors.bgPrimary, 'rgba(251,251,251,0.3)', 'rgba(251,251,251,0)']}
            locations={[0, 0.45, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 26, zIndex: 20 }}
            pointerEvents="none"
          />
        </View>
      }
    >
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
                <SvgXml xml={FULLSCREEN_ICON} width={16} height={16} color="#fff" />
              </View>
            </>
          ) : (
            <View style={st.noRecWrap}>
              <Text style={st.noRecTxt}>No recordings in this time period</Text>
            </View>
          )}
        </View>
        <Row style={st.ctlRow}>
          <Tap style={st.ctlBtn} onPress={() => setCtlSpk((v) => !v)}>
            <SvgXml xml={CTRL_SPEAKER_OFF} width={22} height={22} color={ctlSpk ? colors.brand : colors.textPrimary} />
          </Tap>
          <Tap style={[st.ctlBtn, !segAt && { opacity: 0.35 }]} onPress={segAt ? enterClip : undefined}>
            <SvgXml xml={CTRL_EDITING} width={22} height={22} color={clipMode ? colors.brand : colors.textPrimary} />
          </Tap>
          <Tap style={st.ctlBtn} onPress={() => setCtlRec((v) => !v)}>
            <SvgXml xml={CTRL_CAMVIDEO} width={22} height={22} color={ctlRec ? colors.brand : colors.textPrimary} />
          </Tap>
          <Tap style={st.ctlBtn} onPress={() => setFsOpen(true)}>
            <SvgXml xml={CTRL_EXTEND} width={22} height={22} color={colors.textPrimary} />
          </Tap>
        </Row>
      </View>

      {/* date + filter row */}
      <Row style={st.dateRow}>
        <Tap style={st.dateTap} onPress={() => setCalOpen(true)}>
          <SvgXml xml={CALICON} width={19} height={19} color={colors.textSecondary} />
          {/* 日期 + 当前时刻:跟随时间轴拖动实时变化 */}
          <Text style={st.dateText}>
            {MONTHS_ABBR[pbM]} {pbD}
            <Text style={st.dateTime}> {pad(Math.floor(tm / 60))}:{pad(Math.floor(tm % 60))}</Text>
          </Text>
          {isToday && <Text style={st.todayText}>| Today</Text>}
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
        const tickStep = clipMode ? 10 : 60;
        const winStart = Math.floor((pbHead - WIN) / tickStep) * tickStep;
        const winEnd = winStart + WIN * 2 + tickStep * 2;
        const ticks: number[] = [];
        for (
          let m = Math.max(0, Math.ceil(winStart / tickStep) * tickStep);
          m <= Math.min(winEnd, dayMax);
          m += tickStep
        ) {
          ticks.push(m);
        }
        const trackS = Math.max(winStart, 0);
        const trackE = Math.min(winEnd, dayMax);
        const tiles: { s: number; e: number; evt: boolean }[] = [];
        for (let h = Math.max(0, Math.floor(winStart / 60)); h <= Math.floor(winEnd / 60); h++) {
          for (const sg of PBSEGS) {
            const ts = h * 60 + sg.s;
            const te = Math.min(h * 60 + sg.e, dayMax);
            if (te < winStart || ts > winEnd || ts >= dayMax) continue;
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
                    <View
                      {...panClipS.panHandlers}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={[st.clipHandle, { left: px(clipS - trackS), backgroundColor: '#22C55E' }]}
                    >
                      <SvgXml xml={CLIPGRIP} width={17} height={17} />
                    </View>
                    <View
                      {...panClipE.panHandlers}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={[st.clipHandle, { left: px(clipE - trackS), backgroundColor: '#EF4444' }]}
                    >
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
        <Row style={[st.bottomBar, { justifyContent: 'space-between', paddingHorizontal: 56 }]}>
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

      {/* 拓展:横屏全屏回放 */}
      <Modal visible={fsOpen} animationType="fade" onRequestClose={() => setFsOpen(false)}>
        <View style={st.fsRoot}>
          <View style={[st.fsStage, { width: Dimensions.get('window').height, height: Dimensions.get('window').width }]}>
            <LinearGradient colors={['#2A2520', '#15110D'] as const} style={StyleSheet.absoluteFill} />
            <Text style={st.fsStamp}>{stamp}</Text>
            <Tap style={st.fsBack} onPress={() => setFsOpen(false)} hitSlop={10}>
              <Icon name="chevL" size={18} color="#fff" sw={2.2} />
            </Tap>
          </View>
        </View>
      </Modal>

      {/* 日历选择(原型 pb-cal-open → msg-cal) */}
      <CalendarModal
        visible={calOpen}
        initM={pbM}
        initD={pbD}
        onClose={() => setCalOpen(false)}
        onConfirm={(m, d) => {
          setPbM(m);
          setPbD(d);
          const today = m === CAL_TODAY.m && d === CAL_TODAY.d;
          setPbHead(today ? 6 * 60 + 23 : 12 * 60); // 今天回到当前时段,过去日期定位正午
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
  fsRoot: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  fsStage: { transform: [{ rotate: '90deg' }], overflow: 'hidden' },
  fsStamp: {
    position: 'absolute', top: 16, right: 20, color: '#fff', fontSize: 11, fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  fsBack: {
    position: 'absolute', top: 16, left: 56, width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(80,80,80,0.45)', alignItems: 'center', justifyContent: 'center',
  },

  // 左下,与右下全屏钮垂直居中(对齐设备详情页)
  stamp: {
    position: 'absolute',
    bottom: 15,
    left: 12,
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  // 右上(对齐设备详情页 1080P 徽标位置)
  quality: {
    position: 'absolute',
    top: 12,
    right: 12,
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

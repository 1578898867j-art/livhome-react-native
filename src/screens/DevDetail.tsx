import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, Tap, Row, Card } from '../components/kit';
import { Icon } from '../components/Icon';
import { TABICONS, PHOTOICONS, CTRLICONS, TILTICONS, MOVEICONS } from '../icons/protoSets';
import { ZOOMICON, SELICON, SELICON2 } from '../icons/protoIcons';
import { colors } from '../theme';
import { useDeviceDetailPrototype } from '../features/devices/useDeviceDetailPrototype';
import type {
  ControlKey as CtlKey,
  DeviceDetailTab as Tab,
  DeviceMessage as Msg,
  TiltKey,
} from '../features/devices/useDeviceDetailPrototype';

const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Prototype MSGFILTERS map — keys match the message icon keys.
const MSGFILTERS: Record<string, string> = {
  motion: 'Motion',
  sound: 'Sound',
  cross: 'Line Crossing',
  fence: 'Intrusion Zone',
};
const FILTER_KEYS = ['motion', 'sound', 'cross', 'fence'];

const TILT_ITEMS: { icon: string; label: string; key: TiltKey }[] = [
  { icon: 'smartTrack', label: 'Smart Tracking', key: 'smartTrack' },
  { icon: 'nightVision', label: 'Night Vision', key: 'nightVision' },
  { icon: 'motion', label: 'Motion Detection', key: 'motionOn' },
  { icon: 'sound', label: 'Sound Detection', key: 'soundOn' },
  { icon: 'siren', label: 'Siren', key: 'sirenOn' },
  { icon: 'privacy', label: 'Privacy', key: 'privacyOn' },
];

/* ---- dark camera preview (linear-gradient approximated with a solid dark surface) ---- */
function CamPreview({
  height,
  showBox = true,
  live = false,
  tag = 'Motion detected',
  label,
  children,
}: {
  height?: number;
  showBox?: boolean;
  live?: boolean;
  tag?: string;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={[st.cam, height ? { height } : { aspectRatio: 16 / 9 }]}>
      {live && (
        <View style={st.liveBadge}>
          <View style={st.liveDot} />
          <Text style={st.liveTxt}>LIVE</Text>
        </View>
      )}
      {showBox && (
        <View style={st.detBox}>
          <View style={st.detTag}>
            <Text style={st.detTagTxt}>{tag}</Text>
          </View>
        </View>
      )}
      {!!label && <Text style={st.camLabel}>{label}</Text>}
      {children}
    </View>
  );
}

export default function DevDetail({ navigation }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const {
    activePreset,
    addPreset,
    clearChecked,
    cruising,
    ctl,
    ctrlView,
    deleteCheckedMessages,
    msgChecked,
    msgs,
    presets,
    removePreset,
    setActivePreset,
    setCruising,
    setCtrlView,
    setTab,
    tab,
    tilt,
    toggleChecked,
    toggleCtl,
    toggleTilt,
  } = useDeviceDetailPrototype();

  const [msgSelect, setMsgSelect] = useState(false);
  const [msgFilter, setMsgFilter] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [delConfirm, setDelConfirm] = useState(false);
  const [presetPopup, setPresetPopup] = useState(false);
  // 拍照/录像保存提示条(截图为瞬时动作,不保持常亮)
  const [saveToast, setSaveToast] = useState<null | 'photo' | 'video'>(null);
  const [snapFlash, setSnapFlash] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );
  const showSaveToast = (kind: 'photo' | 'video') => {
    setSaveToast(kind);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setSaveToast(null), 2600);
  };
  const snap = () => {
    setSnapFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setSnapFlash(false), 260);
    showSaveToast('photo');
  };
  const [msgM, setMsgM] = useState(3);
  const [msgD, setMsgD] = useState(23);
  // calendar picker (prototype msg-cal overlay; TODAY = 2026-04-23)
  const TODAY = { y: 2026, m: 3, d: 23 };
  const [calOpen, setCalOpen] = useState(false);
  const [calY, setCalY] = useState(2026);
  const [calM, setCalM] = useState(3);
  const [calSel, setCalSel] = useState({ y: 2026, m: 3, d: 23 });

  const openCal = () => {
    setCalY(2026);
    setCalM(msgM);
    setCalSel({ y: 2026, m: msgM, d: msgD });
    setCalOpen(true);
  };
  const calPrevM = () => {
    const dm = new Date(calY, calM - 1, 1);
    setCalY(dm.getFullYear());
    setCalM(dm.getMonth());
  };
  const calNextM = () => {
    const dn = new Date(calY, calM + 1, 1);
    setCalY(dn.getFullYear());
    setCalM(dn.getMonth());
  };
  const calNextDisabled = calY > TODAY.y || (calY === TODAY.y && calM >= TODAY.m);
  const calConfirm = () => {
    setMsgM(calSel.m);
    setMsgD(calSel.d);
    setCalOpen(false);
  };

  const deleteChecked = () => {
    deleteCheckedMessages();
    setMsgSelect(false);
    setDelConfirm(false);
  };

  const pickFilter = (k: string) => {
    setMsgFilter((f) => (f === k ? null : k));
    clearChecked();
    setFilterOpen(false);
  };

  const BOTTOM_TABS: { key: Tab; label: string }[] = [
    { key: 'messages', label: 'Messages' },
    { key: 'controls', label: 'Controls' },
    { key: 'tilt', label: 'Tilt' },
    { key: 'playback', label: 'Playback' },
  ];

  return (
    <Screen
      scroll={false}
      header={
        <Row style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 10 }}>
          <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
          </Tap>
          <Text style={st.navTitle}>Home Monitoring</Text>
          <Tap style={st.iconGhost} onPress={() => navigation.navigate('dev-settings')} hitSlop={8}>
            <Icon name="gear" size={18} color={colors.textPrimary} />
          </Tap>
        </Row>
      }
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* player */}
        <View style={st.player}>
          <CamPreview live tag="Person · sofa" label="Living · 14:22:08">
            <View style={st.resBadge}>
              <Text style={st.resTxt}>1080P</Text>
            </View>
            <View style={st.scanBtn}>
              <Icon name="scan" size={15} color="#fff" sw={2} />
            </View>
          </CamPreview>
          <Row style={{ gap: 8, padding: 12, backgroundColor: colors.surface }}>
            <PhotoBtn icon="speaker" on={ctl.ctlSpk} onPress={() => toggleCtl('ctlSpk')} />
            <PhotoBtn icon="mic" on={ctl.ctlMic} onPress={() => toggleCtl('ctlMic')} />
            <PhotoBtn
              icon="record"
              on={ctl.ctlRec}
              onPress={() => {
                if (ctl.ctlRec) showSaveToast('video');
                toggleCtl('ctlRec');
              }}
            />
            <PhotoBtn icon="camera" on={snapFlash} onPress={snap} />
          </Row>
        </View>

        {/* body */}
        {tab === 'controls' && (
          <ControlsPanel
            view={ctrlView}
            cruising={cruising}
            presets={presets}
            activePreset={activePreset}
            onPresets={() => setCtrlView('presets')}
            onBack={() => setCtrlView('pad')}
            onAdd={addPreset}
            onDelete={removePreset}
            onView={setActivePreset}
            onCruise={() => {
              // 原型 cruise-try:少于 2 个预置位先提示添加
              if (presets.length < 2) setPresetPopup(true);
              else setCruising((c) => !c);
            }}
          />
        )}
        {tab === 'tilt' && <TiltPanel tilt={tilt} onToggle={toggleTilt} />}
        {tab === 'messages' && (
          <MessagesPanel
            msgs={msgs}
            select={msgSelect}
            checked={msgChecked}
            filter={msgFilter}
            month={MONTHS_ABBR[msgM]}
            day={msgD}
            onPrev={() => setMsgD((d) => Math.max(1, d - 1))}
            onNext={() => setMsgD((d) => d + 1)}
            onFilterOpen={() => setFilterOpen(true)}
            onFilterClear={() => setMsgFilter(null)}
            onToggleSelect={() => {
              setMsgSelect((v) => {
                if (v) clearChecked();
                return !v;
              });
            }}
            onCheck={toggleChecked}
            onOpenMsg={() => navigation.navigate('notif-detail')}
            onCalOpen={openCal}
          />
        )}
        {tab === 'playback' && (
          <PlaybackPanel onOpen={() => navigation.navigate('dev-playback')} />
        )}
      </ScrollView>

      {/* select-mode delete bar (covers the tab bar) */}
      {tab === 'messages' && msgSelect ? (
        <View style={st.deleteBar}>
          <Tap
            style={st.deleteBtn}
            onPress={msgChecked.length ? () => setDelConfirm(true) : undefined}
          >
            <Text
              style={[
                st.deleteTxt,
                { color: msgChecked.length ? colors.critical : colors.textTertiary },
              ]}
            >
              Delete
            </Text>
          </Tap>
        </View>
      ) : (
        <View style={st.tabBar}>
          {BOTTOM_TABS.map((b) => {
            const on = tab === b.key;
            const col = on ? colors.brand : colors.textTertiary;
            return (
              <Tap
                key={b.key}
                style={st.tabItem}
                onPress={() => setTab(b.key)}
              >
                <SvgXml xml={TABICONS[b.key]} width={22} height={22} color={col} />
                <Text style={{ fontSize: 11, fontWeight: on ? '700' : '500', color: col }}>
                  {b.label}
                </Text>
              </Tap>
            );
          })}
        </View>
      )}

      {/* filter bottom sheet */}
      <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={st.ovl} onPress={() => setFilterOpen(false)}>
          <Pressable style={st.sheetWrap} onPress={(e) => e.stopPropagation()}>
            <View style={st.sheetGroup}>
              <Text style={st.sheetTitle}>Filter by alert type</Text>
              {FILTER_KEYS.map((k, i) => {
                const on = msgFilter === k;
                return (
                  <View key={k}>
                    {i > 0 && <View style={st.sheetLine} />}
                    <Tap style={st.sheetRow} onPress={() => pickFilter(k)}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                          color: on ? colors.brand : colors.textPrimary,
                        }}
                      >
                        {MSGFILTERS[k]}
                      </Text>
                      {on && <Icon name="check" size={17} color={colors.brand} sw={2.2} />}
                    </Tap>
                  </View>
                );
              })}
            </View>
            <View style={[st.sheetGroup, { marginTop: 8 }]}>
              <Tap style={st.sheetRow} onPress={() => setFilterOpen(false)}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: colors.textPrimary }}>Cancel</Text>
              </Tap>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* delete confirm dialog */}
      <Modal visible={delConfirm} transparent animationType="fade" onRequestClose={() => setDelConfirm(false)}>
        <Pressable style={st.ovlCenter} onPress={() => setDelConfirm(false)}>
          <Pressable style={st.dialog} onPress={(e) => e.stopPropagation()}>
            <View style={{ paddingVertical: 26, paddingHorizontal: 22, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
                Delete notifications
              </Text>
              <Text style={st.dialogDesc}>
                Are you sure you want to delete the selected notifications?
              </Text>
            </View>
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border }}>
              <Tap style={st.dialogBtn} onPress={() => setDelConfirm(false)}>
                <Text style={{ fontSize: 17, fontWeight: '500', color: colors.textSecondary }}>Cancel</Text>
              </Tap>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <Tap style={st.dialogBtn} onPress={deleteChecked}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: colors.critical }}>Delete</Text>
              </Tap>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 拍照/录像已保存提示条(参考稿:缩略图 + 文案 + Tap to view) */}
      {saveToast != null && (
        <View style={[st.saveToast, { bottom: Math.max(insets.bottom, 12) + 86 }]}>
          <View style={st.saveThumb}>
            <CamPreview height={44} showBox={false} tag="" />
          </View>
          <Text style={st.saveTxt} numberOfLines={1}>
            {saveToast === 'photo' ? 'Photo saved to album' : 'Video saved to album'}{' '}
            <Text
              style={st.saveLink}
              onPress={() => {
                setSaveToast(null);
                navigation.navigate('album');
              }}
            >
              Tap to view
            </Text>
          </Text>
        </View>
      )}

      {/* 巡航前置条件弹窗(原型 preset-popup):预置位不足 2 个 */}
      <Modal visible={presetPopup} transparent animationType="fade" onRequestClose={() => setPresetPopup(false)}>
        <Pressable style={st.ovlCenter} onPress={() => setPresetPopup(false)}>
          <Pressable style={[st.dialog, { paddingHorizontal: 22, paddingTop: 26, paddingBottom: 22 }]} onPress={(e) => e.stopPropagation()}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' }}>
              Please add preset points first
            </Text>
            <Text style={[st.dialogDesc, { textAlign: 'center' }]}>
              At least 2 different preset points are required to see the screen switching effect
            </Text>
            <Tap
              style={st.presetPopupBtn}
              onPress={() => {
                setPresetPopup(false);
                setCtrlView('presets');
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Add now</Text>
            </Tap>
          </Pressable>
        </Pressable>
      </Modal>

      {/* calendar picker (prototype msg-cal overlay) */}
      <Modal visible={calOpen} transparent animationType="fade" onRequestClose={() => setCalOpen(false)}>
        <Pressable style={st.ovlCenter} onPress={() => setCalOpen(false)}>
          <Pressable style={st.calCard} onPress={(e) => e.stopPropagation()}>
            {/* month header */}
            <Row style={{ marginBottom: 14 }}>
              <Tap style={st.calNavBtn} onPress={calPrevM}>
                <Icon name="chevL" size={20} color={colors.textSecondary} sw={2} />
              </Tap>
              <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>
                {calY}-{String(calM + 1).padStart(2, '0')}
              </Text>
              <Tap style={[st.calNavBtn, calNextDisabled && { opacity: 0.3 }]} onPress={calNextDisabled ? undefined : calNextM}>
                <Icon name="chevR" size={20} color={colors.textSecondary} sw={2} />
              </Tap>
            </Row>
            {/* weekday header */}
            <View style={st.calGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
                <Text key={w} style={st.calWk}>{w}</Text>
              ))}
            </View>
            {/* day grid */}
            <View style={[st.calGrid, { marginTop: 4 }]}>
              {(() => {
                const firstDow = new Date(calY, calM, 1).getDay();
                const dim = new Date(calY, calM + 1, 0).getDate();
                const cells: React.ReactNode[] = [];
                for (let b = 0; b < firstDow; b++) cells.push(<View key={'b' + b} style={st.calCell} />);
                for (let d = 1; d <= dim; d++) {
                  const isFut =
                    calY > TODAY.y ||
                    (calY === TODAY.y && calM > TODAY.m) ||
                    (calY === TODAY.y && calM === TODAY.m && d > TODAY.d);
                  const onSel = !isFut && calSel.y === calY && calSel.m === calM && calSel.d === d;
                  const isToday = calY === TODAY.y && calM === TODAY.m && d === TODAY.d;
                  cells.push(
                    <Tap
                      key={d}
                      style={[st.calCell, isFut && { opacity: 0.4 }]}
                      onPress={isFut ? undefined : () => setCalSel({ y: calY, m: calM, d })}
                    >
                      <View
                        style={[
                          st.calDay,
                          onSel
                            ? { backgroundColor: colors.brand }
                            : isToday
                            ? { backgroundColor: colors.bgSecondary }
                            : null,
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: onSel ? '700' : '500',
                            color: isFut ? colors.textTertiary : onSel ? '#fff' : colors.textPrimary,
                          }}
                        >
                          {d}
                        </Text>
                      </View>
                    </Tap>
                  );
                }
                return cells;
              })()}
            </View>
            {/* footer */}
            <Row style={{ gap: 12, marginTop: 18 }}>
              <Tap style={[st.calFootBtn, { backgroundColor: colors.bgSecondary }]} onPress={() => setCalOpen(false)}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textSecondary }}>Cancel</Text>
              </Tap>
              <Tap style={[st.calFootBtn, { backgroundColor: colors.brand }]} onPress={calConfirm}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Confirm</Text>
              </Tap>
            </Row>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

/* ---- player control button (PHOTOICONS; solid variant while ON) ---- */
function PhotoBtn({ icon, on, onPress }: { icon: string; on: boolean; onPress: () => void }) {
  const glyph = on ? (icon === 'speaker' ? 'speakerSolid' : icon === 'mic' ? 'micSolid' : icon) : icon;
  return (
    <Tap style={st.photoBtn} onPress={onPress}>
      <SvgXml xml={PHOTOICONS[glyph]} width={18} height={18} color={on ? colors.brand : colors.textPrimary} />
    </Tap>
  );
}

/* ---- CONTROLS tab (pan pad + preset/reset/cruise actions) ---- */
function ControlsPanel({
  view,
  cruising,
  presets,
  activePreset,
  onPresets,
  onBack,
  onAdd,
  onDelete,
  onView,
  onCruise,
}: {
  view: 'pad' | 'presets';
  cruising: boolean;
  presets: string[];
  activePreset: number | null;
  onPresets: () => void;
  onBack: () => void;
  onAdd: () => void;
  onDelete: (i: number) => void;
  onView: (i: number) => void;
  onCruise: () => void;
}) {
  if (view === 'presets') {
    return (
      <View style={{ padding: 18, paddingTop: 16 }}>
        <Row style={{ marginBottom: 14 }}>
          <Text style={st.presetTitle}>Preset Positions</Text>
          <View style={{ flex: 1 }} />
          <Tap style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} onPress={onBack}>
            <Icon name="refresh" size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>Back</Text>
          </Tap>
        </Row>
        {/* Figma 1655:1625:白底卡 124/122×143,图 99 高、名称白条、右上 22 半透明 ×;
            横滑区左右出血到屏幕边缘(marginHorizontal 抵消父级 padding,不做剪切蒙版) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -18 }}
          contentContainerStyle={{ gap: 10, paddingHorizontal: 18 }}
        >
          <Tap style={st.addCard} onPress={onAdd}>
            <View style={st.addIcon}>
              <Icon name="plus" size={20} color={colors.brand} sw={2.2} />
            </View>
            <Text style={st.addTxt}>{'Add Preset\nPosition'}</Text>
          </Tap>
          {presets.map((name, i) => (
            <Tap
              key={name + i}
              style={[st.presetCard, activePreset === i && st.presetCardSel]}
              onPress={() => onView(i)}
            >
              <CamPreview height={99} showBox={false} tag="" />
              <Text style={st.presetName} numberOfLines={1}>{name}</Text>
              <Tap style={st.presetDel} onPress={() => onDelete(i)} hitSlop={6}>
                <Icon name="x" size={12} color="#fff" sw={2.6} />
              </Tap>
            </Tap>
          ))}
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={{ padding: 18, paddingTop: 20, alignItems: 'center' }}>
      <View style={st.dpad}>
        <Tap style={[st.triWrap, { top: 18, left: '50%', marginLeft: -9 }]} onPress={() => {}} hitSlop={8}>
          <Tri dir="up" />
        </Tap>
        <Tap style={[st.triWrap, { bottom: 18, left: '50%', marginLeft: -9 }]} onPress={() => {}} hitSlop={8}>
          <Tri dir="down" />
        </Tap>
        <Tap style={[st.triWrap, { left: 18, top: '50%', marginTop: -8 }]} onPress={() => {}} hitSlop={8}>
          <Tri dir="left" />
        </Tap>
        <Tap style={[st.triWrap, { right: 18, top: '50%', marginTop: -8 }]} onPress={() => {}} hitSlop={8}>
          <Tri dir="right" />
        </Tap>
        <Tap style={st.dpadHome} onPress={() => {}} hitSlop={8}>
          <View />
        </Tap>
      </View>
      <Row style={{ gap: 12, marginTop: 24, width: '100%' }}>
        <CtrlAction icon="presets" label="Presets" hl={false} onPress={onPresets} />
        <CtrlAction icon="reset" label="Reset" hl onPress={() => {}} />
        <CtrlAction icon="cruise" label="Cruise" hl={cruising} onPress={onCruise} />
      </Row>
    </View>
  );
}

function Tri({ dir }: { dir: 'up' | 'down' | 'left' | 'right' }) {
  const rot = { up: '0deg', right: '90deg', down: '180deg', left: '-90deg' }[dir];
  return <View style={[st.tri, { transform: [{ rotate: rot }] }]} />;
}

function CtrlAction({
  icon,
  label,
  hl,
  onPress,
}: {
  icon: string;
  label: string;
  hl: boolean;
  onPress: () => void;
}) {
  // presets 字形是宽扁 viewBox(29.55×20.8),等宽渲染会显小 — 放大补偿到与另两个视觉等高
  const sz = icon === 'presets' ? 25 : 17;
  return (
    <Tap style={[st.ctrlAction, { backgroundColor: hl ? colors.brandSoft : colors.surface }]} onPress={onPress}>
      <View style={[st.ctrlActionIcon, { backgroundColor: hl ? colors.brand : colors.bgSecondary }]}>
        <SvgXml xml={CTRLICONS[icon]} width={sz} height={sz} color={hl ? '#fff' : colors.textSecondary} />
      </View>
      <Text style={{ fontSize: 12, fontWeight: '700', color: hl ? colors.brand : colors.textSecondary }}>
        {label}
      </Text>
    </Tap>
  );
}

/* ---- TILT tab (3-col feature grid) ---- */
function TiltPanel({
  tilt,
  onToggle,
}: {
  tilt: Record<TiltKey, boolean>;
  onToggle: (k: TiltKey) => void;
}) {
  return (
    <View style={st.tiltGrid}>
      {TILT_ITEMS.map((it) => {
        const on = tilt[it.key];
        const glyph = it.icon === 'privacy' && on ? 'privacyOn' : it.icon;
        return (
          <Tap
            key={it.key}
            style={[st.tiltCell, { backgroundColor: on ? colors.brandSoft : colors.surface }]}
            onPress={() => onToggle(it.key)}
          >
            <View style={[st.tiltIcon, { backgroundColor: on ? colors.brand : colors.bgSecondary }]}>
              <SvgXml xml={TILTICONS[glyph]} width={22} height={22} color={on ? '#fff' : colors.textSecondary} />
            </View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                textAlign: 'center',
                color: on ? colors.brand : colors.textSecondary,
              }}
            >
              {it.label}
            </Text>
          </Tap>
        );
      })}
    </View>
  );
}

/* ---- MESSAGES tab ---- */
function MessagesPanel({
  msgs,
  select,
  checked,
  filter,
  month,
  day,
  onPrev,
  onNext,
  onFilterOpen,
  onFilterClear,
  onToggleSelect,
  onCheck,
  onOpenMsg,
  onCalOpen,
}: {
  msgs: Msg[];
  select: boolean;
  checked: number[];
  filter: string | null;
  month: string;
  day: number;
  onPrev: () => void;
  onNext: () => void;
  onFilterOpen: () => void;
  onFilterClear: () => void;
  onToggleSelect: () => void;
  onCheck: (i: number) => void;
  onOpenMsg: () => void;
  onCalOpen: () => void;
}) {
  const visible = msgs.map((m, i) => ({ m, i })).filter((o) => !filter || o.m.icon === filter);
  return (
    <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
      <Row style={{ gap: 6, marginBottom: 14 }}>
        <Tap style={st.msgNavBtn} onPress={onPrev}>
          <Icon name="chevL" size={16} color={colors.textSecondary} sw={2.2} />
        </Tap>
        <Tap onPress={onCalOpen}>
          <Text style={{ fontSize: 16, fontWeight: '700', paddingHorizontal: 4 }}>
            {month} {day}
          </Text>
        </Tap>
        <Tap style={st.msgNavBtn} onPress={onNext}>
          <Icon name="chevR" size={16} color={colors.textSecondary} sw={2.2} />
        </Tap>
        <View style={{ flex: 1 }} />
        <Tap
          style={[st.msgHeadBtn, !!filter && { backgroundColor: colors.brandSoft }]}
          onPress={onFilterOpen}
        >
          <SvgXml xml={ZOOMICON} width={18} height={18} color={filter ? colors.brand : colors.textSecondary} />
        </Tap>
        <Tap
          style={[st.msgHeadBtn, select && { backgroundColor: colors.brandSoft }]}
          onPress={onToggleSelect}
        >
          <SvgXml
            xml={select ? SELICON2 : SELICON}
            width={18}
            height={18}
            color={select ? colors.brand : colors.textSecondary}
          />
        </Tap>
      </Row>

      {!!filter && (
        <Tap style={st.filterChip} onPress={onFilterClear}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand }}>
            {MSGFILTERS[filter]}
          </Text>
          <Icon name="x" size={13} color={colors.brand} sw={2.4} />
        </Tap>
      )}

      {visible.length ? (
        visible.map(({ m, i }) => {
          const chk = checked.indexOf(i) >= 0;
          return (
            // In select mode the whole card row slides left (bleeding past the
            // screen edge) so the check circle takes the right gutter — per design.
            <Row key={i} style={{ gap: 10, marginBottom: 12, marginLeft: select ? -30 : 0 }}>
              <Tap
                style={{ flex: 1, minWidth: 0 }}
                onPress={() => (select ? onCheck(i) : onOpenMsg())}
              >
                <Card style={st.msgCard}>
                  <View style={st.msgIcon}>
                    <SvgXml xml={MOVEICONS[m.icon]} width={17} height={17} color="#fff" />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>
                      {m.title}
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textTertiary, marginTop: 3 }}>
                      {m.time}
                    </Text>
                  </View>
                  <View style={st.msgThumb}>
                    <CamPreview height={60} showBox={false} />
                  </View>
                </Card>
              </Tap>
              {select && (
                <Tap
                  style={[
                    st.msgCheck,
                    chk
                      ? { backgroundColor: colors.brand }
                      : { borderWidth: 2, borderColor: colors.borderStrong },
                  ]}
                  onPress={() => onCheck(i)}
                >
                  {chk && <Icon name="check" size={14} color="#fff" sw={3} />}
                </Tap>
              )}
            </Row>
          );
        })
      ) : (
        <Text style={st.emptyMsg}>
          {filter ? `No ${MSGFILTERS[filter]} alerts` : 'No messages'}
        </Text>
      )}
    </View>
  );
}

/* ---- PLAYBACK tab ---- */
function PlaybackPanel({ onOpen }: { onOpen: () => void }) {
  return (
    <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
      <Tap onPress={onOpen}>
        <Card style={st.pbCard}>
          <View style={st.pbIcon}>
            <Icon name="sd" size={20} color={colors.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>SD Card Playback</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textTertiary, marginTop: 2 }}>
              View recorded footage on the timeline.
            </Text>
          </View>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Card>
      </Tap>
    </View>
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
  iconGhost: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  navTitle: { flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center', color: colors.textPrimary },

  player: { marginHorizontal: 18, marginTop: 6, borderRadius: 18, overflow: 'hidden' },

  cam: { position: 'relative', width: '100%', backgroundColor: '#211c17', overflow: 'hidden' },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(220,40,40,.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
  detBox: {
    position: 'absolute',
    left: '28%',
    top: '36%',
    width: '34%',
    height: '46%',
    borderWidth: 1.5,
    borderColor: 'rgba(74,222,128,.9)',
    borderRadius: 6,
  },
  detTag: {
    position: 'absolute',
    top: -19,
    left: -1,
    backgroundColor: 'rgba(74,222,128,.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  detTagTxt: { color: '#062018', fontSize: 10, fontWeight: '700' },
  camLabel: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    color: 'rgba(255,255,255,.85)',
    fontSize: 10,
    fontWeight: '700',
  },
  resBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: 'rgba(0,0,0,.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
  scanBtn: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },

  // controls d-pad
  dpad: { position: 'relative', width: 188, height: 188, borderRadius: 94, backgroundColor: colors.bgSecondary },
  triWrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  tri: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#C6CAD1',
  },
  dpadHome: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -16,
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B6BAC2',
  },
  ctrlAction: { flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14, borderRadius: 18 },
  ctrlActionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  presetTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  presetCard: {
    width: 122, height: 143, borderRadius: 14, overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  presetCardSel: { borderWidth: 2, borderColor: colors.brand },
  presetDel: {
    position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  presetName: {
    marginTop: 12, paddingHorizontal: 10,
    fontSize: 13, fontWeight: '600', color: colors.textPrimary,
  },
  saveToast: {
    position: 'absolute', left: 16, right: 16, zIndex: 60,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#F5F8FE', borderRadius: 24, padding: 10, paddingRight: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  saveThumb: { width: 72, borderRadius: 12, overflow: 'hidden' },
  saveTxt: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  saveLink: { color: colors.brand, fontWeight: '600' },

  presetPopupBtn: {
    width: '100%', height: 54, borderRadius: 99, marginTop: 18,
    backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  addCard: {
    width: 124,
    height: 143,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTxt: { fontSize: 12, fontWeight: '600', color: colors.textTertiary, textAlign: 'center', lineHeight: 16 },

  // tilt grid
  tiltGrid: { padding: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tiltCell: {
    width: '31%',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: 18,
  },
  tiltIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },

  // messages
  msgNavBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  msgHeadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: colors.brandSoft,
    borderRadius: 99,
  },
  msgCard: { padding: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  msgIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgThumb: { width: 96, height: 60, borderRadius: 12, overflow: 'hidden' },
  msgCheck: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emptyMsg: { textAlign: 'center', paddingVertical: 60, fontSize: 14, fontWeight: '700', color: colors.textTertiary },

  // playback
  pbCard: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  pbIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // bottom tab bar + delete bar
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 26,
    paddingHorizontal: 6,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 6 },
  deleteBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 26,
    alignItems: 'flex-end',
  },
  deleteBtn: {
    height: 44,
    paddingHorizontal: 28,
    borderRadius: 99,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTxt: { fontSize: 15, fontWeight: '700' },

  // modals
  ovl: { flex: 1, backgroundColor: 'rgba(0,0,0,.4)', justifyContent: 'flex-end' },
  ovlCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  calCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: 26,
    paddingTop: 22,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  calNavBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calWk: {
    width: `${100 / 7}%` as any,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    paddingVertical: 6,
  },
  calCell: { width: `${100 / 7}%` as any, height: 44, alignItems: 'center', justifyContent: 'center' },
  calDay: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  calFootBtn: { flex: 1, height: 52, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  sheetWrap: { paddingHorizontal: 10, paddingBottom: 40 },
  sheetGroup: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden' },
  sheetTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetLine: { height: 1, backgroundColor: colors.border },
  sheetRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dialog: {
    width: '100%',
    maxWidth: 322,
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
  },
  dialogDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 21,
    textAlign: 'center',
  },
  dialogBtn: { flex: 1, height: 58, alignItems: 'center', justifyContent: 'center' },
});

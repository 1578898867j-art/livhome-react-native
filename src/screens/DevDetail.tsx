import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, Dimensions } from 'react-native';
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

// Full-screen(全局放大)—— 用户提供的 Huge-icon 素材
const FULLSCREEN_ICON =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M16.5 3H19.5C20.3284 3 21 3.67157 21 4.5V7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 16.5V19.5C21 20.3284 20.3284 21 19.5 21H16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 21H4.5C3.67157 21 3 20.3284 3 19.5V16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7.5V4.5C3 3.67157 3.67157 3 4.5 3H7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// 全屏横屏控件 —— 用户提供的 Figma 830:1018 切片(54 圆钮 + 174 方向盘)
const FS_FHD =
  '<svg viewBox="0 0 54 54" fill="none"><rect width="54" height="54" rx="27" fill="#878787" fill-opacity="0.4"/><path d="M35 17C37.2091 17 39 18.7909 39 21V33C39 35.2091 37.2091 37 35 37H19C16.7909 37 15 35.2091 15 33V21C15 18.7909 16.7909 17 19 17H35ZM18.4287 29.9756H19.7461V27.2441H22.2822V26.0918H19.7461V24.5166H22.5557V23.3633H18.4287V29.9756ZM24.2695 29.9756H25.5879V27.2441H28.2637V29.9756H29.5781V23.3633H28.2637V26.0918H25.5879V23.3633H24.2695V29.9756ZM31.293 23.3633V29.9756H33.502C34.135 29.9756 34.6793 29.8428 35.1338 29.5781C35.5903 29.3134 35.9401 28.9334 36.1836 28.4385C36.4291 27.9435 36.5527 27.3517 36.5527 26.6631C36.5527 25.9765 36.4291 25.3864 36.1836 24.8936C35.9401 24.4009 35.592 24.0232 35.1396 23.7607C34.6872 23.4961 34.1474 23.3633 33.5205 23.3633H31.293ZM33.4502 24.5615C33.8398 24.5615 34.1678 24.6349 34.4336 24.7812C34.6993 24.9275 34.8993 25.1552 35.0332 25.4648C35.1692 25.7748 35.2373 26.1745 35.2373 26.6631C35.2373 27.1558 35.1691 27.5581 35.0332 27.8701C34.8993 28.18 34.6985 28.4091 34.4307 28.5576C34.1648 28.704 33.8369 28.7773 33.4473 28.7773H32.6104V24.5615H33.4502Z" fill="#D9D8D8"/></svg>';
const FS_SNAP =
  '<svg viewBox="0 0 54 54" fill="none"><rect y="54" width="54" height="54" rx="27" transform="rotate(-90 0 54)" fill="#777777" fill-opacity="0.4"/><path d="M34.667 21.167C36.876 21.1672 38.667 22.958 38.667 25.167V33.5C38.667 35.709 36.876 37.4998 34.667 37.5H19.333C17.124 37.4998 15.333 35.709 15.333 33.5V25.167C15.333 22.958 17.124 21.1672 19.333 21.167H34.667ZM27 25.833C25.0671 25.833 23.5002 27.4002 23.5 29.333C23.5 31.266 25.067 32.833 27 32.833C28.933 32.833 30.5 31.266 30.5 29.333C30.4998 27.4002 28.9329 25.833 27 25.833ZM29.4297 16.5C30.0982 16.5001 30.7229 16.8344 31.0938 17.3906L32.4443 19.417H21.5547L22.9062 17.3906C23.2771 16.8344 23.9018 16.5001 24.5703 16.5H29.4297Z" fill="#D9D8D8"/></svg>';
const FS_REC =
  '<svg viewBox="0 0 54 54" fill="none"><rect y="54" width="54" height="54" rx="27" transform="rotate(-90 0 54)" fill="#777777" fill-opacity="0.4"/><path d="M27.667 17.667C29.876 17.6672 31.667 19.458 31.667 21.667V32.333C31.667 34.542 29.876 36.3328 27.667 36.333H19.333C17.124 36.3328 15.333 34.542 15.333 32.333V21.667C15.333 19.458 17.124 17.6672 19.333 17.667H27.667ZM35.208 21.3564C36.4481 20.0341 38.667 20.9117 38.667 22.7246V31.2764C38.6665 33.089 36.4479 33.9659 35.208 32.6436L33.417 30.7334V23.2656L35.208 21.3564Z" fill="#D9D8D8"/></svg>';
const FS_MIC =
  '<svg viewBox="0 0 54 54" fill="none"><rect y="54" width="54" height="54" rx="27" transform="rotate(-90 0 54)" fill="#777777" fill-opacity="0.4"/><path d="M35.5332 26.3662C35.975 26.3662 36.333 26.7252 36.333 27.167V29.2998C36.333 34.4545 32.1547 38.6338 27 38.6338C21.8453 38.6338 17.667 34.4545 17.667 29.2998V27.167C17.667 26.7252 18.025 26.3662 18.4668 26.3662C18.9086 26.3663 19.2666 26.7252 19.2666 27.167V29.2998C19.2666 33.5708 22.729 37.0332 27 37.0332C31.271 37.0332 34.7334 33.5708 34.7334 29.2998V27.167C34.7334 26.7252 35.0914 26.3663 35.5332 26.3662ZM27 16.5C29.9454 16.5 32.3328 18.8876 32.333 21.833V29.2998C32.333 32.2453 29.9455 34.6338 27 34.6338C24.0545 34.6338 21.667 32.2453 21.667 29.2998V21.833C21.6672 18.8876 24.0546 16.5 27 16.5Z" fill="#D9D8D8"/></svg>';
const FS_MUTE =
  '<svg viewBox="0 0 54 54" fill="none"><rect y="54" width="54" height="54" rx="27" transform="rotate(-90 0 54)" fill="#777777" fill-opacity="0.4"/><path d="M17.048 17.0479C17.3897 16.7063 17.9436 16.7063 18.2853 17.0479L36.9523 35.7149C37.2937 36.0567 37.2939 36.6106 36.9523 36.9522C36.6107 37.2939 36.0567 37.2937 35.715 36.9522L32.8302 34.0675C32.777 35.9452 30.6189 37.0013 29.0998 35.8624L24.0334 32.0636C23.6874 31.8043 23.2664 31.6643 22.8341 31.6642H20.0002C18.7116 31.6642 17.6673 30.6201 17.6671 29.3321V24.6671C17.6674 23.3792 18.7117 22.3351 20.0002 22.3351H21.0978L17.048 18.2852C16.7063 17.9435 16.7063 17.3896 17.048 17.0479ZM29.0998 18.1368C30.6379 16.984 32.8329 18.0814 32.8332 20.003V29.2618L24.8751 21.3038L29.0998 18.1368Z" fill="#D9D8D8"/></svg>';
const FS_DPAD =
  '<svg viewBox="0 0 174 174" fill="none"><rect y="174" width="174" height="174" rx="87" transform="rotate(-90 0 174)" fill="#908E8E" fill-opacity="0.4"/><path d="M15.3674 84.568L25.2435 77.4352C27.2275 76.0024 30 77.42 30 79.8673V87V94.1327C30 96.58 27.2275 97.9976 25.2435 96.5648L15.3674 89.432C13.7094 88.2346 13.7094 85.7654 15.3674 84.568Z" fill="#D0C5BA" fill-opacity="0.8"/><path d="M89.432 158.633L96.5648 148.756C97.9976 146.772 96.58 144 94.1327 144H87H79.8673C77.42 144 76.0024 146.772 77.4352 148.756L84.568 158.633C85.7654 160.291 88.2346 160.291 89.432 158.633Z" fill="#D0C5BA" fill-opacity="0.8"/><circle cx="87" cy="87" r="15" fill="#D0C5BA" fill-opacity="0.8"/><path d="M89.432 15.3674L96.5648 25.2435C97.9976 27.2275 96.58 30 94.1327 30H87H79.8673C77.42 30 76.0024 27.2275 77.4352 25.2435L84.568 15.3674C85.7654 13.7094 88.2346 13.7094 89.432 15.3674Z" fill="#D0C5BA" fill-opacity="0.8"/><path d="M158.633 84.568L148.756 77.4352C146.772 76.0024 144 77.42 144 79.8673V87V94.1327C144 96.58 146.772 97.9976 148.756 96.5648L158.633 89.432C160.291 88.2346 160.291 85.7654 158.633 84.568Z" fill="#D0C5BA" fill-opacity="0.8"/></svg>';

// 预设位网格:一排 3 个(面板左右 padding 18,列间距 10)
const WIN = Dimensions.get('window');
const PRESET_W = Math.floor((WIN.width - 18 * 2 - 10 * 2) / 3);

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
  const [fullscreen, setFullscreen] = useState(false);
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
          <CamPreview live tag="Person · sofa" label="14:22:08">
            <View style={st.resBadge}>
              <Text style={st.resTxt}>1080P</Text>
            </View>
            <Tap style={st.scanBtn} onPress={() => setFullscreen(true)} hitSlop={8}>
              <SvgXml xml={FULLSCREEN_ICON} width={16} height={16} color="#fff" />
            </Tap>
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

      {/* 全屏预览 —— Figma 830:1018:全出血画面 + 左上返回 + 右侧竖排控钮 + 左下方向盘 */}
      <Modal visible={fullscreen} animationType="fade" onRequestClose={() => setFullscreen(false)}>
        <View style={st.fsRoot}>
          <View style={[st.fsStage, { width: WIN.height, height: WIN.width }]}>
            {/* 画面全出血 */}
            <View style={StyleSheet.absoluteFill}>
              <CamPreview height={WIN.width} showBox={false} tag="" />
            </View>

            {/* 返回 */}
            <Tap style={st.fsBack} onPress={() => setFullscreen(false)} hitSlop={10}>
              <Icon name="chevL" size={18} color="#fff" sw={2.2} />
            </Tap>

            {/* 右侧控钮列 */}
            <View style={st.fsRail}>
              <Tap onPress={() => toggleCtl('ctlSpk')}><SvgXml xml={FS_MUTE} width={54} height={54} /></Tap>
              <Tap
                onPress={() => {
                  if (ctl.ctlRec) showSaveToast('video');
                  toggleCtl('ctlRec');
                }}
              >
                <SvgXml xml={FS_REC} width={54} height={54} />
              </Tap>
              <Tap onPress={snap}><SvgXml xml={FS_SNAP} width={54} height={54} /></Tap>
              <Tap onPress={() => toggleCtl('ctlMic')}><SvgXml xml={FS_MIC} width={54} height={54} /></Tap>
              <SvgXml xml={FS_FHD} width={54} height={54} />
            </View>

            {/* 左下方向盘 */}
            <View style={st.fsDpad}>
              <SvgXml xml={FS_DPAD} width={174} height={174} />
            </View>

            {/* 保存成功 toast(全屏深色变体) */}
            {saveToast != null && (
              <View style={st.fsToast}>
                <View style={st.fsToastThumb}>
                  <CamPreview height={40} showBox={false} tag="" />
                </View>
                <Text style={st.fsToastTxt} numberOfLines={1}>
                  {saveToast === 'photo' ? 'Photo saved to album' : 'Video saved to album'}{' '}
                  <Text style={st.fsToastLink}>Tap to view</Text>
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

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
        {/* Figma 1655:1625 卡片样式;上下换行排列,一排最多 3 个 */}
        <View style={st.presetGrid}>
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
        </View>
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
  // bottom 17:与右侧 30 高的全屏按钮(bottom 8)垂直居中对齐
  camLabel: {
    position: 'absolute',
    bottom: 17,
    left: 12,
    color: 'rgba(255,255,255,.85)',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
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
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  presetCard: {
    width: PRESET_W, height: 143, borderRadius: 14, overflow: 'hidden',
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
  // 保存成功弹窗:小号胶片 + 单行文案(72×44 缩略图,圆角 20)
  saveToast: {
    position: 'absolute', left: 16, right: 16, zIndex: 60,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 20, padding: 8, paddingRight: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  saveThumb: { width: 72, height: 44, borderRadius: 10, overflow: 'hidden' },
  saveTxt: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  saveLink: { color: colors.brand, fontWeight: '600' },

  fsRoot: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  fsStage: { transform: [{ rotate: '90deg' }], overflow: 'hidden' },
  // 控件整体向内收,避开刘海 / Home 条(横屏两长边即竖屏的上下安全区)
  fsBack: {
    position: 'absolute', top: 24, left: 34, width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(80,80,80,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  fsRail: {
    position: 'absolute', right: 36, top: 40, bottom: 40,
    justifyContent: 'space-between', alignItems: 'center',
  },
  fsDpad: { position: 'absolute', left: 110, bottom: 32 },
  fsToast: {
    position: 'absolute', bottom: 34, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(28,28,30,0.72)', borderRadius: 14, padding: 8, paddingRight: 16,
  },
  fsToastThumb: { width: 64, height: 40, borderRadius: 8, overflow: 'hidden' },
  fsToastTxt: { fontSize: 15, fontWeight: '600', color: '#fff' },
  fsToastLink: { color: '#6EA8FF', fontWeight: '600' },

  presetPopupBtn: {
    width: '100%', height: 54, borderRadius: 99, marginTop: 18,
    backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  addCard: {
    width: PRESET_W,
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

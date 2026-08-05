import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Linking,
} from 'react-native';
import { Screen, Tap, Card, Header, Eyebrow, Row, ToggleRow, SettingRow } from '../components/kit';
import { BottomSheet } from '../components/BottomSheet';
import { Icon } from '../components/Icon';
import { SvgXml } from 'react-native-svg';
import { getDemoFlags } from '../features/app/demoStore';
import { CONV_EDIT, CONV_TRASH } from '../icons/protoIcons';
import { PHOTOICONS } from '../icons/protoSets';
import { colors } from '../theme';

// 原型 ALARM_PERIODS
const PERIODS = ['All Day', 'Daytime · 06:00–18:00', 'Night · 22:00–07:00'];
const p2 = (n: number) => (n < 10 ? '0' : '') + n;

type Rec = { id: string; name: string };

/* ---- av radio row (avRow) — hollow/filled circle + optional right value ---- */
function AvRow({
  label,
  value,
  on,
  onPress,
  onValuePress,
  last,
}: {
  label: string;
  value?: string;
  on: boolean;
  onPress?: () => void;
  onValuePress?: () => void;
  last?: boolean;
}) {
  return (
    <Tap onPress={onPress} style={st.avRow}>
      {!last && <View style={st.divider} />}
      <View style={[st.radio, { borderColor: on ? colors.brand : colors.borderStrong }]}>
        {on && <View style={st.radioDot} />}
      </View>
      <Text style={st.avLabel}>{label}</Text>
      {!!value && (
        // 值区域单独可点(打开管理弹层),不与"选中"动作混在一起
        <Tap onPress={onValuePress ?? onPress} hitSlop={8} style={st.avValueTap}>
          <Text style={st.avValue}>{value}</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>
      )}
    </Tap>
  );
}

/* ---- 弹层里的单选行(与设备设置弹层同款:文案左、圆圈右) ---- */
function SheetRadio({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Tap onPress={onPress} style={st.sheetRadioRow}>
      <Text style={[st.sheetRadioLabel, on && { color: colors.brand }]}>{label}</Text>
      <View style={[st.radio, { borderColor: on ? colors.brand : colors.borderStrong }]}>
        {on && <View style={st.radioDot} />}
      </View>
    </Tap>
  );
}

function RecordingMicButton({ onPress }: { onPress: () => void }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    pulse.stopAnimation();
    pulse.setValue(reduceMotion ? 0.5 : 0);
    if (reduceMotion) return undefined;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, reduceMotion]);

  return (
    <Tap
      style={st.recMicTap}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Stop recording"
    >
      <Animated.View
        pointerEvents="none"
        style={[
          st.recPulseOuter,
          {
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.14] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1.08] }) }],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          st.recPulseMiddle,
          {
            opacity: pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.78, 0.5] }),
            transform: [
              { scale: pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.92, 1.03, 0.92] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          st.recBigBtn,
          {
            transform: [
              { scale: pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.97, 1] }) },
            ],
          },
        ]}
      >
        <SvgXml xml={PHOTOICONS.micSolid} width={30} height={35} color="#fff" />
      </Animated.View>
    </Tap>
  );
}

export default function AlarmReminder({ navigation }: AppScreenProps) {
  const [notifOn, setNotifOn] = useState(true);
  const [voiceAlarm, setVoiceAlarm] = useState(true);
  const [alarmVoice, setAlarmVoice] = useState<'system' | 'custom'>('system');
  const [alarmPeriod, setAlarmPeriod] = useState('All Day');
  const [sheet, setSheet] = useState<null | 'period' | 'cv'>(null);

  const toggleAlarmNotification = () => {
    const nextNotifOn = !notifOn;
    setNotifOn(nextNotifOn);
    if (!nextNotifOn) setVoiceAlarm(false);
  };

  // 自定义语音(原型 cv*):最多 3 条录音
  const [recs, setRecs] = useState<Rec[]>([]);
  const nextRecordingNumber = useRef(1);
  const [sel, setSel] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [sec, setSec] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [delId, setDelId] = useState<string | null>(null);
  const [limitDlg, setLimitDlg] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  // 概率性状态:麦克风权限被拒(sheet 内引导)/ 上传、删除失败(sheet 内错误提示条)
  const [micDlg, setMicDlg] = useState(false);
  const [cvErr, setCvErr] = useState<string | null>(null);
  const [cvSuccess, setCvSuccess] = useState<string | null>(null);
  const cvErrTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cvSuccessTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (cvErrTimer.current) clearTimeout(cvErrTimer.current);
      if (cvSuccessTimer.current) clearTimeout(cvSuccessTimer.current);
    },
    [],
  );
  const showCvErr = (msg: string) => {
    setCvSuccess(null);
    if (cvSuccessTimer.current) clearTimeout(cvSuccessTimer.current);
    setCvErr(msg);
    if (cvErrTimer.current) clearTimeout(cvErrTimer.current);
    cvErrTimer.current = setTimeout(() => setCvErr(null), 2400);
  };
  const showCvSuccess = (msg: string) => {
    setCvErr(null);
    if (cvErrTimer.current) clearTimeout(cvErrTimer.current);
    setCvSuccess(msg);
    if (cvSuccessTimer.current) clearTimeout(cvSuccessTimer.current);
    cvSuccessTimer.current = setTimeout(() => setCvSuccess(null), 2400);
  };

  const startRec = () => {
    if (recs.length >= 3) {
      setLimitDlg(true);
      return;
    }
    // 录音权限被拒 → sheet 内引导弹窗
    if (getDemoFlags().permsDenied) {
      setMicDlg(true);
      return;
    }
    setMenuId(null);
    setSec(0);
    setRecording(true);
  };

  const stopRec = () => {
    setRecording(false);
    // 上传失败演示:不入列表
    if (getDemoFlags().failOps) {
      showCvErr('Failed to upload the recording.');
      return;
    }
    const id = `r${Date.now()}`;
    const recordingNumber = nextRecordingNumber.current;
    nextRecordingNumber.current += 1;
    setRecs((prev) => prev.concat({ id, name: `Recording ${recordingNumber}` }));
    // 首条录音自动选用并切到自定义语音(对齐原型)
    if (!sel) {
      setSel(id);
      setAlarmVoice('custom');
    }
    showCvSuccess('Recording saved');
  };

  const selectRec = (id: string) => {
    setSel(id);
    setAlarmVoice('custom');
  };

  const confirmDelete = () => {
    // 删除失败演示
    if (getDemoFlags().failOps) {
      setDelId(null);
      showCvErr('Failed to delete. Please try again.');
      return;
    }
    setRecs((prev) => prev.filter((r) => r.id !== delId));
    if (sel === delId) {
      setSel(null);
      setAlarmVoice('system');
    }
    setDelId(null);
  };

  const selName = sel ? recs.find((r) => r.id === sel)?.name : null;
  const closeSheet = () => {
    if (sheet === 'cv') {
      setRecording(false);
      setSec(0);
      setLimitDlg(false);
      setMicDlg(false);
      setDelId(null);
      setCvErr(null);
      setCvSuccess(null);
      if (cvErrTimer.current) {
        clearTimeout(cvErrTimer.current);
        cvErrTimer.current = null;
      }
      if (cvSuccessTimer.current) {
        clearTimeout(cvSuccessTimer.current);
        cvSuccessTimer.current = null;
      }
    }
    setSheet(null);
    setMenuId(null);
    setRenameId(null);
    setRenameVal('');
    setPlaying(null);
  };

  return (
    <Screen header={<Header title="Alarm Reminder" onBack={() => navigation.goBack()} />}>
      <Eyebrow>Alarm settings</Eyebrow>
      <Card style={st.card}>
        <ToggleRow name="Alarm Notification" on={notifOn} onToggle={toggleAlarmNotification} />
        <ToggleRow
          name="Voice Alarm"
          on={voiceAlarm}
          onToggle={notifOn ? () => setVoiceAlarm((v) => !v) : undefined}
          last
        />
      </Card>

      {voiceAlarm && (
        <>
          <Eyebrow>Alarm voice</Eyebrow>
          <Card style={st.card}>
            <AvRow
              label="System Voice"
              on={alarmVoice === 'system'}
              onPress={() => setAlarmVoice('system')}
            />
            <AvRow
              label="Custom Voice"
              value={selName ?? 'Not added'}
              on={alarmVoice === 'custom'}
              // 点击 = 立即选中 + 弹出管理弹层
              onPress={() => {
                setAlarmVoice('custom');
                setSheet('cv');
              }}
              last
            />
          </Card>
        </>
      )}

      <Eyebrow>Alarm period</Eyebrow>
      <Card style={st.card}>
        <SettingRow icon="clock" name="Alarm Period" value={alarmPeriod} onPress={() => setSheet('period')} last />
      </Card>

      {/* 报警时段(与设备设置弹层同规范:点选只切换,Done 确认) */}
      <BottomSheet
        visible={sheet === 'period'}
        title="Alarm Period"
        desc="Choose when the alarm stays active."
        onClose={closeSheet}
      >
        {PERIODS.map((p) => (
          <SheetRadio key={p} label={p} on={alarmPeriod === p} onPress={() => setAlarmPeriod(p)} />
        ))}
        <Pressable onPress={closeSheet} style={({ pressed }) => [st.doneBtn, pressed && { opacity: 0.85 }]}>
          <Text style={st.doneBtnTxt}>Done</Text>
        </Pressable>
      </BottomSheet>

      {/* 自定义语音(原型 cvSheet:录音/列表/选用/重命名/删除) */}
      <BottomSheet
        visible={sheet === 'cv'}
        title="Custom Voice"
        desc="Support up to 3 custom voice recordings."
        onClose={closeSheet}
        floating={
          cvSuccess != null ? (
            <Row style={st.cvSuccessFloating}>
              <Icon name="check" size={13} color={colors.success} sw={2.4} />
              <Text style={st.cvSuccessTxt}>{cvSuccess}</Text>
            </Row>
          ) : null
        }
        overlay={
          limitDlg ? (
            <Pressable style={st.ovl} onPress={() => setLimitDlg(false)}>
              <Pressable style={st.delCard} onPress={(e) => e.stopPropagation()}>
                <View style={st.micIcon}>
                  <Icon name="mic" size={24} color={colors.brand} sw={1.8} />
                </View>
                <Text style={st.delTitle}>Recording limit reached</Text>
                <Text style={st.delDesc}>You can add up to 3 custom voice recordings.</Text>
                <Pressable
                  style={[st.limitBtn, { backgroundColor: colors.brand }]}
                  onPress={() => setLimitDlg(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close recording limit message"
                >
                  <Text style={[st.delBtnTxt, { color: colors.textInverse }]}>Got it</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          ) : micDlg ? (
            <Pressable style={st.ovl} onPress={() => setMicDlg(false)}>
              <Pressable style={st.delCard} onPress={(e) => e.stopPropagation()}>
                <View style={st.micIcon}>
                  <Icon name="mic" size={24} color={colors.brand} sw={1.8} />
                </View>
                <Text style={st.delTitle}>Microphone Access Needed</Text>
                <Text style={st.delDesc}>
                  Microphone access is required to record a custom voice. Please allow it in Settings.
                </Text>
                <Row style={{ gap: 12, marginTop: 20 }}>
                  <Pressable
                    style={[st.delBtn, { backgroundColor: colors.bgSecondary }]}
                    onPress={() => setMicDlg(false)}
                  >
                    <Text style={[st.delBtnTxt, { color: colors.textSecondary }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[st.delBtn, { backgroundColor: colors.brand }]}
                    onPress={() => {
                      Linking.openSettings().catch(() => {});
                      setMicDlg(false);
                    }}
                  >
                    <Text style={[st.delBtnTxt, { color: '#fff' }]}>Go to Settings</Text>
                  </Pressable>
                </Row>
              </Pressable>
            </Pressable>
          ) : delId != null ? (
            <Pressable style={st.ovl} onPress={() => setDelId(null)}>
              <Pressable style={st.deleteCard} onPress={(e) => e.stopPropagation()}>
                <Text style={st.deleteTitle}>Delete Recording</Text>
                <Text style={st.deleteDesc}>
                  Are you sure you want to delete this recording? This action cannot be undone.
                </Text>
                <Row style={st.deleteActionRow}>
                  <Pressable
                    style={[st.deleteBtn, st.deleteCancel]}
                    onPress={() => setDelId(null)}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel deleting recording"
                  >
                    <Text style={st.deleteCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[st.deleteBtn, st.deleteConfirm]}
                    onPress={confirmDelete}
                    accessibilityRole="button"
                    accessibilityLabel="Delete recording permanently"
                  >
                    <Text style={st.deleteConfirmText}>Confirm</Text>
                  </Pressable>
                </Row>
              </Pressable>
            </Pressable>
          ) : null
        }
      >
        {/* sheet 内失败提示条(全局 toast 位于 Modal 之下,需就地提示) */}
        {cvErr != null && (
          <Row style={st.cvErrPill}>
            <Icon name="warn" size={13} color={colors.critical} sw={2} />
            <Text style={st.cvErrTxt}>{cvErr}</Text>
          </Row>
        )}
        {recording ? (
          <View style={st.recordingPanel}>
            <Text style={st.recTimer}>
              {p2(Math.floor(sec / 60))}:{p2(sec % 60)}
              <Text style={st.recTimerUnit}> s</Text>
            </Text>
            <RecordingMicButton onPress={stopRec} />
            <Row style={st.recStatus}>
              <View style={st.recDot} />
              <Text style={st.recHint}>Recording…</Text>
            </Row>
          </View>
        ) : recs.length === 0 ? (
          <>
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
              <View style={st.micCircle}>
                <Icon name="mic" size={26} color={colors.textTertiary} />
              </View>
              <Text style={st.emptyHint}>
                Tap the button below to start recording{'\n'}your custom alarm voice
              </Text>
            </View>
            <Pressable onPress={startRec} style={({ pressed }) => [st.doneBtn, pressed && { opacity: 0.85 }]}>
              <Text style={st.doneBtnTxt}>Record Now</Text>
            </Pressable>
          </>
        ) : (
          <>
            {recs.map((r) => {
              const isSel = sel === r.id;
              const isPlaying = playing === r.id;
              if (renameId === r.id) {
                return (
                  <Row key={r.id} style={{ gap: 10, paddingVertical: 10 }}>
                    <TextInput
                      value={renameVal}
                      onChangeText={setRenameVal}
                      autoFocus
                      style={st.renameInput}
                    />
                    <Tap
                      style={st.renameSave}
                      onPress={() => {
                        setRecs((prev) =>
                          prev.map((x) => (x.id === r.id ? { ...x, name: renameVal.trim() || x.name } : x)),
                        );
                        setRenameId(null);
                      }}
                    >
                      <Icon name="check" size={15} color="#fff" sw={3} />
                    </Tap>
                  </Row>
                );
              }
              return (
                <Row key={r.id} style={{ gap: 10, paddingVertical: 10, zIndex: menuId === r.id ? 40 : 0 }}>
                  <Tap onPress={() => selectRec(r.id)} hitSlop={6}>
                    <View style={[st.radio, { borderColor: isSel ? colors.brand : colors.borderStrong }]}>
                      {isSel && <View style={st.radioDot} />}
                    </View>
                  </Tap>
                  <Tap onPress={() => selectRec(r.id)} style={{ flex: 1 }}>
                    <Text style={st.recName}>{r.name}</Text>
                  </Tap>
                  <Tap style={st.playBtn} onPress={() => setPlaying(isPlaying ? null : r.id)}>
                    <Icon name={isPlaying ? 'volume' : 'play'} size={15} color="#fff" sw={1.6} />
                  </Tap>
                  <View>
                    <Tap style={st.dotsBtn} onPress={() => setMenuId(menuId === r.id ? null : r.id)} hitSlop={6}>
                      <Icon name="more" size={16} color={colors.textTertiary} />
                    </Tap>
                    {menuId === r.id && (
                      <View style={st.recMenu}>
                        <Tap
                          style={st.recMenuRow}
                          onPress={() => {
                            setRenameId(r.id);
                            setRenameVal(r.name);
                            setMenuId(null);
                          }}
                        >
                          <SvgXml xml={CONV_EDIT} width={16} height={16} color={colors.textPrimary} />
                          <Text style={st.recMenuTxt}>Rename</Text>
                        </Tap>
                        <View style={st.recMenuDiv} />
                        <Tap
                          style={st.recMenuRow}
                          onPress={() => {
                            setDelId(r.id);
                            setMenuId(null);
                          }}
                        >
                          <SvgXml xml={CONV_TRASH} width={16} height={16} color={colors.critical} />
                          <Text style={[st.recMenuTxt, { color: colors.critical }]}>Delete</Text>
                        </Tap>
                      </View>
                    )}
                  </View>
                </Row>
              );
            })}
            <Pressable
              onPress={renameId == null ? startRec : undefined}
              style={({ pressed }) => [
                st.doneBtn,
                { flexDirection: 'row', gap: 8 },
                renameId != null && { opacity: 0.45 },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Icon name="plus" size={15} color="#fff" sw={2.2} />
              <Text style={st.doneBtnTxt}>Add New Recording</Text>
            </Pressable>
          </>
        )}
      </BottomSheet>

    </Screen>
  );
}

const st = StyleSheet.create({
  card: { marginHorizontal: 18 },
  avRow: { flexDirection: 'row', alignItems: 'center', minHeight: 54, paddingHorizontal: 16, gap: 12 },
  divider: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
  avLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  avValue: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },
  avValueTap: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 54, marginRight: -4, paddingRight: 4 },

  sheetRadioRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 2,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  sheetRadioLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  doneBtn: {
    width: '100%', height: 50, borderRadius: 99, marginTop: 14,
    backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  doneBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // 录音态
  recordingPanel: {
    minHeight: 290,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  recTimer: {
    fontSize: 48,
    lineHeight: 58,
    fontWeight: '700',
    letterSpacing: -1.5,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  recTimerUnit: { fontSize: 15, fontWeight: '700', letterSpacing: 0, color: colors.textPrimary },
  recMicTap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 22,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recPulseOuter: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.brandSoft,
  },
  recPulseMiddle: {
    position: 'absolute',
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: 'rgba(35,130,255,0.16)',
  },
  recBigBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recStatus: { gap: 8 },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.critical },
  recHint: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },

  // 空态
  micCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.bgSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyHint: {
    marginTop: 12, fontSize: 12, fontWeight: '500', color: colors.textTertiary,
    lineHeight: 18, textAlign: 'center',
  },

  // 列表
  recName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  playBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  dotsBtn: { width: 26, height: 34, alignItems: 'center', justifyContent: 'center' },
  recMenu: {
    position: 'absolute', right: 0, top: 38, width: 150, zIndex: 30,
    backgroundColor: colors.surface, borderRadius: 14,
    shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  recMenuRow: { height: 44, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  recMenuTxt: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  recMenuDiv: { height: 1, backgroundColor: colors.border },
  renameInput: {
    flex: 1, height: 40, paddingHorizontal: 12,
    borderWidth: 1.5, borderColor: colors.brand, borderRadius: 10,
    fontSize: 14, fontWeight: '600', color: colors.textPrimary, backgroundColor: colors.surface,
  },
  renameSave: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  // 删除确认
  ovl: { flex: 1, backgroundColor: 'rgba(0,0,0,0.38)', alignItems: 'center', justifyContent: 'center', padding: 34 },
  delCard: {
    width: '100%', maxWidth: 322, backgroundColor: colors.surface, borderRadius: 24,
    paddingHorizontal: 22, paddingTop: 26, paddingBottom: 20, alignItems: 'center',
  },
  delTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  delDesc: {
    marginTop: 10, fontSize: 13, fontWeight: '500', color: colors.textTertiary,
    lineHeight: 20, textAlign: 'center',
  },
  delBtn: { flex: 1, height: 46, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  delBtnTxt: { fontSize: 15, fontWeight: '700' },
  limitBtn: { width: '100%', height: 46, borderRadius: 99, marginTop: 20, alignItems: 'center', justifyContent: 'center' },

  // 删除录音确认:沿用设备删除确认的居中大圆角卡片与双按钮结构。
  deleteCard: {
    width: '100%', maxWidth: 350, backgroundColor: colors.surface, borderRadius: 28,
    paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24, alignItems: 'center',
  },
  deleteTitle: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  deleteDesc: {
    marginTop: 14, fontSize: 14, fontWeight: '500', color: colors.textSecondary,
    lineHeight: 22, textAlign: 'center',
  },
  deleteActionRow: { width: '100%', gap: 14, marginTop: 22 },
  deleteBtn: { flex: 1, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  deleteCancel: { backgroundColor: colors.bgSecondary },
  deleteConfirm: { backgroundColor: colors.critical },
  deleteCancelText: { fontSize: 18, fontWeight: '600', color: colors.textSecondary },
  deleteConfirmText: { fontSize: 18, fontWeight: '700', color: colors.textInverse },

  // 麦克风权限引导 / sheet 内失败提示条
  micIcon: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.brandSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  cvErrPill: {
    alignSelf: 'center',
    gap: 8,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: colors.criticalSoft,
    marginBottom: 10,
  },
  cvErrTxt: { fontSize: 13, fontWeight: '600', color: colors.critical },
  cvSuccessFloating: {
    gap: 8, height: 34, paddingHorizontal: 14, borderRadius: 17,
    backgroundColor: colors.successSoft,
  },
  cvSuccessTxt: { fontSize: 13, fontWeight: '600', color: colors.success },
});

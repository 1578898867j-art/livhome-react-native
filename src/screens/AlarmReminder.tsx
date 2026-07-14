import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import { Screen, Tap, Card, Header, Eyebrow, Row, ToggleRow, SettingRow } from '../components/kit';
import { BottomSheet } from '../components/BottomSheet';
import { Icon } from '../components/Icon';
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
  last,
}: {
  label: string;
  value?: string;
  on: boolean;
  onPress?: () => void;
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
        <>
          <Text style={st.avValue}>{value}</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </>
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

export default function AlarmReminder({ navigation }: AppScreenProps) {
  const [notifOn, setNotifOn] = useState(true);
  const [voiceAlarm, setVoiceAlarm] = useState(true);
  const [alarmVoice, setAlarmVoice] = useState<'system' | 'custom'>('system');
  const [alarmPeriod, setAlarmPeriod] = useState('All Day');
  const [sheet, setSheet] = useState<null | 'period' | 'cv'>(null);

  // 自定义语音(原型 cv*):最多 3 条录音
  const [recs, setRecs] = useState<Rec[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [sec, setSec] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [delId, setDelId] = useState<string | null>(null);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const startRec = () => {
    if (recs.length >= 3) return;
    setMenuId(null);
    setSec(0);
    setRecording(true);
  };

  const stopRec = () => {
    setRecording(false);
    const id = `r${Date.now()}`;
    setRecs((prev) => prev.concat({ id, name: `Recording ${prev.length + 1}` }));
    // 首条录音自动选用并切到自定义语音(对齐原型)
    if (!sel) {
      setSel(id);
      setAlarmVoice('custom');
    }
  };

  const selectRec = (id: string) => {
    setSel(id);
    setAlarmVoice('custom');
  };

  const confirmDelete = () => {
    setRecs((prev) => prev.filter((r) => r.id !== delId));
    if (sel === delId) {
      setSel(null);
      setAlarmVoice('system');
    }
    setDelId(null);
  };

  const selName = sel ? recs.find((r) => r.id === sel)?.name : null;
  const closeSheet = () => {
    setSheet(null);
    setMenuId(null);
    setRenameId(null);
    setPlaying(null);
  };

  return (
    <Screen>
      <Header title="Alarm Reminder" onBack={() => navigation.goBack()} />

      <Eyebrow>Alarm settings</Eyebrow>
      <Card style={st.card}>
        <ToggleRow name="Alarm Notification" on={notifOn} onToggle={() => setNotifOn((v) => !v)} />
        <ToggleRow name="Voice Alarm" on={voiceAlarm} onToggle={() => setVoiceAlarm((v) => !v)} last />
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
              onPress={() => setSheet('cv')}
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
      >
        {recording ? (
          <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 6 }}>
            <Text style={st.recTimer}>
              {Math.floor(sec / 60)}:{p2(sec % 60)}
              <Text style={st.recTimerUnit}> s</Text>
            </Text>
            <Tap style={st.recBigBtn} onPress={stopRec}>
              <Icon name="mic" size={26} color="#fff" />
            </Tap>
            <Row style={{ gap: 6 }}>
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
                          <Icon name="edit" size={14} color={colors.textPrimary} />
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
                          <Icon name="trash" size={14} color={colors.critical} />
                          <Text style={[st.recMenuTxt, { color: colors.critical }]}>Delete</Text>
                        </Tap>
                      </View>
                    )}
                  </View>
                </Row>
              );
            })}
            <Pressable
              onPress={recs.length < 3 && renameId == null ? startRec : undefined}
              style={({ pressed }) => [
                st.doneBtn,
                { flexDirection: 'row', gap: 8 },
                (recs.length >= 3 || renameId != null) && { opacity: 0.45 },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Icon name="plus" size={15} color="#fff" sw={2.2} />
              <Text style={st.doneBtnTxt}>Add New Recording</Text>
            </Pressable>
          </>
        )}
      </BottomSheet>

      {/* 删除录音确认(原型 cv-del) */}
      <Modal transparent visible={delId != null} animationType="fade" onRequestClose={() => setDelId(null)}>
        <Pressable style={st.ovl} onPress={() => setDelId(null)}>
          <Pressable style={st.delCard} onPress={(e) => e.stopPropagation()}>
            <Text style={st.delTitle}>Delete Recording</Text>
            <Text style={st.delDesc}>
              Are you sure you want to delete "{recs.find((r) => r.id === delId)?.name}"? This action
              cannot be undone.
            </Text>
            <Row style={{ gap: 12, marginTop: 20 }}>
              <Pressable style={[st.delBtn, { backgroundColor: colors.bgSecondary }]} onPress={() => setDelId(null)}>
                <Text style={[st.delBtnTxt, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable style={[st.delBtn, { backgroundColor: colors.critical }]} onPress={confirmDelete}>
                <Text style={[st.delBtnTxt, { color: '#fff' }]}>Delete</Text>
              </Pressable>
            </Row>
          </Pressable>
        </Pressable>
      </Modal>
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
  recTimer: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  recTimerUnit: { fontSize: 16, fontWeight: '600', color: colors.textTertiary },
  recBigBtn: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center', marginTop: 16, marginBottom: 10,
    shadowColor: colors.brand, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  recDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.critical },
  recHint: { fontSize: 12, fontWeight: '700', color: colors.critical },

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
  ovl: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center', padding: 34 },
  delCard: {
    width: '100%', maxWidth: 322, backgroundColor: colors.surface, borderRadius: 22,
    paddingHorizontal: 22, paddingTop: 24, paddingBottom: 20, alignItems: 'center',
  },
  delTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  delDesc: {
    marginTop: 10, fontSize: 13, fontWeight: '500', color: colors.textTertiary,
    lineHeight: 20, textAlign: 'center',
  },
  delBtn: { flex: 1, height: 46, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  delBtnTxt: { fontSize: 15, fontWeight: '700' },
});

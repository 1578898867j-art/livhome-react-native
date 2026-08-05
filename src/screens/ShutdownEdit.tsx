import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Screen, Tap, Row, Card, Header, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';
import {
  formatRepeatLabel,
  getEditingSchedule,
  getEditingScheduleIndex,
  hasScheduleConflict,
  saveSchedule,
  useDraftDays,
} from '../features/devices/shutdownStore';
import { getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';
import type { TM } from '../features/devices/shutdownStore';

type Which = 'off' | 'on';
type Unit = 'h' | 'm';

const p2 = (n: number) => (n < 10 ? '0' : '') + n;

const ITEM_H = 48;

// 可滑动滚轮列:snap 到行高,中间灰色胶囊为选中高亮
function WheelCol({ count, value, onChange }: { count: number; value: number; onChange: (v: number) => void }) {
  const ref = useRef<ScrollView>(null);
  const [active, setActive] = useState(value);
  const activeRef = useRef(value);
  const didSyncInitialValue = useRef(false);

  useEffect(() => {
    if (didSyncInitialValue.current) {
      activeRef.current = value;
      setActive(value);
      return;
    }
    didSyncInitialValue.current = true;
    setActive(value);
    ref.current?.scrollTo({ y: value * ITEM_H, animated: false });
  }, [value]);

  const settle = (y: number) => {
    const i = Math.min(count - 1, Math.max(0, Math.round(y / ITEM_H)));
    activeRef.current = i;
    setActive(i);
    onChange(i);
  };

  return (
    <View style={st.wheelColWrap}>
      <View style={st.wheelHighlight} pointerEvents="none" />
      <ScrollView
        ref={ref}
        style={{ height: ITEM_H * 3, alignSelf: 'stretch' }}
        scrollEnabled
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="normal"
        contentContainerStyle={{ paddingVertical: ITEM_H }}
        scrollEventThrottle={48}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          if (i !== activeRef.current && i >= 0 && i < count) {
            activeRef.current = i;
            setActive(i);
          }
        }}
        onMomentumScrollEnd={(e) => settle(e.nativeEvent.contentOffset.y)}
        onScrollEndDrag={(e) => {
          if (Math.abs(e.nativeEvent.velocity?.y ?? 0) < 0.05) settle(e.nativeEvent.contentOffset.y);
        }}
      >
        {Array.from({ length: count }, (_, v) => (
          <View key={v} style={st.wheelItem}>
            <Text style={[v === active ? st.wheelCur : st.wheelSide, st.mono]}>{p2(v)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function ShutdownEdit({ navigation }: AppScreenProps) {
  const existingSchedule = getEditingSchedule();
  const editingScheduleIndex = getEditingScheduleIndex();
  const [edOff, setEdOff] = useState<TM>(() => existingSchedule?.off ?? { h: 22, m: 0 });
  const [edOn, setEdOn] = useState<TM>(() => existingSchedule?.on ?? { h: 7, m: 0 });
  const edDays = useDraftDays(); // Repeat 页的选择实时同步
  const edErr = hasScheduleConflict({ off: edOff, on: edOn, days: edDays }, editingScheduleIndex);

  const save = () => {
    if (edErr) {
      showToast('This schedule overlaps with an existing schedule.', 'error');
      return;
    }
    // 保存失败演示:提示错误,停留本页
    if (getDemoFlags().failOps) {
      showToast('Failed to save. Please try again.', 'error');
      return;
    }
    saveSchedule({ off: edOff, on: edOn, days: edDays });
    navigation.goBack();
  };

  const setUnit = (which: Which, unit: Unit, v: number) => {
    const set = which === 'off' ? setEdOff : setEdOn;
    set((t) => ({ ...t, [unit]: v }));
  };

  const wheel = (which: Which, t: TM) => (
    <Row style={st.wheelRow}>
      <WheelCol count={24} value={t.h} onChange={(v) => setUnit(which, 'h', v)} />
      <Text style={st.colon}>:</Text>
      <WheelCol count={60} value={t.m} onChange={(v) => setUnit(which, 'm', v)} />
    </Row>
  );

  const timeCard = (label: string, which: Which, t: TM) => (
    <Card style={st.timeCard}>
      <Row style={{ marginBottom: 4 }}>
        <Text style={st.timeLabel}>{label}</Text>
        <Text style={[st.timeValue, st.mono]}>
          {p2(t.h)}:{p2(t.m)}
        </Text>
      </Row>
      {wheel(which, t)}
    </Card>
  );

  return (
    <Screen
      scroll={false}
      dismissKeyboardOnPress={false}
      header={<Header title="Device off Time" onBack={() => navigation.goBack()} />}
    >
      <View style={st.body}>
        {timeCard('Turn Off Time', 'off', edOff)}
        {timeCard('Turn On Time', 'on', edOn)}

        <Tap style={st.repeatRow} onPress={() => navigation.navigate('shutdown-repeat')}>
          <Text style={st.repeatName}>Repeat</Text>
          <Text style={st.repeatValue}>{formatRepeatLabel(edDays)}</Text>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>

        {edErr && (
          <View style={st.errBox}>
            <Text style={st.errText}>
              This time overlaps with an existing schedule. Please adjust the time or repeat days.
            </Text>
          </View>
        )}
      </View>

      <View style={st.footer}>
        <PrimaryBtn label="Save" onPress={save} style={{ backgroundColor: colors.brand }} />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  mono: { fontVariant: ['tabular-nums'] },
  body: { paddingHorizontal: 18, paddingTop: 8, gap: 14 },

  timeCard: { paddingVertical: 14, paddingHorizontal: 16 },
  timeLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  timeValue: { fontSize: 14, fontWeight: '700', color: colors.brand },

  wheelRow: { justifyContent: 'center', gap: 14, paddingVertical: 6 },
  wheelColWrap: { flex: 1, alignItems: 'center', height: 48 * 3 },
  wheelItem: { height: 48, alignItems: 'center', justifyContent: 'center' },
  wheelHighlight: {
    position: 'absolute', top: 48, alignSelf: 'center',
    width: 78, height: 48, borderRadius: 12, backgroundColor: colors.bgSecondary,
  },
  wheelSide: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textTertiary,
    opacity: 0.45,
  },
  wheelCur: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  colon: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, alignSelf: 'center', paddingTop: 2 },

  repeatRow: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatName: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  repeatValue: { fontSize: 14, fontWeight: '500', color: colors.textTertiary, marginRight: 8 },

  errBox: { backgroundColor: colors.criticalSoft, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16 },
  errText: { fontSize: 13, fontWeight: '600', color: colors.critical, lineHeight: 20 },

  footer: { marginTop: 'auto', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 40 },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Tap, Row } from './kit';
import { Icon } from './Icon';
import { colors } from '../theme';

// 原型 msg-cal 日历弹层(dev-detail 消息页与 SD 回放共用;calTarget=msg/pb)
export const CAL_TODAY = { y: 2026, m: 3, d: 23 };

export default function CalendarModal({
  visible,
  initM,
  initD,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  initM: number;
  initD: number;
  onClose: () => void;
  onConfirm: (m: number, d: number) => void;
}) {
  const [calY, setCalY] = useState(CAL_TODAY.y);
  const [calM, setCalM] = useState(initM);
  const [sel, setSel] = useState({ y: CAL_TODAY.y, m: initM, d: initD });

  useEffect(() => {
    if (visible) {
      setCalY(CAL_TODAY.y);
      setCalM(initM);
      setSel({ y: CAL_TODAY.y, m: initM, d: initD });
    }
  }, [visible, initM, initD]);

  const prevM = () => {
    const dm = new Date(calY, calM - 1, 1);
    setCalY(dm.getFullYear());
    setCalM(dm.getMonth());
  };
  const nextM = () => {
    const dn = new Date(calY, calM + 1, 1);
    setCalY(dn.getFullYear());
    setCalM(dn.getMonth());
  };
  const nextDisabled = calY > CAL_TODAY.y || (calY === CAL_TODAY.y && calM >= CAL_TODAY.m);

  const firstDow = new Date(calY, calM, 1).getDay();
  const dim = new Date(calY, calM + 1, 0).getDate();
  const cells: React.ReactNode[] = [];
  for (let b = 0; b < firstDow; b++) cells.push(<View key={'b' + b} style={st.cell} />);
  for (let d = 1; d <= dim; d++) {
    const isFut =
      calY > CAL_TODAY.y ||
      (calY === CAL_TODAY.y && calM > CAL_TODAY.m) ||
      (calY === CAL_TODAY.y && calM === CAL_TODAY.m && d > CAL_TODAY.d);
    const onSel = !isFut && sel.y === calY && sel.m === calM && sel.d === d;
    const isToday = calY === CAL_TODAY.y && calM === CAL_TODAY.m && d === CAL_TODAY.d;
    cells.push(
      <Tap
        key={d}
        style={[st.cell, isFut && { opacity: 0.4 }]}
        onPress={isFut ? undefined : () => setSel({ y: calY, m: calM, d })}
      >
        <View
          style={[
            st.day,
            onSel ? { backgroundColor: colors.brand } : isToday ? { backgroundColor: colors.bgSecondary } : null,
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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.ovl} onPress={onClose}>
        <Pressable style={st.card} onPress={(e) => e.stopPropagation()}>
          <Row style={{ marginBottom: 14 }}>
            <Tap style={st.navBtn} onPress={prevM}>
              <Icon name="chevL" size={20} color={colors.textSecondary} sw={2} />
            </Tap>
            <Text style={st.mLabel}>
              {calY}-{String(calM + 1).padStart(2, '0')}
            </Text>
            <Tap style={[st.navBtn, nextDisabled && { opacity: 0.3 }]} onPress={nextDisabled ? undefined : nextM}>
              <Icon name="chevR" size={20} color={colors.textSecondary} sw={2} />
            </Tap>
          </Row>
          <View style={st.grid}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
              <Text key={w} style={st.wk}>
                {w}
              </Text>
            ))}
          </View>
          <View style={[st.grid, { marginTop: 4 }]}>{cells}</View>
          <Row style={{ gap: 12, marginTop: 18 }}>
            <Tap style={[st.footBtn, { backgroundColor: colors.bgSecondary }]} onPress={onClose}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textSecondary }}>Cancel</Text>
            </Tap>
            <Tap style={[st.footBtn, { backgroundColor: colors.brand }]} onPress={() => onConfirm(sel.m, sel.d)}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Confirm</Text>
            </Tap>
          </Row>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const st = StyleSheet.create({
  ovl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: 26,
    paddingTop: 22,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  mLabel: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  wk: {
    width: `${100 / 7}%` as any,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    paddingVertical: 6,
  },
  cell: { width: `${100 / 7}%` as any, height: 44, alignItems: 'center', justifyContent: 'center' },
  day: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  footBtn: { flex: 1, height: 52, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
});

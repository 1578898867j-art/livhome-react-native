import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row, Card, Header, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { MOONICON, SUNICON, ARROWBOX, TRASHICON } from '../icons/protoIcons';
import { colors } from '../theme';
import { removeSchedule, resetDraftDays, useSchedules } from '../features/devices/shutdownStore';
import { getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';

const p2 = (n: number) => (n < 10 ? '0' : '') + n;

function repeatLabel(days: boolean[]) {
  const n = days.filter(Boolean).length;
  if (n === 7) return 'Everyday';
  if (n === 0) return 'Once';
  if (days[1] && days[2] && days[3] && days[4] && days[5] && !days[0] && !days[6]) return 'Weekdays';
  if (days[0] && days[6] && n === 2) return 'Weekends';
  return 'Custom';
}

export default function ShutdownList({ navigation }: AppScreenProps) {
  const schedules = useSchedules();

  const del = (i: number) => {
    // 删除失败演示:提示错误,保留方案
    if (getDemoFlags().failOps) {
      showToast('Failed to delete. Please try again.', 'error');
      return;
    }
    removeSchedule(i);
  };
  const goAdd = () => {
    resetDraftDays();
    navigation.navigate('shutdown-edit');
  };

  if (!schedules.length) {
    return (
      <Screen
        scroll={false}
        header={<Header title="Device off Time" onBack={() => navigation.goBack()} />}
      >
        <View style={{ flex: 1 }}>
          <View style={st.empty}>
            <Icon name="timer" size={76} color={colors.borderStrong} sw={1.3} />
            <Text style={st.emptyText}>No time set yet</Text>
          </View>
          <View style={st.footer}>
            <PrimaryBtn label="Add" onPress={goAdd} style={st.addBtn} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      scroll={false}
      header={<Header title="Device off Time" onBack={() => navigation.goBack()} />}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 100, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {schedules.map((s, i) => {
            const off = p2(s.off.h) + ':' + p2(s.off.m);
            const on = p2(s.on.h) + ':' + p2(s.on.m);
            const nd = s.on.h * 60 + s.on.m <= s.off.h * 60 + s.off.m;
            return (
              <Tap key={i} onPress={() => navigation.navigate('shutdown-edit')}>
                <Card style={st.schedCard}>
                  <Row style={{ alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Row style={{ gap: 6 }}>
                        <SvgXml xml={MOONICON} width={14} height={14} color={colors.textTertiary} />
                        <Text style={st.eyebrow}>TURN OFF</Text>
                      </Row>
                      <Text style={st.time}>{off}</Text>
                    </View>
                    <View style={st.arrowBox}>
                      <SvgXml xml={ARROWBOX} width={36} height={36} color="#C7C7CC" />
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Row style={{ gap: 6, justifyContent: 'flex-end' }}>
                        <Text style={st.eyebrow}>TURN ON</Text>
                        <SvgXml xml={SUNICON} width={14} height={14} color={colors.textTertiary} />
                      </Row>
                      <Text style={st.time}>{on}</Text>
                    </View>
                  </Row>
                  <Row style={st.metaRow}>
                    <Text style={st.meta}>
                      Repeat · {repeatLabel(s.days)}
                      {nd ? ' · Next day' : ''}
                    </Text>
                    <Tap style={st.delBtn} onPress={() => del(i)} hitSlop={8}>
                      <SvgXml xml={TRASHICON} width={15} height={15} color={colors.critical} />
                    </Tap>
                  </Row>
                </Card>
              </Tap>
            );
          })}
        </ScrollView>
        <View style={st.footer}>
          <PrimaryBtn label="Add Schedule" onPress={goAdd} style={st.addBtn} />
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingBottom: 90,
  },
  emptyText: { fontSize: 14, fontWeight: '600', color: colors.textTertiary },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 40, // 全局规范:底部按钮距底 40
  },
  addBtn: { width: '100%', height: 54, borderRadius: 99, backgroundColor: colors.brand },
  schedCard: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 14 },
  eyebrow: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  time: { fontSize: 32, fontWeight: '800', letterSpacing: -1, color: colors.textPrimary, marginTop: 2 },
  // ARROWBOX bakes in its own rounded-square background — plain 36px container.
  arrowBox: {
    width: 36,
    height: 36,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 12,
    paddingTop: 10,
    alignItems: 'center',
  },
  meta: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  delBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.criticalSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

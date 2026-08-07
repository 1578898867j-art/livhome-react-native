import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { useDemoFlags, getDemoFlags } from '../features/app/demoStore';
import {
  ALL_NOTIFICATION_EVENTS,
  NOTIFICATION_DAYS,
  type NotificationDayKey,
} from '../features/notifications/demoEvents';
import { showToast } from '../features/app/toastStore';
import { colors, shadow } from '../theme';

const FILTERS = ['All', 'Cloud', 'SD Card'] as const;

export default function NotifDetail({ navigation }: AppScreenProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [selectedDay, setSelectedDay] = useState<NotificationDayKey>('24');
  const [readIds, setReadIds] = useState<number[]>([]);
  const { failLoad } = useDemoFlags();

  const groups = NOTIFICATION_DAYS.map((group) => ({
    ...group,
    events: group.events.filter(
      (event) => filter === 'All' || (filter === 'Cloud' ? event.src === 'cloud' : event.src === 'sd'),
    ),
  }));
  const selectedGroup = groups.find((group) => group.day === selectedDay) ?? groups[0];
  const availableDays = groups
    .filter((group) => group.events.length > 0)
    .map((group) => group.day)
    .sort((a, b) => Number(a) - Number(b));
  const selectedDayIndex = availableDays.indexOf(selectedDay);
  const previousDay = selectedDayIndex > 0 ? availableDays[selectedDayIndex - 1] : null;
  const nextDay =
    selectedDayIndex >= 0 && selectedDayIndex < availableDays.length - 1
      ? availableDays[selectedDayIndex + 1]
      : null;

  const markAllRead = () => {
    if (getDemoFlags().failOps) {
      showToast('Failed to mark all as read.', 'error');
      return;
    }
    setReadIds(ALL_NOTIFICATION_EVENTS.map((event) => event.id));
  };

  return (
    <Screen
      bg={colors.bgSecondary}
      contentStyle={{ paddingBottom: 40 }}
      header={
        <Row style={st.nav}>
          <View style={st.navSlot}>
            <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
              <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
            </Tap>
          </View>
          <Text style={st.navTitle} numberOfLines={1}>Notification Details</Text>
          <View style={st.navSlot} />
        </Row>
      }
    >
      <View style={st.segWrap}>
        {FILTERS.map((item) => (
          <Tap
            key={item}
            style={[st.segBtn, filter === item && st.segBtnOn]}
            onPress={() => setFilter(item)}
          >
            <Text style={[st.segTxt, filter === item && st.segTxtOn]}>{item}</Text>
          </Tap>
        ))}
      </View>

      <Row style={st.dayRow}>
        <Tap
          style={[st.dateNav, !previousDay && st.dateNavDisabled]}
          onPress={previousDay ? () => setSelectedDay(previousDay) : undefined}
          disabled={!previousDay}
          accessibilityLabel="Previous day"
        >
          <Icon name="chevL" size={16} color={colors.textSecondary} sw={2.2} />
        </Tap>
        <Text style={st.dayNum}>{selectedGroup.day}</Text>
        <Text style={st.dayMon}> {selectedGroup.mon}</Text>
        <Tap
          style={[st.dateNav, !nextDay && st.dateNavDisabled]}
          onPress={nextDay ? () => setSelectedDay(nextDay) : undefined}
          disabled={!nextDay}
          accessibilityLabel="Next day"
        >
          <Icon name="chevR" size={16} color={colors.textSecondary} sw={2.2} />
        </Tap>
        <View style={{ flex: 1 }} />
        <Tap style={st.allReadPill} onPress={markAllRead}>
          <View style={st.allReadCheck}>
            <Icon name="check" size={10} color={colors.textTertiary} sw={2.4} />
          </View>
          <Text style={st.allReadTxt}>All Read</Text>
        </Tap>
      </Row>

      <View style={st.eventCard}>
        {selectedGroup.events.map((event, index) => {
          const unread = event.unread && readIds.indexOf(event.id) < 0;
          return (
            <Tap
              key={event.id}
              style={[st.event, index === selectedGroup.events.length - 1 && { marginBottom: 0 }]}
              onPress={
                failLoad
                  ? undefined
                  : () =>
                      navigation.navigate('notif-photo-preview', {
                        title: event.title,
                        occurredAt: `2026-04-${selectedGroup.day} ${event.time}`,
                      })
              }
              disabled={failLoad}
              accessibilityRole="button"
              accessibilityLabel={`Open ${event.title} details`}
            >
              {index < selectedGroup.events.length - 1 && <View style={st.connector} />}
              <SvgXml xml={event.icon} width={48} height={48} />

              <View style={st.eventContent}>
                <Row>
                  <View style={[st.tag, event.tag === 'Critical' ? st.tagCritical : st.tagInfo]}>
                    <View
                      style={[
                        st.tagDot,
                        { backgroundColor: event.tag === 'Critical' ? colors.warning : colors.success },
                      ]}
                    />
                    <Text
                      style={[
                        st.tagTxt,
                        { color: event.tag === 'Critical' ? colors.warning : colors.success },
                      ]}
                    >
                      {event.tag}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <Text style={st.evTime}>{event.time}</Text>
                </Row>
                {unread && <View style={st.unreadDot} />}
                <Text style={st.evTitle}>{event.title}</Text>
                {failLoad ? (
                  <View style={[st.preview, st.previewFail]}>
                    <Icon name="photo" size={22} color={colors.textTertiary} sw={1.6} />
                    <Text style={st.previewFailTxt}>Failed to load</Text>
                  </View>
                ) : (
                  <View style={st.preview}>
                    <CamPreview box={false} style={{ width: '100%', height: '100%' }} />
                  </View>
                )}
              </View>
            </Tap>
          );
        })}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  nav: { paddingHorizontal: 16, height: 50, gap: 10 },
  navSlot: { width: 60, height: '100%', justifyContent: 'center' },
  iconbtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  dayRow: { paddingHorizontal: 20, marginTop: 18, height: 32 },
  dateNav: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  dateNavDisabled: { opacity: 0.3 },
  dayNum: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.textPrimary },
  dayMon: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  allReadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  allReadCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allReadTxt: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },
  segWrap: {
    marginHorizontal: 20,
    marginTop: 16,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F9F9FA',
    flexDirection: 'row',
    padding: 4,
  },
  segBtn: { flex: 1, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  segBtnOn: { backgroundColor: colors.surface, ...shadow.sm },
  segTxt: { fontSize: 15, fontWeight: '500', color: colors.textTertiary },
  segTxtOn: { color: colors.textPrimary, fontWeight: '600' },
  eventCard: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
    padding: 12,
    paddingBottom: 16,
  },
  event: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 38 },
  connector: {
    position: 'absolute',
    left: 23,
    top: 48,
    bottom: -26,
    width: 2,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  eventContent: { flex: 1, marginLeft: 16, minWidth: 0 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: -2,
  },
  tagInfo: { backgroundColor: colors.successSoft },
  tagCritical: { backgroundColor: colors.warningSoft },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagTxt: { fontSize: 13, fontWeight: '600' },
  evTime: { fontSize: 13, fontWeight: '500', color: colors.textTertiary },
  unreadDot: {
    position: 'absolute',
    right: 0,
    top: 24,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.critical,
  },
  evTitle: { marginTop: 8, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  preview: {
    marginTop: 6,
    height: 168,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.bgSecondary,
  },
  previewFail: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  previewFailTxt: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
});

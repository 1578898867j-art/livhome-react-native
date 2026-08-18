import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Screen,
  Header,
  Card,
  Eyebrow,
  ToggleRow,
  SettingRow,
} from '../components/kit';
import { colors } from '../theme';
import { setNotificationSettings, useDeviceAlertSettings } from '../features/devices/deviceAlertStore';

type TimeTarget = 'start' | 'end';

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const formatTime = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

export default function NotifSettings({ navigation }: AppScreenProps) {
  const {
    dndEnabled,
    dndEnd,
    dndStart,
    notificationAlarmEnabled,
    notificationCustom,
    notificationFrequency,
    notificationsEnabled,
  } = useDeviceAlertSettings();
  const [dndOpen, setDndOpen] = useState(false);
  const [draftDndStart, setDraftDndStart] = useState(22);
  const [draftDndEnd, setDraftDndEnd] = useState(7);
  const [draftDndEnabled, setDraftDndEnabled] = useState(false);
  const [timeTarget, setTimeTarget] = useState<TimeTarget>('start');

  const selectTime = (hour: number) => {
    if (timeTarget === 'start') setDraftDndStart(hour);
    else setDraftDndEnd(hour);
  };

  const openDnd = () => {
    setDraftDndStart(dndStart);
    setDraftDndEnd(dndEnd);
    setDraftDndEnabled(dndEnabled);
    setTimeTarget('start');
    setDndOpen(true);
  };

  const saveDnd = () => {
    setNotificationSettings({
      notificationsEnabled,
      notificationAlarmEnabled,
      dndEnabled: draftDndEnabled,
      dndStart: draftDndStart,
      dndEnd: draftDndEnd,
      notificationFrequency,
      notificationCustom,
    });
    setDndOpen(false);
  };

  const dndValue = dndEnabled ? `${formatTime(dndStart)}–${formatTime(dndEnd)}` : 'None';
  const frequencyValue = notificationFrequency === 'custom'
    ? `${notificationCustom ?? 0} minutes`
    : notificationFrequency === 'realtime'
      ? 'Real-time'
      : `${notificationFrequency} minute${notificationFrequency === '1' ? '' : 's'}`;

  return (
    <Screen header={<Header title="Notifications" onBack={() => navigation.goBack()} />}>
      <Card style={{ marginHorizontal: 18, marginTop: 8 }}>
        <ToggleRow
          name="Notifications"
          on={notificationsEnabled}
          onToggle={() => setNotificationSettings({
            notificationsEnabled: !notificationsEnabled,
            notificationAlarmEnabled,
            dndEnabled,
            dndStart,
            dndEnd,
            notificationFrequency,
            notificationCustom,
          })}
          last
        />
      </Card>

      {notificationsEnabled && (
        <View>
          <Eyebrow>Notification settings</Eyebrow>
          <Card style={{ marginHorizontal: 18 }}>
            <SettingRow
              name="Notification Frequency"
              value={frequencyValue}
              onPress={() => navigation.navigate('notif-frequency')}
            />
            <SettingRow
              name="Do Not Disturb"
              value={dndValue}
              onPress={openDnd}
              last
            />
          </Card>

          <Eyebrow>Notification trigger conditions</Eyebrow>
          <Card style={{ marginHorizontal: 18 }}>
            <ToggleRow
              name="Alarm Notification"
              on={notificationAlarmEnabled}
              onToggle={() => setNotificationSettings({
                notificationsEnabled,
                notificationAlarmEnabled: !notificationAlarmEnabled,
                dndEnabled,
                dndStart,
                dndEnd,
                notificationFrequency,
                notificationCustom,
              })}
              last
            />
          </Card>
        </View>
      )}

      <Modal transparent visible={dndOpen} animationType="fade" onRequestClose={() => setDndOpen(false)}>
        <View style={st.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setDndOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close Do Not Disturb settings"
          />
          <View style={st.dialog} accessibilityViewIsModal>
            <Text style={st.title}>Do Not Disturb</Text>
            <Text style={st.hint}>Notifications will not be sent during this time.</Text>

            <Pressable
              style={st.enableRow}
              onPress={() => {
                void Haptics.selectionAsync();
                setDraftDndEnabled((enabled) => !enabled);
              }}
              accessibilityRole="switch"
              accessibilityLabel="Enable Do Not Disturb"
              accessibilityState={{ checked: draftDndEnabled }}
            >
              <Text style={st.enableText}>Enable Do Not Disturb</Text>
              <View style={[st.toggle, draftDndEnabled && st.toggleOn]}>
                <View style={st.toggleKnob} />
              </View>
            </Pressable>

            <View style={st.timeTabs}>
              {(['start', 'end'] as const).map((target) => {
                const selected = timeTarget === target;
                const hour = target === 'start' ? draftDndStart : draftDndEnd;
                return (
                  <Pressable
                    key={target}
                    style={[st.timeTab, selected && st.timeTabSelected]}
                    onPress={() => setTimeTarget(target)}
                    accessibilityRole="button"
                    accessibilityLabel={`${target === 'start' ? 'Start' : 'End'} time, ${formatTime(hour)}`}
                    accessibilityState={{ selected }}
                  >
                    <Text style={st.timeTabLabel}>{target === 'start' ? 'Start' : 'End'}</Text>
                    <Text style={[st.timeTabValue, selected && st.timeTabValueSelected]}>{formatTime(hour)}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ScrollView style={st.timeList} showsVerticalScrollIndicator={false}>
              {HOURS.map((hour) => {
                const selected = (timeTarget === 'start' ? draftDndStart : draftDndEnd) === hour;
                return (
                  <Pressable
                    key={hour}
                    style={[st.timeOption, selected && st.timeOptionSelected]}
                    onPress={() => selectTime(hour)}
                    accessibilityRole="radio"
                    accessibilityLabel={formatTime(hour)}
                    accessibilityState={{ selected }}
                  >
                    <Text style={[st.timeOptionText, selected && st.timeOptionTextSelected]}>{formatTime(hour)}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              style={st.doneButton}
              onPress={() => {
                void Haptics.selectionAsync();
                saveDnd();
              }}
              accessibilityRole="button"
              accessibilityLabel="Save Do Not Disturb time"
            >
              <Text style={st.doneText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  dialog: {
    maxHeight: '82%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 34,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  hint: { marginTop: 5, fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  enableRow: { minHeight: 56, marginTop: 16, flexDirection: 'row', alignItems: 'center' },
  enableText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  toggle: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    backgroundColor: colors.borderStrong,
  },
  toggleOn: { alignItems: 'flex-end', backgroundColor: colors.brand },
  toggleKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.surface },
  timeTabs: { flexDirection: 'row', gap: 10, marginTop: 8 },
  timeTab: {
    flex: 1,
    minHeight: 62,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.bgSecondary,
  },
  timeTabSelected: { backgroundColor: colors.brandSoft, borderWidth: 1, borderColor: colors.brand },
  timeTabLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  timeTabValue: { marginTop: 3, fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  timeTabValueSelected: { color: colors.brand },
  timeList: { maxHeight: 216, marginTop: 12 },
  timeOption: { minHeight: 46, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 14 },
  timeOptionSelected: { backgroundColor: colors.brandSoft },
  timeOptionText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  timeOptionTextSelected: { color: colors.brand },
  doneButton: {
    height: 52,
    marginTop: 16,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.btnPrimary,
  },
  doneText: { fontSize: 16, fontWeight: '700', color: colors.textInverse },
});

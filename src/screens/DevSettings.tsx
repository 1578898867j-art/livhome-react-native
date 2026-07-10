import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Screen, Tap, Row, Card, Header, Eyebrow, SettingRow } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

type Overlay = null | 'restart' | 'delete';

export default function DevSettings({ navigation }: any) {
  const [overlay, setOverlay] = useState<Overlay>(null);

  const closeOverlay = () => setOverlay(null);
  const onRestartConfirm = () => setOverlay(null);
  const onDeleteConfirm = () => {
    setOverlay(null);
    navigation.navigate('Main', { screen: 'dev-home' });
  };

  return (
    <Screen scroll={false}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      <Eyebrow>Basic settings</Eyebrow>
      <Card style={st.card}>
        <SettingRow icon="info" name="Device Details" onPress={() => navigation.navigate('dev-info')} />
        <SettingRow icon="sliders" name="Device Settings" onPress={() => navigation.navigate('dev-config')} />
        <SettingRow icon="bell" name="Notifications" onPress={() => navigation.navigate('notif-settings')} />
        <SettingRow icon="warn" name="Alert Settings" onPress={() => navigation.navigate('alert-settings')} last />
      </Card>

      <Eyebrow>Smart</Eyebrow>
      <Card style={st.smartCard}>
        <Tap style={st.smartRow} onPress={() => navigation.navigate('geofence')}>
          <View style={st.smartIcon}>
            <Icon name="shield" size={17} color={colors.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.smartTitle}>Electronic Fence</Text>
            <Text style={st.smartSub}>
              When enabled, you will be alerted and alarms will be recorded when the fence boundary is
              detected.
            </Text>
          </View>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>
      </Card>

      <View style={st.actions}>
        <Pressable
          style={({ pressed }) => [st.flatBtn, pressed && { opacity: 0.7 }]}
          onPress={() => setOverlay('restart')}
        >
          <Text style={[st.flatBtnText, { color: colors.brand }]}>Restart Device</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [st.flatBtn, pressed && { opacity: 0.7 }]}
          onPress={() => setOverlay('delete')}
        >
          <Text style={[st.flatBtnText, { color: colors.critical }]}>Delete Device</Text>
        </Pressable>
      </View>

      <Modal transparent visible={overlay !== null} animationType="fade" onRequestClose={closeOverlay}>
        <Pressable style={st.ovl} onPress={closeOverlay}>
          <Pressable style={st.dialog} onPress={() => {}}>
            <Text style={st.dialogTitle}>
              {overlay === 'delete' ? 'Delete Device' : 'Restart Device'}
            </Text>
            <Text style={st.dialogDesc}>
              {overlay === 'delete'
                ? 'Are you sure you want to delete this device? This action cannot be undone.'
                : 'Are you sure you want to restart this device?'}
            </Text>
            <Row style={{ gap: 12, marginTop: 20 }}>
              <Pressable style={[st.dialogBtn, st.dialogCancel]} onPress={closeOverlay}>
                <Text style={[st.dialogBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  st.dialogBtn,
                  { backgroundColor: overlay === 'delete' ? colors.critical : colors.brand },
                ]}
                onPress={overlay === 'delete' ? onDeleteConfirm : onRestartConfirm}
              >
                <Text style={[st.dialogBtnText, { color: '#fff' }]}>Confirm</Text>
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
  smartCard: { marginHorizontal: 18, paddingVertical: 14, paddingHorizontal: 16 },
  smartRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  smartIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smartTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  smartSub: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 2, lineHeight: 17 },
  // marginTop:'auto' pins the actions to the bottom, per prototype `margin-top:auto`
  actions: { marginTop: 'auto', paddingHorizontal: 18, paddingTop: 22, paddingBottom: 40, gap: 12 },
  flatBtn: {
    width: '100%',
    height: 54,
    borderRadius: 99,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatBtnText: { fontSize: 15, fontWeight: '700' },
  ovl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 34,
  },
  dialog: {
    width: '100%',
    maxWidth: 322,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
  },
  dialogTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  dialogDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: 10,
    lineHeight: 20,
    textAlign: 'center',
  },
  dialogBtn: { flex: 1, height: 46, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  dialogCancel: { backgroundColor: colors.bgSecondary },
  dialogBtnText: { fontSize: 15, fontWeight: '700' },
});

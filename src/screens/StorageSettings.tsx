import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Screen, Tap, Header, Card, Eyebrow } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

const RECMODES: Record<string, string> = {
  off: 'No Recording',
  alert: 'Alert Recording',
  allday: 'All-day Recording',
};
const REC_OPTS: string[] = ['off', 'alert', 'allday'];

type Overlay = null | 'rec' | 'format';

export default function StorageSettings({ navigation }: AppScreenProps) {
  const [recMode, setRecMode] = useState<string>('allday');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [used, setUsed] = useState(2.19);

  const close = () => setOverlay(null);

  return (
    <Screen>
      <View style={{ paddingTop: 8 }}>
        <Header title="Storage Card" onBack={() => navigation.goBack()} />

        <Card style={{ marginHorizontal: 18, marginTop: 8 }}>
          {/* Card Status */}
          <View style={st.row}>
            <View style={st.divider} />
            <Text style={st.label}>Card Status</Text>
            <Text style={[st.value, { color: colors.success, fontWeight: '700' }]}>Ready</Text>
          </View>

          {/* Recording Mode */}
          <Tap style={st.row} onPress={() => setOverlay('rec')}>
            <View style={st.divider} />
            <Text style={st.label}>Recording Mode</Text>
            <Text style={st.value}>{RECMODES[recMode]}</Text>
            <View style={{ marginLeft: 8 }}>
              <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
            </View>
          </Tap>

          {/* Format Card */}
          <Tap style={st.row} onPress={() => setOverlay('format')}>
            <Text style={st.label}>Format Card</Text>
            <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
          </Tap>
        </Card>

        <Eyebrow>Storage usage</Eyebrow>

        <Card style={{ marginHorizontal: 18, padding: 16 }}>
          <View style={st.barTrack}>
            <View style={[st.barFill, { width: `${Math.max(used, 0.6)}%` }]} />
          </View>
          <Text style={st.usageText}>
            {used.toFixed(2)}% used · {(100 - used).toFixed(2)}% available
          </Text>
        </Card>
      </View>

      {/* Recording mode bottom sheet */}
      <Modal transparent visible={overlay === 'rec'} animationType="fade" onRequestClose={close}>
        <Pressable style={st.sheetOvl} onPress={close}>
          <Pressable style={st.sheetWrap} onPress={() => {}}>
            <View style={[st.sheetCard, { marginBottom: 8 }]}>
              {REC_OPTS.map((key, i) => {
                const on = recMode === key;
                return (
                  <React.Fragment key={key}>
                    {i > 0 && <View style={st.sheetLine} />}
                    <Tap
                      style={st.sheetRow}
                      onPress={() => {
                        setRecMode(key);
                        close();
                      }}
                    >
                      <Text style={[st.sheetRowText, on && st.sheetRowTextOn]}>
                        {RECMODES[key]}
                      </Text>
                      {on && <Icon name="check" size={17} color={colors.brand} sw={2.2} />}
                    </Tap>
                  </React.Fragment>
                );
              })}
            </View>
            <View style={st.sheetCard}>
              <Tap style={st.sheetRow} onPress={close}>
                <Text style={st.sheetCancelText}>Cancel</Text>
              </Tap>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Format confirm dialog */}
      <Modal transparent visible={overlay === 'format'} animationType="fade" onRequestClose={close}>
        <Pressable style={st.dlgOvl} onPress={close}>
          <Pressable style={st.dialog} onPress={() => {}}>
            <View style={st.dialogHead}>
              <Text style={st.dialogTitle}>Format Card</Text>
              <Text style={st.dialogDesc}>
                Formatting this storage card cannot be undone. Are you sure you want to format it?
              </Text>
            </View>
            <View style={st.dialogBtns}>
              <Pressable
                onPress={close}
                style={({ pressed }) => [st.dialogBtn, pressed && { opacity: 0.55 }]}
              >
                <Text style={st.dialogCancel}>Cancel</Text>
              </Pressable>
              <View style={st.dialogSep} />
              <Pressable
                onPress={() => {
                  setUsed(0);
                  close();
                }}
                style={({ pressed }) => [st.dialogBtn, pressed && { opacity: 0.55 }]}
              >
                <Text style={st.dialogConfirm}>Format</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  divider: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
  label: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  value: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.bgSecondary,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5, backgroundColor: colors.brand },
  usageText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 10,
  },

  /* ---- recording mode bottom sheet ---- */
  sheetOvl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetWrap: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  sheetCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sheetLine: { height: 1, backgroundColor: colors.border },
  sheetRow: {
    height: 63,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sheetRowText: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },
  sheetRowTextOn: { fontWeight: '700', color: colors.brand },
  sheetCancelText: { fontSize: 16, fontWeight: '500', color: colors.textSecondary },

  /* ---- format confirm dialog ---- */
  dlgOvl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  dialog: {
    width: '100%',
    maxWidth: 322,
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
  },
  dialogHead: { paddingHorizontal: 22, paddingTop: 26, paddingBottom: 20, alignItems: 'center' },
  dialogTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  dialogDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 21,
    textAlign: 'center',
  },
  dialogBtns: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  dialogBtn: { flex: 1, height: 58, alignItems: 'center', justifyContent: 'center' },
  dialogSep: { width: 1, backgroundColor: colors.border },
  dialogCancel: { fontSize: 17, fontWeight: '500', color: colors.textSecondary },
  dialogConfirm: { fontSize: 17, fontWeight: '700', color: colors.critical },
});

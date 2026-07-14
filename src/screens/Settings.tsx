import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Screen, NavBar, Card, SettingRow } from '../components/kit';
import { clearLoginState } from '../features/auth/session';
import { colors } from '../theme';

type Overlay = null | 'logout' | 'delete' | 'unbind';

export default function Settings({ navigation }: AppScreenProps) {
  const [overlay, setOverlay] = useState<Overlay>(null);

  const close = () => setOverlay(null);

  const logOut = async () => {
    try {
      await clearLoginState();
      close();
      navigation.reset({ index: 0, routes: [{ name: 'splash' }] });
    } catch {
      Alert.alert('Unable to log out', 'The login state could not be cleared. Please try again.');
    }
  };

  return (
    <Screen
      scroll={false}
      header={
        <View style={st.headerInset}>
          <NavBar title="Setting" onBack={() => navigation.goBack()} />
        </View>
      }
    >
      <View style={st.wrap}>
        <Card style={st.card}>
          <SettingRow
            name="Language"
            value="English"
            onPress={() => navigation.navigate('language')}
          />
          <SettingRow
            name="User Agreement"
            onPress={() => navigation.navigate('privacy-agreement')}
          />
          <SettingRow
            name="Privacy Policy"
            onPress={() => navigation.navigate('privacy-policy')}
          />
          <SettingRow name="About" onPress={() => navigation.navigate('about')} last />
        </Card>

        <View style={st.bottom}>
          <Pressable
            onPress={() => setOverlay('logout')}
            style={({ pressed }) => [st.btn, st.btnLogout, pressed && { opacity: 0.85 }]}
          >
            <Text style={[st.btnText, { color: colors.textInverse }]}>Log Out</Text>
          </Pressable>
          <Pressable
            onPress={() => setOverlay('delete')}
            style={({ pressed }) => [st.btn, st.btnDelete, pressed && { opacity: 0.85 }]}
          >
            <Text style={[st.btnText, { color: colors.critical }]}>Delete Account</Text>
          </Pressable>
        </View>
      </View>

      {overlay === 'logout' && (
        <ConfirmDialog
          title="Confirm Logout"
          cancelLabel="Cancel"
          confirmLabel="Log Out"
          onCancel={close}
          onConfirm={() => void logOut()}
        />
      )}

      {overlay === 'delete' && (
        <ConfirmDialog
          title="Confirm Account Deletion"
          desc="This action cannot be undone. All your data will be permanently removed."
          cancelLabel="Cancel"
          confirmLabel="Delete Account"
          onCancel={close}
          onConfirm={() => setOverlay('unbind')}
        />
      )}

      {overlay === 'unbind' && (
        <ConfirmDialog
          title="Unbind devices first"
          desc="Please unbind all devices from this account before deleting it."
          cancelLabel="Cancel"
          confirmLabel="Unbind Devices"
          onCancel={close}
          onConfirm={() => {
            close();
            navigation.navigate('login');
          }}
        />
      )}
    </Screen>
  );
}

function ConfirmDialog({
  title,
  desc,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  desc?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal transparent visible animationType="fade" onRequestClose={onCancel}>
      <Pressable style={st.ovl} onPress={onCancel}>
        <Pressable style={st.dialog} onPress={() => {}}>
          <View style={[st.dialogHead, { paddingBottom: desc ? 20 : 24 }]}>
            <Text style={st.dialogTitle}>{title}</Text>
            {!!desc && <Text style={st.dialogDesc}>{desc}</Text>}
          </View>
          <View style={st.dialogBtns}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [st.dialogBtn, pressed && { opacity: 0.55 }]}
            >
              <Text style={st.dialogCancel}>{cancelLabel}</Text>
            </Pressable>
            <View style={st.dialogSep} />
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [st.dialogBtn, pressed && { opacity: 0.55 }]}
            >
              <Text style={st.dialogConfirm}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const st = StyleSheet.create({
  headerInset: { paddingTop: 8 },
  wrap: { flex: 1 },
  card: { marginHorizontal: 18, marginTop: 8 },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 14,
  },
  btn: {
    width: '100%',
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLogout: { backgroundColor: colors.textPrimary },
  btnDelete: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  btnText: { fontSize: 16, fontWeight: '700' },

  ovl: {
    ...StyleSheet.absoluteFillObject,
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
  dialogHead: { paddingHorizontal: 22, paddingTop: 26, alignItems: 'center' },
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

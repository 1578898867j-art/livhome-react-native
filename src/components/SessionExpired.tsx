// 登录态过期全局弹窗 —— triggerSessionExpired() 触发,确认后回到登录页。
// 视觉沿用 App 弹窗规范(白卡 22 圆角 + 软色圆标)。
import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Icon } from './Icon';
import { useSessionExpired, clearSessionExpired } from '../features/app/demoStore';
import { navRef } from '../navigation/navRef';
import { colors } from '../theme';

export function SessionExpiredHost() {
  const visible = useSessionExpired();

  const signIn = () => {
    clearSessionExpired();
    if (navRef.isReady()) {
      navRef.reset({ index: 0, routes: [{ name: 'login' }] });
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={signIn}>
      <View style={st.ovl}>
        <View style={st.dialog}>
          <View style={st.iconTile}>
            <Icon name="lock" size={24} color={colors.brand} sw={1.8} />
          </View>
          <Text style={st.title}>Login Expired</Text>
          <Text style={st.desc}>Your login session has expired. Please sign in again to continue.</Text>
          <Pressable
            style={({ pressed }) => [st.btn, pressed && { opacity: 0.85 }]}
            onPress={signIn}
          >
            <Text style={st.btnTxt}>Sign In Again</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
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
  iconTile: {
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  desc: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: 10,
    lineHeight: 20,
    textAlign: 'center',
  },
  btn: {
    marginTop: 20,
    height: 46,
    borderRadius: 99,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

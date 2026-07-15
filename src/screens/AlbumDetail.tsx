import type { AppScreenProps } from '../navigation/types';
import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Modal, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { DarkPlayerState } from '../components/states';
import { PermissionDialog } from '../components/PermissionDialog';
import { getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';
import { colors } from '../theme';

export default function AlbumDetail({ navigation }: AppScreenProps) {
  const insets = useSafeAreaInsets();

  // 概率性状态:媒体加载失败 / 保存权限被拒 / 保存与删除失败
  const [mState, setMState] = useState<'loading' | 'ready' | 'error'>('ready');
  const [permDlg, setPermDlg] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const mTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadMedia = useCallback(() => {
    if (!getDemoFlags().failStream) {
      setMState('ready');
      return;
    }
    setMState('loading');
    if (mTimer.current) clearTimeout(mTimer.current);
    mTimer.current = setTimeout(
      () => setMState(getDemoFlags().failStream ? 'error' : 'ready'),
      900,
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMedia();
      return () => {
        if (mTimer.current) clearTimeout(mTimer.current);
      };
    }, [loadMedia]),
  );

  const download = () => {
    if (getDemoFlags().permsDenied) {
      setPermDlg(true);
      return;
    }
    if (getDemoFlags().failOps) {
      showToast('Failed to save to gallery.', 'error');
      return;
    }
    showToast('Saved to gallery', 'success');
  };

  const doDelete = () => {
    setConfirm(false);
    if (getDemoFlags().failOps) {
      showToast('Failed to delete. Please try again.', 'error');
      return;
    }
    navigation.goBack();
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Screen
        scroll={false}
        edges={[]}
        bg="#0B0B0C"
        header={
          <View style={{ paddingTop: Math.max(insets.top, 20) + 20 }}>
            <View style={st.topBar}>
              <Tap style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
                <Icon name="chevL" size={18} color="#fff" sw={2} />
              </Tap>
              <Text style={st.title}>Today</Text>
              <View style={{ width: 34 }} />
            </View>
          </View>
        }
      >
        {/* Photo — camPreview({h:'aspect-ratio:3/4', tag:'Person', label:'Living Room · 14:22'}) */}
        <View style={st.photoWrap}>
          <View style={st.frame}>
            {mState === 'ready' ? (
              <CamPreview tag="Person" label="Living Room · 14:22" style={st.cam} />
            ) : (
              <View style={st.cam}>
                <DarkPlayerState
                  loading={mState === 'loading'}
                  icon="warn"
                  title="Failed to load"
                  sub="Please check your network and try again."
                  actionLabel="Retry"
                  onAction={loadMedia}
                />
              </View>
            )}
          </View>
        </View>

        {/* Bottom actions */}
        <View style={[st.actions, { paddingBottom: Math.max(insets.bottom, 34) }]}>
          <Tap style={st.actionBtn} onPress={download}>
            <Icon name="download" size={22} color="#fff" />
          </Tap>
          <Tap style={st.actionBtn} onPress={() => setConfirm(true)}>
            <Icon name="trash" size={22} color="#fff" />
          </Tap>
        </View>

        {/* 删除确认(与相册列表同款式) */}
        <Modal transparent visible={confirm} animationType="fade" onRequestClose={() => setConfirm(false)}>
          <Pressable style={st.ovl} onPress={() => setConfirm(false)}>
            <Pressable style={st.dialog} onPress={(e) => e.stopPropagation()}>
              <Text style={st.dialogTxt}>Are you sure you want to delete this item?</Text>
              <View style={st.dialogBtns}>
                <Tap style={st.dialogBtn} onPress={() => setConfirm(false)}>
                  <Text style={st.dialogCancel}>Cancel</Text>
                </Tap>
                <View style={st.dialogDivV} />
                <Tap style={st.dialogBtn} onPress={doDelete}>
                  <Text style={st.dialogDelete}>Delete</Text>
                </Tap>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* 相册写入权限被拒引导 */}
        <PermissionDialog type="photos" visible={permDlg} onClose={() => setPermDlg(false)} />
      </Screen>
    </>
  );
}

const st = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  photoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  frame: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cam: { aspectRatio: 3 / 4 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 22,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ovl: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center', padding: 36 },
  dialog: { width: '100%', maxWidth: 350, backgroundColor: colors.surface, borderRadius: 18, overflow: 'hidden' },
  dialogTxt: {
    paddingHorizontal: 22, paddingTop: 21, paddingBottom: 19,
    fontSize: 15, fontWeight: '600', lineHeight: 22, color: colors.textPrimary, textAlign: 'center',
  },
  dialogBtns: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  dialogBtn: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center' },
  dialogDivV: { width: 1, backgroundColor: colors.border },
  dialogCancel: { fontSize: 15, fontWeight: '500', color: colors.textSecondary },
  dialogDelete: { fontSize: 15, fontWeight: '700', color: colors.critical },
});

import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { StateView, Spinner } from '../components/states';
import { PermissionDialog } from '../components/PermissionDialog';
import { useDemoFlags, getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';
import { SELICON2 } from '../icons/protoIcons';
import { CamPreview } from '../components/CamPreview';
import { colors } from '../theme';

// 用户提供的 Huge-icon:download / trash 01(描边改 currentColor 便于着色)
const DL_ICON =
  '<svg viewBox="0 0 28 28" fill="none"><path d="M17.5 14L14 17.5L10.5 14M14 17.5L14 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.75 10.5L7.5 10.5C5.29086 10.5 3.5 12.2909 3.5 14.5L3.5 20.5C3.5 22.7091 5.29086 24.5 7.5 24.5L20.5 24.5C22.7091 24.5 24.5 22.7091 24.5 20.5L24.5 14.5C24.5 12.2909 22.7091 10.5 20.5 10.5L19.25 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const TRASH_ICON =
  '<svg viewBox="0 0 28 28" fill="none"><path d="M22.1667 10.4999L21.3314 21.3578C21.1444 23.7892 19.117 25.6666 16.6785 25.6666H11.3215C8.88298 25.6666 6.85558 23.7892 6.66856 21.3578L5.83333 10.4999M24.5 8.16659C21.4691 6.68956 17.8659 5.83325 14 5.83325C10.1341 5.83325 6.5309 6.68956 3.5 8.16659M11.6667 5.83325V4.66659C11.6667 3.37792 12.7113 2.33325 14 2.33325C15.2887 2.33325 16.3333 3.37792 16.3333 4.66659V5.83325M11.6667 12.8333V19.8333M16.3333 12.8333V19.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

type Group = { title: string; times: string[] };

const GROUPS: Group[] = [
  { title: 'Today', times: ['14:22', '12:08', '09:41', '08:15'] },
  { title: '2026-03-22', times: ['21:03', '18:44', '16:27', '11:36', '08:52', '07:18'] },
  { title: '2026-03-21', times: ['22:10', '19:35', '15:46', '13:24', '10:08', '08:31'] },
  { title: '2026-03-20', times: ['20:42', '17:19', '14:05', '09:56', '07:43', '06:28'] },
  { title: '2026-03-19', times: ['23:16', '18:57', '16:11', '12:39', '09:14', '07:02'] },
  { title: '2026-03-18', times: ['21:48', '19:06', '14:33', '11:27', '08:45', '06:51'] },
];

export default function Album({ navigation }: AppScreenProps) {
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>(GROUPS);
  const [confirm, setConfirm] = useState(false);

  // 概率性状态:列表加载失败 / 删除失败 / 保存权限被拒
  const { failLoad } = useDemoFlags();
  const [retrying, setRetrying] = useState(false);
  const [permDlg, setPermDlg] = useState(false);
  const retryLoad = () => {
    setRetrying(true);
    setTimeout(() => setRetrying(false), 800);
  };

  const allKeys = groups.flatMap((g) => g.times.map((t) => g.title + t));
  const allOn = allKeys.length > 0 && selected.length === allKeys.length;
  const albumEmpty = allKeys.length === 0;

  const toggleSel = (k: string) =>
    setSelected((s) => (s.indexOf(k) >= 0 ? s.filter((v) => v !== k) : s.concat(k)));

  const exitEdit = () => {
    setEditMode(false);
    setSelected([]);
  };

  const doDelete = () => {
    // 删除失败演示:提示错误,保留列表
    if (getDemoFlags().failOps) {
      setConfirm(false);
      showToast('Failed to delete. Please try again.', 'error');
      return;
    }
    setGroups((gs) =>
      gs
        .map((g) => ({ ...g, times: g.times.filter((t) => selected.indexOf(g.title + t) < 0) }))
        .filter((g) => g.times.length > 0),
    );
    setConfirm(false);
    exitEdit();
  };

  // 保存到系统相册:权限被拒 → 引导;failOps → 失败;否则成功提示
  const doDownload = () => {
    if (selected.length === 0) return;
    if (getDemoFlags().permsDenied) {
      setPermDlg(true);
      return;
    }
    if (getDemoFlags().failOps) {
      showToast('Failed to save to gallery.', 'error');
      return;
    }
    showToast(selected.length > 1 ? 'Saved to gallery' : 'Saved to gallery', 'success');
    exitEdit();
  };

  return (
    <Screen
      scroll={false}
      header={
        editMode ? (
          <Row style={st.nav}>
            <Tap onPress={exitEdit} hitSlop={10} style={st.xBtn}>
              <Icon name="x" size={20} color={colors.textPrimary} sw={2.2} />
            </Tap>
            <Text style={st.titleCenter}>Album</Text>
            {/* 取消全选时默认保留第一张(左上角) */}
            <Tap onPress={() => setSelected(allOn ? allKeys.slice(0, 1) : allKeys)} hitSlop={10} style={st.xBtn}>
              <SvgXml xml={SELICON2} width={20} height={20} color={colors.brand} />
            </Tap>
          </Row>
        ) : (
          <Row style={st.nav}>
            <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
              <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
            </Tap>
            <Text style={st.title}>Album</Text>
            {!albumEmpty && !failLoad && (
              <Tap onPress={() => setEditMode(true)} hitSlop={8}>
                <Text style={st.action}>Select</Text>
              </Tap>
            )}
          </Row>
        )
      }
    >
      {/* 加载失败 / 空相册 / 正常网格 */}
      {failLoad ? (
        retrying ? (
          <View style={{ alignItems: 'center', paddingTop: 130 }}>
            <Spinner size={28} />
          </View>
        ) : (
          <StateView
            variant="error"
            icon="warn"
            title="Failed to load album"
            sub="Please check your network and try again."
            actionLabel="Retry"
            onAction={retryLoad}
            style={{ paddingTop: 180 }}
            titleStyle={{ fontSize: 19 }}
            subStyle={{ fontSize: 16, lineHeight: 22 }}
            actionTextStyle={{ fontSize: 17 }}
          />
        )
      ) : albumEmpty ? (
        <StateView
          variant="empty"
          icon="photo"
          title="No photos or videos yet"
          sub="Snapshots and recordings you save will appear here."
          style={{ paddingTop: 90 }}
        />
      ) : (
      <ScrollView
        contentContainerStyle={{ paddingBottom: editMode ? 140 : 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 18 }}>
        {groups.map((g) => (
          <View key={g.title}>
            <Text style={st.groupTitle}>{g.title}</Text>
            <View style={st.grid}>
              {g.times.map((time) => {
                const k = g.title + time;
                const on = selected.indexOf(k) >= 0;
                return (
                  <Tap
                    key={time}
                    style={st.cell}
                    onPress={() =>
                      editMode ? toggleSel(k) : navigation.navigate('album-detail')
                    }
                  >
                    <CamPreview box={false} style={st.cam} />
                    <View style={st.scrim} />
                    <Text style={st.time}>{time}</Text>
                    {editMode &&
                      (on ? (
                        <View style={st.selDotOn}>
                          <Icon name="check" size={11} color="#fff" sw={3} />
                        </View>
                      ) : (
                        <View style={st.selDot} />
                      ))}
                  </Tap>
                );
              })}
            </View>
          </View>
        ))}
        </View>
      </ScrollView>
      )}

      {/* 底部操作栏 — 钉在屏幕底部(滚动容器之外) */}
      {editMode && (
        <View style={st.actionBar}>
          <Tap style={st.barBtn} onPress={doDownload}>
            <SvgXml xml={DL_ICON} width={24} height={24} color={colors.brand} />
          </Tap>
          <Tap style={st.barBtn} onPress={() => selected.length > 0 && setConfirm(true)}>
            <SvgXml xml={TRASH_ICON} width={24} height={24} color={colors.brand} />
          </Tap>
        </View>
      )}

      {/* 相册写入权限被拒引导 */}
      <PermissionDialog type="photos" visible={permDlg} onClose={() => setPermDlg(false)} />

      {/* 删除确认弹窗(与消息中心同款式) */}
      <Modal transparent visible={confirm} animationType="fade" onRequestClose={() => setConfirm(false)}>
        <Pressable style={st.ovl} onPress={() => setConfirm(false)}>
          <Pressable style={st.dialog} onPress={(e) => e.stopPropagation()}>
            <Text style={st.dialogTxt}>Are you sure you want to delete the selected videos?</Text>
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
    </Screen>
  );
}

const st = StyleSheet.create({
  nav: { paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  iconbtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  titleCenter: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  action: { fontSize: 14, fontWeight: '700', color: colors.brand },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: {
    width: '48.5%',
    aspectRatio: 186 / 104,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
    backgroundColor: colors.bgSecondary,
  },
  cam: { width: '100%', height: '100%' },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  time: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  selDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  selDotOn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 96,
    backgroundColor: colors.surface,
    paddingTop: 14,
    paddingBottom: 40,
  },
  barBtn: {
    width: 64,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF9FB',
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

import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
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
  { title: '2026-03-22', times: ['21:03', '18:44'] },
];

export default function Album({ navigation }: AppScreenProps) {
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const allKeys = GROUPS.flatMap((g) => g.times.map((t) => g.title + t));
  const allOn = selected.length === allKeys.length;

  const toggleSel = (k: string) =>
    setSelected((s) => (s.indexOf(k) >= 0 ? s.filter((v) => v !== k) : s.concat(k)));

  const exitEdit = () => {
    setEditMode(false);
    setSelected([]);
  };

  return (
    <Screen scroll contentStyle={{ paddingBottom: editMode ? 120 : 40 }}>
      {/* Nav row — 选择态按参考稿:左 ×,居中标题,右全选(蓝) */}
      {editMode ? (
        <Row style={st.nav}>
          <Tap onPress={exitEdit} hitSlop={10} style={st.xBtn}>
            <Icon name="x" size={20} color={colors.textPrimary} sw={2.2} />
          </Tap>
          <Text style={st.titleCenter}>Album</Text>
          <Tap onPress={() => setSelected(allOn ? [] : allKeys)} hitSlop={10} style={st.xBtn}>
            <SvgXml xml={SELICON2} width={20} height={20} color={colors.brand} />
          </Tap>
        </Row>
      ) : (
        <Row style={st.nav}>
          <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
          </Tap>
          <Text style={st.title}>Album</Text>
          <Tap onPress={() => setEditMode(true)} hitSlop={8}>
            <Text style={st.action}>Select</Text>
          </Tap>
        </Row>
      )}

      <View style={{ paddingHorizontal: 18 }}>
        {GROUPS.map((g) => (
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

      {/* 底部操作栏 — 参考稿:白底通栏,两个浅蓝圆角图标钮居中 */}
      {editMode && (
        <View style={st.actionBar}>
          <Tap style={st.barBtn}>
            <SvgXml xml={DL_ICON} width={24} height={24} color={colors.brand} />
          </Tap>
          <Tap style={st.barBtn}>
            <SvgXml xml={TRASH_ICON} width={24} height={24} color={colors.brand} />
          </Tap>
        </View>
      )}
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
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: {
    width: '48.5%',
    aspectRatio: 186 / 104,
    borderRadius: 14,
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
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

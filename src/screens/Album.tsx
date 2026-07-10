import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { colors } from '../theme';

type Group = { title: string; times: string[] };

const GROUPS: Group[] = [
  { title: 'Today', times: ['14:22', '12:08', '09:41', '08:15'] },
  { title: '2026-03-22', times: ['21:03', '18:44'] },
];

export default function Album({ navigation }: any) {
  const [editMode, setEditMode] = useState(false);

  return (
    <Screen scroll contentStyle={{ paddingBottom: editMode ? 100 : 40 }}>
      {/* Nav row */}
      <Row style={st.nav}>
        <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
        </Tap>
        <Text style={st.title}>Album</Text>
        <Tap onPress={() => setEditMode((v) => !v)} hitSlop={8}>
          <Text style={st.action}>{editMode ? 'Close' : 'Select'}</Text>
        </Tap>
      </Row>

      <View style={{ paddingHorizontal: 18 }}>
        {GROUPS.map((g) => (
          <View key={g.title}>
            <Text style={st.groupTitle}>{g.title}</Text>
            <View style={st.grid}>
              {g.times.map((time) => (
                <Tap
                  key={time}
                  style={st.cell}
                  onPress={() => navigation.navigate('album-detail')}
                >
                  <CamPreview box={false} style={st.cam} />
                  <View style={st.scrim} />
                  <Text style={st.time}>{time}</Text>
                  {editMode && <View style={st.selDot} />}
                </Tap>
              ))}
            </View>
          </View>
        ))}
      </View>

      {editMode && (
        <View style={st.actionBar}>
          <Tap style={[st.barBtn, { backgroundColor: colors.bgSecondary }]}>
            <Icon name="download" size={16} color={colors.textSecondary} />
            <Text style={[st.barBtnLabel, { color: colors.textSecondary }]}>Download</Text>
          </Tap>
          <Tap style={[st.barBtn, { backgroundColor: colors.criticalSoft }]}>
            <Icon name="trash" size={16} color={colors.critical} />
            <Text style={[st.barBtnLabel, { color: colors.critical }]}>Delete</Text>
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
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary },
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
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 34,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  barBtn: {
    flex: 1,
    maxWidth: 150,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  barBtnLabel: { fontSize: 14, fontWeight: '700' },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen, Tap, Row, Card } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

export default function DevDownload({ navigation }: any) {
  const [dlPct] = useState(41);
  const p = Math.round(dlPct);
  const done = p >= 100;

  return (
    <Screen scroll={false} contentStyle={st.page}>
      {/* nav bar */}
      <Row style={st.nav}>
        <Tap style={st.navBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
        </Tap>
        <Text style={st.navTitle}>Video Download</Text>
        <View style={{ width: 34 }} />
      </Row>

      {/* progress card */}
      <Card style={st.card}>
        <Text style={st.pct}>{p}%</Text>
        <View style={st.track}>
          <View style={[st.fill, { width: `${p}%` }]} />
        </View>
        <Text style={st.status}>
          {done ? 'Video download complete' : 'Please keep the app open while saving.'}
        </Text>
      </Card>

      <View style={{ flex: 1 }} />

      {/* actions */}
      <Row style={st.actions}>
        <Pressable
          style={({ pressed }) => [st.btn, st.btnCancel, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={st.btnCancelTxt}>Cancel</Text>
        </Pressable>
        <Pressable
          disabled={!done}
          style={({ pressed }) => [
            st.btn,
            { backgroundColor: done ? colors.brand : 'rgba(35,130,255,0.4)' },
            pressed && done && { opacity: 0.85 },
          ]}
          onPress={done ? () => navigation.navigate('album') : undefined}
        >
          <Text style={st.btnViewTxt}>View</Text>
        </Pressable>
      </Row>
    </Screen>
  );
}

const st = StyleSheet.create({
  page: { paddingBottom: 40 },
  nav: { paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: { flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center', color: colors.textPrimary },
  card: { marginHorizontal: 18, marginTop: 8, padding: 22, paddingTop: 22 },
  pct: { fontSize: 34, fontWeight: '800', letterSpacing: -1, color: colors.textPrimary },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bgSecondary,
    overflow: 'hidden',
    marginTop: 16,
  },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.brand },
  status: { fontSize: 13, fontWeight: '500', color: colors.textTertiary, marginTop: 14 },
  actions: { gap: 14, paddingHorizontal: 24 },
  btn: { flex: 1, height: 54, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: colors.bgSecondary },
  btnCancelTxt: { color: colors.textSecondary, fontSize: 16, fontWeight: '700' },
  btnViewTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

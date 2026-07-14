import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Card, Row, Tap } from '../components/kit';
import { SunLogo } from '../components/SunLogo';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

export default function About({ navigation }: AppScreenProps) {
  return (
    <Screen
      header={<Header title="About" onBack={() => navigation.goBack()} />}
      contentStyle={{ paddingBottom: 54 }}
    >
      {/* app logo + name — SunLogo already is the blue rounded square */}
      <View style={st.hero}>
        <SunLogo size={76} />
        <Text style={st.name}>LIVHOME</Text>
        <Text style={st.tagline}>Smart home-care camera</Text>
      </View>

      {/* version / update card */}
      <Card style={st.card}>
        <Row style={st.row}>
          <Text style={st.rowLabel}>Current Version</Text>
          <Text style={st.versionValue}>v1.2.2</Text>
          <View style={st.rowLine} />
        </Row>
        <Tap style={st.row}>
          <Text style={st.rowLabel}>Check for Updates</Text>
          <View style={st.badge}>
            <Text style={st.badgeText}>New v1.2.3</Text>
          </View>
          <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
        </Tap>
      </Card>

      <Text style={st.copyright}>© 2026 LIVHOME</Text>
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { alignItems: 'center', paddingHorizontal: 18, paddingTop: 26, paddingBottom: 8 },
  name: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4, color: colors.textPrimary, marginTop: 16 },
  tagline: { fontSize: 12, fontWeight: '600', color: colors.textTertiary, marginTop: 2 },

  card: { marginHorizontal: 18, marginTop: 16 },
  // Tap renders a Pressable (column by default) — force the row layout here.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 54,
    paddingHorizontal: 16,
    position: 'relative',
  },
  rowLine: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  versionValue: { fontSize: 14, fontWeight: '600', color: colors.textTertiary },

  badge: { paddingVertical: 3, paddingHorizontal: 9, borderRadius: 8, backgroundColor: colors.criticalSoft },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.critical },

  copyright: {
    textAlign: 'center',
    paddingHorizontal: 18,
    paddingTop: 24,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textTertiary,
    lineHeight: 16,
  },
});

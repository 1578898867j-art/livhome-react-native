import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Screen, Header, Hint, Eyebrow, Card, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

const TZ_ALL: [string, string][] = [
  ['Beijing', 'GMT+8:00'],
  ['Shanghai', 'GMT+8:00'],
  ['Shenzhen', 'GMT+8:00'],
  ['Singapore', 'GMT+8:00'],
  ['Tokyo', 'GMT+9:00'],
  ['Seoul', 'GMT+9:00'],
  ['Bangkok', 'GMT+7:00'],
  ['Jakarta', 'GMT+7:00'],
  ['New Delhi', 'GMT+5:30'],
  ['Dubai', 'GMT+4:00'],
  ['Tehran', 'GMT+3:30'],
  ['London', 'GMT+0:00'],
  ['New York', 'GMT-5:00'],
  ['Los Angeles', 'GMT-8:00'],
];

const TZ_DEFAULT = ['Beijing', 'Tokyo', 'Bangkok', 'New Delhi', 'Dubai', 'Tehran'];

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

export default function Timezone({ navigation }: AppScreenProps) {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState('Beijing');

  const q = norm(query.trim());

  const ZRow = ({ city, gmt, last }: { city: string; gmt: string; last?: boolean }) => {
    const on = sel === city;
    return (
      <Tap onPress={() => setSel(city)} style={st.zRow}>
        {!last && <View style={st.divider} />}
        <Text style={st.zCity}>{city}</Text>
        <Text style={[st.zGmt, { color: on ? colors.brand : colors.textTertiary }]}>{gmt}</Text>
        {on && <Icon name="check" size={17} color={colors.brand} sw={2.6} />}
      </Tap>
    );
  };

  let body: React.ReactNode;
  if (q) {
    const res = TZ_ALL.filter((z) => norm(z[0]).indexOf(q) >= 0 || norm(z[1]).indexOf(q) >= 0);
    body = (
      <>
        <Eyebrow>Search results</Eyebrow>
        {res.length ? (
          <Card style={st.listCard}>
            {res.map((z, i) => (
              <ZRow key={z[0]} city={z[0]} gmt={z[1]} last={i === res.length - 1} />
            ))}
          </Card>
        ) : (
          <Text style={st.empty}>No matching cities found</Text>
        )}
      </>
    );
  } else {
    const list = TZ_DEFAULT.map((c) => TZ_ALL.find((z) => z[0] === c)!);
    const recSel = sel === 'Beijing';
    body = (
      <>
        <Eyebrow>Current recommended time zone</Eyebrow>
        <Tap
          onPress={() => setSel('Beijing')}
          style={[st.recCard, recSel && { backgroundColor: colors.brandSoft }]}
        >
          <Row style={{ gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={st.recCity}>Beijing</Text>
              <Text style={st.recSub}>Based on your current location</Text>
            </View>
            <Text style={st.recGmt}>GMT+8:00</Text>
            {recSel && <Icon name="check" size={17} color={colors.brand} sw={2.6} />}
          </Row>
        </Tap>
        <Eyebrow>All time zones</Eyebrow>
        <Card style={st.listCard}>
          {list.map((z, i) => (
            <ZRow key={z[0]} city={z[0]} gmt={z[1]} last={i === list.length - 1} />
          ))}
        </Card>
      </>
    );
  }

  return (
    <Screen>
      <View style={{ paddingTop: 8 }}>
        <Header title="Device Time Zone" onBack={() => navigation.goBack()} />
        <Hint>Select a city close to your location.</Hint>

        <View style={st.searchWrap}>
          <Row style={st.searchBar}>
            <Icon name="search" size={16} color={colors.textTertiary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search city or time zone"
              placeholderTextColor={colors.textTertiary}
              style={st.searchInput}
            />
            {!!query && (
              <Tap onPress={() => setQuery('')} hitSlop={8}>
                <Icon name="x" size={15} color={colors.textTertiary} sw={2.2} />
              </Tap>
            )}
          </Row>
        </View>

        {body}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  searchWrap: { paddingHorizontal: 18, paddingVertical: 12 },
  searchBar: {
    height: 44,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    padding: 0,
  },
  listCard: { marginHorizontal: 18 },
  zRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    gap: 10,
  },
  divider: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
  zCity: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  zGmt: { fontSize: 14, fontWeight: '600' },
  empty: {
    textAlign: 'center',
    paddingVertical: 70,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  recCard: {
    marginHorizontal: 18,
    marginBottom: 4,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  recCity: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  recSub: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 2 },
  recGmt: { fontSize: 14, fontWeight: '700', color: colors.brand },
});

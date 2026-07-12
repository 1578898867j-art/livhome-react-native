import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, NavBar, Card, Row, RadioRow } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

const LANGS = ['English', '简体中文', '繁體中文', '日本語', '한국어', 'Español', 'Deutsch'];

export default function Language({ navigation }: AppScreenProps) {
  const [selected, setSelected] = useState('English');

  return (
    <Screen scroll={false}>
      <View style={st.wrap}>
        <NavBar
          title="Language"
          onBack={() => navigation.goBack()}
          action={{ label: 'Done', onPress: () => navigation.goBack() }}
        />

        <View style={st.searchWrap}>
          <Row style={st.search}>
            <Icon name="search" size={16} color={colors.textTertiary} />
            <Text style={st.searchText}>Search</Text>
          </Row>
        </View>

        <Card style={st.card}>
          {LANGS.map((lang, i) => (
            <RadioRow
              key={lang}
              name={lang}
              selected={selected === lang}
              onPress={() => setSelected(lang)}
              last={i === LANGS.length - 1}
            />
          ))}
        </Card>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  wrap: { flex: 1, paddingTop: 8 },
  searchWrap: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12 },
  search: {
    height: 44,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    gap: 8,
  },
  searchText: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.textTertiary },
  card: { marginHorizontal: 18 },
});

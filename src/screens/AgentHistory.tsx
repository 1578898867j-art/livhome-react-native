import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

type Convo = { title: string; time: string };

const GROUPS: { label: string; items: Convo[] }[] = [
  {
    label: 'Today',
    items: [
      { title: 'Daily check-in setup', time: '2:14 PM' },
      { title: 'Today’s activity summary', time: '11:02 AM' },
    ],
  },
  {
    label: 'Yesterday',
    items: [{ title: 'Any alerts overnight?', time: '8:41 PM' }],
  },
  {
    label: 'Within 30 days',
    items: [
      { title: 'Night vision question', time: 'Jun 18' },
      { title: 'Notify family on alerts', time: 'Jun 15' },
    ],
  },
];

export default function AgentHistory({ navigation }: any) {
  const openChat = () => navigation.navigate('Main', { screen: 'agent-chat' });

  return (
    <Screen contentStyle={st.page}>
      {/* Header row: back + title */}
      <View style={st.navRow}>
        <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
        </Tap>
        <Text style={st.navTitle}>Conversations</Text>
      </View>

      <View style={st.body}>
        {/* New Conversation button */}
        <Tap style={st.newBtn} onPress={openChat}>
          <Icon name="plus" size={17} color={colors.brand} sw={2.2} />
          <Text style={st.newBtnLabel}>New Conversation</Text>
        </Tap>

        {GROUPS.map((g) => (
          <View key={g.label}>
            <Text style={st.group}>{g.label}</Text>
            {g.items.map((it) => (
              <Tap key={it.title} style={st.item} onPress={openChat}>
                <Text style={st.itemTitle}>{it.title}</Text>
                <Text style={st.itemTime}>{it.time}</Text>
              </Tap>
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  page: { backgroundColor: colors.bgSecondary, paddingBottom: 54, flexGrow: 1 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconbtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  body: { paddingHorizontal: 18, paddingTop: 8 },
  newBtn: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 99,
  },
  newBtnLabel: { fontSize: 15, fontWeight: '700', color: colors.brand },
  group: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    marginTop: 16,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    marginBottom: 10,
  },
  itemTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  itemTime: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 3 },
});

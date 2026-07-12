import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Eyebrow, Card, ToggleRow, Segmented, SettingRow } from '../components/kit';
import { colors } from '../theme';

export default function LineCrossing({ navigation }: AppScreenProps) {
  const [lineOn, setLineOn] = useState(true);
  const [lineSens, setLineSens] = useState(1);

  return (
    <Screen>
      <View style={{ paddingTop: 4, paddingBottom: 24 }}>
        <Header title="Trip Wire Detection" onBack={() => navigation.goBack()} />

        <Eyebrow>Alarm</Eyebrow>
        <Card style={st.card}>
          <ToggleRow name="Trip Wire Detection" on={lineOn} onToggle={() => setLineOn((v) => !v)} last />
        </Card>

        {lineOn && (
          <>
            <Card style={st.sensCard}>
              <Segmented opts={['Low', 'Medium', 'High']} active={lineSens} onSelect={setLineSens} />
              <Text style={st.sensHint}>
                You will receive an alarm when a person or object crosses the trip wire you set.
              </Text>
            </Card>

            {lineSens !== 1 && (
              <>
                <Eyebrow>Area settings</Eyebrow>
                <Card style={st.card}>
                  <SettingRow name="Trip Wire" onPress={() => navigation.navigate('trip-wire')} last />
                </Card>
              </>
            )}
          </>
        )}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { marginHorizontal: 18 },
  sensCard: { marginHorizontal: 18, marginTop: 14, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
  sensHint: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    lineHeight: 18,
    marginTop: 12,
    paddingHorizontal: 2,
  },
});

import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Eyebrow, Card, ToggleRow, Segmented, SettingRow } from '../components/kit';
import { colors } from '../theme';
import { setLineCrossing, useDeviceAlertSettings } from '../features/devices/deviceAlertStore';

export default function LineCrossing({ navigation }: AppScreenProps) {
  const { lineCrossingEnabled: lineOn, lineCrossingSensitivity: lineSens } = useDeviceAlertSettings();

  return (
    <Screen header={<Header title="Trip Wire Detection" onBack={() => navigation.goBack()} />}>
      <View style={{ paddingTop: 4, paddingBottom: 24 }}>
        <Eyebrow>Alarm</Eyebrow>
        <Card style={st.card}>
          <ToggleRow name="Trip Wire Detection" on={lineOn} onToggle={() => setLineCrossing(!lineOn)} last />
        </Card>

        {lineOn && (
          <>
            <Card style={st.sensCard}>
              <Segmented opts={['Low', 'Medium', 'High']} active={lineSens} onSelect={(sensitivity) => setLineCrossing(lineOn, sensitivity as 0 | 1 | 2)} />
              <Text style={st.sensHint}>
                You will receive an alarm when a person or object crosses the trip wire you set.
              </Text>
            </Card>

            {/* 所有灵敏度档位都显示;行标题固定为 Trip Wire */}
            <Eyebrow>Area settings</Eyebrow>
            <Card style={st.card}>
              <SettingRow name="Trip Wire" onPress={() => navigation.navigate('trip-wire')} last />
            </Card>
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

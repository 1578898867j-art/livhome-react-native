import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen, Header, Eyebrow, Card, ToggleRow, Segmented, SettingRow } from '../components/kit';
import { colors } from '../theme';

export default function MotionDetection({ navigation }: AppScreenProps) {
  const [motionOn, setMotionOn] = useState(true);
  const [motionSens, setMotionSens] = useState(1);

  return (
    <Screen header={<Header title="Motion Detection" onBack={() => navigation.goBack()} />}>
      <Eyebrow>Alarm</Eyebrow>
      <Card style={st.card}>
        <ToggleRow
          name="Motion Detection"
          on={motionOn}
          onToggle={() => setMotionOn((v) => !v)}
          last
        />
      </Card>

      {motionOn && (
        <>
          <Card style={st.sensCard}>
            <Segmented
              opts={['Low', 'Medium', 'High']}
              active={motionSens}
              onSelect={setMotionSens}
            />
            <Text style={st.hint}>
              You will receive an alarm when large object movement is detected (family members
              walking).
            </Text>
          </Card>

          {/* 区域设置:仅 Medium 档隐藏,Low / High 保留 */}
          {motionSens !== 1 && (
            <>
              <Eyebrow>Area settings</Eyebrow>
              <Card style={st.card}>
                <SettingRow
                  name="Detection Area"
                  onPress={() => navigation.navigate('detection-area')}
                  last
                />
              </Card>
            </>
          )}
        </>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { marginHorizontal: 18 },
  sensCard: {
    marginTop: 14,
    marginHorizontal: 18,
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  hint: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    lineHeight: 18,
    marginTop: 12,
    paddingHorizontal: 2,
  },
});

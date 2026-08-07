import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen, Header, Eyebrow, Card, ToggleRow, Segmented } from '../components/kit';
import { colors } from '../theme';
import {
  setSoundDetectionEnabled,
  setSoundSensitivity,
  useDeviceSettings,
  useSoundDetectionEnabled,
} from '../features/devices/deviceSettingsStore';

export default function SoundDetection({ navigation }: AppScreenProps) {
  const soundOn = useSoundDetectionEnabled();
  const { soundSensitivity } = useDeviceSettings();

  return (
    <Screen header={<Header title="Sound Detection" onBack={() => navigation.goBack()} />}>
      <Eyebrow>Alarm</Eyebrow>
      <Card style={{ marginHorizontal: 18 }}>
        <ToggleRow name="Sound Detection" on={soundOn} onToggle={() => setSoundDetectionEnabled(!soundOn)} last />
      </Card>

      {soundOn && (
        <Card style={st.sensCard}>
          <Segmented opts={['Low', 'Medium', 'High']} active={soundSensitivity} onSelect={setSoundSensitivity} />
          <Text style={st.hint}>
            You will receive an alarm when loud sounds are detected (phone ringing, etc.).
          </Text>
        </Card>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
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

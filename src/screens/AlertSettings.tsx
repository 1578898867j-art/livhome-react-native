import React from 'react';
import { Screen, Header, Eyebrow, Card, SettingRow } from '../components/kit';

export default function AlertSettings({ navigation }: any) {
  return (
    <Screen>
      <Header title="Alarm Settings" onBack={() => navigation.goBack()} />

      <Eyebrow>Detection type</Eyebrow>
      <Card style={{ marginHorizontal: 18 }}>
        <SettingRow name="Motion Detection" onPress={() => navigation.navigate('motion-detection')} />
        <SettingRow name="Sound Detection" onPress={() => navigation.navigate('sound-detection')} />
        <SettingRow name="Cross-line Detection" onPress={() => navigation.navigate('line-crossing')} last />
      </Card>

      <Eyebrow>Alarm method</Eyebrow>
      <Card style={{ marginHorizontal: 18 }}>
        <SettingRow name="Alarm Reminder" onPress={() => navigation.navigate('alarm-reminder')} last />
      </Card>
    </Screen>
  );
}

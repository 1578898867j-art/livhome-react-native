import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Screen,
  Header,
  Card,
  Eyebrow,
  ToggleRow,
  SettingRow,
} from '../components/kit';

export default function NotifSettings({ navigation }: AppScreenProps) {
  const [notifOn, setNotifOn] = useState(true);
  const [motionOn, setMotionOn] = useState(true);

  return (
    <Screen header={<Header title="Notifications" onBack={() => navigation.goBack()} />}>
      <Card style={{ marginHorizontal: 18, marginTop: 8 }}>
        <ToggleRow
          name="Notifications"
          on={notifOn}
          onToggle={() => setNotifOn((v) => !v)}
          last
        />
      </Card>

      {notifOn && (
        <View>
          <Eyebrow>Notification settings</Eyebrow>
          <Card style={{ marginHorizontal: 18 }}>
            <SettingRow
              name="Notification Frequency"
              value="10 minutes"
              onPress={() => navigation.navigate('notif-frequency')}
            />
            <SettingRow name="Do Not Disturb" value="None" last />
          </Card>

          <Eyebrow>Notification trigger conditions</Eyebrow>
          <Card style={{ marginHorizontal: 18 }}>
            <ToggleRow
              name="Alarm Notification"
              on={motionOn}
              onToggle={() => setMotionOn((v) => !v)}
              last
            />
          </Card>
        </View>
      )}
    </Screen>
  );
}

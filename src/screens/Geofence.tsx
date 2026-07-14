import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap, Row, Card, Header, Toggle } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

export default function Geofence({ navigation }: AppScreenProps) {
  const [geofenceOn, setGeofenceOn] = useState(true);

  return (
    <Screen header={<Header title="Geofence" onBack={() => navigation.goBack()} />}>
      {/* Master toggle */}
      <Card style={st.card}>
        <Row style={{ gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={st.title}>Geofence</Text>
            <Text style={st.sub}>
              After setting a monitoring area, alerts are triggered when a target enters or leaves it.
            </Text>
          </View>
          <Toggle on={geofenceOn} onToggle={() => setGeofenceOn((v) => !v)} />
        </Row>
      </Card>

      {geofenceOn && (
        <>
          {/* Detection Time Period */}
          <Card style={[st.card, { marginTop: 14 }]}>
            <Tap style={st.row} onPress={() => {}}>
              <View style={{ flex: 1 }}>
                <Text style={st.title}>Detection Time Period</Text>
                <Text style={[st.sub, { marginTop: 2 }]}>
                  Only perform virtual fence detection during the set time period.
                </Text>
              </View>
              <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
            </Tap>
          </Card>

          {/* Detection Area */}
          <Card style={[st.card, { marginTop: 12 }]}>
            <Tap style={st.row} onPress={() => {}}>
              <Text style={[st.title, { flex: 1 }]}>Detection Area</Text>
              <View style={st.badge}>
                <Text style={st.badgeText}>Configured</Text>
              </View>
              <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
            </Tap>
          </Card>
        </>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { marginHorizontal: 18, marginTop: 8, paddingHorizontal: 16, paddingVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  sub: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 3, lineHeight: 17 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.successSoft,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.success },
});

import React from 'react';
import { View, Text } from 'react-native';
import { Screen, NavBar } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

// Placeholder for screens not yet ported. Keeps the app runnable while the
// remaining screens are converted batch by batch.
export default function Stub({ navigation, route }: any) {
  const id = route?.name ?? 'screen';
  return (
    <Screen scroll={false}>
      <NavBar title={id} onBack={navigation?.canGoBack?.() ? () => navigation.goBack() : undefined} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 30 }}>
        <Icon name="layers" size={40} color={colors.textTertiary} sw={1.6} />
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.textPrimary }}>Coming soon</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>
          “{id}” 正在从原型移植中。{'\n'}This screen is being ported.
        </Text>
      </View>
    </Screen>
  );
}

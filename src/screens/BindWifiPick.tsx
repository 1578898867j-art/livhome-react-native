import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { StateView, Spinner } from '../components/states';
import { useDemoFlags } from '../features/app/demoStore';
import { colors } from '../theme';

type Net = { name: string; checked?: boolean; unsupported?: boolean };

// Mirrors bindWifi('list'): the "Select a Wi-Fi network" bottom sheet
// listing nearby networks over a dimmed backdrop.
const NETWORKS: Net[] = [
  { name: 'Home_2.4', checked: true },
  { name: 'Home_5G (unsupported)', unsupported: true },
  { name: 'LIVHOME-Setup' },
  { name: 'Office_2.4' },
  { name: 'TP-LINK_8821' },
];

export default function BindWifiPick({ navigation }: AppScreenProps) {
  const pick = () => navigation.navigate('bind-wifi');
  const { failLoad } = useDemoFlags();
  const [retrying, setRetrying] = useState(false);

  // 列表获取失败 → 错误态;Retry 转 0.8s 后仍失败(接后端后换真实请求)
  const retry = () => {
    setRetrying(true);
    setTimeout(() => setRetrying(false), 800);
  };

  return (
    <Screen scroll={false}>
      {/* dim backdrop — tap to dismiss (background:rgba(0,0,0,.32)) */}
      <Tap style={st.backdrop} onPress={() => navigation.goBack()}>
        <View />
      </Tap>

      {/* bottom sheet */}
      <View style={st.sheet}>
        <View style={st.grabber} />
        <Text style={st.sheetTitle}>Select a Wi-Fi network</Text>

        {failLoad ? (
          retrying ? (
            <View style={st.loadingBox}>
              <Spinner size={26} />
            </View>
          ) : (
            <StateView
              variant="error"
              icon="wifi"
              title="Couldn't get the Wi-Fi list"
              sub="Please make sure the device is powered on and nearby, then try again."
              actionLabel="Retry"
              onAction={retry}
              style={st.errorBox}
            />
          )
        ) : (
          NETWORKS.map((n) => (
            <Tap
              key={n.name}
              onPress={pick}
              style={[st.row, n.unsupported && { opacity: 0.45 }]}
            >
              <Text
                style={[
                  st.rowName,
                  { fontWeight: n.checked ? '600' : '400' },
                ]}
              >
                {n.name}
              </Text>
              {n.unsupported ? (
                <Text style={st.unsupported}>Unsupported</Text>
              ) : (
                <Icon name="wifi" size={16} color={colors.textTertiary} sw={1.8} />
              )}
              {n.checked && (
                <Icon name="check" size={18} color={colors.brand} sw={2.4} />
              )}
              <View style={st.rowLine} />
            </Tap>
          ))
        )}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -8 },
    elevation: 12,
  },
  grabber: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 22,
    gap: 12,
  },
  // inset divider — prototype draws it 16px in from each edge
  rowLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  rowName: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  unsupported: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  errorBox: { paddingVertical: 34 },
  loadingBox: { height: 270, alignItems: 'center', justifyContent: 'center' },
});

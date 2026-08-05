import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Screen, Tap, Row, Header } from '../components/kit';
import { BottomSheet } from '../components/BottomSheet';
import { Icon } from '../components/Icon';
import { StateView, Spinner } from '../components/states';
import { useDemoFlags } from '../features/app/demoStore';
import { colors } from '../theme';

type Network = { name: string; unsupported?: boolean };

const NETWORKS: Network[] = [
  { name: 'Home_2.4' },
  { name: 'Home_5G', unsupported: true },
  { name: 'LIVHOME-Setup' },
  { name: 'Office_2.4' },
  { name: 'TP-LINK_8821' },
];

export default function BindWifi({ navigation }: AppScreenProps) {
  const [password, setPassword] = useState('');
  const [network, setNetwork] = useState('Home_2.4');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { failLoad } = useDemoFlags();
  const filled = password.length > 0;

  useEffect(
    () => () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    },
    [],
  );

  const retry = () => {
    setRetrying(true);
    if (retryTimer.current) clearTimeout(retryTimer.current);
    retryTimer.current = setTimeout(() => setRetrying(false), 800);
  };

  const pickNetwork = (item: Network) => {
    if (item.unsupported) return;
    setNetwork(item.name);
    setPickerOpen(false);
  };

  return (
    <Screen
      scroll={false}
      contentStyle={st.page}
      header={<Header title="Wi-Fi Setup" onBack={() => navigation.goBack()} />}
    >
      {/* step indicator (bStepper(2) of 4) */}
      <Row style={st.stepper}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[st.stepBar, { backgroundColor: i <= 2 ? colors.brand : colors.borderStrong }]}
          />
        ))}
      </Row>

      <View style={st.fields}>
        {/* Network selection stays inside this screen so the sheet preserves setup context. */}
        <View style={st.field}>
          <Text style={st.fieldLabel}>Network (2.4GHz)</Text>
          <Tap style={st.fieldRow} onPress={() => setPickerOpen(true)}>
            <Text style={st.fieldVal}>{network}</Text>
            <Icon name="chevR" size={16} color={colors.textTertiary} sw={2} />
          </Tap>
        </View>

        {/* Password — secure text input */}
        <View style={st.field}>
          <Text style={st.fieldLabel}>Password</Text>
          <View style={st.fieldRow}>
            <TextInput
              style={st.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Wi-Fi password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
      </View>

      {/* 2.4GHz notice */}
      <Row style={st.noteRow}>
        <Icon name="info" size={13} color={colors.textTertiary} sw={2} />
        <Text style={st.noteText}>2.4GHz networks only (5GHz not supported).</Text>
      </Row>

      <View style={{ flex: 1 }} />

      {/* Connect / Next */}
      <View style={st.ctaWrap}>
        <Tap
          style={[
            st.btn,
            { backgroundColor: filled ? colors.btnPrimary : colors.bgSecondary },
            !filled && { opacity: 0.5 },
          ]}
          onPress={() => navigation.navigate('bind-connecting')}
        >
          <Text style={[st.btnText, { color: filled ? '#fff' : colors.textPrimary }]}>Connect</Text>
        </Tap>
      </View>

      <BottomSheet
        visible={pickerOpen}
        title="Select a Wi-Fi network"
        onClose={() => setPickerOpen(false)}
      >
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
          <View style={st.networkList}>
            {NETWORKS.map((item, index) => {
              const selected = item.name === network;
              return (
                <Tap
                  key={item.name}
                  disabled={item.unsupported}
                  accessibilityRole="button"
                  accessibilityState={{ selected, disabled: item.unsupported }}
                  onPress={() => pickNetwork(item)}
                  style={[st.networkRow, item.unsupported && st.networkUnsupported]}
                >
                  <Text style={[st.networkName, selected && st.networkNameSelected]}>
                    {item.name}
                  </Text>
                  {item.unsupported ? (
                    <Text style={st.unsupported}>Unsupported</Text>
                  ) : (
                    <Icon name="wifi" size={16} color={colors.textTertiary} sw={1.8} />
                  )}
                  {selected && <Icon name="check" size={18} color={colors.brand} sw={2.4} />}
                  {index < NETWORKS.length - 1 && <View style={st.networkDivider} />}
                </Tap>
              );
            })}
          </View>
        )}
      </BottomSheet>
    </Screen>
  );
}

const st = StyleSheet.create({
  page: { paddingBottom: 40 },
  stepper: { justifyContent: 'center', gap: 6, paddingVertical: 8, paddingTop: 8 },
  stepBar: { width: 20, height: 3, borderRadius: 2 },
  fields: { paddingTop: 18 },
  field: { marginHorizontal: 22, marginBottom: 12 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: 8,
    marginLeft: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  fieldVal: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  noteRow: { marginHorizontal: 22, marginTop: 2, gap: 8, alignItems: 'flex-start' },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    lineHeight: 17,
  },
  ctaWrap: { paddingHorizontal: 24, paddingTop: 16 },
  btn: { width: '100%', height: 54, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
  networkList: { marginHorizontal: -22, marginTop: 8 },
  networkRow: {
    height: 54,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  networkUnsupported: { opacity: 0.45 },
  networkName: { flex: 1, fontSize: 16, fontWeight: '400', color: colors.textPrimary },
  networkNameSelected: { fontWeight: '600' },
  unsupported: { fontSize: 12, fontWeight: '500', color: colors.textTertiary },
  networkDivider: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  errorBox: { paddingVertical: 34 },
  loadingBox: { height: 270, alignItems: 'center', justifyContent: 'center' },
});

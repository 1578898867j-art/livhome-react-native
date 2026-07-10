import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Tap, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

/* Stepper: 4 segments, first `n` filled with brand, the rest border-strong. */
function Stepper({ n }: { n: number }) {
  return (
    <View style={st.stepper}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[st.step, { backgroundColor: i <= n ? colors.brand : colors.borderStrong }]}
        />
      ))}
    </View>
  );
}

/* Manual-add device tile → bind-prep */
function DeviceTile({ name, onPress }: { name: string; onPress?: () => void }) {
  return (
    <Tap style={st.tile} onPress={onPress}>
      <View style={st.tileIcon}>
        <Icon name="camera" size={22} color={colors.textSecondary} sw={1.8} />
      </View>
      <Text style={st.tileLabel}>{name}</Text>
    </Tap>
  );
}

export default function BindNone({ navigation }: any) {
  const goPrep = () => navigation.navigate('bind-prep');

  return (
    <Screen>
      <Header title="Add Device" onBack={() => navigation.goBack()} />
      <Stepper n={1} />

      {/* empty-state icon */}
      <View style={st.iconWrap}>
        <View style={st.iconCircle}>
          <Icon name="router" size={40} color={colors.textTertiary} sw={1.6} />
        </View>
      </View>

      {/* copy */}
      <View style={st.copy}>
        <Text style={st.title}>No device found</Text>
        <Text style={st.sub}>
          Make sure the device is powered on, within 10 m, and Bluetooth is on.
        </Text>
      </View>

      {/* Retry → bind-find */}
      <View style={st.btnWrap}>
        <PrimaryBtn label="Retry" onPress={() => navigation.navigate('bind-find')} />
      </View>

      {/* manual add */}
      <View style={st.manual}>
        <View style={st.dividerRow}>
          <View style={st.dividerLine} />
          <Text style={st.dividerText}>Or add manually</Text>
          <View style={st.dividerLine} />
        </View>
        <View style={st.tiles}>
          <DeviceTile name="Living Room Camera" onPress={goPrep} />
          <DeviceTile name="Bedroom Camera" onPress={goPrep} />
          <DeviceTile name="Backyard Camera" onPress={goPrep} />
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    paddingBottom: 4,
  },
  step: { width: 20, height: 3, borderRadius: 2 },
  iconWrap: { alignItems: 'center', paddingTop: 48, paddingBottom: 4 },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { paddingHorizontal: 34, paddingTop: 18, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, color: colors.textPrimary, textAlign: 'center' },
  sub: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  btnWrap: { paddingHorizontal: 22, paddingTop: 26 },
  manual: { marginTop: 32, paddingHorizontal: 22, paddingBottom: 30 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  tiles: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },
  tileIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center', lineHeight: 16 },
});

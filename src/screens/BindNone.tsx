import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Screen, Header, Tap, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { CAMAVATAR } from '../assets/images';
import { colors } from '../theme';

/* Manual-add device tile → bind-prep;图标为产品图(与搜索页一致) */
function DeviceTile({ name, onPress }: { name: string; onPress?: () => void }) {
  return (
    <Tap style={st.tile} onPress={onPress}>
      <View style={st.tileIcon}>
        <Image source={{ uri: CAMAVATAR }} resizeMode="contain" style={st.tileImg} />
      </View>
      <Text style={st.tileLabel}>{name}</Text>
    </Tap>
  );
}

export default function BindNone({ navigation }: AppScreenProps) {
  const goPrep = () => navigation.navigate('bind-prep');

  return (
    <Screen header={<Header title="Add Device" onBack={() => navigation.goBack()} />}>
      {/* empty-state icon(与搜索页同环节,不显示流程步进条) */}
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

      {/* manual add —— marginTop 130 使卡片落在与搜索页相同的屏幕位置 */}
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
  manual: { marginTop: 130, paddingHorizontal: 22, paddingBottom: 30 },
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
    padding: 8,
  },
  tileImg: { width: '100%', height: '100%' },
  tileLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center', lineHeight: 16 },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { DevicePrivacyStatus } from '../contracts';
import { TILTICONS } from '../icons/protoSets';
import { colors } from '../theme';

export function PrivacyMask({
  status,
  compact = false,
}: {
  status: DevicePrivacyStatus;
  compact?: boolean;
}) {
  const title = status === 'enabling'
    ? 'Turning on privacy mode…'
    : status === 'disabling'
      ? 'Turning off privacy mode…'
      : 'Privacy mode is on';

  return (
    <View style={[st.root, compact && st.compact]} accessibilityRole="text" accessibilityLabel={title}>
      <View style={[st.icon, compact && st.iconCompact]}>
        <SvgXml xml={TILTICONS.privacy} width={compact ? 26 : 30} height={compact ? 26 : 30} color={colors.textTertiary} />
      </View>
      <Text style={[st.title, compact && st.titleCompact]}>{title}</Text>
      {!compact && <Text style={st.sub}>Live video and recording are paused.</Text>}
    </View>
  );
}

const st = StyleSheet.create({
  root: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#252627',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  compact: { gap: 8 },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCompact: { width: 46, height: 46, borderRadius: 23 },
  title: { color: colors.textInverse, fontSize: 16, fontWeight: '700' },
  titleCompact: { fontSize: 15 },
  sub: { color: 'rgba(255,255,255,0.62)', fontSize: 12, fontWeight: '500' },
});

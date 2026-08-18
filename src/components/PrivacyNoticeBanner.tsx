import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import type { DevicePrivacyStatus } from '../contracts';
import { TILTICONS } from '../icons/protoSets';
import { colors } from '../theme';

export function PrivacyNoticeBanner({
  status,
  deviceName,
  compact = false,
  embedded = false,
}: {
  status: DevicePrivacyStatus;
  deviceName?: string;
  compact?: boolean;
  embedded?: boolean;
}) {
  const title = status === 'enabling'
    ? 'Turning on Privacy Mode…'
    : status === 'disabling'
      ? 'Turning off Privacy Mode…'
      : 'Privacy Mode is on';
  const displayTitle = deviceName ? `${deviceName} · ${title}` : title;

  return (
    <LinearGradient
      colors={[colors.criticalSoft, colors.criticalSoft]}
      locations={[0, 1]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[st.root, compact && st.compact, embedded && st.embedded]}
      accessibilityRole="text"
      accessibilityLabel={`${displayTitle}. New events will not be recorded.`}
    >
      <View style={[st.icon, compact && st.iconCompact]}>
        <SvgXml xml={TILTICONS.privacy} width={compact ? 14 : 17} height={compact ? 14 : 17} color={colors.critical} />
      </View>
      <View style={st.copy}>
        {compact ? (
          <Text style={st.compactText} numberOfLines={1}>
            {displayTitle} · New events will not be recorded
          </Text>
        ) : (
          <>
            <Text style={st.title} numberOfLines={1}>{displayTitle}</Text>
            <Text style={st.sub}>New events will not be recorded. Previous events remain available.</Text>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const st = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    gap: 10,
    marginHorizontal: 22,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F4D9D7',
  },
  compact: { minHeight: 40, gap: 8, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12 },
  embedded: { marginHorizontal: 0 },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCompact: { width: 24, height: 24, borderRadius: 12 },
  copy: { flex: 1 },
  title: { fontSize: 13, fontWeight: '700', color: colors.critical },
  sub: { marginTop: 2, fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  compactText: { fontSize: 11, fontWeight: '600', color: colors.critical },
});

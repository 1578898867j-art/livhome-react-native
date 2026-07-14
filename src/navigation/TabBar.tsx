import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { IconFill } from '../components/Icon';
import { SunBurst } from '../components/SunLogo';

// Custom tab bar mirroring the prototype's buildTab():
//   Devices (filled house) · centered sun-burst (no label, larger) · Profile (filled user)
const SIDE: Record<string, { label: string; icon: 'houseNav' | 'user' }> = {
  'dev-home': { label: 'Devices', icon: 'houseNav' },
  'me-home': { label: 'Profile', icon: 'user' },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 0 }]} pointerEvents="box-none">
      <View style={styles.pill}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const onPress = () => {
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
          };

          // center Assistant tab — the sun-burst, no label, larger
          if (route.name === 'agent-chat') {
            return (
              <Pressable key={route.key} onPress={onPress} style={styles.center}>
                <SunBurst size={46} color={focused ? colors.brand : colors.textTertiary} sw={2.4} />
              </Pressable>
            );
          }

          const meta = SIDE[route.name] ?? { label: route.name, icon: 'houseNav' as const };
          const tint = focused ? colors.brand : colors.textTertiary;
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.side}>
              <View style={styles.iconWrap}>
                <IconFill name={meta.icon} size={27} color={tint} />
              </View>
              <Text style={[styles.label, { color: tint, fontWeight: focused ? '700' : '500' }]}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 99,
    height: 72,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  side: { flex: 1, alignItems: 'center', gap: 3 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { height: 30, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10 },
});

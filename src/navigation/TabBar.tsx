import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { IconFill } from '../components/Icon';
import { SunBurst } from '../components/SunLogo';
import type { MainTabName } from './types';
import {
  TAB_BAR_COLLAPSED_SIZE,
  TAB_BAR_HORIZONTAL_INSET,
  TAB_BAR_MIN_BOTTOM_INSET,
  useTabShell,
} from './TabOverlay';

// Custom tab bar mirroring the prototype's buildTab():
//   Devices (filled house) · centered sun-burst (no label, larger) · Profile (filled user)
const SIDE: Record<string, { label: string; icon: 'houseNav' | 'user' }> = {
  'dev-home': { label: 'Devices', icon: 'houseNav' },
  'me-home': { label: 'Profile', icon: 'user' },
};

function NavIcon({ routeName, color, collapsed = false }: { routeName: string; color: string; collapsed?: boolean }) {
  if (routeName === 'agent-chat') {
    return <SunBurst size={collapsed ? 37 : 46} color={color} sw={2.4} />;
  }

  const meta = SIDE[routeName] ?? { label: routeName, icon: 'houseNav' as const };
  return <IconFill name={meta.icon} size={27} color={color} />;
}

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { collapsedTab, setCollapsedTab } = useTabShell();
  const collapsedIndex = collapsedTab === null
    ? -1
    : state.routes.findIndex((route) => route.name === collapsedTab);
  const collapsedRoute = collapsedIndex < 0 ? null : state.routes[collapsedIndex];

  return (
    <View
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, TAB_BAR_MIN_BOTTOM_INSET) }]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.pill,
          collapsedRoute && styles.pillCollapsed,
          collapsedRoute && (collapsedIndex === state.routes.length - 1 ? styles.pillRight : styles.pillLeft),
        ]}
      >
        {collapsedRoute ? (
          <Pressable
            accessibilityLabel="Expand bottom navigation"
            accessibilityRole="button"
            onPress={() => setCollapsedTab(null)}
            style={styles.collapsedButton}
          >
            <NavIcon
              routeName={collapsedRoute.name}
              color={collapsedIndex === state.index ? colors.brand : colors.textTertiary}
              collapsed
            />
          </Pressable>
        ) : state.routes.map((route, i) => {
          const focused = state.index === i;
          const onPress = () => {
            if (focused) {
              setCollapsedTab(route.name as MainTabName);
              return;
            }

            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!e.defaultPrevented) navigation.navigate(route.name);
          };

          // center Assistant tab — the sun-burst, no label, larger
          if (route.name === 'agent-chat') {
            return (
              <Pressable
                accessibilityLabel="Assistant"
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                key={route.key}
                onPress={onPress}
                style={styles.center}
              >
                <NavIcon routeName={route.name} color={focused ? colors.brand : colors.textTertiary} />
              </Pressable>
            );
          }

          const meta = SIDE[route.name] ?? { label: route.name, icon: 'houseNav' as const };
          const tint = focused ? colors.brand : colors.textTertiary;
          return (
            <Pressable
              accessibilityLabel={meta.label}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              key={route.key}
              onPress={onPress}
              style={styles.side}
            >
              <View style={styles.iconWrap}>
                <NavIcon routeName={route.name} color={tint} />
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
    paddingHorizontal: TAB_BAR_HORIZONTAL_INSET,
    paddingTop: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 99,
    height: TAB_BAR_COLLAPSED_SIZE,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pillCollapsed: { width: TAB_BAR_COLLAPSED_SIZE, paddingHorizontal: 0, justifyContent: 'center' },
  pillLeft: { alignSelf: 'flex-start' },
  pillRight: { alignSelf: 'flex-end' },
  collapsedButton: {
    width: TAB_BAR_COLLAPSED_SIZE,
    height: TAB_BAR_COLLAPSED_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  side: { flex: 1, alignItems: 'center', gap: 3 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { height: 30, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10 },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
  PressableProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../theme';

// Full-bleed screen background. Replaces the web build's phone frame / .lp shell.
export function Screen({
  children,
  style,
  edges = ['top'],
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  return (
    <SafeAreaView style={[styles.screen, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Row({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

// Primary dark pill button (matches --btn-primary).
export function PrimaryButton({
  title,
  onPress,
  style,
  disabled,
}: {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryBtn,
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <Text style={styles.primaryBtnText}>{title}</Text>
    </Pressable>
  );
}

// Brand-blue filled button (Continue with email, etc.).
export function BrandButton({
  title,
  onPress,
  style,
  left,
}: {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  left?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.brandBtn, pressed && { opacity: 0.9 }, style]}
    >
      {left}
      <Text style={styles.brandBtnText}>{title}</Text>
    </Pressable>
  );
}

export function Tap({
  children,
  style,
  ...rest
}: Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable {...rest} style={({ pressed }) => [pressed && { opacity: 0.6 }, style]}>
      {children as React.ReactNode}
    </Pressable>
  );
}

export const text = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, color: colors.textPrimary },
  h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.textPrimary },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  secondary: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  tertiary: { fontSize: 12, fontWeight: '500', color: colors.textTertiary },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgPrimary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...shadow.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: colors.border },
  primaryBtn: {
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.btnPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  brandBtn: {
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  brandBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

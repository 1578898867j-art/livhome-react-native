import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow } from '../theme';
import { Icon } from './Icon';
import { getDemoFlags } from '../features/app/demoStore';
import { showToast } from '../features/app/toastStore';

// 设置项保存守卫:failOps 演示打开时,所有设置开关/选项「保存失败」——
// 提示错误并保持原状态(接后端后换成真实请求失败回滚)。
function guardSave(apply?: () => void) {
  if (!apply) return;
  if (getDemoFlags().failOps) {
    showToast('Failed to save. Please try again.', 'error');
    return;
  }
  apply();
}

/* ---- Screen shell (replaces the phone frame; full-bleed) ---- */
export function Screen({
  children,
  header,
  scroll = true,
  edges = ['top'],
  contentStyle,
  bg = colors.bgPrimary,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  contentStyle?: StyleProp<ViewStyle>;
  bg?: string; // 页面底色(如消息中心的灰底),默认全局 bgPrimary
}) {
  const insets = useSafeAreaInsets();
  if (header) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: bg }]} edges={edges}>
        {header}
        {scroll ? (
          <ScrollView
            style={s.screenBody}
            contentContainerStyle={[{ paddingBottom: 28 }, contentStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[s.screenBody, contentStyle]}>{children}</View>
        )}
      </SafeAreaView>
    );
  }
  if (scroll) {
    // 内容允许滚到状态栏后面,顶部用 底色→透明 渐变蒙版让其淡出(全局统一效果)
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: bg }]} edges={edges.filter((e) => e !== 'top')}>
        <ScrollView
          contentContainerStyle={[{ paddingTop: insets.top, paddingBottom: 28 }, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        <LinearGradient
          colors={[bg, `${bg}4D`, `${bg}00`]}
          locations={[0, 0.45, 1]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 26, zIndex: 20 }}
          pointerEvents="none"
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[s.screen, { backgroundColor: bg }]} edges={edges}>
      <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

export function Tap({
  children,
  style,
  onPress,
  hitSlop,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  hitSlop?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={hitSlop}
      style={({ pressed }) => [pressed && { opacity: 0.55 }, style]}
    >
      {children}
    </Pressable>
  );
}

export const Row = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[s.row, style]}>{children}</View>
);

export const Card = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[s.card, style]}>{children}</View>
);

/* ---- header (.hdr) — matches head(title, sub, back) ---- */
export function Header({
  title,
  sub,
  onBack,
  right,
}: {
  title: string;
  sub?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={s.hdr}>
      {onBack && (
        <Tap style={s.iconbtn} onPress={onBack} hitSlop={8}>
          <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
        </Tap>
      )}
      <View style={{ flex: 1 }}>
        <Text style={s.tHead}>{title}</Text>
        {!!sub && <Text style={[s.tBody, { marginTop: 2 }]}>{sub}</Text>}
      </View>
      {right}
    </View>
  );
}

/* ---- nav bar with centered title + optional right action ---- */
export function NavBar({
  title,
  onBack,
  action,
}: {
  title: string;
  onBack?: () => void;
  action?: { label: string; onPress?: () => void; color?: string };
}) {
  return (
    <Row style={{ paddingHorizontal: 18, minHeight: 44, gap: 12, paddingVertical: 8 }}>
      {onBack ? (
        <Tap onPress={onBack} hitSlop={8} style={s.iconbtn}>
          <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
        </Tap>
      ) : (
        <View style={{ width: 18 }} />
      )}
      <Text style={[s.tHead, { flex: 1 }]}>{title}</Text>
      {action ? (
        <Tap onPress={action.onPress} hitSlop={8}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: action.color || colors.brand }}>
            {action.label}
          </Text>
        </Tap>
      ) : (
        <View style={{ width: 18 }} />
      )}
    </Row>
  );
}

export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.eyebrow}>{children}</Text>
);

export const Hint = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.hint}>{children}</Text>
);

/* ---- toggle switch (.tg) ---- */
export function Toggle({ on, onToggle }: { on: boolean; onToggle?: () => void }) {
  return (
    <Pressable
      onPress={() => guardSave(onToggle)}
      style={[s.tg, on && { backgroundColor: colors.brand, alignItems: 'flex-end' }]}
    >
      <View style={s.tgKnob} />
    </Pressable>
  );
}

/* ---- setting nav row (setRow) ---- */
export function SettingRow({
  icon,
  name,
  value,
  onPress,
  last,
}: {
  icon?: string;
  name: string;
  value?: string;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <Tap onPress={onPress} style={s.setRow}>
      {!!icon && (
        <View style={s.setIcon}>
          <Icon name={icon} size={15} color={colors.textSecondary} />
        </View>
      )}
      {/* 标题不换行;值单行、可截断 —— 长值(如 Daytime · 06:00–18:00)不再把标题挤成两行 */}
      <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{name}</Text>
      <View style={{ flex: 1 }} />
      {!!value && (
        <Text numberOfLines={1} style={{ flexShrink: 1, fontSize: 14, fontWeight: '500', color: colors.textTertiary }}>
          {value}
        </Text>
      )}
      <Icon name="chevR" size={15} color={colors.textTertiary} sw={2} />
      {!last && <View style={s.rowLine} />}
    </Tap>
  );
}

/* ---- toggle row (toggleRow) ---- */
export function ToggleRow({
  name,
  sub,
  on,
  onToggle,
  last,
}: {
  name: string;
  sub?: string;
  on: boolean;
  onToggle?: () => void;
  last?: boolean;
}) {
  return (
    <Row style={[{ minHeight: sub ? 62 : 54, paddingHorizontal: 16, paddingVertical: sub ? 12 : 0, gap: 12, position: 'relative' }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{name}</Text>
        {!!sub && (
          <Text style={{ fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 3, lineHeight: 17 }}>
            {sub}
          </Text>
        )}
      </View>
      <Toggle on={on} onToggle={onToggle} />
      {!last && <View style={s.rowLine} />}
    </Row>
  );
}

/* ---- segmented control (segmented) ---- */
export function Segmented({
  opts,
  active,
  onSelect,
}: {
  opts: string[];
  active: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <Row style={s.seg}>
      {opts.map((o, i) => (
        <Tap
          key={o}
          onPress={() => guardSave(() => onSelect?.(i))}
          style={[s.segItem, i === active && s.segItemActive]}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: i === active ? colors.brand : colors.textSecondary }}>
            {o}
          </Text>
        </Tap>
      ))}
    </Row>
  );
}

/* ---- radio row (radioRow) ---- */
export function RadioRow({
  name,
  selected,
  onPress,
  last,
}: {
  name: string;
  selected?: boolean;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <Tap onPress={() => guardSave(onPress)} style={s.setRow}>
      <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: selected ? colors.brand : colors.textPrimary }}>
        {name}
      </Text>
      {selected && <Icon name="check" size={18} color={colors.brand} sw={2.4} />}
      {!last && <View style={s.rowLine} />}
    </Tap>
  );
}

/* ---- primary / secondary buttons ---- */
export function PrimaryBtn({ label, onPress, style }: { label: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.btnPri, pressed && { opacity: 0.85 }, style]}>
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}
export function SecondaryBtn({ label, onPress, style }: { label: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.btnSec, pressed && { opacity: 0.85 }, style]}>
      <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}

export const t = {
  head: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.4, color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: '500' as const, color: colors.textSecondary, lineHeight: 21 },
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.6, color: colors.textPrimary },
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgPrimary },
  screenBody: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: 20 },
  hdr: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 8 },
  tHead: { fontSize: 18, fontWeight: '600', letterSpacing: -0.4, color: colors.textPrimary },
  tBody: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, lineHeight: 21 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  hint: { paddingHorizontal: 22, paddingTop: 10, fontSize: 12, fontWeight: '500', color: colors.textTertiary, lineHeight: 18 },
  iconbtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tg: { width: 42, height: 25, borderRadius: 13, backgroundColor: colors.borderStrong, padding: 2.5, justifyContent: 'center' },
  tgKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  setRow: { flexDirection: 'row', alignItems: 'center', minHeight: 54, paddingHorizontal: 16, gap: 12, position: 'relative' },
  setIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLine: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
  seg: { backgroundColor: colors.bgSecondary, borderRadius: 14, padding: 4, gap: 4 },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11 },
  segItemActive: { backgroundColor: colors.surface, ...shadow.sm },
  btnPri: { height: 54, borderRadius: 99, backgroundColor: colors.btnPrimary, alignItems: 'center', justifyContent: 'center' },
  btnSec: { height: 54, borderRadius: 99, backgroundColor: colors.bgSecondary, alignItems: 'center', justifyContent: 'center' },
});

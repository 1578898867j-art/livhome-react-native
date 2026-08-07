// 通用状态组件 —— 加载 / 空 / 错误(docs/edge-states-checklist.md)。
// 视觉与 BindFail / 消息中心空态同一语言:软色圆底图标 + 标题 + 说明 + 胶囊按钮。
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Tap } from './kit';
import { Icon } from './Icon';
import { colors, shadow } from '../theme';

/* ---- Spinner:C 形旋转加载环(同 BindConnecting 的 pending 环) ---- */
export function Spinner({
  size = 22,
  color = colors.brand,
  stroke = 2,
}: {
  size?: number;
  color?: string;
  stroke?: number;
}) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: stroke,
        borderColor: color,
        borderRightColor: 'transparent',
        transform: [{ rotate }],
      }}
    />
  );
}

/* ---- StateView:页面内空态 / 错误态 ----
 * variant: error(criticalSoft 圆底) | empty(灰圆底) | brand(brandSoft 圆底)
 */
export function StateView({
  variant = 'empty',
  icon,
  title,
  sub,
  actionLabel,
  onAction,
  style,
  titleStyle,
  subStyle,
  actionTextStyle,
}: {
  variant?: 'error' | 'empty' | 'brand';
  icon: string;
  title: string;
  sub?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subStyle?: StyleProp<TextStyle>;
  actionTextStyle?: StyleProp<TextStyle>;
}) {
  const tone =
    variant === 'error'
      ? { bg: colors.criticalSoft, fg: colors.critical }
      : variant === 'brand'
        ? { bg: colors.brandSoft, fg: colors.brand }
        : { bg: colors.bgSecondary, fg: colors.textTertiary };

  return (
    <View style={[st.wrap, style]}>
      <View style={[st.circle, { backgroundColor: tone.bg }]}>
        <Icon name={icon} size={28} color={tone.fg} sw={1.7} />
      </View>
      <Text style={[st.title, titleStyle]}>{title}</Text>
      {!!sub && <Text style={[st.sub, subStyle]}>{sub}</Text>}
      {!!actionLabel && (
        <Tap style={st.actionBtn} onPress={onAction}>
          <Text style={[st.actionTxt, actionTextStyle]}>{actionLabel}</Text>
        </Tap>
      )}
    </View>
  );
}

/* ---- DarkPlayerState:深色播放器内的 加载/离线/错误 态 ----
 * 绝对铺满播放器区域,居中内容;loading 时只显示白色 spinner。
 */
export function DarkPlayerState({
  loading,
  icon = 'cloudOff',
  title,
  sub,
  actionLabel,
  onAction,
}: {
  loading?: boolean;
  icon?: string;
  title?: string;
  sub?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={dk.wrap} pointerEvents="box-none">
      {loading ? (
        <Spinner size={28} color="rgba(255,255,255,0.9)" stroke={2.4} />
      ) : (
        <>
          <View style={dk.circle}>
            <Icon name={icon} size={24} color="rgba(255,255,255,0.85)" sw={1.7} />
          </View>
          {!!title && <Text style={dk.title}>{title}</Text>}
          {!!sub && <Text style={dk.sub}>{sub}</Text>}
          {!!actionLabel && (
            <Tap style={dk.btn} onPress={onAction}>
              <Text style={dk.btnTxt}>{actionLabel}</Text>
            </Tap>
          )}
        </>
      )}
    </View>
  );
}

const dk = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1A16',
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: 12, fontSize: 14, fontWeight: '700', color: '#fff' },
  sub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  btn: {
    marginTop: 14,
    height: 34,
    paddingHorizontal: 20,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: { fontSize: 13, fontWeight: '700', color: '#fff' },
});

const st = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  sub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    lineHeight: 19,
    textAlign: 'center',
  },
  actionBtn: {
    marginTop: 18,
    height: 40,
    paddingHorizontal: 26,
    borderRadius: 99,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  actionTxt: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
});

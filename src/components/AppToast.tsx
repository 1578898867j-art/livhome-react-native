// 全局 toast host —— 白色胶囊 + 状态圆标(成功绿勾 / 失败红叉 / 信息蓝),
// 底部导航上方居中出现,自动消失(toastStore 控制时长)。挂在 App 根部。
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { useToastMsg } from '../features/app/toastStore';
import { colors, shadow } from '../theme';
import type { ToastMsg } from '../features/app/toastStore';

const TONE = {
  success: { bg: '#22A45D', icon: 'check' },
  error: { bg: colors.critical, icon: 'x' },
  info: { bg: colors.brand, icon: 'info' },
} as const;

export function AppToastHost() {
  const msg = useToastMsg();
  const insets = useSafeAreaInsets();

  // 退场动画期间保留最后一条内容
  const [shown, setShown] = useState<ToastMsg | null>(null);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (msg) {
      setShown(msg);
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setShown(null);
      });
    }
  }, [msg, anim]);

  if (!shown) return null;
  const tone = TONE[shown.variant];

  return (
    <View
      pointerEvents="none"
      style={[st.layer, { bottom: Math.max(insets.bottom, 12) + 88 }]}
    >
      <Animated.View
        style={[
          st.pill,
          {
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
          },
        ]}
      >
        <View style={[st.mark, { backgroundColor: tone.bg }]}>
          <Icon name={tone.icon} size={12} color="#fff" sw={3} />
        </View>
        <Text style={st.txt} numberOfLines={1}>
          {shown.text}
        </Text>
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  layer: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 200 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 40,
    maxWidth: '86%',
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    ...shadow.lg,
  },
  mark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
});

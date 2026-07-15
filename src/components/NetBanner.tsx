// 全局断网提示条 —— demoStore.offline 打开时从顶部滑入(接后端后换 NetInfo 驱动)。
// 深色胶囊,不挡交互(pointerEvents none)。
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { useDemoFlags } from '../features/app/demoStore';
import { shadow } from '../theme';

export function NetBanner() {
  const { offline } = useDemoFlags();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (offline) {
      setMounted(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 260,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [offline, anim]);

  if (!mounted) return null;

  return (
    <View pointerEvents="none" style={[st.layer, { top: insets.top + 8 }]}>
      <Animated.View
        style={[
          st.pill,
          {
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] }) }],
          },
        ]}
      >
        <Icon name="cloudOff" size={14} color="#fff" sw={2} />
        <Text style={st.txt}>No internet connection</Text>
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  layer: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 190 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    ...shadow.lg,
  },
  txt: { fontSize: 13, fontWeight: '600', color: '#fff' },
});

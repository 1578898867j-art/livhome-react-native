import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// 全局底部弹层壳:遮罩原地淡入淡出,白色面板单独从底部滑入/滑出
// (与 DevConfig 的 CfgSheet 同一交互规范;退场动画播完才卸载)
export function BottomSheet({
  visible,
  title,
  desc,
  onClose,
  children,
  overlay,
  floating,
}: {
  visible: boolean;
  title: string;
  desc?: string;
  onClose: () => void;
  children: React.ReactNode;
  // 渲染在同一个 Modal 里、盖在面板之上的浮层(如删除确认)。
  // iOS 下两个平级 Modal 无法同时展示,必须走这里。
  overlay?: React.ReactNode;
  // 悬浮在弹层顶部上方的非阻塞反馈,随面板实际高度定位。
  floating?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(visible);
  const [sheetH, setSheetH] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => setMounted(false));
    }
  }, [visible, anim]);

  if (!mounted) return null;
  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFillObject, st.backdrop, { opacity: anim }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      <View style={st.wrap} pointerEvents="box-none">
        <Animated.View
          onLayout={(e) => setSheetH(e.nativeEvent.layout.height)}
          style={{
            transform: [
              { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [sheetH || 600, 0] }) },
            ],
          }}
        >
          {/* 面板空白区域点击收起键盘(面板内含输入框的场景,如自定义语音重命名) */}
          <Pressable style={st.sheet} onPress={Keyboard.dismiss} accessible={false}>
            <View style={st.grabberWrap}>
              <View style={st.grabber} />
            </View>
            <Text style={st.title}>{title}</Text>
            {!!desc && <Text style={st.desc}>{desc}</Text>}
            {children}
          </Pressable>
        </Animated.View>
      </View>
      {floating != null && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          <View style={[st.floating, { bottom: sheetH + 12 }]}>{floating}</View>
        </View>
      )}
      {/* 浮层必须绝对铺满:否则会作为兄弟节点和面板平分屏幕高度,把面板挤到上半屏 */}
      {overlay != null && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          {overlay}
        </View>
      )}
    </Modal>
  );
}

const st = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  wrap: { flex: 1, justifyContent: 'flex-end' },
  floating: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  grabberWrap: { alignItems: 'center', paddingTop: 10, paddingBottom: 8 },
  grabber: { width: 38, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  title: { fontSize: 19, fontWeight: '800', color: colors.textPrimary },
  desc: { fontSize: 13, fontWeight: '500', color: colors.textTertiary, marginTop: 5, marginBottom: 10, lineHeight: 19 },
});

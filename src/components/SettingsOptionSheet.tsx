import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Tap } from './kit';

export function SettingsOptionSheet({
  visible,
  title,
  desc,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  desc?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(visible);
  const [sheetHeight, setSheetHeight] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(animation, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => setMounted(false));
  }, [animation, visible]);

  if (!mounted) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFillObject, st.backdrop, { opacity: animation }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      <View style={st.overlay} pointerEvents="box-none">
        <Animated.View
          onLayout={(event) => setSheetHeight(event.nativeEvent.layout.height)}
          style={{
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [sheetHeight || 600, 0],
                }),
              },
            ],
          }}
        >
          <View accessibilityViewIsModal style={st.sheet}>
            <View style={st.grabberWrap}>
              <View style={st.grabber} />
            </View>
            <Text style={st.title}>{title}</Text>
            {!!desc && <Text style={st.desc}>{desc}</Text>}
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function SettingsOptionRow({
  label,
  sub,
  selected,
  onPress,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Tap onPress={onPress} style={[st.optionRow, { alignItems: sub ? 'flex-start' : 'center' }]}>
      <View style={{ flex: 1 }}>
        <Text style={[st.optionLabel, selected && { color: colors.brand }]}>{label}</Text>
        {!!sub && <Text style={st.optionSub}>{sub}</Text>}
      </View>
      <View
        style={[
          st.radio,
          selected && { borderColor: colors.brand },
          sub ? { marginTop: 2 } : null,
        ]}
      >
        {selected && <View style={st.radioDot} />}
      </View>
    </Tap>
  );
}

export function SettingsOptionDoneButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [st.doneButton, pressed && { opacity: 0.85 }]}
    >
      <Text style={st.doneText}>Done</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg * 2,
  },
  grabberWrap: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: 8 },
  grabber: { width: 38, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  title: { fontSize: 19, fontWeight: '800', color: colors.textPrimary },
  desc: {
    marginTop: 5,
    marginBottom: spacing.sm,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  optionLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  optionSub: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.brand },
  doneButton: {
    width: '100%',
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  doneText: { color: colors.textInverse, fontSize: 16, fontWeight: '700' },
});

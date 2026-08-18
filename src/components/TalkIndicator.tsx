import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { PHOTOICONS } from '../icons/protoSets';

const BAR_COUNT = 7;

export function TalkIndicator({
  compact,
  inverted = false,
  style,
}: {
  compact: boolean;
  inverted?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const wave = useRef(new Animated.Value(0)).current;
  const phase = useRef(new Animated.Value(compact ? 1 : 0)).current;
  const entry = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(wave, {
          toValue: 1,
          duration: 420,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave, {
          toValue: 0,
          duration: 420,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    waveLoop.start();
    const entryAnimation = Animated.spring(entry, {
      toValue: 1,
      damping: 17,
      stiffness: 220,
      mass: 0.7,
      // The same view also animates height through `phase`, which cannot use
      // the native driver. Keep both values on the JS driver to avoid moving
      // one animated node between native and JS in Expo Go.
      useNativeDriver: false,
    });
    entryAnimation.start();
    return () => {
      waveLoop.stop();
      entryAnimation.stop();
    };
  }, [entry, wave]);

  useEffect(() => {
    Animated.timing(phase, {
      toValue: compact ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [compact, phase]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        st.card,
        style,
        {
          height: phase.interpolate({ inputRange: [0, 1], outputRange: [94, 52] }),
          opacity: entry,
          transform: [
            { scale: entry.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
          ],
        },
      ]}
    >
      <Animated.View
        style={[
          st.mic,
          {
            opacity: phase.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0, 0] }),
            transform: [
              { translateY: phase.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
            ],
          },
        ]}
      >
        <SvgXml xml={PHOTOICONS.micSolid} width={30} height={35} color="#fff" />
      </Animated.View>

      <View style={[st.waveRow, inverted && { transform: [{ rotate: '180deg' }] }]}>
        {Array.from({ length: BAR_COUNT }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              st.waveBar,
              {
                transform: [
                  {
                    scaleY: wave.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0.34 + 0.66 * Math.abs(Math.sin(index * 0.95)),
                        0.34 + 0.66 * Math.abs(Math.sin(index * 0.95 + 2.2)),
                      ],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    width: 92,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(16,18,22,0.72)',
    alignItems: 'center',
  },
  mic: { position: 'absolute', top: 12, alignItems: 'center', justifyContent: 'center' },
  waveRow: {
    position: 'absolute',
    bottom: 11,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  waveBar: { width: 2.5, height: 24, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.96)' },
});

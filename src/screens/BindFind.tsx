import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Screen, Tap, Row, Header } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors, shadow } from '../theme';

/* manual-add device tile (bDeviceTile) → continue/next */
function DeviceTile({ name, onPress }: { name: string; onPress?: () => void }) {
  return (
    <Tap style={st.tile} onPress={onPress}>
      <View style={st.tileIcon}>
        <Icon name="camera" size={22} color={colors.textSecondary} sw={1.8} />
      </View>
      <Text style={st.tileLabel}>{name}</Text>
    </Tap>
  );
}

export default function BindFind({ navigation }: AppScreenProps) {
  // ping ripples (two rings staggered) + breathing dot
  const ping1 = useRef(new Animated.Value(0)).current;
  const ping2 = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const mkPing = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, duration: 2600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ]),
      );
    const p1 = mkPing(ping1, 0);
    const p2 = mkPing(ping2, 1300);
    const br = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    p1.start();
    p2.start();
    br.start();
    return () => {
      p1.stop();
      p2.stop();
      br.stop();
    };
  }, [ping1, ping2, breathe]);

  const ringStyle = (v: Animated.Value) => ({
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
  });

  return (
    <Screen
      scroll={false}
      header={<Header title="Add Device" onBack={() => navigation.goBack()} />}
    >
      <View style={st.headBlock}>
        <Text style={st.title}>Bring your phone close to the device</Text>
        <Text style={st.sub}>LIVHOME is quietly detecting nearby cameras</Text>
      </View>

      {/* searching spinner */}
      <View style={st.radar}>
        <Animated.View style={[st.ring, ringStyle(ping1)]} />
        <Animated.View style={[st.ring, ringStyle(ping2)]} />
        <View style={st.core}>
          <Icon name="camera" size={46} color={colors.brand} sw={1.5} />
        </View>
      </View>

      <Row style={st.searchRow}>
        <Animated.View
          style={[
            st.dot,
            { opacity: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
          ]}
        />
        <Text style={st.searchTxt}>Searching for nearby devices…</Text>
      </Row>

      <View style={st.qrRow}>
        <Tap onPress={() => navigation.navigate('bind-qr')}>
          <Text style={st.qrTxt}>Use QR Pairing instead</Text>
        </Tap>
      </View>

      {/* manual add card */}
      <View style={st.manual}>
        <Row style={st.divider}>
          <View style={st.line} />
          <Text style={st.dividerTxt}>Or add manually</Text>
          <View style={st.line} />
        </Row>
        <Row style={st.tileRow}>
          <DeviceTile name="Living Room Camera" onPress={() => navigation.navigate('bind-prep')} />
          <DeviceTile name="Bedroom Camera" onPress={() => navigation.navigate('bind-prep')} />
          <DeviceTile name="Backyard Camera" onPress={() => navigation.navigate('bind-prep')} />
        </Row>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  headBlock: { alignItems: 'center', paddingHorizontal: 26, paddingTop: 22 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, lineHeight: 29, color: colors.textPrimary, textAlign: 'center' },
  sub: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, lineHeight: 21, marginTop: 10, textAlign: 'center' },

  radar: { width: 210, height: 210, alignSelf: 'center', marginTop: 30, marginBottom: 22, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: colors.brandSoft },
  core: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.md },

  searchRow: { justifyContent: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand },
  searchTxt: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },

  qrRow: { alignItems: 'center', paddingTop: 14 },
  qrTxt: { fontSize: 13, fontWeight: '700', color: colors.brand },

  manual: { marginTop: 32, paddingHorizontal: 22 },
  divider: { gap: 10, marginBottom: 14 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerTxt: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  tileRow: { alignItems: 'stretch', gap: 10 },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },
  tileIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.bgSecondary, alignItems: 'center', justifyContent: 'center' },
  tileLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center', lineHeight: 16 },
});

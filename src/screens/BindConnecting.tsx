import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Screen, Header, PrimaryBtn, SecondaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

/* 4-dot binding stepper (bStepper(n)) — first n dots brand, rest border-strong */
function Stepper({ n }: { n: number }) {
  return (
    <View style={st.stepper}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[st.stepDot, { backgroundColor: i <= n ? colors.brand : colors.borderStrong }]}
        />
      ))}
    </View>
  );
}

/* pending spinner — the C-shaped ring rotates continuously */
function SpinRing() {
  const spin = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View style={[st.dotPending, { transform: [{ rotate }] }]} />;
}

/* status step row — done = success check, pending = ring */
function Step({ done, title, sub }: { done: boolean; title: string; sub: string }) {
  return (
    <View style={st.stepRow}>
      {done ? (
        <View style={st.dotDone}>
          <Icon name="check" size={13} color="#fff" sw={2.8} />
        </View>
      ) : (
        <SpinRing />
      )}
      <View>
        <Text style={[st.stepTitle, { color: done ? colors.textPrimary : colors.brand }]}>{title}</Text>
        <Text style={st.stepSub}>{sub}</Text>
      </View>
    </View>
  );
}

export default function BindConnecting({ navigation }: AppScreenProps) {
  // progress ring geometry (r=58): circumference ~364, offset 36 ≈ 90%
  const R = 58;
  const CIRC = 364;
  const OFFSET = 36;

  return (
    <Screen
      scroll={false}
      header={<Header title="Connecting" onBack={() => navigation.goBack()} />}
    >
      <View style={st.wrap}>
        <Stepper n={3} />

        {/* progress ring */}
        <View style={st.ringWrap}>
          <Svg width={132} height={132} viewBox="0 0 132 132">
            <Circle cx={66} cy={66} r={R} fill="none" stroke={colors.border} strokeWidth={6} />
            <Circle
              cx={66}
              cy={66}
              r={R}
              fill="none"
              stroke={colors.brand}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={OFFSET}
              transform="rotate(-90 66 66)"
            />
          </Svg>
          <View style={st.ringIcon}>
            <Icon name="camera" size={40} color={colors.brand} sw={1.5} />
          </View>
        </View>

        <Text style={st.pct}>90%</Text>

        {/* status steps */}
        <View style={st.stepsCard}>
          <Step done title="Device found" sub="Living Room Camera" />
          <Step done title="Joining Home_2.4" sub="Sending credentials" />
          <Step done title="Registering to LIVHOME" sub="Binding to your account" />
          <Step done={false} title="Starting the camera" sub="Vision · sound · IR" />
        </View>

        <Text style={st.hint}>
          Bluetooth slow? Use{' '}
          <Text style={st.hintLink} onPress={() => navigation.navigate('bind-qr')}>
            QR Pairing
          </Text>
        </Text>

        {/* actions */}
        <View style={st.actions}>
          <SecondaryBtn label="Cancel" onPress={() => navigation.goBack()} style={st.btn} />
          <PrimaryBtn label="Continue" onPress={() => navigation.navigate('bind-success')} style={st.btn} />
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  wrap: { flex: 1, flexDirection: 'column' },
  stepper: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 8, paddingBottom: 4 },
  stepDot: { width: 20, height: 3, borderRadius: 2 },
  ringWrap: { width: 132, height: 132, marginTop: 14, alignSelf: 'center' },
  ringIcon: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  pct: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
    letterSpacing: -0.6,
  },
  stepsCard: {
    marginTop: 14,
    marginHorizontal: 30,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  dotDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.brand,
    borderRightColor: 'transparent',
  },
  stepTitle: { fontSize: 14, fontWeight: '600' },
  stepSub: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 2 },
  hint: {
    marginTop: 16,
    marginHorizontal: 30,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  hintLink: { color: colors.brand, fontWeight: '600' },
  actions: { marginTop: 'auto', flexDirection: 'row', gap: 10, paddingHorizontal: 24, paddingTop: 14, paddingBottom: 40 },
  btn: { flex: 1, borderRadius: 99 },
});

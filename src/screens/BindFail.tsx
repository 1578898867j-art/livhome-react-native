import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, PrimaryBtn, SecondaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

const CAUSES = [
  'Check the Wi-Fi password',
  'Use a 2.4GHz network (not 5GHz)',
  'Move the device closer to the router',
  'Hold the reset button on the back',
];

function CauseRow({ text, first }: { text: string; first?: boolean }) {
  return (
    <View style={[st.causeRow, !first && st.causeDivider]}>
      <View style={st.causeIcon}>
        <Icon name="chevR" size={13} color={colors.textTertiary} sw={2.2} />
      </View>
      <Text style={st.causeText}>{text}</Text>
    </View>
  );
}

export default function BindFail({ navigation }: AppScreenProps) {
  return (
    <Screen scroll={false}>
      <Header title="Connection failed" onBack={() => navigation.goBack()} />

      <View style={st.iconWrap}>
        <View style={st.iconCircle}>
          <Icon name="x" size={32} color={colors.critical} sw={2.4} />
        </View>
      </View>

      <View style={st.titleWrap}>
        <Text style={st.title}>Connection failed</Text>
        <Text style={st.subtitle}>
          The password may be wrong, or the device is too far from the router.
        </Text>
      </View>

      <View style={st.causesWrap}>
        <Text style={st.causesLabel}>Common causes</Text>
        <View style={st.causesCard}>
          {CAUSES.map((c, i) => (
            <CauseRow key={c} text={c} first={i === 0} />
          ))}
        </View>
      </View>

      <View style={st.footer}>
        <PrimaryBtn
          label="Retry"
          onPress={() => navigation.navigate('bind-wifi')}
          style={st.btn}
        />
        <SecondaryBtn
          label="Contact support"
          onPress={() => navigation.navigate('Main', { screen: 'dev-home' })}
          style={[st.btn, { marginTop: 10 }]}
        />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    paddingTop: 38,
    paddingBottom: 4,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.criticalSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  causesWrap: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  causesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    marginLeft: 4,
    marginBottom: 4,
  },
  causesCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 18,
  },
  causeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  causeDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  causeIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  causeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 40,
  },
  btn: {
    width: '100%',
  },
});

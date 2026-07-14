import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Card, PrimaryBtn } from '../components/kit';
import { colors } from '../theme';

/* ---- bind stepper (bStepper) — 4 segments, first n filled ---- */
function BStepper({ n }: { n: number }) {
  return (
    <View style={st.stepper}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[st.step, { backgroundColor: i <= n ? colors.brand : colors.borderStrong }]}
        />
      ))}
    </View>
  );
}

/* ---- numbered prep item (item) ---- */
function PrepItem({ n, title, desc, first }: { n: string; title: string; desc: string; first?: boolean }) {
  return (
    <View style={[st.item, !first && st.itemDivider]}>
      <View style={st.badge}>
        <Text style={st.badgeText}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={st.itemTitle}>{title}</Text>
        <Text style={st.itemDesc}>{desc}</Text>
      </View>
    </View>
  );
}

export default function BindPrep({ navigation }: AppScreenProps) {
  return (
    <Screen
      scroll={false}
      header={
        <Header
          title="Before you start"
          sub="Most failures are network or power related · ~60s"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <View style={{ flex: 1 }}>
        <BStepper n={1} />

        <View style={st.listWrap}>
          <Card style={st.list}>
            <PrepItem
              n="1"
              title="Reset the device"
              desc="Hold the pairing button ~8s until the light slowly blinks blue."
              first
            />
            <PrepItem
              n="2"
              title="Use a 2.4GHz network"
              desc="LIVHOME doesn’t support 5GHz. Use your router’s 2.4G band."
            />
            <PrepItem
              n="3"
              title="Stay on the same network"
              desc="During pairing, keep your phone on the same Wi-Fi as the device."
            />
          </Card>
        </View>

        <View style={st.footer}>
          <PrimaryBtn label="Got it, continue" onPress={() => navigation.navigate('bind-wifi')} />
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    paddingBottom: 4,
  },
  step: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  listWrap: {
    paddingHorizontal: 22,
    paddingTop: 14,
  },
  list: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 16,
  },
  itemDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.brand,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  itemDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 21,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 40,
  },
});

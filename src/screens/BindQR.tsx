import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, SecondaryBtn } from '../components/kit';
import { SunLogo } from '../components/SunLogo';
import { colors } from '../theme';

// QR matrix from the prototype source (11 rows of 11 chars; '1' = filled).
const PAT = [
  '11111011111',
  '10001010001',
  '10111010111',
  '10111011101',
  '10001000101',
  '11111010101',
  '00000011000',
  '11101101110',
  '10010100011',
  '01101011010',
  '11011001011',
];

const CELL = 14;

export default function BindQR({ navigation }: any) {
  return (
    <Screen scroll={false}>
      <Header title="QR Pairing" onBack={() => navigation.goBack()} />

      <View style={st.intro}>
        <Text style={st.title}>Scan the QR code</Text>
        <Text style={st.sub}>
          Hold the QR code ~10cm from the device camera so it can read the Wi-Fi.
        </Text>
      </View>

      <View style={st.qrWrap}>
        <View style={st.qrCard}>
          <View style={st.grid}>
            {PAT.map((row, r) =>
              row.split('').map((v, c) => (
                <View
                  key={`${r}-${c}`}
                  style={{
                    width: CELL,
                    height: CELL,
                    backgroundColor: v === '1' ? colors.textPrimary : 'transparent',
                  }}
                />
              )),
            )}
          </View>
          <View style={st.logoBadge}>
            <SunLogo size={38} />
          </View>
        </View>
      </View>

      <View style={st.waitRow}>
        <View style={st.dot} />
        <Text style={st.waitText}>Waiting for the device to scan…</Text>
      </View>

      <View style={st.footer}>
        <SecondaryBtn
          label="Can’t scan? Switch to Bluetooth"
          onPress={() => navigation.navigate('bind-find')}
          style={{ borderRadius: 99 }}
        />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  intro: { paddingHorizontal: 34, paddingTop: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.textPrimary },
  sub: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  qrWrap: { alignItems: 'center', paddingTop: 34 },
  qrCard: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CELL * 11,
    height: CELL * 11,
  },
  logoBadge: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -22,
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  waitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 28,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand },
  waitText: { fontSize: 14, fontWeight: '500', color: colors.textTertiary },
  footer: { marginTop: 'auto', paddingHorizontal: 24, paddingTop: 30, paddingBottom: 40 },
});

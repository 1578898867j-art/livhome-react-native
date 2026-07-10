import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, DimensionValue } from 'react-native';
import { Screen, NavBar } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

const COLS = 4;
const ROWS = 3;
const N = COLS * ROWS;

// Seeded from the prototype's S.detCells default.
const DEFAULT_CELLS: boolean[] = [
  false, true, true, false,
  false, true, true, false,
  false, true, true, false,
];

// Orange overlay dots: [25,50,75]% horizontally × [33.333,66.666]% vertically.
const DOTS: { left: DimensionValue; top: DimensionValue }[] = [];
[25, 50, 75].forEach((vx) => {
  [33.333, 66.666].forEach((vy) => {
    DOTS.push({ left: `${vx}%`, top: `${vy}%` });
  });
});

export default function DetectionArea({ navigation }: any) {
  const [cells, setCells] = useState<boolean[]>(DEFAULT_CELLS);
  const [notify, setNotify] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allOn = cells.every((v) => v);

  const toggleCell = (i: number) =>
    setCells((prev) => prev.map((v, j) => (j === i ? !v : v)));

  const toggleAll = () => setCells(DEFAULT_CELLS.map(() => !allOn));

  // Prototype det-refresh only shows a toast — it never touches the cells.
  const refresh = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast('Snapshot refreshed');
    toastTimer.current = setTimeout(() => setToast(null), 1400);
  };

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  return (
    <Screen scroll={false}>
      <NavBar
        title="Detection Area"
        onBack={() => navigation.goBack()}
        action={{ label: 'Done', onPress: () => navigation.goBack() }}
      />

      {/* Camera preview (dark synthetic base, no photo) with tappable grid + dot overlay */}
      <View style={st.previewWrap}>
        <View style={st.preview}>
          {/* timestamp */}
          <View style={st.stamp}>
            <Text style={st.stampText}>2026-03-23 10:46:57</Text>
          </View>

          {/* 4×3 tappable grid */}
          <View style={st.grid}>
            {cells.map((on, i) => (
              <Pressable
                key={i}
                onPress={() => toggleCell(i)}
                style={[st.cell, on && st.cellOn]}
              />
            ))}
          </View>

          {/* orange dots (non-interactive) */}
          <View style={st.dotLayer} pointerEvents="none">
            {DOTS.map((d, i) => (
              <View key={i} style={[st.dot, { left: d.left, top: d.top }]} />
            ))}
          </View>
        </View>
      </View>

      {/* Notify toggle */}
      <Pressable style={st.notifyRow} onPress={() => setNotify((v) => !v)}>
        <View style={[st.check, notify ? st.checkOn : st.checkOff]}>
          {notify && <Icon name="check" size={12} color="#fff" sw={3} />}
        </View>
        <Text style={st.notifyText}>Select areas to receive alerts for those regions</Text>
      </Pressable>

      {/* Refresh */}
      <View style={st.refreshWrap}>
        <Pressable
          onPress={refresh}
          style={({ pressed }) => [st.refreshBtn, pressed && { opacity: 0.85 }]}
        >
          <Icon name="refresh" size={15} color={colors.brand} />
          <Text style={st.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {/* Bottom Select/Clear All */}
      <View style={st.footer}>
        <Pressable
          onPress={toggleAll}
          style={({ pressed }) => [st.footerBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={st.footerBtnText}>{allOn ? 'Clear All' : 'Select All'}</Text>
        </Pressable>
      </View>

      {/* toast (port of showToast) */}
      {toast && (
        <View style={st.toast} pointerEvents="none">
          <Text style={st.toastText}>{toast}</Text>
        </View>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  previewWrap: {
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  preview: { position: 'relative', height: 250, backgroundColor: '#1E1A16', overflow: 'hidden' },
  stamp: {
    position: 'absolute',
    top: 8,
    left: 10,
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,.45)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  stampText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / COLS}%`,
    height: `${100 / ROWS}%`,
    borderWidth: 1,
    borderColor: 'rgba(90,150,255,.55)',
    backgroundColor: 'transparent',
  },
  cellOn: { backgroundColor: 'rgba(35,130,255,.20)' },

  dotLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9F0A',
    marginLeft: -3,
    marginTop: -3,
  },

  notifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 14,
    gap: 10,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkOn: { borderColor: colors.brand, backgroundColor: colors.brand },
  checkOff: { borderColor: colors.borderStrong, backgroundColor: 'transparent' },
  notifyText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textSecondary, lineHeight: 18 },

  refreshWrap: { flexDirection: 'row', justifyContent: 'center', paddingTop: 18 },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 42,
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: 99,
  },
  refreshText: { fontSize: 14, fontWeight: '700', color: colors.brand },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 40,
  },
  footerBtn: {
    width: '100%',
    height: 54,
    borderRadius: 99,
    backgroundColor: colors.btnPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  toast: {
    position: 'absolute',
    top: 118,
    alignSelf: 'center',
    zIndex: 90,
    backgroundColor: 'rgba(20,20,22,0.9)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 99,
  },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});

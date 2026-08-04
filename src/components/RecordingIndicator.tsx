import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

export function useRecordingElapsed(active: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!active) {
      setElapsedSeconds(0);
      return undefined;
    }

    const startedAt = Date.now();
    const update = () => setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    update();
    const timer = setInterval(update, 250);

    return () => clearInterval(timer);
  }, [active]);

  return elapsedSeconds;
}

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(' : ');
}

export function RecordingIndicator({
  elapsedSeconds,
  style,
  compact = false,
}: {
  elapsedSeconds: number;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}) {
  const label = formatElapsed(elapsedSeconds);

  return (
    <View pointerEvents="none" style={[st.anchor, style]}>
      <View accessible accessibilityLabel={`Recording ${label}`} style={[st.pill, compact && st.pillCompact]}>
        <View style={[st.dot, compact && st.dotCompact]} />
        <Text style={[st.time, compact && st.timeCompact]}>{label}</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    zIndex: 20,
    alignItems: 'center',
  },
  pill: {
    minWidth: 126,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(18, 21, 26, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#FF3B1F' },
  time: {
    color: '#F4F4F5',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  pillCompact: { minWidth: 106, height: 30, paddingHorizontal: 10, borderRadius: 10, gap: 6 },
  dotCompact: { width: 7, height: 7, borderRadius: 3.5 },
  timeCompact: { fontSize: 14, letterSpacing: 0.5 },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  tag?: string;
  label?: string;
  box?: boolean;
  style?: any;
};

/**
 * camPreview() — dark synthetic camera view (no photo assets).
 * Base #1E1A16 with a #2A2520 → #15110d vertical gradient and soft
 * radial-highlight approximations, an optional green detection box
 * (+ tag chip) and an optional bottom-left label.
 */
export function CamPreview({ tag, label, box = true, style }: Props) {
  return (
    <View style={[st.root, style]}>
      {/* linear-gradient(180deg, #2A2520, #15110d) */}
      <LinearGradient colors={['#2A2520', '#15110d']} style={StyleSheet.absoluteFill} />
      {/* radial-gradient highlight approximations */}
      <View style={st.glowA} />
      <View style={st.glowB} />

      {/* green detection box */}
      {box && (
        <View style={st.box}>
          {!!tag && (
            <View style={st.tagChip}>
              <Text style={st.tagText}>{tag}</Text>
            </View>
          )}
        </View>
      )}

      {/* bottom-left label */}
      {!!label && <Text style={st.label}>{label}</Text>}
    </View>
  );
}

export default CamPreview;

const st = StyleSheet.create({
  root: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1E1A16',
    overflow: 'hidden',
  },
  /* circle at 40% 62%, rgba(120,140,160,.35) */
  glowA: {
    position: 'absolute',
    left: '12%',
    top: '34%',
    width: '56%',
    height: '56%',
    borderRadius: 999,
    backgroundColor: 'rgba(120,140,160,0.16)',
  },
  /* circle at 74% 30%, rgba(245,232,216,.12) */
  glowB: {
    position: 'absolute',
    left: '56%',
    top: '6%',
    width: '36%',
    height: '48%',
    borderRadius: 999,
    backgroundColor: 'rgba(245,232,216,0.08)',
  },
  box: {
    position: 'absolute',
    left: '28%',
    top: '36%',
    width: '34%',
    height: '46%',
    borderWidth: 1.5,
    borderColor: 'rgba(74,222,128,.9)',
    borderRadius: 6,
  },
  tagChip: {
    position: 'absolute',
    top: -19,
    left: -1,
    backgroundColor: 'rgba(74,222,128,.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: { color: '#062018', fontSize: 10, fontWeight: '700' },
  label: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

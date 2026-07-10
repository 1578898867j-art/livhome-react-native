import React from 'react';
import { View, Image } from 'react-native';
import Svg, { Line, G } from 'react-native-svg';
import { SUNLOGO } from '../assets/images';
import { colors } from '../theme';

// The exact LIVHOME sun-burst mark, drawn with the same 24-ray geometry as the
// prototype (long/short alternating rays). Used for the Assistant tab + greeting.
export function SunBurst({ size = 42, color = colors.brand, sw = 2.4 }: { size?: number; color?: string; sw?: number }) {
  const rays = [];
  for (let a = 0; a < 360; a += 15) {
    const long = (a / 15) % 2 === 0;
    rays.push(
      <Line key={a} x1={24} y1={15} x2={24} y2={long ? 5 : 9.5} transform={`rotate(${a} 24 24)`} />
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <G stroke={color} strokeWidth={sw} strokeLinecap="round">
        {rays}
      </G>
    </Svg>
  );
}

// The app icon: a blue rounded square (brand) holding the SUNLOGO white-burst
// asset — matches the prototype exactly (SUNLOGO alone is a transparent glyph).
export function SunLogo({ size = 84 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.286,
        backgroundColor: colors.brand,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.brand,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      }}
    >
      <Image
        source={{ uri: SUNLOGO }}
        style={{ width: size * 0.52, height: size * 0.52 }}
        resizeMode="contain"
      />
    </View>
  );
}

// Back-compat alias used by a couple of screens.
export function SunGlyph({ size = 24, color = colors.brand }: { size?: number; color?: string }) {
  return <SunBurst size={size} color={color} sw={1.9} />;
}

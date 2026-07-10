import React from 'react';
import { SvgXml } from 'react-native-svg';
import { P, FILL } from '../icons/paths';
import { colors } from '../theme';

// Mirror of the prototype's ic(name, size, color, strokeWidth):
// builds the exact same <svg> string and renders it verbatim with react-native-svg.
export function Icon({
  name,
  size = 16,
  color = colors.textPrimary,
  sw = 1.9,
}: {
  name: keyof typeof P | string;
  size?: number;
  color?: string;
  sw?: number;
}) {
  const body = P[name as string] || '';
  const xml =
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
    `stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">` +
    body +
    `</svg>`;
  return <SvgXml xml={xml} width={size} height={size} />;
}

// Filled nav icons (house / user) used by the bottom tab bar.
export function IconFill({
  name,
  size = 27,
  color = colors.textTertiary,
}: {
  name: keyof typeof FILL | string;
  size?: number;
  color?: string;
}) {
  const body = FILL[name as string] || '';
  const xml =
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">` +
    body +
    `</svg>`;
  return <SvgXml xml={xml} width={size} height={size} />;
}

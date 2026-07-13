import type { AppScreenProps } from '../navigation/types';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SunLogo } from '../components/SunLogo';

// 启动页(Figma 4514:254):白底居中 App logo,短暂停留后进入欢迎/隐私同意页
export default function Splash({ navigation }: AppScreenProps) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('privacy-terms'), 1400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={st.wrap}>
      <SunLogo size={64} />
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
});

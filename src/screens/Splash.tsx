import type { AppScreenProps } from '../navigation/types';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SunLogo } from '../components/SunLogo';
import { hasLoginState } from '../features/auth/session';
import { hydratePersistence } from '../features/app/persistence';

// 启动页(Figma 4514:254):白底居中 App logo,短暂停留后进入欢迎/隐私同意页
export default function Splash({ navigation }: AppScreenProps) {
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const routeFromSession = async () => {
      const [loggedIn] = await Promise.all([hasLoginState(), hydratePersistence()]);
      if (cancelled) return;

      if (loggedIn) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'agent-chat' } }],
        });
        return;
      }

      timer = setTimeout(() => navigation.replace('privacy-terms'), 1400);
    };

    void routeFromSession();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
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

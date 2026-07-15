import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { WEB_LINKING } from './src/navigation/types';
import { navRef } from './src/navigation/navRef';
import { AppToastHost } from './src/components/AppToast';
import { NetBanner } from './src/components/NetBanner';
import { SessionExpiredHost } from './src/components/SessionExpired';
import { colors } from './src/theme';

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bgPrimary },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navRef}
        linking={Platform.OS === 'web' ? WEB_LINKING : undefined}
        theme={navTheme}
      >
        <StatusBar style="dark" />
        <RootNavigator />
        {/* 全局状态层:断网条 / toast / 登录过期弹窗 */}
        <NetBanner />
        <AppToastHost />
        <SessionExpiredHost />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

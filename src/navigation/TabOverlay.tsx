import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type SetOverlay = (overlay: ReactNode | null) => void;

const TabOverlayContext = createContext<SetOverlay | null>(null);

export function TabOverlayProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<ReactNode | null>(null);

  return (
    <TabOverlayContext.Provider value={setOverlay}>
      <View style={styles.root}>
        {children}
        {overlay}
      </View>
    </TabOverlayContext.Provider>
  );
}

export function TabOverlay({ children }: { children: ReactNode }) {
  const setOverlay = useContext(TabOverlayContext);

  useLayoutEffect(() => {
    if (!setOverlay) return;
    setOverlay(children);
    return () => setOverlay(null);
  }, [children, setOverlay]);

  if (!setOverlay) throw new Error('TabOverlay must be used inside TabOverlayProvider');
  return null;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { AccessibilityInfo, LayoutAnimation, StyleSheet, View } from 'react-native';
import type { MainTabName } from './types';

type SetOverlay = (overlay: ReactNode | null) => void;
type SetCollapsedTab = (tab: MainTabName | null) => void;
type TabShellContextValue = {
  collapsedTab: MainTabName | null;
  setCollapsedTab: SetCollapsedTab;
  setOverlay: SetOverlay;
};

export const TAB_BAR_COLLAPSED_SIZE = 72;
export const TAB_BAR_HORIZONTAL_INSET = 16;
export const TAB_BAR_CONTROL_GAP = 10;
export const TAB_BAR_MIN_BOTTOM_INSET = 12;

const COLLAPSE_ANIMATION = LayoutAnimation.create(
  240,
  LayoutAnimation.Types.easeInEaseOut,
  LayoutAnimation.Properties.opacity,
);

const TabShellContext = createContext<TabShellContextValue | null>(null);

export function TabOverlayProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<ReactNode | null>(null);
  const [collapsedTab, setCollapsedTabState] = useState<MainTabName | null>(null);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const setCollapsedTab = useCallback<SetCollapsedTab>((tab) => {
    if (tab === collapsedTab) return;
    if (!reduceMotion) LayoutAnimation.configureNext(COLLAPSE_ANIMATION);
    setCollapsedTabState(tab);
  }, [collapsedTab, reduceMotion]);

  const contextValue = useMemo(
    () => ({ collapsedTab, setCollapsedTab, setOverlay }),
    [collapsedTab, setCollapsedTab],
  );

  return (
    <TabShellContext.Provider value={contextValue}>
      <View style={styles.root}>
        {children}
        {overlay}
      </View>
    </TabShellContext.Provider>
  );
}

export function useTabShell() {
  const context = useContext(TabShellContext);
  if (!context) throw new Error('useTabShell must be used inside TabOverlayProvider');
  return context;
}

export function TabOverlay({ children }: { children: ReactNode }) {
  const { setOverlay } = useTabShell();

  useLayoutEffect(() => {
    setOverlay(children);
    return () => setOverlay(null);
  }, [children, setOverlay]);

  return null;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

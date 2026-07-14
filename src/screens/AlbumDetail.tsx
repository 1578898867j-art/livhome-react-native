import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';

export default function AlbumDetail({ navigation }: AppScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Screen
        scroll={false}
        edges={[]}
        bg="#0B0B0C"
        header={
          <View style={{ paddingTop: Math.max(insets.top, 20) + 20 }}>
            <View style={st.topBar}>
              <Tap style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
                <Icon name="chevL" size={18} color="#fff" sw={2} />
              </Tap>
              <Text style={st.title}>Today</Text>
              <View style={{ width: 34 }} />
            </View>
          </View>
        }
      >
        {/* Photo — camPreview({h:'aspect-ratio:3/4', tag:'Person', label:'Living Room · 14:22'}) */}
        <View style={st.photoWrap}>
          <View style={st.frame}>
            <CamPreview tag="Person" label="Living Room · 14:22" style={st.cam} />
          </View>
        </View>

        {/* Bottom actions */}
        <View style={[st.actions, { paddingBottom: Math.max(insets.bottom, 34) }]}>
          <Tap style={st.actionBtn} onPress={() => {}}>
            <Icon name="download" size={22} color="#fff" />
          </Tap>
          <Tap style={st.actionBtn} onPress={() => {}}>
            <Icon name="trash" size={22} color="#fff" />
          </Tap>
        </View>
      </Screen>
    </>
  );
}

const st = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  photoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  frame: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cam: { aspectRatio: 3 / 4 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 22,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

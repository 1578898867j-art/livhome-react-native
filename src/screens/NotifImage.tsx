import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { colors } from '../theme';

export default function NotifImage({ navigation }: AppScreenProps) {
  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      {/* top bar: back + centered date/time */}
      <View style={st.bar}>
        <Tap style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="chevL" size={18} color="#fff" sw={2} />
        </Tap>
        <View style={st.barCenter}>
          <Text style={st.date}>2025.06.24</Text>
          <Text style={st.time}>09:41</Text>
        </View>
        <View style={st.barSpacer} />
      </View>

      {/* camPreview({h:'aspect-ratio:3/4', tag:'Motion', label:'Living Room'}) */}
      <View style={st.imageWrap}>
        <View style={st.frame}>
          <CamPreview tag="Motion" label="Living Room" style={st.cam} />
        </View>
      </View>

      {/* download button */}
      <View style={st.footer}>
        <Tap style={st.downloadBtn} onPress={() => {}}>
          <Icon name="download" size={24} color={colors.brand} sw={2} />
        </Tap>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0B0C',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  barCenter: {
    flex: 1,
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  barSpacer: {
    width: 34,
  },
  imageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  frame: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cam: { aspectRatio: 3 / 4 },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 54,
  },
  downloadBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
  },
});

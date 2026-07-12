import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Screen, Tap, Row, Header, Segmented } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';
import { CAREPICS } from '../assets/images';

type Sev = 'Info' | 'Critical';

type Evt = {
  id: string;
  time: string;
  type: string;
  icon: string;
  color: string;
  soft: string;
  sev: Sev;
  thumb: boolean;
};

const EVENTS: Evt[] = [
  { id: 'e1', time: '14:22:08', type: 'Motion Detected', icon: 'walk', color: colors.brand, soft: colors.brandSoft, sev: 'Info', thumb: true },
  { id: 'e2', time: '12:08:41', type: 'Person left the zone', icon: 'walk', color: colors.critical, soft: colors.criticalSoft, sev: 'Critical', thumb: true },
  { id: 'e3', time: '09:41:02', type: 'Sound Detected', icon: 'speaker', color: colors.warning, soft: colors.warningSoft, sev: 'Info', thumb: false },
];

const FILTERS = ['All', 'Cloud', 'SD Card'];
const GREEN = '#4ADE80';

/* thumbnail preview — port of camPreview() using a CAREPICS still + overlay box/labels */
function CamPreview({ tag, label, pic }: { tag: string; label: string; pic: string }) {
  return (
    <View style={st.preview}>
      <Image source={{ uri: pic }} resizeMode="cover" style={StyleSheet.absoluteFill} />
      <View style={st.previewScrim} />
      <View style={st.detBox}>
        <View style={st.detTag}>
          <Text style={st.detTagTxt}>{tag}</Text>
        </View>
      </View>
      <Text style={st.previewLabel}>{label}</Text>
    </View>
  );
}

export default function DevMessages({ navigation }: AppScreenProps) {
  // The All/Cloud/SD Card filter is decorative in the prototype — switching is purely visual.
  const [active, setActive] = useState(0);

  return (
    <Screen>
      <Header title="Notification Details" onBack={() => navigation.goBack()} />

      {/* date group heading */}
      <Row style={st.dateRow}>
        <Text style={st.dateNum}>
          23<Text style={st.dateMon}> Apr</Text>
        </Text>
        <View style={{ flex: 1 }} />
        <Tap style={st.actRow} hitSlop={6}>
          <Icon name="check" size={14} color={colors.brand} sw={2.4} />
          <Text style={[st.actTxt, { color: colors.brand }]}>All Read</Text>
        </Tap>
      </Row>

      {/* All / Cloud / SD Card filter (visual only) */}
      <View style={st.segWrap}>
        <Segmented opts={FILTERS} active={active} onSelect={setActive} />
      </View>

      {/* alert timeline */}
      <View style={st.list}>
        {EVENTS.map((e, i) => {
          const pic = CAREPICS[i % CAREPICS.length];
          return (
            <Row key={e.id} style={st.evt}>
              <View style={st.evtIconWrap}>
                <View style={[st.evtIcon, { backgroundColor: e.soft }]}>
                  <Icon name={e.icon} size={21} color={e.color} />
                </View>
                {e.sev === 'Critical' && <View style={st.critDot} />}
              </View>
              <View style={st.evtBody}>
                <Row style={{ gap: 6 }}>
                  <View style={[st.sevBadge, { backgroundColor: e.soft }]}>
                    <Text style={[st.sevTxt, { color: e.color }]}>{e.sev}</Text>
                  </View>
                  <Text style={st.evtTime}>{e.time}</Text>
                </Row>
                <Text style={st.evtType}>{e.type}</Text>
                {e.thumb && (
                  <Tap
                    style={st.thumbWrap}
                    onPress={() => navigation.navigate('notif-detail')}
                  >
                    <CamPreview
                      tag={e.type}
                      label={`Living Room · ${e.time}`}
                      pic={pic}
                    />
                  </Tap>
                )}
              </View>
            </Row>
          );
        })}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  dateRow: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 4 },
  dateNum: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6, color: colors.textPrimary },
  dateMon: { fontSize: 14, fontWeight: '700', color: colors.textTertiary },
  actRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actTxt: { fontSize: 12, fontWeight: '700' },

  segWrap: { paddingHorizontal: 18, paddingTop: 8 },

  list: { paddingHorizontal: 18, paddingTop: 6 },
  evt: { gap: 12, paddingVertical: 14, alignItems: 'flex-start' },

  evtIconWrap: { position: 'relative', flexShrink: 0 },
  evtIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  critDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.critical,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },

  evtBody: { flex: 1, minWidth: 0 },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  sevTxt: { fontSize: 10, fontWeight: '700' },
  evtTime: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  evtType: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 5 },

  thumbWrap: { marginTop: 8, borderRadius: 12, overflow: 'hidden' },
  preview: {
    position: 'relative',
    width: '100%',
    height: 120,
    backgroundColor: '#15110d',
    overflow: 'hidden',
  },
  previewScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  detBox: {
    position: 'absolute',
    left: '28%',
    top: '36%',
    width: '34%',
    height: '46%',
    borderWidth: 1.5,
    borderColor: GREEN,
    borderRadius: 6,
  },
  detTag: {
    position: 'absolute',
    top: -19,
    left: -1,
    backgroundColor: GREEN,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  detTagTxt: { fontSize: 10, fontWeight: '700', color: '#062018' },
  previewLabel: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },
});

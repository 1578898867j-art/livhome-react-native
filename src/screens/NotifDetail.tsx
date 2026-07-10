import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap, Row, Card } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { colors } from '../theme';

type InfoRowProps = {
  icon: string;
  color: string;
  soft: string;
  label: string;
  val: string;
  last?: boolean;
};

export default function NotifDetail({ navigation }: any) {
  /* ---- infoRow(icon, color, label, val, last) ---- */
  const InfoRow = ({ icon, color, soft, label, val, last }: InfoRowProps) => (
    <Row style={st.infoRow}>
      {!last && <View style={st.infoDivider} />}
      <View style={[st.infoIcon, { backgroundColor: soft }]}>
        <Icon name={icon} size={15} color={color} />
      </View>
      <Text style={st.infoLabel}>{label}</Text>
      <Text style={st.infoVal}>{val}</Text>
    </Row>
  );

  return (
    <Screen>
      {/* Nav bar */}
      <Row style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 10 }}>
        <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
        </Tap>
        <Text style={st.navTitle}>Notification Details</Text>
        <Tap style={st.iconbtnPlain} hitSlop={8}>
          <Icon name="more" size={18} color={colors.textPrimary} />
        </Tap>
      </Row>

      {/* Event body card */}
      <Card style={{ marginHorizontal: 18, marginTop: 8, padding: 16 }}>
        <Text style={st.title}>Motion Detected</Text>
        <Text style={st.body}>
          Movement was detected in the Living Room monitoring area. Tap the image to view full
          resolution.
        </Text>

        {/* camPreview({h:'height:200px', tag:'Motion', label:'Living Room · 09:41:02'}) → notif-image */}
        <Tap style={st.previewWrap} onPress={() => navigation.navigate('notif-image')}>
          <CamPreview tag="Motion" label="Living Room · 09:41:02" style={st.previewCam} />
        </Tap>
      </Card>

      {/* Rule / Time card */}
      <Card style={{ marginHorizontal: 18, marginTop: 14 }}>
        <InfoRow
          icon="doc"
          color={colors.brand}
          soft={colors.brandSoft}
          label="Rule"
          val="Motion detection · Living Room area"
        />
        <InfoRow
          icon="clock"
          color={colors.success}
          soft={colors.successSoft}
          label="Time"
          val="2025-06-24 09:41:02"
          last
        />
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  iconbtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconbtnPlain: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: { flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center', color: colors.textPrimary },

  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginTop: 6, lineHeight: 21 },

  previewWrap: { marginTop: 12, borderRadius: 14, overflow: 'hidden' },
  previewCam: { height: 200 },

  infoRow: { minHeight: 54, paddingHorizontal: 16, paddingVertical: 12, gap: 12, alignItems: 'flex-start' },
  infoDivider: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoLabel: { width: 56, fontSize: 13, fontWeight: '600', color: colors.textTertiary, paddingTop: 6 },
  infoVal: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary, paddingTop: 6 },
});

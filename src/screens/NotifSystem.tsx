import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

// 系统消息详情 —— 纯文字,无图片(消息中心 System tab 点击进入)。
// 布局语言与设备消息详情一致:灰底 + 白卡。
export default function NotifSystem({ navigation }: AppScreenProps) {
  return (
    <Screen bg={colors.bgSecondary} contentStyle={{ paddingBottom: 40 }}>
      {/* nav:返回 + 居中标题(行高固定 50) */}
      <Row style={st.nav}>
        <View style={st.navSlot}>
          <Tap style={st.iconbtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
          </Tap>
        </View>
        <Text style={st.navTitle} numberOfLines={1}>Notification Details</Text>
        <View style={st.navSlot} />
      </Row>

      <View style={st.card}>
        <Row>
          <Text style={st.title} numberOfLines={2}>Message Title</Text>
          <View style={{ flex: 1 }} />
          <Text style={st.time}>17:40:20</Text>
        </Row>
        <Text style={st.date}>Jan 24, 2026</Text>
        <View style={st.divider} />
        <Text style={st.body}>
          Congratulations! Your registration was successful, Welcome aboard. Explore your new
          LIVHOME experience: add your cameras, set up detection zones, and let the assistant keep
          an eye on your home while you are away.
        </Text>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  nav: { paddingHorizontal: 16, height: 50, gap: 10 },
  navSlot: { width: 60, height: '100%', justifyContent: 'center' },
  iconbtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.bgSecondary, alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.textPrimary },

  card: {
    marginHorizontal: 20, marginTop: 12, borderRadius: 20,
    backgroundColor: colors.surface, padding: 20,
  },
  title: { flexShrink: 1, fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  time: { marginLeft: 12, fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 4 },
  date: { marginTop: 4, fontSize: 12, fontWeight: '500', color: colors.textTertiary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  body: { fontSize: 15, fontWeight: '500', lineHeight: 24, color: colors.textSecondary },
});

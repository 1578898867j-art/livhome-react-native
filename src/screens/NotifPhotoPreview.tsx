import type { AppScreenProps, AppParamList } from '../navigation/types';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Tap, Row } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { colors } from '../theme';

type Props = AppScreenProps & {
  route?: RouteProp<AppParamList, 'notif-photo-preview'>;
};

// 参考图的信息层级：事件标题、画面和时间；视觉 token 与图片内容沿用 LIVHOME。
export default function NotifPhotoPreview({ navigation, route }: Props) {
  const { title, occurredAt } = route?.params ?? {
    title: 'Motion Detected',
    occurredAt: '2026-04-24 18:42:15',
  };

  return (
    <Screen
      scroll={false}
      bg={colors.bgSecondary}
      header={
        <Row style={st.nav}>
          <View style={st.navSlot}>
            <Tap
              style={st.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Back to notification details"
            >
              <Icon name="chevL" size={16} color={colors.textPrimary} sw={2} />
            </Tap>
          </View>
          <Text style={st.navTitle} numberOfLines={1}>Message Notification</Text>
          <View style={st.navSlot} />
        </Row>
      }
    >
      <View style={st.content}>
        <View style={st.previewCard}>
          <Text style={st.eventTitle}>{title}</Text>
          <Tap
            style={st.imageTap}
            onPress={() => navigation.navigate('notif-image')}
            accessibilityRole="button"
            accessibilityLabel={`Open ${title} image`}
            accessibilityHint="Opens the full image preview"
          >
            <CamPreview box={false} style={st.image} />
          </Tap>
        </View>

        <View style={st.timeCard}>
          <View style={st.timeIcon}>
            <Icon name="clock" size={20} color={colors.success} sw={2.1} />
          </View>
          <View style={st.timeText}>
            <Text style={st.timeLabel}>Time</Text>
            <Text style={st.timeValue}>{occurredAt}</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  nav: { paddingHorizontal: 16, height: 50, gap: 10 },
  navSlot: { width: 60, height: '100%', justifyContent: 'center' },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  previewCard: { padding: 16, borderRadius: 20, backgroundColor: colors.surface },
  eventTitle: { marginBottom: 14, fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  imageTap: { borderRadius: 14, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.bgSecondary },
  timeCard: {
    minHeight: 84,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  timeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: { flex: 1, gap: 3 },
  timeLabel: { fontSize: 14, fontWeight: '600', color: colors.textTertiary },
  timeValue: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },
});

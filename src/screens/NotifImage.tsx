import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { CamPreview } from '../components/CamPreview';
import { NT_DOWNLOAD } from '../icons/notifIcons';
import { colors } from '../theme';

// 图片详情页 —— Figma 4531:946/984:浅色底,居中「日期/时刻」双行标题,
// 通栏图片垂直居中,底部 48 圆形下载钮;下载后出现
// 「Image saved to gallery」浅色 toast(自动消失)。
export default function NotifImage({ navigation }: AppScreenProps) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const download = () => {
    setSaved(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  return (
    <SafeAreaView style={st.root} edges={['top', 'bottom']}>
      {/* top bar:返回 + 居中 日期/时刻 */}
      <View style={st.bar}>
        <View style={st.barSlot}>
          <Tap style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={10}>
            <Icon name="chevL" size={18} color={colors.textPrimary} sw={2} />
          </Tap>
        </View>
        <View style={st.barCenter}>
          <Text style={st.date}>2025.12.9</Text>
          <Text style={st.time}>00:52</Text>
        </View>
        <View style={st.barSlot} />
      </View>

      {/* 通栏图片,剩余空间内垂直居中 */}
      <View style={st.imageWrap}>
        <CamPreview box={false} style={st.cam} />
      </View>

      {/* 下载 + 保存成功 toast */}
      <View style={st.footer}>
        {saved && (
          <View style={st.toast}>
            <View style={st.toastCheck}>
              <Icon name="check" size={12} color="#fff" sw={3} />
            </View>
            <Text style={st.toastTxt}>Image saved to gallery</Text>
          </View>
        )}
        <Tap style={st.downloadBtn} onPress={download}>
          <SvgXml xml={NT_DOWNLOAD} width={24} height={24} color={colors.brand} />
        </Tap>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },

  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56 },
  barSlot: { width: 60, justifyContent: 'center' },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  barCenter: { flex: 1, alignItems: 'center' },
  date: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  time: { marginTop: 2, fontSize: 12, fontWeight: '500', color: colors.textTertiary },

  imageWrap: { flex: 1, justifyContent: 'center' },
  cam: { width: '100%', aspectRatio: 430 / 254 },

  footer: { alignItems: 'center', paddingBottom: 40 },
  downloadBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center',
  },
  // toast:下载钮上方 ~16,浅灰胶囊 + 绿色实心对勾
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 36, paddingHorizontal: 12, borderRadius: 18,
    backgroundColor: '#F1EEF5', marginBottom: 16,
  },
  toastCheck: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#22A45D',
    alignItems: 'center', justifyContent: 'center',
  },
  toastTxt: { fontSize: 13, fontWeight: '500', color: colors.textTertiary },
});

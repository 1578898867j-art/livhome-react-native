import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, Header, Eyebrow, Row, Tap, PrimaryBtn } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

export default function EditProfile({ navigation }: any) {
  const [nickname, setNickname] = useState('Jon Alishon');

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header title="Personal Account" onBack={() => navigation.goBack()} />

        {/* Avatar */}
        <View style={st.avatarWrap}>
          <View style={st.avatarInner}>
            <LinearGradient
              colors={['#6A9BFA', '#2372F0'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={st.avatar}
            >
              <Text style={st.avatarLetter}>J</Text>
            </LinearGradient>
            <View style={st.camBadge}>
              <Icon name="camera" size={15} color={colors.textSecondary} />
            </View>
          </View>
        </View>

        {/* Nick name */}
        <View style={st.section}>
          <Eyebrow>Nick name</Eyebrow>
          <View style={[st.field, st.fieldActive]}>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              maxLength={15}
              placeholder="Nick name"
              placeholderTextColor={colors.textTertiary}
              style={st.nicknameInput}
            />
            <Text style={st.counter}>{nickname.length}/15</Text>
          </View>
          <Text style={st.hint}>Nickname must be 1–15 characters long.</Text>
        </View>

        {/* Email */}
        <View style={st.section}>
          <Eyebrow>Email</Eyebrow>
          <Tap style={st.field}>
            <Text style={st.staticText}>Add backup email</Text>
          </Tap>
        </View>

        {/* WhatsApp */}
        <View style={st.section}>
          <Eyebrow>WhatsApp</Eyebrow>
          <Row style={{ gap: 10 }}>
            <Tap style={[st.field, st.countryField]}>
              <Text style={st.countryCode}>+81</Text>
              <Icon name="chevD" size={14} color={colors.textTertiary} sw={2.2} />
            </Tap>
            <View style={[st.field, { flex: 1 }]}>
              <Text style={st.phonePlaceholder}>Phone Number</Text>
            </View>
          </Row>
        </View>
      </View>

      {/* Save */}
      <View style={st.footer}>
        <PrimaryBtn label="Save" onPress={() => navigation.goBack()} style={st.saveBtn} />
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  avatarWrap: { alignItems: 'center', paddingTop: 14, paddingBottom: 6 },
  avatarInner: { position: 'relative' },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: 40, fontWeight: '700', color: '#fff' },
  camBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { paddingHorizontal: 22, paddingTop: 16 },
  field: {
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldActive: { borderColor: colors.brand },
  nicknameInput: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  counter: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  staticText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  hint: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, marginTop: 8, marginLeft: 4 },
  countryField: { width: 88, justifyContent: 'center', gap: 5, paddingHorizontal: 12 },
  countryCode: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  phonePlaceholder: { fontSize: 16, fontWeight: '500', color: colors.textTertiary },
  footer: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 40 },
  saveBtn: { borderRadius: 99 },
});

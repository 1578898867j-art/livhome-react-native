import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Modal, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { Screen, Tap, Row, Card, Header } from '../components/kit';
import { DeviceOfflineDialog } from '../components/DeviceOfflineDialog';
import { Icon } from '../components/Icon';
import { Spinner } from '../components/states';
import { useDemoFlags, getDemoFlags } from '../features/app/demoStore';
import { showToast as showAppToast } from '../features/app/toastStore';
import { useDeviceAvailability } from '../features/devices/useDeviceAvailability';
import { renameDevice } from '../features/devices/deviceListStore';
import { colors, shadow } from '../theme';
import { INPUT_LIMITS } from '../features/app/inputLimits';

/* device / edit avatars — ported verbatim from the prototype (DEVAVATAR / EDITAVATAR) */
const DEVAVATAR =
  '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="devav-mask" fill="white"><path d="M0 16C0 7.16344 7.16344 0 16 0H40C48.8366 0 56 7.16344 56 16V40C56 48.8366 48.8366 56 40 56H16C7.16344 56 0 48.8366 0 40V16Z"/></mask><path d="M0 16C0 7.16344 7.16344 0 16 0H40C48.8366 0 56 7.16344 56 16V40C56 48.8366 48.8366 56 40 56H16C7.16344 56 0 48.8366 0 40V16Z" fill="white" fill-opacity="0.15"/><path d="M16 0V1H40V0V-1H16V0ZM56 16H55V40H56H57V16H56ZM40 56V55H16V56V57H40V56ZM0 40H1V16H0H-1V40H0ZM16 56V55C7.71573 55 1 48.2843 1 40H0H-1C-1 49.3888 6.61116 57 16 57V56ZM56 40H55C55 48.2843 48.2843 55 40 55V56V57C49.3888 57 57 49.3888 57 40H56ZM40 0V1C48.2843 1 55 7.71573 55 16H56H57C57 6.61116 49.3888 -1 40 -1V0ZM16 0V-1C6.61116 -1 -1 6.61116 -1 16H0H1C1 7.71573 7.71573 1 16 1V0Z" fill="white" fill-opacity="0.2" mask="url(#devav-mask)"/><path d="M28 12C20.2688 12 14 18.2688 14 26C14 33.7313 20.2688 40 28 40C35.7313 40 42 33.7313 42 26C42 18.2688 35.7313 12 28 12ZM28 15.5C28.8281 15.5 29.5 16.1719 29.5 17C29.5 17.8281 28.8281 18.5 28 18.5C27.1719 18.5 26.5 17.8281 26.5 17C26.5 16.1719 27.1719 15.5 28 15.5ZM28 33C24.1344 33 21 29.8656 21 26C21 22.1344 24.1344 19 28 19C31.8656 19 35 22.1344 35 26C35 29.8656 31.8656 33 28 33Z" fill="white"/><path d="M33 26C33 27.3344 32.4813 28.5906 31.5344 29.5344C30.5906 30.4812 29.3344 31 28 31C26.6656 31 25.4094 30.4812 24.4656 29.5344C23.5188 28.5906 23 27.3344 23 26C23 24.6656 23.5188 23.4094 24.4656 22.4656C25.4094 21.5187 26.6656 21 28 21C29.3344 21 30.5906 21.5187 31.5344 22.4656C32.4813 23.4094 33 24.6656 33 26ZM37.5844 39.5906C38.1782 39.9969 38.1594 40.8781 37.55 41.2625C34.7813 42.9969 31.5094 44 28 44C24.4906 44 21.2188 42.9969 18.45 41.2594C17.8406 40.8781 17.8219 39.9969 18.4156 39.5875C18.7438 39.3625 19.175 39.3531 19.5156 39.5656C20.2344 40.0156 20.9875 40.4094 21.775 40.7406C23.7438 41.5781 25.8375 42 28 42C30.1625 42 32.2563 41.5781 34.2281 40.7437C35.0156 40.4094 35.7688 40.0188 36.4875 39.5688C36.825 39.3563 37.2563 39.3625 37.5844 39.5906Z" fill="white"/></svg>';
const EDITAVATAR =
  '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="editav-mask" fill="white"><path d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V8Z"/></mask><path d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V8Z" fill="white" fill-opacity="0.15"/><path d="M8 0V1H16V0V-1H8V0ZM24 8H23V16H24H25V8H24ZM16 24V23H8V24V25H16V24ZM0 16H1V8H0H-1V16H0ZM8 24V23C4.13401 23 1 19.866 1 16H0H-1C-1 20.9706 3.02944 25 8 25V24ZM24 16H23C23 19.866 19.866 23 16 23V24V25C20.9706 25 25 20.9706 25 16H24ZM16 0V1C19.866 1 23 4.13401 23 8H24H25C25 3.02944 20.9706 -1 16 -1V0ZM8 0V-1C3.02944 -1 -1 3.02944 -1 8H0H1C1 4.13401 4.13401 1 8 1V0Z" fill="white" fill-opacity="0.2" mask="url(#editav-mask)"/><path d="M6 18H18M13.1896 7.54114C13.1896 7.54114 13.1896 8.63089 14.2794 9.72064C15.3691 10.8104 16.4589 10.8104 16.4589 10.8104M8.87975 15.992L11.1682 15.6651C11.4983 15.618 11.8042 15.465 12.04 15.2292L17.5486 9.72064C18.1505 9.11879 18.1505 8.14299 17.5486 7.54114L16.4589 6.45139C15.857 5.84954 14.8812 5.84954 14.2794 6.45139L8.77078 11.96C8.53499 12.1958 8.38203 12.5017 8.33488 12.8318L8.00795 15.1202C7.9353 15.6288 8.3712 16.0647 8.87975 15.992Z" stroke="white" stroke-linecap="round"/></svg>';

type TipKey = 'serial' | 'mac';
const DEVTIPS: Record<TipKey, string> = {
  serial: 'Unique device identifier, typically used for after-sales service or troubleshooting.',
  mac: "Device's network identification address, typically used for network connection or technical troubleshooting.",
};

export default function DevInfo({ navigation }: AppScreenProps) {
  const [tip, setTip] = useState<TipKey | null>(null);
  const [devNameDraft, setDevNameDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const canSaveDeviceName = devNameDraft.trim().length > 0;
  const [offlineDialog, setOfflineDialog] = useState(false);
  const { device, isOffline } = useDeviceAvailability();

  const runWhenOnline = (action: () => void) => {
    if (isOffline) {
      setOfflineDialog(true);
      return;
    }
    action();
  };

  // Keep copy confirmation visible long enough to read before it fades out.
  const [toast, setToast] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const copyToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showCopyToast = () => {
    if (copyToastTimer.current) clearTimeout(copyToastTimer.current);
    toastAnim.stopAnimation();
    setToast(true);
    toastAnim.setValue(0);
    Animated.timing(toastAnim, { toValue: 1, duration: 160, useNativeDriver: true }).start();
    copyToastTimer.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setToast(false);
      });
    }, 2560);
  };

  const copyToClipboard = async (value: string) => {
    try {
      await Clipboard.setStringAsync(value);
      showCopyToast();
    } catch {
      showAppToast('Failed to copy. Please try again.', 'error');
    }
  };

  useEffect(
    () => () => {
      if (copyToastTimer.current) clearTimeout(copyToastTimer.current);
      toastAnim.stopAnimation();
    },
    [toastAnim],
  );

  const toggleTip = (key: TipKey) => setTip((t) => (t === key ? null : key));

  // ---- 固件 OTA:检查更新 → 新版本弹窗 → 升级进度 → 成功/失败 ----
  const { otaUpdate } = useDemoFlags();
  const [fw, setFw] = useState('v2.4.1');
  const [ota, setOta] = useState<null | 'checking' | 'update' | 'progress'>(null);
  const [otaPct, setOtaPct] = useState(0);
  const otaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const otaInt = useRef<ReturnType<typeof setInterval> | null>(null);
  const otaProg = useRef(0);
  const hasUpdate = otaUpdate && fw === 'v2.4.1';
  useEffect(
    () => () => {
      if (otaTimer.current) clearTimeout(otaTimer.current);
      if (otaInt.current) clearInterval(otaInt.current);
    },
    [],
  );

  const checkUpdate = () => {
    if (ota) return;
    setOta('checking');
    if (otaTimer.current) clearTimeout(otaTimer.current);
    otaTimer.current = setTimeout(() => {
      if (getDemoFlags().otaUpdate && fw === 'v2.4.1') {
        setOta('update');
      } else {
        setOta(null);
        showAppToast('Firmware is up to date', 'success');
      }
    }, 1000);
  };

  const startUpdate = () => {
    setOta('progress');
    otaProg.current = 0;
    setOtaPct(0);
    if (otaInt.current) clearInterval(otaInt.current);
    otaInt.current = setInterval(() => {
      otaProg.current += 3;
      if (getDemoFlags().failOps && otaProg.current >= 60) {
        if (otaInt.current) clearInterval(otaInt.current);
        setOta(null);
        showAppToast('Update failed. Please try again.', 'error');
        return;
      }
      if (otaProg.current >= 100) {
        if (otaInt.current) clearInterval(otaInt.current);
        setOta(null);
        setFw('v2.5.0');
        showAppToast('Updated to v2.5.0', 'success');
        return;
      }
      setOtaPct(otaProg.current);
    }, 90);
  };

  return (
    <Screen
      header={<Header title="Device Details" onBack={() => navigation.goBack()} />}
      contentStyle={{ paddingBottom: 54 }}
    >
      {/* device summary card — Figma HeroCard 渐变:1D6FF3 → 4B93FF(60%) → 78B0FF,左下→右上 */}
      <LinearGradient
        colors={['#1D6FF3', '#4B93FF', '#78B0FF']}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={st.hero}
      >
        <View style={{ width: 56, height: 56 }}>
          <SvgXml xml={DEVAVATAR} width={56} height={56} />
        </View>
        {editing ? (
          <View>
            <TextInput
              value={devNameDraft}
              onChangeText={setDevNameDraft}
              maxLength={INPUT_LIMITS.deviceName}
              autoFocus
              multiline
              placeholderTextColor="rgba(255,255,255,.6)"
              style={st.heroNameInput}
            />
            <Text style={st.heroNameHint}>{devNameDraft.length}/{INPUT_LIMITS.deviceName}</Text>
          </View>
        ) : (
          <Text style={st.heroName}>{device?.name ?? 'Living Room'}</Text>
        )}
        <Text style={st.heroSub}>Indoor · IP Camera</Text>

        {editing ? (
          <Tap
            style={[st.saveBtn, !canSaveDeviceName && st.saveBtnDisabled]}
            onPress={() => runWhenOnline(() => {
              if (device && devNameDraft.trim()) renameDevice(device.id, devNameDraft);
              setEditing(false);
            })}
            hitSlop={8}
            disabled={!canSaveDeviceName}
            accessibilityLabel="Save device name"
          >
            <Text style={st.saveBtnTxt}>Save</Text>
          </Tap>
        ) : (
          <Tap
            style={st.editBtn}
            onPress={() => runWhenOnline(() => {
              setDevNameDraft(device?.name ?? '');
              setEditing(true);
            })}
            hitSlop={8}
            accessibilityLabel="Edit device name"
          >
            <SvgXml xml={EDITAVATAR} width={36} height={36} />
          </Tap>
        )}
      </LinearGradient>

      {/* Device version */}
      <View style={st.eyebrow}>
        <View style={[st.dot, { backgroundColor: colors.brand }]} />
        <Text style={st.eyebrowTxt}>Device version</Text>
      </View>
      <Card style={st.card}>
        {/* Firmware:点击检查更新;有新版本时显示 New 角标 */}
        <View>
          <Tap
            style={[st.infoRow, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => runWhenOnline(checkUpdate)}
          >
            <View style={st.infoLabelWrap}>
              <Text style={st.infoLabel}>Firmware</Text>
            </View>
            {ota === 'checking' ? (
              <Spinner size={15} stroke={1.8} />
            ) : (
              <>
                {hasUpdate && (
                  <View style={st.newBadge}>
                    <Text style={st.newBadgeTxt}>New</Text>
                  </View>
                )}
                <Text style={st.infoVal}>{fw}</Text>
              </>
            )}
            <View style={{ marginLeft: 2 }}>
              <Icon name="chevR" size={14} color={colors.textTertiary} sw={2} />
            </View>
          </Tap>
        </View>
      </Card>

      {/* 新版本弹窗 */}
      <Modal transparent visible={ota === 'update'} animationType="fade" onRequestClose={() => setOta(null)}>
        <Pressable style={st.otaOvl} onPress={() => setOta(null)}>
          <Pressable style={st.otaDialog} onPress={() => {}}>
            <View style={st.otaIcon}>
              <Icon name="cpu" size={24} color={colors.brand} sw={1.8} />
            </View>
            <Text style={st.otaTitle}>New Version v2.5.0</Text>
            <Text style={st.otaDesc}>
              Improved motion detection accuracy and stability fixes. The camera will restart after
              updating.
            </Text>
            <Row style={{ gap: 12, marginTop: 20 }}>
              <Pressable style={[st.otaBtn, st.otaBtnGhost]} onPress={() => setOta(null)}>
                <Text style={[st.otaBtnTxt, { color: colors.textSecondary }]}>Later</Text>
              </Pressable>
              <Pressable style={[st.otaBtn, { backgroundColor: colors.brand }]} onPress={startUpdate}>
                <Text style={[st.otaBtnTxt, { color: '#fff' }]}>Update Now</Text>
              </Pressable>
            </Row>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 升级进度弹窗(不可取消) */}
      <Modal transparent visible={ota === 'progress'} animationType="fade">
        <View style={st.otaOvl}>
          <View style={st.otaDialog}>
            <Text style={st.otaTitle}>Updating Firmware</Text>
            <View style={st.otaTrack}>
              <View style={[st.otaFill, { width: `${otaPct}%` }]} />
            </View>
            <Text style={st.otaPct}>{otaPct}%</Text>
            <Text style={st.otaHint}>Do not power off the camera during the update.</Text>
          </View>
        </View>
      </Modal>

      {/* Device information */}
      <View style={st.eyebrow}>
        <View style={[st.dot, { backgroundColor: colors.preventive }]} />
        <Text style={st.eyebrowTxt}>Device information</Text>
      </View>
      <Card style={st.card}>
        <InfoRow label="Model" value="IP Camera" copy onCopy={copyToClipboard} />
        <InfoRow
          label="Serial Number"
          value="IH34100102000039"
          copy
          onCopy={copyToClipboard}
          tipKey="serial"
          tipOpen={tip === 'serial'}
          onTip={() => toggleTip('serial')}
        />
        <InfoRow
          label="MAC Address"
          value="2C:D8:DE:4F:AD:75"
          copy
          onCopy={copyToClipboard}
          tipKey="mac"
          tipOpen={tip === 'mac'}
          onTip={() => toggleTip('mac')}
          last
        />
      </Card>

      {toast && (
        <Animated.View style={[st.toast, { opacity: toastAnim }]} pointerEvents="none">
          <Text style={st.toastTxt}>Copied</Text>
        </Animated.View>
      )}

      <DeviceOfflineDialog
        visible={offlineDialog}
        deviceName={device?.name}
        onClose={() => setOfflineDialog(false)}
      />
    </Screen>
  );
}

function InfoRow({
  label,
  value,
  copy,
  onCopy,
  last,
  tipKey,
  tipOpen,
  onTip,
}: {
  label: string;
  value: string;
  copy?: boolean;
  onCopy?: (value: string) => void;
  last?: boolean;
  tipKey?: TipKey;
  tipOpen?: boolean;
  onTip?: () => void;
}) {
  const showTip = !!tipKey && !!tipOpen;
  const showDivider = !last; // 最后一行永不画分隔线(展开提示卡时也不画)
  return (
    <View>
      <Row style={st.infoRow}>
        <View style={st.infoLabelWrap}>
          <Text style={st.infoLabel}>{label}</Text>
          {!!tipKey && (
            <Tap onPress={onTip} hitSlop={8}>
              <Icon name="info" size={14} color={showTip ? colors.brand : '#F1889B'} sw={2} />
            </Tap>
          )}
        </View>
        <Text style={st.infoVal}>{value}</Text>
        {copy && (
          <Tap
            style={{ marginLeft: 2 }}
            onPress={() => onCopy?.(value)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Copy ${label}`}
          >
            <Icon name="copy" size={15} color={colors.textTertiary} />
          </Tap>
        )}
      </Row>
      {showTip && (
        <View style={st.tipWrap}>
          <View style={st.tipCard}>
            <Text style={st.tipTxt}>{tipKey ? DEVTIPS[tipKey] : ''}</Text>
          </View>
        </View>
      )}
      {showDivider && <View style={st.divider} />}
    </View>
  );
}

const st = StyleSheet.create({
  hero: {
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
    ...shadow.md,
  },
  heroName: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 14 },
  heroNameInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 14,
    minHeight: 58,
    padding: 0,
    textAlignVertical: 'top',
  },
  heroSub: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,.75)', marginTop: 2 },
  heroNameHint: { alignSelf: 'flex-end', marginTop: 2, fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,.75)' },
  editBtn: { position: 'absolute', top: 20, right: 20, width: 36, height: 36 },
  saveBtn: { position: 'absolute', top: 20, right: 20, minHeight: 36, justifyContent: 'center' },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  eyebrow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  eyebrowTxt: { fontSize: 12, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.4 },

  card: { marginHorizontal: 18 },

  infoRow: { minHeight: 52, paddingHorizontal: 16, gap: 8 },
  infoLabelWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoLabel: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  infoVal: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  // ---- 固件 OTA ----
  newBadge: {
    height: 18,
    paddingHorizontal: 7,
    borderRadius: 9,
    backgroundColor: colors.critical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadgeTxt: { fontSize: 10, fontWeight: '800', color: '#fff' },
  otaOvl: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 34,
  },
  otaDialog: {
    width: '100%',
    maxWidth: 322,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
  },
  otaIcon: {
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  otaTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  otaDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
    marginTop: 10,
    lineHeight: 20,
    textAlign: 'center',
  },
  otaBtn: { flex: 1, height: 46, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  otaBtnGhost: { backgroundColor: colors.bgSecondary },
  otaBtnTxt: { fontSize: 15, fontWeight: '700' },
  otaTrack: {
    marginTop: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.bgSecondary,
    overflow: 'hidden',
  },
  otaFill: { height: 6, borderRadius: 3, backgroundColor: colors.brand },
  otaPct: { marginTop: 10, fontSize: 13, fontWeight: '600', color: colors.textTertiary, textAlign: 'center' },
  otaHint: { marginTop: 12, fontSize: 12, fontWeight: '500', color: colors.textTertiary, textAlign: 'center' },
  divider: { height: 1, marginHorizontal: 16, backgroundColor: colors.border },

  tipWrap: { paddingHorizontal: 16, paddingTop: 2, paddingBottom: 12 },
  tipCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    ...shadow.md,
  },
  tipTxt: { fontSize: 12, fontWeight: '500', color: colors.textSecondary, lineHeight: 18 },

  toast: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'center',
  },
  toastTxt: {
    backgroundColor: 'rgba(26,26,26,.92)',
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
});

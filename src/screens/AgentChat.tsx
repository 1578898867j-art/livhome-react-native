import type { AppScreenProps } from '../navigation/types';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Dimensions,
  ActivityIndicator,
  Animated,
  Easing,
  PanResponder,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { Icon, IconFill } from '../components/Icon';
import { SunBurst } from '../components/SunLogo';
import { colors } from '../theme';
import { CAREPICS } from '../assets/images';
import { SENDICON, SCROLLDOWN, CONV_EDIT, CONV_TRASH } from '../icons/protoIcons';
import { CONVERSATION_GROUPS, useAssistantPrototype } from '../features/assistant/useAssistantPrototype';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;
const DRAWER_W = Math.round(W * 0.78);

const PANEL_ICON =
  '<svg width="26" height="26" viewBox="0 0 24 24" fill="none">' +
  '<rect x="3" y="4" width="18" height="16" rx="4.5" stroke="#1A1A1A" stroke-width="2"/>' +
  '<rect x="4.4" y="5.4" width="6.2" height="13.2" rx="3" fill="#1A1A1A"/></svg>';
const EDIT_ICON =
  '<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 6C2.75 4.20507 4.20507 2.75 6 2.75H12C12.4142 2.75 12.75 2.41421 12.75 2C12.75 1.58579 12.4142 1.25 12 1.25H6C3.37665 1.25 1.25 3.37665 1.25 6V18C1.25 20.6234 3.37665 22.75 6 22.75H18C20.6234 22.75 22.75 20.6234 22.75 18V12C22.75 11.5858 22.4142 11.25 22 11.25C21.5858 11.25 21.25 11.5858 21.25 12V18C21.25 19.7949 19.7949 21.25 18 21.25H6C4.20507 21.25 2.75 19.7949 2.75 18V6ZM16.419 2.67708C17.3218 1.77431 18.7855 1.77431 19.6883 2.67708L21.3229 4.31171C22.2257 5.21449 22.2257 6.67818 21.3229 7.58096L19.8736 9.03028C19.7598 8.97394 19.6401 8.91302 19.516 8.84767C18.6806 8.40786 17.6892 7.79057 16.9493 7.05069C16.2095 6.31082 15.5922 5.31945 15.1524 4.48403C15.087 4.35989 15.0261 4.24018 14.9697 4.12639L16.419 2.67708ZM15.8887 8.11135C16.7642 8.98687 17.8777 9.67594 18.7595 10.1444L13.06 15.8438C12.7064 16.1975 12.2475 16.4269 11.7523 16.4977L8.31963 16.9881C7.5568 17.097 6.90295 16.4432 7.01193 15.6804L7.50231 12.2477C7.57305 11.7525 7.80248 11.2936 8.15616 10.94L13.8556 5.24053C14.3241 6.12234 15.0131 7.23582 15.8887 8.11135Z" fill="currentColor"/></svg>';
const MIC_ICON =
  '<svg viewBox="0 0 26 26" fill="none"><path d="M18.4695 11.7238V13.0001C18.4695 15.8194 16.0207 18.1049 13 18.1049M7.53052 11.7238V13.0001C7.53052 15.8194 9.97929 18.1049 13 18.1049M13 18.1049V20.6573M16.4184 9.17141V8.53331C16.4184 6.77122 14.8879 5.34277 13 5.34277C11.1121 5.34277 9.58157 6.77122 9.58157 8.53331V13.0001C9.58157 14.7621 11.1121 16.1906 13 16.1906C14.8879 16.1906 16.4184 14.7621 16.4184 13.0001V12.3619V9.17141Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const COPY_ICON =
  '<svg viewBox="9 9 20 20" fill="none"><path d="M15.667 15.6667V14.0001C15.667 12.1591 17.1594 10.6667 19.0003 10.6667L24.0003 10.6667C25.8413 10.6667 27.3337 12.1591 27.3337 14.0001V19.0001C27.3337 20.841 25.8413 22.3334 24.0003 22.3334H22.3337M15.667 15.6667H14.0003C12.1594 15.6667 10.667 17.1591 10.667 19.0001V24.0001C10.667 25.841 12.1594 27.3334 14.0003 27.3334H19.0003C20.8413 27.3334 22.3337 25.841 22.3337 24.0001V22.3334M15.667 15.6667H19.0003C20.8413 15.6667 22.3337 17.1591 22.3337 19.0001V22.3334" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
const SPEAK_ICON =
  '<svg viewBox="57 9 20 20" fill="none"><path d="M72.0003 17.557C72.4985 17.8451 72.8337 18.3838 72.8337 19.0007C72.8337 19.6176 72.4985 20.1562 72.0003 20.4444M72.0003 14.9173C73.9022 15.3034 75.3337 16.9848 75.3337 19.0006C75.3337 21.0164 73.9022 22.6979 72.0003 23.084M63.278 15.3357L66.8337 12.6702C67.9324 11.8465 69.5003 12.6301 69.5003 14.0029V23.9984C69.5003 25.3712 67.9324 26.1548 66.8337 25.3311L63.278 22.6656C62.9896 22.4494 62.6388 22.3325 62.2783 22.3325H60.3337C59.4132 22.3325 58.667 21.5866 58.667 20.6666V17.3347C58.667 16.4147 59.4132 15.6688 60.3337 15.6688H62.2783C62.6388 15.6688 62.9896 15.5519 63.278 15.3357Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

type Block = { t: 'me' | 'p' | 'h' | 'sh' | 'li' | 'gap'; text?: string; secondary?: boolean };

// The exact demo conversation from the prototype (convHistory + final answer).
const CONV: Block[] = [
  { t: 'me', text: 'Anything I should know about today?' },
  { t: 'p', text: 'Jon, things look calm at home today — <b>12 events</b> logged and no alerts. Here’s a quick read on your day.' },
  { t: 'h', text: 'Top Highlights' },
  { t: 'sh', text: 'Morning routine looks normal' },
  { t: 'p', secondary: true, text: 'Motion at <b>7:12 AM</b> in the Living Room led into kitchen activity — right on your usual schedule.' },
  { t: 'h', text: 'What I noticed' },
  { t: 'li', text: 'Front door opened at <b>8:04 AM</b> · likely a departure.' },
  { t: 'li', text: 'Quiet from <b>9 AM–3 PM</b> · expected during the day.' },
  { t: 'li', text: 'Living Room activity resumed at <b>5:47 PM</b>.' },
  { t: 'li', text: 'All 3 cameras online · storage <b>42%</b> used.' },
  { t: 'p', secondary: true, text: 'Everything’s within your normal range. Want me to set an evening check-in reminder?' },
  { t: 'gap' },
  { t: 'me', text: 'Any alerts overnight?' },
  { t: 'p', secondary: true, text: 'No alerts overnight — all quiet from <b>11 PM to 6 AM</b>. The Backyard camera caught a moving shadow at 2:14 AM but classified it as a tree branch, so no notification was sent.' },
  { t: 'gap' },
  { t: 'me', text: 'Did the front door open while I was out?' },
  { t: 'p', text: 'Yes — twice today:' },
  { t: 'li', text: '<b>8:04 AM</b> · opened for ~40 seconds, matching your usual departure.' },
  { t: 'li', text: '<b>5:47 PM</b> · opened and stayed unlocked for about 3 minutes.' },
  { t: 'p', secondary: true, text: 'The evening entry lines up with the Living Room motion right after — likely you getting home. Want a reminder if the door stays unlocked past 10 minutes next time?' },
  { t: 'gap' },
  { t: 'me', text: 'How are the cameras and storage doing?' },
  { t: 'h', text: 'Devices' },
  { t: 'li', text: '<b>Living Room</b> · online · signal strong.' },
  { t: 'li', text: '<b>Front Door</b> · online · signal good.' },
  { t: 'li', text: '<b>Backyard</b> · online · night vision active.' },
  { t: 'p', secondary: true, text: 'Storage is at <b>42%</b> (about 9 days of continuous recording left). I can switch to event-only recording to stretch that to ~30 days if you’d like.' },
  { t: 'gap' },
  { t: 'me', text: 'Yes, set an evening check-in for 6 PM.' },
  { t: 'p', text: 'Done ✅ Evening check-in set for <b>6:00 PM</b> daily. I’ll send a short summary of the day’s activity and flag anything unusual. You can change or turn this off anytime in the check-in settings.' },
];

// Render text with <b>…</b> bold spans.
function Rich({ text, style }: { text: string; style: any }) {
  const parts = text.split(/(<b>.*?<\/b>)/g).filter((s) => s.length > 0);
  return (
    <Text style={style}>
      {parts.map((p, i) =>
        p.startsWith('<b>') ? (
          <Text key={i} style={{ fontWeight: '700' }}>
            {p.slice(3, -4)}
          </Text>
        ) : (
          p
        )
      )}
    </Text>
  );
}

function Toolbar({ onNew, onMenu }: { onNew: () => void; onMenu: () => void }) {
  return (
    <View style={styles.toolbar}>
      <Pressable hitSlop={8} onPress={onMenu}>
        <SvgXml xml={PANEL_ICON} width={26} height={26} />
      </Pressable>
      <Text style={styles.title}>Assistant</Text>
      <Pressable hitSlop={8} onPress={onNew}>
        <SvgXml xml={EDIT_ICON} width={24} height={24} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

// 键盘图标(用户提供的 Frame.svg,fill 改 currentColor 以便着色)
const KEYBOARD_ICON =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M19.3222 19.2H4.68028C2.98256 19.2 1.6001 17.8713 1.6001 16.2346V7.76548C1.6001 6.13101 2.98023 4.80005 4.68028 4.80005H19.3199C21.0176 4.80005 22.4001 6.12876 22.4001 7.76548V16.2346C22.4001 17.8713 21.02 19.2 19.3222 19.2ZM4.68028 5.64988C3.46829 5.64988 2.48048 6.59864 2.48048 7.76773V16.2369C2.48048 17.4037 3.46829 18.3547 4.68028 18.3547H19.3199C20.5319 18.3547 21.5197 17.4059 21.5197 16.2369V7.76548C21.5197 6.59864 20.5319 5.64764 19.3199 5.64764H4.68028V5.64988Z" fill="currentColor"/><path d="M5.82702 15.451C5.82702 15.2169 6.01676 15.0272 6.25081 15.0272H17.752C17.986 15.0272 18.1758 15.2169 18.1758 15.451C18.1758 15.6851 17.986 15.8748 17.752 15.8748H6.25081C6.01676 15.8748 5.82702 15.6851 5.82702 15.451ZM19.4368 8.80294C19.4368 9.037 19.2471 9.22674 19.013 9.22674H18.1022C17.8681 9.22674 17.6784 9.037 17.6784 8.80294C17.6784 8.56889 17.8681 8.37915 18.1022 8.37915H19.013C19.2471 8.37915 19.4368 8.56889 19.4368 8.80294ZM16.359 8.80294C16.359 9.037 16.1692 9.22674 15.9352 9.22674H15.0243C14.7903 9.22674 14.6005 9.037 14.6005 8.80294C14.6005 8.56889 14.7903 8.37915 15.0243 8.37915H15.9352C16.1692 8.37915 16.359 8.56889 16.359 8.80294ZM13.2788 8.80294C13.2788 9.037 13.089 9.22674 12.855 9.22674H11.9441C11.7101 9.22674 11.5203 9.037 11.5203 8.80294C11.5203 8.56889 11.7101 8.37915 11.9441 8.37915H12.855C13.089 8.37915 13.2788 8.56889 13.2788 8.80294ZM10.2009 8.80294C10.2009 9.037 10.0112 9.22674 9.77713 9.22674H8.86628C8.63223 9.22674 8.44249 9.037 8.44249 8.80294C8.44249 8.56889 8.63223 8.37915 8.86628 8.37915H9.77713C10.0112 8.37915 10.2009 8.56889 10.2009 8.80294ZM7.12074 8.80294C7.12074 9.037 6.931 9.22674 6.69695 9.22674H5.7861C5.55204 9.22674 5.3623 9.037 5.3623 8.80294C5.3623 8.56889 5.55204 8.37915 5.7861 8.37915H6.69695C6.931 8.37915 7.12074 8.56889 7.12074 8.80294ZM19.4368 12.3821C19.4368 12.6162 19.2471 12.8059 19.013 12.8059H18.1022C17.8681 12.8059 17.6784 12.6162 17.6784 12.3821C17.6784 12.1481 17.8681 11.9584 18.1022 11.9584H19.013C19.2471 11.9584 19.4368 12.1481 19.4368 12.3821ZM16.359 12.3821C16.359 12.6162 16.1692 12.8059 15.9352 12.8059H15.0243C14.7903 12.8059 14.6005 12.6162 14.6005 12.3821C14.6005 12.1481 14.7903 11.9584 15.0243 11.9584H15.9352C16.1692 11.9584 16.359 12.1481 16.359 12.3821ZM13.2788 12.3821C13.2788 12.6162 13.089 12.8059 12.855 12.8059H11.9441C11.7101 12.8059 11.5203 12.6162 11.5203 12.3821C11.5203 12.1481 11.7101 11.9584 11.9441 11.9584H12.855C13.089 11.9584 13.2788 12.1481 13.2788 12.3821ZM10.2009 12.3821C10.2009 12.6162 10.0112 12.8059 9.77713 12.8059H8.86628C8.63223 12.8059 8.44249 12.6162 8.44249 12.3821C8.44249 12.1481 8.63223 11.9584 8.86628 11.9584H9.77713C10.0112 11.9584 10.2009 12.1481 10.2009 12.3821ZM7.12074 12.3821C7.12074 12.6162 6.931 12.8059 6.69695 12.8059H5.7861C5.55204 12.8059 5.3623 12.6162 5.3623 12.3821C5.3623 12.1481 5.55204 11.9584 5.7861 11.9584H6.69695C6.931 11.9584 7.12074 12.1481 7.12074 12.3821Z" fill="currentColor"/></svg>';

function MicOrSend({
  draft,
  onSend,
  onVoice,
}: {
  draft: string;
  onSend: () => void;
  onVoice: () => void;
}) {
  if (draft.trim()) {
    return (
      <Pressable style={styles.sendBtn} onPress={onSend}>
        <SvgXml xml={SENDICON} width={20} height={20} color="#fff" />
      </Pressable>
    );
  }
  return (
    <Pressable style={styles.micBtn} onPress={onVoice}>
      <SvgXml xml={MIC_ICON} width={27} height={27} color="#A0A0A5" />
    </Pressable>
  );
}

// 语音输入态:按住说话(豆包式:按住出浮层,上移取消)+ 右侧键盘键切回文字输入
// 文案相对整条胶囊绝对居中,不受右侧键盘按钮占位影响
function VoiceRow({
  onKeyboard,
  onSpeakStart,
  onSpeakMove,
  onSpeakEnd,
  speaking,
  style,
}: {
  onKeyboard: () => void;
  onSpeakStart: () => void;
  onSpeakMove: (dy: number) => void;
  onSpeakEnd: () => void;
  speaking: boolean;
  style?: any;
}) {
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onSpeakStart(),
      onPanResponderMove: (_, g) => onSpeakMove(g.dy),
      onPanResponderRelease: () => onSpeakEnd(),
      onPanResponderTerminate: () => onSpeakEnd(),
    })
  ).current;
  return (
    <View
      style={[
        styles.inputRow,
        { backgroundColor: speaking ? colors.bgSecondary : colors.bgPrimary, justifyContent: 'flex-end' },
        style,
      ]}
    >
      {/* 按住区域(覆盖整条胶囊,键盘按钮浮在其上) */}
      <View style={StyleSheet.absoluteFill} {...pan.panHandlers} />
      <View style={styles.holdTextWrap} pointerEvents="none">
        <Text style={styles.holdText}>{speaking ? 'Listening…' : 'Hold to speak'}</Text>
      </View>
      <Pressable style={[styles.micBtn, { backgroundColor: colors.bgPrimary }]} onPress={onKeyboard}>
        <SvgXml xml={KEYBOARD_ICON} width={26} height={26} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

// 说话浮层:底部渐变 + 提示文案 + 波形;上移进入取消态(变红)
function VoiceOverlay({ state, anim }: { state: 'active' | 'cancel'; anim: Animated.Value }) {
  const cancel = state === 'cancel';
  const bars = Array.from({ length: 34 });
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={
          cancel
            ? ['rgba(255,255,255,0)', 'rgba(252,220,216,0.92)', '#F6AFA6']
            : ['rgba(255,255,255,0)', 'rgba(178,209,255,0.92)', '#4D8DF7']
        }
        locations={[0, 0.55, 1]}
        style={styles.voiceOvl}
      >
        <Text style={[styles.voiceHint, { color: cancel ? '#D93A2B' : '#fff' }]}>
          {cancel ? 'Release to cancel' : 'Release to send · slide up to cancel'}
        </Text>
        <View style={styles.waveRow}>
          {bars.map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.waveBar,
                {
                  backgroundColor: cancel ? 'rgba(217,58,43,0.75)' : 'rgba(255,255,255,0.92)',
                  transform: [
                    {
                      scaleY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0.35 + 0.65 * Math.abs(Math.sin(i * 0.9)),
                          0.35 + 0.65 * Math.abs(Math.sin(i * 0.9 + 2.1)),
                        ],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

export default function AgentChat({ navigation }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const {
    conversations: convs,
    deleteConversation,
    draft,
    mode,
    openConversation,
    renameConversation,
    reset: resetAssistant,
    send: sendAssistant,
    setDraft,
    thinking,
  } = useAssistantPrototype();
  const [voiceMode, setVoiceMode] = useState(false);
  // 长按说话:null=未按住;active=松手发送;cancel=上移后松手取消
  const [speak, setSpeak] = useState<null | 'active' | 'cancel'>(null);
  const waveAnim = useRef(new Animated.Value(0)).current;
  const waveLoop = useRef<Animated.CompositeAnimation | null>(null);
  const startSpeak = () => {
    speakRef.current = 'active';
    setSpeak('active');
    waveLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 420, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0, duration: 420, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    waveLoop.current.start();
  };
  const speakRef = useRef<null | 'active' | 'cancel'>(null);
  const moveSpeak = (dy: number) => {
    const next = dy < -70 ? 'cancel' : 'active';
    if (speakRef.current !== next) {
      speakRef.current = next;
      setSpeak(next);
    }
  };
  const endSpeak = () => {
    waveLoop.current?.stop();
    const wasActive = speakRef.current === 'active';
    speakRef.current = null;
    setSpeak(null);
    if (wasActive) send(); // 松手发送(demo:触发一次会话)
  };
  // 会话态或说话浮层出现时:隐藏导航 tab 栏
  useEffect(() => {
    navigation.setParams({ conv: mode === 'conv' || speak !== null });
  }, [mode, speak, navigation]);
  const [kb, setKb] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Chat drawer + conversation list state (mirrors prototype chat-drawer overlay).
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(0)).current;
  const [convMenu, setConvMenu] = useState<number | null>(null);
  const [convMenuY, setConvMenuY] = useState(200);
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Scroll-to-bottom button state (conv mode).
  const scrollBtnAnim = useRef(new Animated.Value(0)).current;
  const scrollBtnShown = useRef(false);
  const [scrollBtnActive, setScrollBtnActive] = useState(false);
  const scrollMetrics = useRef({ offset: 0, content: 0, layout: 0 });

  useEffect(() => {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s1 = Keyboard.addListener(show, () => setKb(true));
    const s2 = Keyboard.addListener(hide, () => setKb(false));
    return () => { s1.remove(); s2.remove(); };
  }, []);

  function send() {
    Keyboard.dismiss();
    sendAssistant();
  }

  function reset() {
    resetAssistant();
    scrollMetrics.current = { offset: 0, content: 0, layout: 0 };
    scrollBtnShown.current = false;
    setScrollBtnActive(false);
    scrollBtnAnim.setValue(0);
  }

  // --- drawer ---
  function openDrawer() {
    Keyboard.dismiss();
    setConvMenu(null);
    setRenameId(null);
    setDeleteId(null);
    setDrawerOpen(true);
    Animated.timing(drawerAnim, {
      toValue: 1,
      duration: 280,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }

  function closeDrawer() {
    setConvMenu(null);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  }

  function openConv() {
    openConversation();
    closeDrawer();
  }

  // --- conversation context menu / rename / delete ---
  function openRename() {
    const c = convs.find((k) => k.id === convMenu);
    setRenameId(convMenu);
    setRenameVal(c ? c.name : '');
    setConvMenu(null);
  }

  function confirmRename() {
    renameConversation(renameId, renameVal);
    setRenameId(null);
  }

  function openDelete() {
    setDeleteId(convMenu);
    setConvMenu(null);
  }

  function confirmDelete() {
    deleteConversation(deleteId);
    setDeleteId(null);
  }

  // --- scroll-to-bottom button ---
  function updateScrollBtn() {
    const { offset, content, layout } = scrollMetrics.current;
    const show = content - offset - layout >= 48;
    if (show !== scrollBtnShown.current) {
      scrollBtnShown.current = show;
      setScrollBtnActive(show);
      Animated.timing(scrollBtnAnim, {
        toValue: show ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }

  const renameOk = renameVal.trim() !== '';
  const menuTop = Math.max(insets.top + 56, Math.min(convMenuY - 10, H - 200));

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      {/* 顶部渐变蒙版头(原型 agentTopBar:白 → 白52% → 透明),内容从其后淡出 */}
      <LinearGradient
        colors={[colors.bgPrimary, colors.bgPrimary, 'rgba(251,251,251,0)']}
        locations={[0, 0.52, 1]}
        style={[styles.topBarGrad, { paddingTop: insets.top + 8 }]}
        pointerEvents="box-none"
      >
        <Toolbar onNew={reset} onMenu={openDrawer} />
      </LinearGradient>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {mode === 'empty' ? (
          <>
            <Pressable style={[styles.center, { paddingTop: insets.top + 44 }]} onPress={() => Keyboard.dismiss()}>
              <View style={{ marginBottom: 26 }}>
                <SunBurst size={46} color="#C7C7CC" sw={2} />
              </View>
              <Text style={styles.greeting}>Hi Jon, how can I help?</Text>
              <Text style={styles.greetingSub}>
                I'm your home-care assistant — I keep an eye on your devices, alerts and daily
                check-ins so you always know things are okay at home.
              </Text>
            </Pressable>

            <View style={[styles.bottomWrap, { paddingBottom: kb ? 14 : 120 }]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.pillsScroll}
                contentContainerStyle={styles.pillsRow}
              >
                <Pressable style={[styles.cardOutline, { width: W * 0.75 }]} onPress={() => navigation.navigate('feedback')}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.cardTitle}>Contact us</Text>
                    <View style={styles.cardSubRow}>
                      <Text style={styles.cardSub}>Feedback & support team</Text>
                      <Icon name="arrowUpRight" size={13} color={colors.textTertiary} sw={2} />
                    </View>
                  </View>
                  <View style={styles.avatars}>
                    {[0, 1, 2].map((i) => (
                      <Image key={i} source={{ uri: CAREPICS[i] }} style={styles.avatar} />
                    ))}
                  </View>
                </Pressable>
                <Pressable style={[styles.cardSoft, { width: W * 0.5 }]} onPress={send}>
                  <Text style={styles.cardTitle}>Recommended</Text>
                  <Text style={[styles.cardSub, { marginTop: 4 }]}>based on your home</Text>
                </Pressable>
                <Pressable style={[styles.cardSoft, { width: W * 0.5 }]} onPress={send}>
                  <Text style={styles.cardTitle}>Daily summary</Text>
                  <Text style={[styles.cardSub, { marginTop: 4 }]}>of home activity</Text>
                </Pressable>
              </ScrollView>
              {voiceMode ? (
                <VoiceRow
                  onKeyboard={() => setVoiceMode(false)}
                  onSpeakStart={startSpeak}
                  onSpeakMove={moveSpeak}
                  onSpeakEnd={endSpeak}
                  speaking={speak !== null}
                />
              ) : (
                <View style={styles.inputRow}>
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    placeholder="Ask anything..."
                    placeholderTextColor={colors.textTertiary}
                    style={styles.input}
                    onSubmitEditing={send}
                    returnKeyType="send"
                  />
                  <MicOrSend draft={draft} onSend={send} onVoice={() => setVoiceMode(true)} />
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <ScrollView
                ref={scrollRef}
                contentContainerStyle={[styles.convContent, { paddingTop: insets.top + 64 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={() => Keyboard.dismiss()}
                scrollEventThrottle={16}
                onScroll={(e) => {
                  scrollMetrics.current = {
                    offset: e.nativeEvent.contentOffset.y,
                    content: e.nativeEvent.contentSize.height,
                    layout: e.nativeEvent.layoutMeasurement.height,
                  };
                  updateScrollBtn();
                }}
                onContentSizeChange={(_w, h) => {
                  scrollMetrics.current.content = h;
                  updateScrollBtn();
                }}
                onLayout={(e) => {
                  scrollMetrics.current.layout = e.nativeEvent.layout.height;
                  updateScrollBtn();
                }}
              >
                {thinking ? (
                  <View style={styles.thinkingRow}>
                    <ActivityIndicator color={colors.brand} />
                    <Text style={styles.thinkingText}>Thinking…</Text>
                  </View>
                ) : (
                  <>
                    {CONV.map((b, i) => {
                      if (b.t === 'gap') return <View key={i} style={{ height: 14 }} />;
                      if (b.t === 'me')
                        return (
                          <View key={i} style={styles.meRow}>
                            <View style={styles.meBubble}>
                              <Text style={styles.meText}>{b.text}</Text>
                            </View>
                          </View>
                        );
                      if (b.t === 'h') return <Text key={i} style={styles.h}>{b.text}</Text>;
                      if (b.t === 'sh') return <Text key={i} style={styles.sh}>{b.text}</Text>;
                      if (b.t === 'li')
                        return (
                          <View key={i} style={styles.liRow}>
                            <Text style={styles.bullet}>•</Text>
                            <Rich text={b.text!} style={styles.li} />
                          </View>
                        );
                      return (
                        <Rich key={i} text={b.text!} style={[styles.p, b.secondary && { color: colors.textSecondary }]} />
                      );
                    })}
                    {/* copy / speak */}
                    <View style={styles.ansActions}>
                      <View style={styles.ansBtn}>
                        <SvgXml xml={COPY_ICON} width={16} height={16} color={colors.textSecondary} />
                      </View>
                      <View style={styles.ansBtn}>
                        <SvgXml xml={SPEAK_ICON} width={16} height={16} color={colors.textSecondary} />
                      </View>
                    </View>
                  </>
                )}
              </ScrollView>

              {/* scroll-to-latest (悬浮在输入栏渐变之上) */}
              <Animated.View
                pointerEvents={scrollBtnActive ? 'auto' : 'none'}
                style={[
                  styles.scrollDownWrap,
                  { bottom: (kb ? 10 : Math.max(insets.bottom, 12) + 6) + 65 + 20, opacity: scrollBtnAnim },
                ]}
              >
                <Pressable hitSlop={6} onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}>
                  <SvgXml xml={SCROLLDOWN} width={56} height={56} />
                </Pressable>
              </Animated.View>

              {/* input bar with home shortcut — 渐变蒙版盖在滚动内容上,文字自然淡出 */}
              <LinearGradient
                colors={['rgba(251,251,251,0)', colors.bgPrimary, colors.bgPrimary]}
                locations={[0, 0.45, 1]}
                style={[styles.convBarGrad, { paddingBottom: kb ? 10 : Math.max(insets.bottom, 12) + 6 }]}
              >
                <View style={styles.convBar}>
                  <Pressable
                    style={[styles.homeBtn, { backgroundColor: colors.bgPrimary }]}
                    onPress={() => navigation.navigate('Main', { screen: 'dev-home' })}
                  >
                    <IconFill name="house" size={26} color={colors.brand} />
                  </Pressable>
                  {voiceMode ? (
                    <VoiceRow
                      onKeyboard={() => setVoiceMode(false)}
                      onSpeakStart={startSpeak}
                      onSpeakMove={moveSpeak}
                      onSpeakEnd={endSpeak}
                      speaking={speak !== null}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <View style={[styles.inputRow, { flex: 1, backgroundColor: colors.bgPrimary }]}>
                      <TextInput
                        value={draft}
                        onChangeText={setDraft}
                        placeholder="Ask anything..."
                        placeholderTextColor={colors.textTertiary}
                        style={styles.input}
                        onSubmitEditing={send}
                        returnKeyType="send"
                      />
                      <MicOrSend draft={draft} onSend={send} onVoice={() => setVoiceMode(true)} />
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      {/* 长按说话浮层(盖住整屏,含隐藏后的 tab 区域) */}
      {speak !== null && <VoiceOverlay state={speak} anim={waveAnim} />}

      {/* chat drawer overlay */}
      {drawerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.drawerBackdrop, { opacity: drawerAnim }]}>
            <Pressable style={{ flex: 1 }} onPress={closeDrawer} />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawerPanel,
              {
                width: DRAWER_W,
                paddingTop: insets.top + 12,
                transform: [
                  {
                    translateX: drawerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-DRAWER_W, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 6 }}>
              <Pressable
                style={styles.newConvBtn}
                onPress={() => {
                  reset();
                  closeDrawer();
                }}
              >
                <Icon name="plus" size={18} color={colors.textPrimary} sw={2.2} />
                <Text style={styles.newConvText}>New Conversation</Text>
              </Pressable>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {CONVERSATION_GROUPS.map((g) => {
                const items = convs.filter((c) => c.grp === g);
                if (!items.length) return null;
                return (
                  <View key={g}>
                    <Text style={styles.convGroup}>{g}</Text>
                    {items.map((c) => (
                      <Pressable
                        key={c.id}
                        style={[styles.convItem, convMenu === c.id && { backgroundColor: colors.bgSecondary }]}
                        onPress={openConv}
                        delayLongPress={420}
                        onLongPress={(e) => {
                          setConvMenuY(e.nativeEvent.pageY);
                          setConvMenu(c.id);
                        }}
                      >
                        <Text numberOfLines={1} style={styles.convItemText}>{c.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* long-press context menu */}
          {convMenu != null && (
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setConvMenu(null)}>
              <View style={[styles.convMenu, { top: menuTop }]}>
                <Pressable style={styles.convMenuRow} onPress={openRename}>
                  <SvgXml xml={CONV_EDIT} width={18} height={18} color={colors.textPrimary} />
                  <Text style={styles.convMenuText}>Rename</Text>
                </Pressable>
                <View style={styles.menuDivider} />
                <Pressable style={styles.convMenuRow} onPress={openDelete}>
                  <SvgXml xml={CONV_TRASH} width={18} height={18} color={colors.critical} />
                  <Text style={[styles.convMenuText, { color: colors.critical }]}>Delete</Text>
                </Pressable>
              </View>
            </Pressable>
          )}

          {/* rename dialog */}
          {renameId != null && (
            <KeyboardAvoidingView
              style={styles.dialogWrap}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <Pressable style={StyleSheet.absoluteFill} onPress={() => setRenameId(null)} />
              <View style={styles.renameCard}>
                <Text style={styles.dialogTitle}>Rename conversation</Text>
                <View style={styles.renameInputRow}>
                  <TextInput
                    value={renameVal}
                    onChangeText={setRenameVal}
                    placeholder="Enter a name"
                    placeholderTextColor={colors.textTertiary}
                    style={styles.renameInput}
                    autoFocus
                  />
                  {renameVal.length > 0 && (
                    <Pressable style={styles.renameClear} onPress={() => setRenameVal('')}>
                      <Icon name="x" size={12} color="#fff" sw={2.6} />
                    </Pressable>
                  )}
                </View>
                <View style={styles.dialogBtnRow}>
                  <Pressable
                    style={[styles.dialogBtn, { backgroundColor: colors.bgSecondary }]}
                    onPress={() => setRenameId(null)}
                  >
                    <Text style={[styles.dialogBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.dialogBtn, { backgroundColor: renameOk ? colors.textPrimary : colors.bgSecondary }]}
                    onPress={renameOk ? confirmRename : undefined}
                  >
                    <Text style={[styles.dialogBtnText, { color: renameOk ? '#fff' : colors.textTertiary }]}>
                      Confirm
                    </Text>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          )}

          {/* delete confirm dialog */}
          {deleteId != null && (
            <View style={styles.dialogWrap}>
              <Pressable style={StyleSheet.absoluteFill} onPress={() => setDeleteId(null)} />
              <View style={styles.delCard}>
                <Text style={styles.delMsg}>Are you sure you want to delete this conversation?</Text>
                <View style={styles.menuDivider} />
                <View style={{ flexDirection: 'row' }}>
                  <Pressable
                    style={[styles.delBtn, { borderRightWidth: 1, borderRightColor: colors.border }]}
                    onPress={() => setDeleteId(null)}
                  >
                    <Text style={styles.delCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.delBtn} onPress={confirmDelete}>
                    <Text style={styles.delConfirmText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgPrimary },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18 },
  topBarGrad: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40, paddingBottom: 44 },
  title: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '600', letterSpacing: -0.5, color: colors.textPrimary },

  // empty
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, overflow: 'hidden' },
  greeting: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4, color: colors.textPrimary, textAlign: 'center' },
  greetingSub: { marginTop: 18, fontSize: 16, fontWeight: '400', color: colors.textTertiary, textAlign: 'center', lineHeight: 24, maxWidth: 360 },
  bottomWrap: { paddingHorizontal: 18, gap: 10, backgroundColor: colors.bgPrimary },
  pillsScroll: { marginHorizontal: -18 },
  pillsRow: { gap: 12, paddingLeft: 18, paddingRight: 18 },
  cardOutline: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16 },
  cardSoft: { backgroundColor: 'rgba(120,120,128,0.05)', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, color: colors.textPrimary },
  cardSubRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardSub: { fontSize: 12, fontWeight: '500', color: colors.textTertiary },
  avatars: { flexDirection: 'row' },
  avatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.surface, marginLeft: -8, backgroundColor: colors.bgSecondary },

  // shared input
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 18, minHeight: 65, paddingLeft: 16, paddingRight: 8 },
  holdTextWrap: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  holdText: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  voiceOvl: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: H * 0.42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 56,
  },
  voiceHint: { fontSize: 15, fontWeight: '600', marginBottom: 34 },
  waveRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 26 },
  waveBar: { width: 3.5, height: 22, borderRadius: 2 },
  input: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.textPrimary },
  sendBtn: { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.textPrimary, alignItems: 'center', justifyContent: 'center' },
  micBtn: { width: 44, height: 44, borderRadius: 13, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },

  // conversation
  convContent: { paddingHorizontal: 18, paddingBottom: 150 },
  thinkingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 8 },
  thinkingText: { fontSize: 18, fontWeight: '600', letterSpacing: -0.2, color: colors.textPrimary },
  meRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 2, marginBottom: 22 },
  meBubble: { maxWidth: '82%', borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 9, paddingHorizontal: 15 },
  meText: { fontSize: 15, fontWeight: '500', color: colors.textPrimary, lineHeight: 21 },
  p: { fontSize: 16, fontWeight: '500', lineHeight: 25, color: colors.textPrimary, marginBottom: 15 },
  h: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, color: colors.textPrimary, marginTop: 22, marginBottom: 12 },
  sh: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  liRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  bullet: { color: colors.textTertiary, fontSize: 16, lineHeight: 24 },
  li: { flex: 1, fontSize: 16, fontWeight: '500', lineHeight: 24, color: colors.textPrimary },
  ansActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  ansBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.bgSecondary, alignItems: 'center', justifyContent: 'center' },
  convBarGrad: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 34 },
  convBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  homeBtn: { width: 65, height: 65, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },

  // scroll-to-bottom
  scrollDownWrap: { position: 'absolute', bottom: 8, alignSelf: 'center' },

  // chat drawer
  drawerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,20,22,0.35)' },
  drawerPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.bgPrimary,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 44,
    shadowOffset: { width: 8, height: 0 },
    elevation: 16,
  },
  newConvBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  newConvText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  convGroup: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4, fontSize: 14, fontWeight: '600', color: colors.textTertiary },
  convItem: { paddingVertical: 13, paddingHorizontal: 20 },
  convItemText: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },

  // conversation context menu
  convMenu: {
    position: 'absolute',
    right: 22,
    width: 186,
    backgroundColor: colors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  convMenuRow: { height: 52, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
  convMenuText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  menuDivider: { height: 1, backgroundColor: colors.border },

  // dialogs
  dialogWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,20,22,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  dialogTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center', color: colors.textPrimary },
  renameCard: { width: '100%', maxWidth: 330, backgroundColor: colors.surface, borderRadius: 22, padding: 22 },
  renameInputRow: {
    marginTop: 16,
    height: 48,
    paddingLeft: 14,
    paddingRight: 8,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  renameInput: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  renameClear: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  dialogBtnRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  dialogBtn: { flex: 1, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dialogBtnText: { fontSize: 15, fontWeight: '700' },
  delCard: { width: '100%', maxWidth: 320, backgroundColor: colors.surface, borderRadius: 20, overflow: 'hidden' },
  delMsg: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 20, textAlign: 'center', fontSize: 16, fontWeight: '600', lineHeight: 24, color: colors.textPrimary },
  delBtn: { flex: 1, height: 52, alignItems: 'center', justifyContent: 'center' },
  delCancelText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  delConfirmText: { fontSize: 16, fontWeight: '700', color: colors.critical },
});

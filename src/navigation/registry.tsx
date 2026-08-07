import type { ComponentType } from 'react';
import type { AppScreenProps, ScreenName } from './types';

import Login from '../screens/Login';
import Splash from '../screens/Splash';
import DevHome from '../screens/DevHome';
import DevDetail from '../screens/DevDetail';
import DevPlayback from '../screens/DevPlayback';
import DevDownload from '../screens/DevDownload';
import DevMessages from '../screens/DevMessages';
import DevConfig from '../screens/DevConfig';
import DevSettings from '../screens/DevSettings';
import DevInfo from '../screens/DevInfo';
import NotifCenter from '../screens/NotifCenter';
import NotifDetail from '../screens/NotifDetail';
import NotifSystem from '../screens/NotifSystem';
import NotifPhotoPreview from '../screens/NotifPhotoPreview';
import NotifImage from '../screens/NotifImage';
import NotifSettings from '../screens/NotifSettings';
import NotifFrequency from '../screens/NotifFrequency';
import AlertSettings from '../screens/AlertSettings';
import MotionDetection from '../screens/MotionDetection';
import DetectionArea from '../screens/DetectionArea';
import SoundDetection from '../screens/SoundDetection';
import LineCrossing from '../screens/LineCrossing';
import TripWire from '../screens/TripWire';
import Geofence from '../screens/Geofence';
import AgentChat from '../screens/AgentChat';
import AgentHistory from '../screens/AgentHistory';
import Album from '../screens/Album';
import AlbumDetail from '../screens/AlbumDetail';
import AlarmReminder from '../screens/AlarmReminder';
import ShutdownList from '../screens/ShutdownList';
import ShutdownEdit from '../screens/ShutdownEdit';
import ShutdownRepeat from '../screens/ShutdownRepeat';
import MeHome from '../screens/MeHome';
import EditProfile from '../screens/EditProfile';
import Settings from '../screens/Settings';
import About from '../screens/About';
import Feedback from '../screens/Feedback';
import Language from '../screens/Language';
import Timezone from '../screens/Timezone';
import StorageSettings from '../screens/StorageSettings';
import StatePreview from '../screens/StatePreview';
import EmailLogin from '../screens/EmailLogin';
import AppleBind from '../screens/AppleBind';
import PrivacyTerms from '../screens/PrivacyTerms';
import PrivacyAgreement from '../screens/PrivacyAgreement';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import HelpCenter from '../screens/HelpCenter';
import BindFind from '../screens/BindFind';
import BindNone from '../screens/BindNone';
import BindPrep from '../screens/BindPrep';
import BindWifi from '../screens/BindWifi';
import BindConnecting from '../screens/BindConnecting';
import BindSuccess from '../screens/BindSuccess';
import BindFail from '../screens/BindFail';
import BindQR from '../screens/BindQR';

const SCREENS = {
  'login': Login,
  'dev-home': DevHome,
  'dev-detail': DevDetail,
  'dev-playback': DevPlayback,
  'dev-download': DevDownload,
  'dev-messages': DevMessages,
  'dev-config': DevConfig,
  'dev-settings': DevSettings,
  'dev-info': DevInfo,
  'notif-center': NotifCenter,
  'notif-detail': NotifDetail,
  'notif-system': NotifSystem,
  'notif-photo-preview': NotifPhotoPreview,
  'notif-image': NotifImage,
  'notif-settings': NotifSettings,
  'notif-frequency': NotifFrequency,
  'alert-settings': AlertSettings,
  'motion-detection': MotionDetection,
  'detection-area': DetectionArea,
  'sound-detection': SoundDetection,
  'line-crossing': LineCrossing,
  'trip-wire': TripWire,
  'geofence': Geofence,
  'agent-chat': AgentChat,
  'agent-history': AgentHistory,
  'album': Album,
  'album-detail': AlbumDetail,
  'alarm-reminder': AlarmReminder,
  'shutdown-list': ShutdownList,
  'shutdown-edit': ShutdownEdit,
  'shutdown-repeat': ShutdownRepeat,
  'me-home': MeHome,
  'edit-profile': EditProfile,
  'settings': Settings,
  'about': About,
  'feedback': Feedback,
  'language': Language,
  'timezone': Timezone,
  'storage-settings': StorageSettings,
  'state-preview': StatePreview,
  'email-login': EmailLogin,
  splash: Splash,
  'apple-bind': AppleBind,
  'privacy-terms': PrivacyTerms,
  'privacy-agreement': PrivacyAgreement,
  'privacy-policy': PrivacyPolicy,
  'help-center': HelpCenter,
  'bind-find': BindFind,
  'bind-none': BindNone,
  'bind-prep': BindPrep,
  'bind-wifi': BindWifi,
  'bind-connecting': BindConnecting,
  'bind-success': BindSuccess,
  'bind-fail': BindFail,
  'bind-qr': BindQR,
} satisfies Record<ScreenName, ComponentType<AppScreenProps>>;

// React Navigation injects route-specific props at this dynamic registration boundary.
export function screenFor(id: ScreenName): ComponentType<any> {
  return SCREENS[id];
}

import { CommonActions } from '@react-navigation/native';
import type { LinkingOptions, NavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const TAB_ROUTES = ['dev-home', 'agent-chat', 'me-home'] as const;

export const STACK_ROUTES = [
  'splash',
  'dev-detail', 'dev-playback', 'dev-download', 'dev-messages', 'dev-config', 'dev-settings', 'dev-info',
  'notif-center', 'notif-detail', 'notif-system', 'notif-image', 'notif-settings', 'notif-frequency', 'alert-settings',
  'motion-detection', 'detection-area', 'sound-detection', 'line-crossing', 'trip-wire', 'geofence',
  'agent-history',
  'album', 'album-detail',
  'alarm-reminder', 'shutdown-list', 'shutdown-edit', 'shutdown-repeat',
  'edit-profile', 'settings', 'about', 'feedback', 'language', 'timezone', 'storage-settings', 'state-preview',
  'email-login', 'apple-bind', 'privacy-terms', 'privacy-agreement', 'privacy-policy', 'help-center',
  'bind-find', 'bind-none', 'bind-prep', 'bind-wifi',
  'bind-connecting', 'bind-success', 'bind-fail', 'bind-qr',
] as const;

export type MainTabName = (typeof TAB_ROUTES)[number];
export type StackRouteName = (typeof STACK_ROUTES)[number];
export type ScreenName = 'login' | MainTabName | StackRouteName;

type ScreenParamList = {
  [Route in ScreenName]: undefined;
};

export type MainTabParamList = Pick<ScreenParamList, MainTabName>;
export type RootStackParamList = Pick<ScreenParamList, 'login' | StackRouteName> & {
  Main: NavigatorScreenParams<MainTabParamList>;
};
export type AppParamList = ScreenParamList & {
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AppNavigation = NavigationProp<AppParamList> & NativeStackNavigationProp<RootStackParamList>;
export type AppScreenProps = { navigation: AppNavigation };

const stackPaths = Object.fromEntries(STACK_ROUTES.map((route) => [route, route]));

export const WEB_LINKING: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      login: 'login',
      Main: {
        screens: {
          'dev-home': 'dev-home',
          'agent-chat': 'agent-chat',
          'me-home': 'me-home',
        },
      },
      ...stackPaths,
    },
  },
};

export function navigateTo(navigation: AppNavigation, route: StackRouteName) {
  navigation.dispatch(CommonActions.navigate(route));
}

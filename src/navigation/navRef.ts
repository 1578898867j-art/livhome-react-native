// 全局导航 ref —— 供导航树外的全局组件(登录过期弹窗等)跳转用。
import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navRef = createNavigationContainerRef<RootStackParamList>();

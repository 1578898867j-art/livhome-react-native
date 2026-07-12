import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { screenFor } from './registry';
import { STACK_ROUTES, TAB_ROUTES } from './types';
import type { MainTabParamList, RootStackParamList } from './types';
import TabBar from './TabBar';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Prototype tab order: Devices · Assistant (center) · Profile
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="dev-home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      {TAB_ROUTES.map((id) => (
        <Tab.Screen key={id} name={id} component={screenFor(id)} />
      ))}
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={screenFor('login')} />
      <Stack.Screen name="Main" component={MainTabs} />
      {STACK_ROUTES.map((id) => (
        <Stack.Screen key={id} name={id} component={screenFor(id)} />
      ))}
    </Stack.Navigator>
  );
}

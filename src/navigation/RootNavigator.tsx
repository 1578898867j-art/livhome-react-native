import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { STACK_ROUTES } from './routes';
import { screenFor } from './registry';
import TabBar from './TabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Prototype tab order: Devices · Assistant (center) · Profile
const ORDERED_TABS = ['dev-home', 'agent-chat', 'me-home'];

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="dev-home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      {ORDERED_TABS.map((id) => (
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

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthStore } from './store/authStore';
import { supabase } from './services/supabase';

// 屏幕组件
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainMenuScreen from './screens/MainMenuScreen';
import GameScreen from './screens/GameScreen';
import SettingsScreen from './screens/SettingsScreen';
import SaveSlotScreen from './screens/SaveSlotScreen';

// 导航类型
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  MainMenu: undefined;
  SaveSlot: { mode: 'load' | 'save' };
  Game: { sceneId?: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { checkAuth, isLoading } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#1a1a2e' },
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="SaveSlot" component={SaveSlotScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

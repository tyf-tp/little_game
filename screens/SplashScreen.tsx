import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { isAuthenticated, isLoading } = useAuthStore();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          navigation.replace('MainMenu');
        } else {
          navigation.replace('Login');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>谜境逃脱</Text>
        <Text style={styles.subtitle}>Escape the Mystery</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    letterSpacing: 4,
  },
  loadingContainer: {
    marginTop: 50,
  },
  loading: {
    color: '#666',
    fontSize: 14,
  },
});

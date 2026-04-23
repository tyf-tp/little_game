import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import { saveService } from '../services/supabase';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MainMenuScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();
  const { initGame } = useGameStore();
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    checkSaveData();
  }, []);

  const checkSaveData = async () => {
    if (!user) return;
    try {
      const saves = await saveService.getSaves(user.id);
      setHasSave(saves && saves.length > 0);
    } catch (error) {
      console.log('No save data');
    }
  };

  const handleNewGame = () => {
    Alert.alert('新游戏', '是否开始新游戏？', [
      { text: '取消', style: 'cancel' },
      { text: '开始', onPress: () => { initGame(); navigation.navigate('Game', {}); } },
    ]);
  };

  const handleContinue = () => navigation.navigate('SaveSlot', { mode: 'load' });

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出当前账号吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: async () => { await logout(); navigation.replace('Login'); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>欢迎回来</Text>
        <Text style={styles.username}>{user?.username}</Text>
      </View>

      <View style={styles.menu}>
        <Text style={styles.title}>谜境逃脱</Text>
        
        {hasSave && (
          <TouchableOpacity style={styles.menuButton} onPress={handleContinue}>
            <Text style={styles.menuButtonText}>继续游戏</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuButton} onPress={handleNewGame}>
          <Text style={styles.menuButtonText}>新游戏</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.menuButtonText}>设置</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuButton, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 30, paddingTop: 80 },
  header: { marginBottom: 40 },
  welcomeText: { color: '#666', fontSize: 14 },
  username: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  menu: { flex: 1, justifyContent: 'center', gap: 20 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#e94560', textAlign: 'center', marginBottom: 40 },
  menuButton: { backgroundColor: '#16213e', borderRadius: 15, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  menuButtonText: { color: '#fff', fontSize: 20, fontWeight: '600' },
  logoutButton: { marginTop: 40, backgroundColor: 'transparent', borderColor: '#e94560' },
  logoutText: { color: '#e94560', fontSize: 16 },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const handleResetProgress = () => {
    Alert.alert(
      '重置进度',
      '确定要重置所有游戏进度吗？此操作不可撤销！',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '重置',
          style: 'destructive',
          onPress: () => {
            Alert.alert('提示', '进度已重置');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>设置</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>声音</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>音效</Text>
              <Text style={styles.settingDesc}>游戏中的音效反馈</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#333', true: '#e94560' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>音乐</Text>
              <Text style={styles.settingDesc}>背景音乐的播放</Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={setMusicEnabled}
              trackColor={{ false: '#333', true: '#e94560' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>震动</Text>
              <Text style={styles.settingDesc}>触摸和交互反馈</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#333', true: '#e94560' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据</Text>
          
          <TouchableOpacity style={styles.dangerBtn} onPress={handleResetProgress}>
            <Text style={styles.dangerText}>重置游戏进度</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <Text style={styles.aboutText}>谜境逃脱 v1.0.0</Text>
          <Text style={styles.aboutText}>一款类绣湖+i Wanna风格的解谜游戏</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  backBtn: {
    color: '#4a9eff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 30,
  },
  section: {
    gap: 15,
  },
  sectionTitle: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
  },
  settingDesc: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  dangerBtn: {
    backgroundColor: 'rgba(233,69,96,0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  dangerText: {
    color: '#e94560',
    fontSize: 16,
    textAlign: 'center',
  },
  aboutText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

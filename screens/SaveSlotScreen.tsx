import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import { saveService } from '../services/supabase';
import { RootStackParamList } from '../App';
import { SaveData } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SaveSlotRouteProp = RouteProp<RootStackParamList, 'SaveSlot'>;

export default function SaveSlotScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SaveSlotRouteProp>();
  const { user } = useAuthStore();
  const { loadGame, getSaveData } = useGameStore();
  const [saves, setSaves] = useState<SaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const mode = route.params?.mode || 'load';

  useEffect(() => { loadSaves(); }, []);

  const loadSaves = async () => {
    if (!user) return;
    try {
      const data = await saveService.getSaves(user.id);
      setSaves(data || []);
    } catch (error) {
      console.error('Failed to load saves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (slot: number) => {
    if (!user) return;
    Alert.alert('保存游戏', `保存到存档位 ${slot}？`, [
      { text: '取消', style: 'cancel' },
      { text: '保存', onPress: async () => {
        try {
          const saveData = getSaveData(slot, user.id);
          await saveService.saveGame(saveData);
          Alert.alert('成功', '游戏已保存');
          navigation.goBack();
        } catch (error) {
          Alert.alert('错误', '保存失败');
        }
      }},
    ]);
  };

  const handleLoad = async (save: SaveData) => {
    loadGame(save);
    navigation.replace('Game', { sceneId: save.sceneId });
  };

  const handleDelete = async (save: SaveData) => {
    Alert.alert('删除存档', '确定要删除这个存档吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => {
        try {
          await saveService.deleteSave(save.id);
          loadSaves();
        } catch (error) {
          Alert.alert('错误', '删除失败');
        }
      }},
    ]);
  };

  const renderSlot = ({ item, index }: { item: SaveData | null; index: number }) => (
    <TouchableOpacity
      style={styles.slotCard}
      onPress={() => mode === 'save' ? handleSave(index + 1) : item && handleLoad(item)}
      disabled={mode === 'load' && !item}
    >
      <View style={styles.slotHeader}>
        <Text style={styles.slotTitle}>存档位 {index + 1}</Text>
        {item && <Text style={styles.slotDate}>{new Date(item.updatedAt).toLocaleDateString()}</Text>}
      </View>
      {item ? (
        <View style={styles.slotInfo}>
          <Text style={styles.slotScene}>场景: {item.sceneId}</Text>
          <Text style={styles.slotPuzzles}>已解谜题: {item.gameState.solvedPuzzles.length}</Text>
          {mode === 'load' && (
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
              <Text style={styles.deleteText}>删除</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={styles.emptySlot}>空</Text>
      )}
    </TouchableOpacity>
  );

  const slots = [saves[0] || null, saves[1] || null, saves[2] || null];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{mode === 'save' ? '保存游戏' : '读取存档'}</Text>
      </View>

      <FlatList
        data={slots}
        renderItem={renderSlot}
        keyExtractor={(_, index) => `slot-${index}`}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 20 },
  backBtn: { color: '#4a9eff', fontSize: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  list: { padding: 20, gap: 16 },
  slotCard: { backgroundColor: '#16213e', borderRadius: 15, padding: 20, borderWidth: 1, borderColor: '#333' },
  slotHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  slotTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  slotDate: { color: '#666', fontSize: 12 },
  slotInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  slotScene: { color: '#888', fontSize: 14 },
  slotPuzzles: { color: '#888', fontSize: 14 },
  emptySlot: { color: '#444', fontSize: 16, textAlign: 'center', paddingVertical: 20 },
  deleteBtn: { marginLeft: 'auto' },
  deleteText: { color: '#e94560', fontSize: 14 },
});

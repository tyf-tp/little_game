import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../store/gameStore';
import { RootStackParamList } from '../App';
import PuzzleModal from '../components/PuzzleModal';
import { Puzzle } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type GameRouteProp = RouteProp<RootStackParamList, 'Game'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAME_HEIGHT = 550;

export default function GameScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GameRouteProp>();
  const {
    currentScene,
    gameState,
    showInventory,
    showDialog,
    currentDialog,
    dialogIndex,
    initGame,
    movePlayer,
    interact,
    toggleInventory,
    nextDialog,
    changeScene,
    setPaused,
    setFlag,
    gameState: storeState,
  } = useGameStore();

  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    // 检测是否为Web平台
    setIsWeb(Platform.OS === 'web');
    initGame(route.params?.sceneId);
  }, []);

  // Web平台键盘控制
  useEffect(() => {
    if (!isWeb) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDialog) {
        if (e.key === ' ' || e.key === 'Enter') {
          nextDialog();
        }
        return;
      }

      if (showInventory) {
        if (e.key === 'Escape' || e.key === 'i') {
          toggleInventory();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          handleDirection('up');
          break;
        case 's':
        case 'arrowdown':
          handleDirection('down');
          break;
        case 'a':
        case 'arrowleft':
          handleDirection('left');
          break;
        case 'd':
        case 'arrowright':
          handleDirection('right');
          break;
        case 'e':
        case ' ':
          // 交互键 - 模拟点击最近的物品
          handleInteractNearby();
          break;
        case 'i':
          toggleInventory();
          break;
        case 'escape':
          handlePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWeb, showDialog, showInventory, currentScene]);

  // 交互最近的物品
  const handleInteractNearby = useCallback(() => {
    if (!currentScene) return;
    const { x, y } = storeState.playerPosition;
    
    // 找到最近的未收集物品
    let nearest: typeof currentScene.objects[0] | null = null;
    let minDist = Infinity;

    for (const obj of currentScene.objects) {
      if (obj.isCollected) continue;
      const dx = obj.position.x - x;
      const dy = obj.position.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist < minDist) {
        minDist = dist;
        nearest = obj;
      }
    }

    if (nearest) {
      // 触发交互
      if (nearest.triggersPuzzle) {
        const puzzle = currentScene.puzzles.find(p => p.id === nearest.triggersPuzzle);
        if (puzzle && !puzzle.solved) {
          setActivePuzzle(puzzle);
          return;
        }
      }
      if (nearest.requiresItem) {
        const hasItem = storeState.inventory.some(i => i.id === nearest.requiresItem);
        if (!hasItem) {
          Alert.alert('提示', `需要钥匙才能打开。`);
          return;
        }
      }
      interact(nearest.id);
    }
  }, [currentScene, storeState]);

  // 处理物品使用
  const handleUseItem = useCallback((itemId: string) => {
    const item = storeState.inventory.find(i => i.id === itemId);
    if (!item) return;

    if (itemId === 'candle' && currentScene?.id === 'scene_ch2_down') {
      setFlag('candle_lit', true);
      Alert.alert('点燃', '蜡烛点燃了！符文墙壁发出更强的光芒...');
    }
  }, [currentScene, storeState.inventory]);

  // 方向控制
  const handleDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const { playerPosition } = storeState;
    const { x, y } = playerPosition;

    if (currentScene) {
      for (const exit of currentScene.exits) {
        let canExit = false;
        switch (exit.direction) {
          case 'up':
            canExit = y <= 110 && x >= 140 && x <= 220;
            break;
          case 'down':
            canExit = y >= 490 && x >= 140 && x <= 220;
            break;
          case 'left':
            canExit = x <= 30 && y >= 250 && y <= 350;
            break;
          case 'right':
            canExit = x >= 330 && y >= 250 && y <= 350;
            break;
        }

        if (canExit) {
          if (exit.locked) {
            Alert.alert('提示', '这扇门被锁住了，需要找到打开的方法。');
          } else {
            changeScene(exit.targetSceneId);
          }
          return;
        }
      }
    }

    movePlayer(direction);
  }, [currentScene, storeState]);

  // 点击交互
  const handleSceneTap = useCallback((event: any) => {
    const locationX = event.nativeEvent?.locationX ?? event.clientX;
    const locationY = event.nativeEvent?.locationY ?? event.clientY;
    
    if (!currentScene) return;

    for (const obj of currentScene.objects) {
      if (obj.isCollected) continue;
      
      const { x, y } = obj.position;
      const { width, height } = obj.size;
      
      if (
        locationX >= x && locationX <= x + width &&
        locationY >= y && locationY <= y + height
      ) {
        if (obj.triggersPuzzle) {
          const puzzle = currentScene.puzzles.find(p => p.id === obj.triggersPuzzle);
          if (puzzle && !puzzle.solved) {
            setActivePuzzle(puzzle);
            return;
          }
        }

        if (obj.requiresItem) {
          const hasItem = storeState.inventory.some(i => i.id === obj.requiresItem);
          if (!hasItem) {
            Alert.alert('提示', `需要钥匙才能使用这个物品。`);
            return;
          }
        }

        interact(obj.id);
        return;
      }
    }
  }, [currentScene, storeState.inventory]);

  // 谜题解决后的回调
  const handlePuzzleSolve = useCallback(() => {
    if (!activePuzzle || !currentScene) return;

    switch (activePuzzle.id) {
      case 'lever_puzzle':
        setFlag('lever_solved', true);
        Alert.alert('成功', '机关启动了！上方和下方的门都打开了！');
        break;
      case 'rune_code':
        setFlag('rune_solved', true);
        Alert.alert('成功', '符文共鸣！通往深处的道路打开了！');
        break;
      case 'safe_puzzle':
        Alert.alert('恭喜', '保险箱打开了！里面有一张地图...');
        break;
      case 'treasure_puzzle':
        Alert.alert('恭喜', '宝箱机关解除了！你获得了...');
        break;
    }
  }, [activePuzzle]);

  // 暂停菜单
  const handlePause = () => {
    setPaused(true);
    Alert.alert(
      '游戏暂停',
      '',
      [
        { text: '继续', onPress: () => setPaused(false) },
        { text: '保存', onPress: () => navigation.navigate('SaveSlot', { mode: 'save' }) },
        { text: '设置', onPress: () => navigation.navigate('Settings') },
        { text: '退出', onPress: () => navigation.replace('MainMenu') },
      ]
    );
  };

  if (!currentScene) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Web控制提示 */}
      {isWeb && (
        <View style={styles.webControls}>
          <Text style={styles.webControlsText}>
            移动: WASD/方向键 | 交互: E/空格 | 背包: I | 暂停: ESC
          </Text>
        </View>
      )}

      {/* 游戏场景 */}
      <View
        style={[styles.gameArea, { backgroundColor: currentScene.background }]}
        onClick={handleSceneTap}
      >
        {/* 场景名称 */}
        <View style={styles.sceneHeader}>
          <Text style={styles.sceneName}>{currentScene.name}</Text>
          <Text style={styles.inventoryCount}>
            物品: {storeState.inventory.length}
          </Text>
        </View>

        {/* 出口指示器 */}
        {currentScene.exits.map((exit, index) => (
          <View key={index} style={[styles.exitIndicator, styles[`exit_${exit.direction}`]]}>
            <Text style={styles.exitArrow}>
              {exit.direction === 'up' ? '↑' : 
               exit.direction === 'down' ? '↓' : 
               exit.direction === 'left' ? '←' : '→'}
            </Text>
          </View>
        ))}

        {/* 玩家 */}
        <View
          style={[
            styles.player,
            {
              left: storeState.playerPosition.x,
              top: storeState.playerPosition.y,
            },
          ]}
        >
          <Text style={styles.playerSprite}>🧑</Text>
        </View>

        {/* 场景物品 */}
        {currentScene.objects.map((obj) => (
          !obj.isCollected && (
            <View
              key={obj.id}
              style={[
                styles.object,
                { left: obj.position.x, top: obj.position.y },
              ]}
            >
              <Text style={styles.objectSprite}>{obj.sprite}</Text>
            </View>
          )
        ))}
      </View>

      {/* 手机端虚拟摇杆 */}
      {!isWeb && (
        <View style={styles.joystickArea}>
          <View style={styles.joystick}>
            <TouchableOpacity style={styles.dirBtn} onPress={() => handleDirection('up')}>
              <Text style={styles.dirText}>▲</Text>
            </TouchableOpacity>
            <View style={styles.joystickRow}>
              <TouchableOpacity style={styles.dirBtn} onPress={() => handleDirection('left')}>
                <Text style={styles.dirText}>◀</Text>
              </TouchableOpacity>
              <View style={styles.joystickCenter} />
              <TouchableOpacity style={styles.dirBtn} onPress={() => handleDirection('right')}>
                <Text style={styles.dirText}>▶</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.dirBtn} onPress={() => handleDirection('down')}>
              <Text style={styles.dirText}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 右侧按钮 */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn} onPress={toggleInventory}>
              <Text style={styles.actionText}>📦</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handlePause}>
              <Text style={styles.actionText}>⏸</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Web端操作按钮 */}
      {isWeb && (
        <View style={styles.webButtons}>
          <TouchableOpacity style={styles.webBtn} onPress={toggleInventory}>
            <Text style={styles.webBtnText}>📦 背包 (I)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.webBtn} onPress={() => handleInteractNearby()}>
            <Text style={styles.webBtnText}>🤚 交互 (E)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.webBtn} onPress={handlePause}>
            <Text style={styles.webBtnText}>⏸ 暂停 (ESC)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 提示文字 */}
      <Text style={styles.tipText}>
        {isWeb ? '靠近物品后按 E 键交互' : '点击场景中的物品进行交互'}
      </Text>

      {/* 对话框 */}
      {showDialog && (
        <TouchableOpacity style={styles.dialogOverlay} onPress={nextDialog}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogText}>
              {currentDialog[dialogIndex] || ''}
            </Text>
            <Text style={styles.dialogHint}>
              {isWeb ? '按空格键继续...' : '点击继续...'}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* 背包界面 */}
      {showInventory && (
        <View style={styles.inventoryOverlay}>
          <View style={styles.inventoryBox}>
            <View style={styles.inventoryHeader}>
              <Text style={styles.inventoryTitle}>背包</Text>
              <TouchableOpacity onPress={toggleInventory}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inventoryGrid}>
              {storeState.inventory.length === 0 ? (
                <Text style={styles.emptyText}>背包是空的</Text>
              ) : (
                storeState.inventory.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.itemSlot}
                    onPress={() => {
                      if (item.usable) {
                        handleUseItem(item.id);
                      } else {
                        Alert.alert(item.name, item.description);
                      }
                    }}
                  >
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.usable && <Text style={styles.itemUsable}>可使用</Text>}
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </View>
      )}

      {/* 谜题弹窗 */}
      {activePuzzle && (
        <PuzzleModal
          visible={true}
          puzzleType={activePuzzle.type as 'code' | 'sequence'}
          puzzleData={activePuzzle.data}
          puzzleId={activePuzzle.id}
          onClose={() => setActivePuzzle(null)}
          onSolve={handlePuzzleSolve}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  loadingText: { color: '#fff', fontSize: 18 },
  webControls: {
    backgroundColor: '#0f0f23',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  webControlsText: {
    color: '#4a9eff',
    fontSize: 12,
    textAlign: 'center',
  },
  gameArea: { height: GAME_HEIGHT, position: 'relative' },
  sceneHeader: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sceneName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inventoryCount: {
    color: '#4a9eff',
    fontSize: 12,
  },
  exitIndicator: {
    position: 'absolute',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(74,158,255,0.3)',
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#4a9eff',
  },
  exit_up: { top: 65, left: 152 },
  exit_down: { bottom: 5, left: 152 },
  exit_left: { left: 5, top: 275 },
  exit_right: { right: 5, top: 275 },
  exitArrow: { color: '#fff', fontSize: 22 },
  player: { position: 'absolute', width: 40, height: 50, justifyContent: 'center', alignItems: 'center' },
  playerSprite: { fontSize: 32 },
  object: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  objectSprite: { fontSize: 28 },
  joystickArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  joystick: { alignItems: 'center', gap: 5 },
  joystickRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dirBtn: {
    width: 55,
    height: 55,
    backgroundColor: '#16213e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  dirText: { color: '#fff', fontSize: 24 },
  joystickCenter: { width: 55, height: 55, backgroundColor: '#0f0f23', borderRadius: 12 },
  actionButtons: { gap: 15 },
  actionBtn: {
    width: 55,
    height: 55,
    backgroundColor: '#16213e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e94560',
  },
  actionText: { fontSize: 24 },
  webButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  webBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#16213e',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4a9eff',
  },
  webBtnText: { color: '#fff', fontSize: 14 },
  tipText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    paddingBottom: 10,
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  dialogBox: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e94560',
  },
  dialogText: { color: '#fff', fontSize: 18, lineHeight: 28 },
  dialogHint: { color: '#666', fontSize: 12, textAlign: 'right', marginTop: 10 },
  inventoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inventoryBox: {
    width: SCREEN_WIDTH - 40,
    maxHeight: '70%',
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e94560',
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inventoryTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  closeBtn: { color: '#e94560', fontSize: 24 },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemSlot: {
    width: 80,
    height: 100,
    backgroundColor: '#0f0f23',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    padding: 5,
  },
  itemIcon: { fontSize: 32 },
  itemName: { color: '#fff', fontSize: 11, textAlign: 'center' },
  itemUsable: { color: '#4a9eff', fontSize: 9 },
  emptyText: { color: '#666', fontSize: 16, textAlign: 'center', width: '100%', paddingVertical: 40 },
});

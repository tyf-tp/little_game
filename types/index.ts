// ============================================
// 数据类型定义
// ============================================

// 物品
export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  usable: boolean;
  consumable: boolean;
}

// 场景出口
export interface Exit {
  direction: 'up' | 'down' | 'left' | 'right';
  targetSceneId: string;
  requiredItem?: string;
  locked?: boolean;
  unlockCondition?: string;
}

// 可交互物品/对象
export interface InteractiveObject {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  sprite: string;
  action: 'examine' | 'pickup' | 'use' | 'talk' | 'open' | 'push' | 'pull';
  requiresItem?: string;
  givesItem?: string;
  triggersPuzzle?: string;
  dialog?: string[];
  isCollected?: boolean;
}

// 谜题
export interface Puzzle {
  id: string;
  type: 'code' | 'sequence' | 'slider' | 'match' | 'custom';
  solved: boolean;
  data: Record<string, any>;
}

// 场景
export interface Scene {
  id: string;
  name: string;
  background: string;
  exits: Exit[];
  objects: InteractiveObject[];
  puzzles: Puzzle[];
  music?: string;
}

// 玩家位置
export interface PlayerPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'idle';
}

// 游戏状态
export interface GameState {
  currentSceneId: string;
  playerPosition: PlayerPosition;
  inventory: Item[];
  collectedItems: string[];
  solvedPuzzles: string[];
  flags: Record<string, boolean>;
  dialogHistory: string[];
}

// 存档数据
export interface SaveData {
  id: string;
  userId: string;
  slot: number;
  sceneId: string;
  gameState: GameState;
  playTime: number;
  createdAt: string;
  updatedAt: string;
}

// 用户数据
export interface UserData {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

# 谜境逃脱 - 解谜游戏框架

## 项目概述
一款类绣湖+i Wanna风格的移动端解谜游戏，玩家在可切换的场景中通过探索、收集物品、解谜来通关。

## 技术栈
- **前端**: React Native + Expo
- **后端**: 腾讯云开发 (CloudBase) 或 Supabase
- **状态管理**: Zustand
- **导航**: React Navigation
- **存储**: 云数据库 + 本地缓存

## 核心模块设计

### 1. 账号系统
- 注册/登录界面
- JWT Token 认证
- 存档管理（每账号独立）

### 2. 场景系统
```
SceneSystem
├── SceneManager (场景切换管理)
├── Room (单个场景)
│   ├── background (背景图)
│   ├── interactiveObjects (可交互物品)
│   ├── exits (出口：上下左右)
│   └── puzzles (谜题触发器)
└── Transition (场景切换动画)
```

### 3. 物品系统
```
InventorySystem
├── Item (物品定义)
├── Inventory (背包)
└── ItemInteraction (物品交互逻辑)
```

### 4. 存档系统
```javascript
SaveData {
  userId: string,
  currentScene: string,
  inventory: Item[],
  solvedPuzzles: string[],
  flags: { [key]: boolean },
  timestamp: number
}
```

### 5. 游戏核心循环
```
GameLoop
├── 输入处理 (虚拟摇杆/按钮)
├── 场景渲染
├── 碰撞检测
├── 交互判定
└── 状态更新
```

## 场景切换示意
```
        [上出口] → 场景B
             ↓
[左出口] → 场景A ← [右出口]
             ↓
        [下出口] → 场景C
```

## 后续扩展
- 多种谜题类型（密码、拼图、顺序等）
- 剧情对话系统
- 成就系统
- 提示系统

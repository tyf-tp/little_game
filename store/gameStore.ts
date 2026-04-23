import { create } from 'zustand';
import { Scene, Item, GameState, SaveData } from '../types';
import { scenes } from '../data/scenes';
import { items } from '../data/items';

const initialGameState: GameState = {
  currentSceneId: 'scene_start',
  playerPosition: { x: 180, y: 400, direction: 'down' },
  inventory: [],
  collectedItems: [],
  solvedPuzzles: [],
  flags: {},
  dialogHistory: [],
};

interface GameStore {
  currentScene: Scene | null;
  gameState: GameState;
  isPaused: boolean;
  showInventory: boolean;
  showDialog: boolean;
  currentDialog: string[];
  dialogIndex: number;
  
  initGame: (sceneId?: string) => void;
  loadGame: (saveData: SaveData) => void;
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  interact: (objectId: string) => void;
  useItem: (itemId: string, targetId?: string) => void;
  addToInventory: (item: Item) => void;
  removeFromInventory: (itemId: string) => void;
  changeScene: (sceneId: string) => void;
  solvePuzzle: (puzzleId: string) => void;
  setFlag: (flag: string, value: boolean) => void;
  toggleInventory: () => void;
  showMessage: (dialogs: string[]) => void;
  nextDialog: () => void;
  closeDialog: () => void;
  setPaused: (paused: boolean) => void;
  getSaveData: (slot: number, userId: string) => SaveData;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentScene: null,
  gameState: initialGameState,
  isPaused: false,
  showInventory: false,
  showDialog: false,
  currentDialog: [],
  dialogIndex: 0,

  initGame: (sceneId?: string) => {
    const startSceneId = sceneId || 'scene_start';
    const scene = scenes.find(s => s.id === startSceneId) || scenes[0];
    set({
      currentScene: scene,
      gameState: { ...initialGameState, currentSceneId: startSceneId },
      isPaused: false,
      showInventory: false,
      showDialog: false,
    });
  },

  loadGame: (saveData: SaveData) => {
    const scene = scenes.find(s => s.id === saveData.sceneId) || scenes[0];
    set({
      currentScene: scene,
      gameState: saveData.gameState,
      isPaused: false,
      showInventory: false,
      showDialog: false,
    });
  },

  movePlayer: (direction) => {
    const { gameState } = get();
    const speed = 5;
    let { x, y } = gameState.playerPosition;
    
    switch (direction) {
      case 'up': y -= speed; break;
      case 'down': y += speed; break;
      case 'left': x -= speed; break;
      case 'right': x += speed; break;
    }

    x = Math.max(20, Math.min(340, x));
    y = Math.max(100, Math.min(500, y));

    set({
      gameState: { ...gameState, playerPosition: { x, y, direction } },
    });
  },

  interact: (objectId: string) => {
    const { currentScene, gameState, addToInventory, showMessage } = get();
    if (!currentScene) return;

    const obj = currentScene.objects.find(o => o.id === objectId);
    if (!obj) return;

    if (obj.action === 'pickup' && obj.isCollected) return;

    if (obj.requiresItem) {
      const hasItem = gameState.inventory.some(i => i.id === obj.requiresItem);
      if (!hasItem) {
        showMessage([`需要先获取 ${obj.requiresItem}`]);
        return;
      }
    }

    switch (obj.action) {
      case 'examine':
        if (obj.dialog) showMessage(obj.dialog);
        break;
      case 'pickup':
        const item = items.find(i => i.id === obj.givesItem);
        if (item) {
          addToInventory(item);
          set(state => ({
            currentScene: state.currentScene ? {
              ...state.currentScene,
              objects: state.currentScene.objects.map(o => 
                o.id === objectId ? { ...o, isCollected: true } : o
              ),
            } : null,
            gameState: {
              ...state.gameState,
              collectedItems: [...state.gameState.collectedItems, obj.id],
            },
          }));
          showMessage([`获得: ${item.name}`, item.description]);
        }
        break;
      default:
        if (obj.dialog) showMessage(obj.dialog);
    }
  },

  useItem: (itemId: string, targetId?: string) => {
    const { gameState, currentScene, showMessage } = get();
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item || !currentScene) return;

    if (targetId) {
      const target = currentScene.objects.find(o => o.id === targetId);
      if (target) {
        showMessage([`对 ${target.name} 使用了 ${item.name}`]);
      }
    }
  },

  addToInventory: (item: Item) => {
    set(state => ({
      gameState: { ...state.gameState, inventory: [...state.gameState.inventory, item] },
    }));
  },

  removeFromInventory: (itemId: string) => {
    set(state => ({
      gameState: {
        ...state.gameState,
        inventory: state.gameState.inventory.filter(i => i.id !== itemId),
      },
    }));
  },

  changeScene: (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      set(state => ({
        currentScene: scene,
        gameState: {
          ...state.gameState,
          currentSceneId: sceneId,
          playerPosition: { ...state.gameState.playerPosition, x: 180, y: 200 },
        },
      }));
    }
  },

  solvePuzzle: (puzzleId: string) => {
    set(state => ({
      gameState: { ...state.gameState, solvedPuzzles: [...state.gameState.solvedPuzzles, puzzleId] },
      currentScene: state.currentScene ? {
        ...state.currentScene,
        puzzles: state.currentScene.puzzles.map(p =>
          p.id === puzzleId ? { ...p, solved: true } : p
        ),
      } : null,
    }));
  },

  setFlag: (flag: string, value: boolean) => {
    set(state => ({
      gameState: { ...state.gameState, flags: { ...state.gameState.flags, [flag]: value } },
    }));
  },

  toggleInventory: () => set(state => ({ showInventory: !state.showInventory })),

  showMessage: (dialogs: string[]) => {
    set({ showDialog: true, currentDialog: dialogs, dialogIndex: 0 });
  },

  nextDialog: () => {
    const { dialogIndex, currentDialog } = get();
    if (dialogIndex < currentDialog.length - 1) {
      set({ dialogIndex: dialogIndex + 1 });
    } else {
      set({ showDialog: false, dialogIndex: 0, currentDialog: [] });
    }
  },

  closeDialog: () => {
    set({ showDialog: false, dialogIndex: 0, currentDialog: [] });
  },

  setPaused: (paused: boolean) => set({ isPaused: paused }),

  getSaveData: (slot: number, userId: string): SaveData => {
    const { currentScene, gameState } = get();
    return {
      id: `${userId}_${slot}`,
      userId,
      slot,
      sceneId: currentScene?.id || 'scene_start',
      gameState,
      playTime: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  resetGame: () => {
    set({
      currentScene: null,
      gameState: initialGameState,
      isPaused: false,
      showInventory: false,
      showDialog: false,
      currentDialog: [],
      dialogIndex: 0,
    });
  },
}));

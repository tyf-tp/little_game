import { Item } from '../types';

export const items: Item[] = [
  // ═══════════════════════════════════════════
  // 第一关物品
  // ═══════════════════════════════════════════
  {
    id: 'flashlight',
    name: '手电筒',
    description: '一个老旧但还能用的手电筒，可以照亮黑暗的地方。',
    icon: '🔦',
    usable: true,
    consumable: false,
  },
  {
    id: 'key_bronze',
    name: '铜钥匙',
    description: '一把生锈的铜钥匙，形状很普通。',
    icon: '🗝️',
    usable: true,
    consumable: false,
  },

  // ═══════════════════════════════════════════
  // 第二关物品
  // ═══════════════════════════════════════════
  {
    id: 'torn_note',
    name: '破碎的纸条',
    description: '一张被撕碎的纸条，上面写着"2_1_"。',
    icon: '📜',
    usable: false,
    consumable: false,
  },
  {
    id: 'magic_book',
    name: '魔法书',
    description: '一本古老的书，封面刻着神秘符文。书中提到："数字的密码，用光芒照亮答案"。',
    icon: '📖',
    usable: false,
    consumable: false,
  },
  {
    id: 'candle',
    name: '蜡烛',
    description: '一根红色的蜡烛，可以点燃。',
    icon: '🕯️',
    usable: true,
    consumable: true,
  },
  {
    id: 'key_silver',
    name: '银钥匙',
    description: '一把闪亮的银钥匙，比铜钥匙精致很多。',
    icon: '🔑',
    usable: true,
    consumable: false,
  },

  // ═══════════════════════════════════════════
  // 第三关物品
  // ═══════════════════════════════════════════
  {
    id: 'crystal_blue',
    name: '蓝色水晶',
    description: '散发着寒冷蓝光的宝石，触感冰冷。',
    icon: '💎',
    usable: true,
    consumable: false,
  },
  {
    id: 'crystal_red',
    name: '红色宝石',
    description: '一颗温热的红宝石，散发着温暖的光芒。',
    icon: '🔴',
    usable: true,
    consumable: false,
  },
  {
    id: 'crystal_green',
    name: '绿色宝石',
    description: '一块翠绿的宝石，颜色鲜艳欲滴。',
    icon: '🟢',
    usable: true,
    consumable: false,
  },
  {
    id: 'compass',
    name: '罗盘',
    description: '一个古老的罗盘，指针永远指向北方。',
    icon: '🧭',
    usable: true,
    consumable: false,
  },

  // ═══════════════════════════════════════════
  // 特殊物品
  // ═══════════════════════════════════════════
  {
    id: 'old_key',
    name: '旧钥匙',
    description: '一把看起来很旧的钥匙，不知道能开什么锁。',
    icon: '🗝️',
    usable: true,
    consumable: false,
  },
  {
    id: 'note_hint',
    name: '提示纸条',
    description: '上面写着："答案就在眼前"。',
    icon: '📝',
    usable: true,
    consumable: false,
  },
  {
    id: 'lever_handle',
    name: '拉杆手柄',
    description: '从某处拆下来的机械部件。',
    icon: '🔧',
    usable: true,
    consumable: false,
  },
  {
    id: 'torch',
    name: '火把',
    description: '可以照亮黑暗的地方。',
    icon: '🔥',
    usable: true,
    consumable: true,
  },
];

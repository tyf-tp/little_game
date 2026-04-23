# 谜境逃脱 - 项目配置与运行指南

## 目录
1. [项目介绍](#项目介绍)
2. [三关攻略](#三关攻略)
3. [本地开发运行](#本地开发运行)
4. **[网页端运行（无需下载App）](#网页端运行无需下载app)** ⭐
5. [手机端运行](#手机端运行)
6. [部署到云端](#部署到云端)
7. [后端配置 (Supabase)](#后端配置-supabase)
8. [数据库设置](#数据库设置)
9. [常见问题](#常见问题)

---

## 项目介绍

这是一个基于 **React Native + Expo** 开发的跨平台解谜游戏框架，支持：
- 网页浏览器直接运行 ⭐
- 手机 App 运行
- 用户注册/登录系统
- 多场景切换探索
- 物品收集与背包系统
- 多种谜题类型
- 云端存档保存

---

## 三关攻略

### 第一关：苏醒

**目标**: 在封闭房间中找到钥匙，打开铁门离开

**攻略步骤**:
1. 从床上醒来，先四处探索
2. 调查墙上的便签，得知"门的密码藏在画里"
3. 调查挂画，发现太阳是红色的（暗示时间）
4. **关键**: 移动到床底，发现铜钥匙
5. 用钥匙打开铁门，进入下一关

### 第二关：抉择

**目标**: 解开拉杆谜题，打开通往地下室的通道

**攻略步骤**:

1. **图书馆探索** - 调查书架获得魔法书和蜡烛
2. **储藏室探索** - 调查照片，注意时钟显示 `2:10`
3. **拉杆谜题** - 按顺序 A-B-A-B 拉动
4. **符文密码** - 在地下室输入密码 `210`

### 第三关：深渊

**目标**: 收集宝石，解开祭坛之谜，找到出口

**攻略步骤**:
1. 收集蓝色水晶、红色宝石、罗盘
2. 密室保险箱密码: `218`
3. 宝藏室按 红→蓝→绿 顺序点击
4. 完成祭坛，打开最终之门

---

## 本地开发运行

### 准备工作

1. **安装 Node.js** (v18+)
   - 下载地址: https://nodejs.org/

2. **代码编辑器** (推荐 VS Code)
   - 下载: https://code.visualstudio.com/

### 安装依赖

```bash
# 进入项目目录
cd E:\little_game\puzzle-game-framework

# 安装依赖
npm install
```

---

## 网页端运行（无需下载App）⭐

### 方法一：本地浏览器直接运行（推荐）

```bash
# 在项目目录执行
cd E:\little_game\puzzle-game-framework
npm start
```

然后按 `w` 切换到 Web 模式，或在浏览器中访问:
```
http://localhost:8081
```

### 方法二：Expo 网页模式

```bash
# 启动 Expo 并选择 "w" 打开 Web
npm start

# 或直接指定 web 平台
npm run web
```

### 方法三：开发模式热重载

```bash
# 确保 Node.js 已安装
# 进入目录
cd E:\little_game\puzzle-game-framework

# 安装 expo-cli 全局（如果需要）
npm install -g expo-cli

# 启动 web 开发服务器
npx expo start --web
```

### 网页端操作说明

| 按键 | 功能 |
|------|------|
| `W` / `↑` | 向上移动 |
| `S` / `↓` | 向下移动 |
| `A` / `←` | 向左移动 |
| `D` / `→` | 向右移动 |
| `E` / `空格` | 交互/拾取 |
| `I` | 打开背包 |
| `ESC` | 暂停菜单 |

---

## 手机端运行

### 方法一：扫码运行（需安装 Expo Go）

1. **安装 Expo Go App**
   - iOS: App Store 搜索 "Expo Go"
   - Android: 应用商店搜索 "Expo Go"

2. **扫码运行**
   - 电脑端运行 `npm start`
   - 用 Expo Go 扫描显示的二维码

3. **或手机浏览器访问**
   - Expo 会提供局域网 URL
   - 手机和电脑在同一 WiFi 下即可

### 方法二：打包 APK

```bash
# 1. 生成本地代码
npx expo prebuild --platform android

# 2. 进入 android 目录
cd android

# 3. 构建 Debug APK
./gradlew assembleDebug

# APK 文件位置: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 部署到云端

### 方案一：部署到 Vercel（免费，推荐）

1. **构建 Web 版本**
   ```bash
   npm run web
   ```

2. **创建 Vercel 项目**
   - 访问 https://vercel.com
   - 用 GitHub 登录
   - 点击 "New Project"
   - 导入 `puzzle-game-framework` 文件夹

3. **配置构建设置**
   - Build Command: `npx expo export:embed`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **部署完成**
   - 获得一个公开 URL，如: `https://your-game.vercel.app`

### 方案二：部署到 Netlify（免费）

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **构建**
   ```bash
   npx expo export:embed
   ```

3. **部署**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### 方案三：部署到 GitHub Pages

1. **创建 GitHub 仓库**
2. **推送代码**
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git remote add origin https://github.com/你的用户名/puzzle-game.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 仓库 Settings → Pages → Source: main branch

4. **注意**: 需要将 `dist` 目录推送到 `gh-pages` 分支

---

## 后端配置 (Supabase)

### 为什么需要 Supabase?

Supabase 提供：
- 用户认证 (登录/注册)
- PostgreSQL 数据库
- 云端存档保存

### 注册 Supabase

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新项目

### 获取 API 配置

1. 进入项目 Dashboard
2. 点击 **Settings** → **API**
3. 复制：
   - `Project URL`: 类似 `https://xxxxx.supabase.co`
   - `anon public` key: 长字符串

### 更新项目配置

编辑 `services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://你的项目.supabase.co';
const supabaseAnonKey = '你的anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 数据库设置

在 Supabase Dashboard → **SQL Editor** 执行以下 SQL：

```sql
-- 用户资料表
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 游戏存档表
CREATE TABLE IF NOT EXISTS public.saves (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  slot INTEGER NOT NULL CHECK (slot >= 1 AND slot <= 3),
  scene_id TEXT NOT NULL,
  game_state JSONB NOT NULL,
  play_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, slot)
);

-- 启用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;

-- profiles 策略
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- saves 策略
CREATE POLICY "Users can view own saves" ON public.saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saves" ON public.saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saves" ON public.saves FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saves" ON public.saves FOR DELETE USING (auth.uid() = user_id);

-- 自动创建 profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_saves_updated_at
  BEFORE UPDATE ON public.saves
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

## 常见问题

### Q: 网页打不开？
```bash
# 确保端口没被占用
# 尝试指定端口
npx expo start --port 3000
```

### Q: 扫码没反应？
- 确保手机和电脑在同一网络
- 尝试刷新二维码

### Q: 安装依赖失败？
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Q: Supabase 连接失败？
- 检查 API URL 和 Key 是否正确
- 确认数据库表已创建

### Q: 网页端键盘没反应？
- 确保焦点在游戏窗口上
- 刷新页面重试

---

## 项目结构

```
puzzle-game-framework/
├── App.tsx                 # 应用入口
├── app.json               # Expo 配置
├── package.json           # 依赖管理
├── screens/               # 界面组件
│   ├── SplashScreen.tsx   # 启动画面
│   ├── LoginScreen.tsx   # 登录
│   ├── RegisterScreen.tsx # 注册
│   ├── MainMenuScreen.tsx # 主菜单
│   ├── GameScreen.tsx     # 游戏主界面
│   ├── SettingsScreen.tsx # 设置
│   └── SaveSlotScreen.tsx # 存档管理
├── components/            # UI 组件
│   └── PuzzleModal.tsx    # 谜题弹窗
├── store/                 # 状态管理
│   ├── authStore.ts       # 认证状态
│   └── gameStore.ts       # 游戏状态
├── services/              # 服务层
│   └── supabase.ts        # 数据库服务
├── data/                  # 游戏数据
│   ├── scenes.ts          # 场景配置
│   └── items.ts           # 物品配置
└── types/                 # 类型定义
    └── index.ts
```

---

## 快速开始命令汇总

```bash
# 进入项目
cd E:\little_game\puzzle-game-framework

# 安装依赖
npm install

# 启动开发（网页）
npm start
# 然后按 w 打开网页

# 或直接启动网页
npm run web

# 打包 APK
npx expo prebuild --platform android
cd android && ./gradlew assembleDebug
```

---

祝游戏开发愉快！

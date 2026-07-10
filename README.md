# LIVHOME · React Native (Expo)

居家看护智能摄像头 App —— 由原型单文件 HTML 转换而来的 **React Native / Expo** 工程。

## 与 HTML 原型的两点差异（按需求）

1. **去掉了手机外框** —— 不再有 `.phone / .lp` 设备外壳、圆角外框、状态栏模拟。改用 `SafeAreaView` 直接全屏渲染，就是一个真正的原生 App。
2. **去掉了「全局页面」功能** —— 原型右下角那个悬浮球（网格图标）+「All screens」画板 / picker 全部移除。页面之间改由底部 Tab + 原生栈导航跳转。

## 运行

```bash
cd livhome-rn
npm install          # 或 yarn
npx expo start       # 扫码用 Expo Go 打开，或按 i / a 开模拟器
```

> 首次安装后如提示版本不匹配，运行 `npx expo install --fix` 让依赖对齐当前 Expo SDK。

## 目录结构

```
App.tsx                    入口：SafeAreaProvider + NavigationContainer
index.js                   registerRootComponent
src/
  theme/index.ts           设计令牌（颜色 / 圆角 / 间距 / 阴影 / 字号）——从原型 :root 1:1 移植
  components/
    SunLogo.tsx            太阳放射标（react-native-svg 绘制，任意尺寸清晰）
    ui.tsx                 Screen / Card / Row / 按钮 / 文本样式等基础组件
  assets/images.ts         摄像头照片等 data URI 资源
  navigation/
    RootNavigator.tsx      Stack(Login → Main → DeviceDetail) + BottomTabs(Home/Assistant/Profile)
  screens/
    LoginScreen.tsx        登录（邮箱 / Google / Apple）
    DeviceHomeScreen.tsx   设备首页（在线卡片 + 离线卡片，含摄像头照片头像）
    DeviceDetailScreen.tsx 实时画面（Controls / Tilt / Messages / Playback 四 Tab）
    AssistantScreen.tsx    AI 助手（空态问候 + 建议 Pills + 流式对话 + 复制/朗读）
    ProfileScreen.tsx      我的（资料卡 + 相册/通知/反馈/帮助/设置分组）
```

## 已转换的页面（核心主流程）

- 登录 → 设备首页 → 实时画面 → AI 助手 → 我的

## 尚未转换（原型里还有，可继续补）

通知中心 / 通知设置、AI 侦测（移动/声音/越界/电子围栏）、相册、自动化（闹钟/定时关机）、
配网流程（搜索/Wi-Fi/连接/成功/失败/二维码）、设置子页（关于/语言/时区/存储卡）、反馈中心表单等。

这些在 HTML 原型里都已存在，按需要可以按同样的 `screens/*.tsx` 模式逐个补齐并挂到导航上。

## 技术栈

- Expo SDK 52 · React Native 0.76 · TypeScript
- React Navigation v7（native-stack + bottom-tabs）
- react-native-svg（自绘图标 / logo）
- @expo/vector-icons（Feather / Ionicons）

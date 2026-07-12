# LIVHOME · React Native (Expo)

居家看护智能摄像头 App —— 由原型单文件 HTML 转换而来的 **React Native / Expo** 工程。

## 与 HTML 原型的两点差异（按需求）

1. **去掉了手机外框** —— 不再有 `.phone / .lp` 设备外壳、圆角外框、状态栏模拟。改用 `SafeAreaView` 直接全屏渲染，就是一个真正的原生 App。
2. **去掉了「全局页面」功能** —— 原型右下角那个悬浮球（网格图标）+「All screens」画板 / picker 全部移除。页面之间改由底部 Tab + 原生栈导航跳转。

## 运行

```bash
npm ci
npx expo start --clear --go --port 8082
```

当前固定使用 Expo SDK 54，以兼容 App Store 中的 iOS Expo Go。真机联调后端时，将 `.env.example` 复制为本地环境文件，并把 API 地址改为开发电脑的局域网地址。

## 目录结构

```
App.tsx                    入口：SafeAreaProvider + NavigationContainer
index.js                   registerRootComponent
src/
  api/client.ts            统一 HTTP、超时、取消和错误处理
  contracts/               前后端 DTO 与稳定枚举
  features/                聊天、设备等功能状态与行为
  theme/index.ts           设计令牌（颜色 / 圆角 / 间距 / 阴影 / 字号）
  components/
    kit.tsx                Screen / Card / Row / 按钮等共享组件
    SunLogo.tsx            太阳放射标
  assets/images.ts         摄像头照片等 data URI 资源
  navigation/
    types.ts               路由名、参数与页面导航类型
    registry.tsx           页面注册表
    RootNavigator.tsx      Stack + Bottom Tabs
  screens/                 页面组合与本地视觉状态
```

## 后端联调

- 接口约定见 `docs/API_CONTRACT.md`。
- 页面不得直接调用 `fetch`，统一使用 `src/api/client.ts`。
- DTO 与枚举维护在 `src/contracts/`。
- 团队与编码代理协作规则见 `AGENTS.md` 和 `CLAUDE.md`。

## 技术栈

- Expo SDK 54 · React Native 0.81 · TypeScript 5.9
- React Navigation v7（native-stack + bottom-tabs）
- react-native-svg（自绘图标 / logo）

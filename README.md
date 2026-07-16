# LIVHOME

LIVHOME 是面向家庭摄像头监控、设备管理与 AI 助手的跨平台 React Native 前端。项目以 iOS 和 Android 为主要目标，同时保留基于 Metro 的 Web 开发入口。

本仓库是生产前端代码库。当前已经具备完整的页面与导航流程，但多数业务数据和交互仍使用本地状态；真实后端尚未接入页面。API 约定见 [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md)。

## 当前能力

- 设备列表、实时画面、回放、事件、配置与设备绑定流程
- AI Assistant 对话、历史会话、语音交互与底部导航联动
- 通知、相册、告警、检测区域、定时关机与提醒流程
- 登录、个人资料、设置、反馈、隐私协议与帮助中心
- iOS、Android 和 Web 的类型安全导航

当前登录流程仅保存一个本地登录标记：原生端使用 `expo-secure-store`，Web 端回退到 `localStorage`。它不是正式的验证码认证或 access/refresh token 会话。

## 技术栈

- Node.js 22.13 或更高版本
- Expo SDK 54（`54.0.35`）
- React Native `0.81.5`、React `19.1.0`
- TypeScript 5.9 strict mode
- React Navigation 7（native stack + bottom tabs）
- `react-native-safe-area-context`、`react-native-svg`
- `expo-secure-store`、`expo-linear-gradient`

Expo SDK 54 是有意固定的版本，用于兼容 App Store 当前提供的 iOS Expo Go。未经明确批准和真机验证，请勿升级 Expo 或 React Native。

## 快速开始

首次拉取或需要干净安装时，先确保 Metro 已停止，再执行：

```bash
npm ci
```

日常启动：

```bash
npm start
```

使用 Expo Go 并固定到 `8082` 端口时：

```bash
npx expo start --go --port 8082
```

不要把 `--clear` 作为日常启动参数；仅在确认 Metro 缓存异常时使用。不要停止或重启其他人启动的 Metro 服务。

## 环境变量与真机联调

需要连接后端时，在 PowerShell 中创建本地环境文件：

```powershell
Copy-Item .env.example .env.local
```

默认配置为：

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:3000
```

真机不能使用开发电脑的 `localhost`，需要改为电脑的局域网地址，例如：

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

手机与电脑需要处于同一网络，后端也必须监听局域网接口。不要在 `EXPO_PUBLIC_*` 变量中保存密钥或其他秘密。

目前页面尚未调用真实 API，因此未配置该变量时仍可浏览本地 UI 流程。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm start` | 启动 Expo / Metro |
| `npm run android` | 启动 Expo 并打开 Android |
| `npm run ios` | 启动 Expo 并打开 iOS（需要 macOS） |
| `npm run web` | 启动 Web 开发版本 |
| `npm run lint` | 运行 ESLint |
| `npm run typecheck` | 运行 TypeScript 类型检查 |
| `npm run check:api` | 校验 `src/api/client.ts` 的 HTTP 边界行为 |

普通 TypeScript / TSX 改动完成后运行：

```bash
npm run lint
npm run typecheck
```

`npm run check:api` 仅在 API client 或其检查脚本变化时运行。Expo Doctor、全平台 export 和依赖重装的触发条件见 [`AGENTS.md`](AGENTS.md)。

## 导航与登录路径

- 根导航从 `splash` 开始。
- 已有登录标记时，启动后直接进入 `Main / agent-chat`。
- 未登录时依次进入隐私确认、登录与邮箱流程。
- Settings 中的 Log Out 会清除登录标记并返回 `splash`。
- 主导航包含 Devices、Assistant、Profile 三个底部 Tab；其他页面使用类型安全的 native stack。
- 路由与参数以 `src/navigation/types.ts` 为准，页面注册以 `src/navigation/registry.tsx` 为准。

## 目录结构

```text
App.tsx                         应用入口：SafeAreaProvider + NavigationContainer
app.json                        Expo 应用配置
docs/API_CONTRACT.md            前后端 API 草案与待决事项
scripts/check-api-client.mjs    API client 最小行为检查
src/
  api/client.ts                 统一 HTTP、Bearer token、超时、取消与 ApiError
  contracts/                    前后端 DTO 与稳定枚举
  features/                     跨页面功能状态与行为
    auth/session.ts             本地登录标记持久化
  navigation/
    types.ts                    路由名称、参数与 Web linking
    registry.tsx                页面注册表
    RootNavigator.tsx           Native Stack + Bottom Tabs
    TabBar.tsx                  自定义可收起底部导航
    TabOverlay.tsx              高于底部导航的临时浮层宿主
  screens/                      页面组合、本地状态、弹窗与导航事件
  components/                   共享组件与图标组件
  theme/index.ts                运行时设计令牌
  assets/                       图片资源
  icons/                        SVG 路径与图标集合
```

## 后端接入约束

- 从 [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) 和 `src/contracts/` 开始，不从页面 JSX 推断接口。
- 页面不得直接调用 `fetch`；统一通过 `src/api/client.ts`。
- 网络和 HTTP 错误统一归一为 `ApiError`。
- 正式认证 token 必须存入 `expo-secure-store`，不能存入 AsyncStorage。
- 每个联网页面需要覆盖 loading、empty、error、retry 和 mutation-in-progress 状态。
- Assistant 流式传输方式尚未确定，接入前需要先约定 SSE、WebSocket 或 chunked HTTP。

## 项目文档

- [`DESIGN.md`](DESIGN.md)：视觉与交互规范
- [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md)：API 契约草案
- [`AGENTS.md`](AGENTS.md)：工程规则与按改动范围执行的检查
- [`CLAUDE.md`](CLAUDE.md)：同步的协作说明

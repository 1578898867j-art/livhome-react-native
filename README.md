# LIVHOME · React Native (Expo)

居家看护智能摄像头 App —— 由高保真 HTML 原型 1:1 迁移到 **React Native / Expo** 的工程,55 个页面全部落地,并内置了接后端前的全套异常/边界状态演示。

- 设计源:Figma「LIVHOME交付文档」与「小黄人摄像头设计稿」;设计令牌见 [DESIGN.md](DESIGN.md)
- 主分支:`rn-initial`(GitLab MR !1)

## 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | Expo SDK 54 · React Native 0.81 · React 19 · TypeScript 5.9(strict) |
| 导航 | React Navigation v7(native-stack + bottom-tabs,自定义可收起胶囊 TabBar) |
| 图形 | react-native-svg(图标体系 + 设计稿切片原样渲染)· expo-linear-gradient |
| 其他 | expo-clipboard(复制)· expo-secure-store(登录态持久化)· react-native-safe-area-context |

Node ≥ 22.13;固定 SDK 54 以兼容 App Store 版 iOS Expo Go。

## 快速开始

```bash
npm ci

# 真机同一局域网联调(把 IP 换成开发机地址)
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.11.55 npx expo start --lan

# 或默认方式
npx expo start --clear --go
```

用 Expo Go 扫码打开。改动纯 JS/TS 时 Fast Refresh 即可;**改了依赖或原生配置需重启 Metro**。

常用检查:

```bash
npm run typecheck   # tsc --noEmit,每次提交前必须通过
npm run lint        # eslint(expo 规则)
npm run check:api   # 校验页面未绕过 api/client 直连 fetch
```

## 目录结构

```
App.tsx                     入口:SafeAreaProvider + NavigationContainer + 全局状态层挂载
index.js                    registerRootComponent
docs/
  API_CONTRACT.md           前后端接口约定
  edge-states-checklist.md  异常/边界状态清单(每项的形式、触发方式、现状)
src/
  api/client.ts             统一 HTTP:超时、取消、错误处理(页面禁止直接 fetch)
  contracts/                前后端 DTO 与稳定枚举(auth / device / notification / assistant)
  theme/index.ts            设计令牌:颜色(仅浅色)/ 圆角 / 间距 / 阴影 / 字号
  assets/images.ts          data-URI 位图资源(设备图、空态插画等)
  icons/                    图标体系:paths.ts 描边图标 + 设计稿 SVG 切片(原样使用)
  navigation/
    types.ts                路由表(STACK_ROUTES / TAB_ROUTES)与导航类型
    registry.tsx            路由名 → 页面组件注册表
    RootNavigator.tsx       Stack + Bottom Tabs
    TabBar.tsx / TabOverlay  自定义底部胶囊 Tab(可收起)+ 覆盖层入口
    navRef.ts               全局导航 ref(供登录过期弹窗等导航树外组件使用)
  components/
    kit.tsx                 Screen / Header / Card / Tap / Row / 各类设置行与按钮
    BottomSheet.tsx         通用底部弹层(动画 + overlay 插槽,规避 iOS 双 Modal 限制)
    states.tsx              StateView(空/错态)· Spinner · DarkPlayerState(播放器态)
    AppToast.tsx            全局 toast(白胶囊 + 成功/失败/信息圆标)
    PermissionDialog.tsx    五种系统权限引导弹窗(跳系统设置)
    NetBanner.tsx           全局断网提示条
    SessionExpired.tsx      登录过期全局弹窗
    CamPreview / CalendarModal / SunLogo / Icon
  features/
    app/demoStore.ts        「概率性状态」演示开关 store(接后端后的替换点)
    app/toastStore.ts       全局 toast store(任意位置 showToast())
    auth/session.ts         登录态读写(expo-secure-store)
    devices/                设备详情原型状态 · 定时开关机共享 store
    assistant/              AI 助手会话原型状态
  screens/                  55 个页面(命名与路由一一对应)
```

## 功能模块

- **登录**:启动页 / 第三方登录 / 邮箱验证码登录(倒计时、验证码错误、登录失败)
- **配网**(Bind 系列):蓝牙搜索 → 准备 → Wi-Fi 设置/选择 → 连接进度 → 成功命名;含未找到设备、连接失败、二维码配对、蓝牙/权限引导、设备已被绑定等完整分支
- **设备**:设备列表(在线/离线/空态)· 直播详情(云台、预设位、巡航、对讲、截图录像、横屏全屏)· SD 回放(NVR 式时间轴、事件筛选、剪辑、下载进度)· 设备消息
- **消息中心**:设备/系统两级、编辑批删、详情时间线、图片查看与下载
- **相册**:分组网格、多选下载/删除、大图查看
- **AI 助手**:会话流、语音按住说话、长按消息编辑/复制、会话抽屉与历史
- **设置**:设备设置(侦测区域/拌线/声光报警/自定义语音/定时开关机/存储卡/固件 OTA)· 通知设置 · 个人中心(资料、语言、时区、反馈、帮助、关于)

## 全局状态层与异常演示

所有「接后端才会出现」的状态已提前实现,由演示开关驱动:

- **入口**:我的 → Setting → **State Preview**(分组开关 + 一次性事件 + Reset All)
- **开关**:断网 / 加载失败 / 操作失败 / 拉流失败 / 权限被拒 / 设备离线 / 无设备 / 当日无录像 / 无 SD 卡 / 云存过期 / 蓝牙未开 / 已被绑定 / 配网失败 / 有新固件
- **自然触发**(无需开关):搜索 12s 超时、扫码 20s 提示、进直播 1.2s 加载态、预设位上限、验证码 `000000` 报错、下载/格式化/OTA 进度弹窗、删空列表出空态
- 完整对照表:[docs/edge-states-checklist.md](docs/edge-states-checklist.md)

## 后端联调

- 接口约定见 [docs/API_CONTRACT.md](docs/API_CONTRACT.md);页面不得直接调用 `fetch`,统一走 `src/api/client.ts`;DTO 与枚举维护在 `src/contracts/`
- **替换演示状态**:全局搜索 `getDemoFlags()` / `useDemoFlags()`,即为全部后端接入点;设置项的统一保存出口是 `kit.tsx` 的 `guardSave`
- 真机联调时将 `.env.example` 复制为本地环境文件,API 地址改为开发机局域网地址

## 开发约定

1. **视觉即规范**:颜色/圆角/阴影一律取自 `src/theme`;间距用 2 的倍数;弹窗、toast、空/错态复用共享组件,不各写各的
2. **素材原样使用**:设计稿/用户提供的 SVG 切片不改绘、不替换;描边小图标统一走 `icons/paths.ts` + `<Icon/>`
3. **提交前**:`npm run typecheck` 必须通过;涉及接口层再跑 `npm run check:api`
4. 团队与编码代理协作规则见 [AGENTS.md](AGENTS.md) 与 [CLAUDE.md](CLAUDE.md)

## 与 HTML 原型的差异

1. **去掉手机外框**——不再模拟设备外壳/状态栏,`SafeAreaView` 全屏渲染真原生页面
2. **去掉「全局页面」画板**——原型的悬浮球 + All screens picker 移除,改为底部 Tab + 原生栈导航

# 异常与边界状态清单(接入后端前对照用)

> 目的:demo 的「成功路径」之外,以下概率性状态均已实现,由 **State Preview**(我的 → Setting → State Preview)里的演示开关驱动;接入后端后,把读 `demoStore` flag 的位置替换为真实请求结果即可(全部集中在 `src/features/app/demoStore.ts` 的引用处)。
> 现状标记:✅ 已实现(触发方式写在「触发」列) · ⏸ 暂缓(说明原因)
> 开关速查:`offline` 断网 · `failLoad` 加载失败 · `failOps` 操作失败 · `failStream` 拉流失败 · `permsDenied` 权限被拒 · `deviceOffline` 设备离线 · `noDevices` 无设备 · `emptyDay` 当日无录像 · `noSdCard` 无卡 · `cloudExpired` 云存过期 · `btOff` 蓝牙未开 · `alreadyBound` 已被绑定 · `bindFail` 配网失败 · `otaUpdate` 有新固件

---

## 1. 全局 / 网络

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 无网络 | 顶部深色胶囊提示条(全局) | 开关 `offline` | ✅ |
| 请求超时 / 服务器异常 | 错误 toast(全局白胶囊+红叉) | State Preview「Show server-error toast」;各操作由 `failOps` 覆盖 | ✅ |
| 登录态过期 | 全局弹窗 → Sign In Again 回登录页 | State Preview「Show login-expired dialog」 | ✅ |
| 版本强制更新 | 全屏拦截页 | 无此业务需求,待产品定义 | ⏸ |

## 2. 登录与账号

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 邮箱格式错误 | 输入框红边 + 红字 | 输入非法邮箱(本地校验) | ✅ |
| 验证码发送失败 | 错误 toast | `offline` 或 `failOps` 时点 Get Verification Code | ✅ |
| 重发频率限制 | Resend in 60s 倒计时 | 进入验证码步骤自动开始(自然触发) | ✅ |
| 验证码错误 | 输入框红边 + 红字 | 输入 `000000` 后 Sign In | ✅ |
| 登录失败 | 错误 toast | `offline` / `failOps` 时 Sign In | ✅ |
| Apple / Google 授权失败 | 错误 toast | 由通用 `failOps` 模式覆盖(第三方按钮为演示直登) | ⏸ |
| 头像上传 / 资料保存失败 | 错误 toast + 保留已填内容 | `failOps` 时 EditProfile 点 Save | ✅ |

## 3. 设备列表(DevHome)

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 列表加载失败 | 整页错误态 + Retry(转圈重试) | 开关 `failLoad` | ✅ |
| 无设备空态 | 蓝色相机圆标 + Add Device 引导 | 开关 `noDevices` | ✅ |
| 设备离线卡片 | 卡片置灰 + Reconnect → 配网 | 常驻演示数据(Bedroom Cam) | ✅ |
| 卡片封面加载失败 | 深色占位 | 由播放器状态组件覆盖(封面为演示画面) | ⏸ |

## 4. 添加设备 / 配网(Bind 系列)

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 手机蓝牙未开启 | 引导弹窗(Turn On → 系统设置) | 开关 `btOff` 后进搜索页 | ✅ |
| 蓝牙权限未授权 | 引导弹窗(Go to Settings) | 开关 `permsDenied` 后进搜索页 | ✅ |
| 定位权限(Android) | 同上组件 `location` 变体,接入时按平台调用 | 组件已备(PermissionDialog) | ✅ |
| 搜索超时 / 未找到设备 | 整页 BindNone + Retry + 手动添加 | 搜索页停留 12s 自动进入(自然触发);State Preview 可直开 | ✅ |
| 设备已被其他账号绑定 | 冲突弹窗(黄色 warn 圆标 + Got it) | 开关 `alreadyBound` 后点手动添加设备 | ✅ |
| Wi-Fi 列表获取失败 | 弹层内错误态 + Retry | 开关 `failLoad` 进 Wi-Fi 选择弹层 | ✅ |
| 连接失败 | 整页 BindFail(Retry → 重设 Wi-Fi) | 开关 `bindFail` 后 Connecting 页 4s 自动进入;State Preview 可直开 | ✅ |
| 二维码生成失败 | 卡片内紧凑错误态 + Retry | 开关 `failLoad` 进 QR 页 | ✅ |
| 扫码超时提示 | 二维码下方黄色提示条 | QR 页停留 20s(自然触发) | ✅ |
| 命名保存失败(BindSuccess) | 错误 toast,停留本页 | `failOps` 时点 Save | ✅ |

## 5. 实时预览 / 云台(DevDetail)

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 视频流连接中 | 播放器深色底白色转圈 | 每次进入页面 1.2s(自然触发) | ✅ |
| 视频流连接失败 | 播放器内错误 + Retry;控制条禁用置灰 | 开关 `failStream` | ✅ |
| 设备离线占位 | 播放器 cloudOff + Reconnect | 开关 `deviceOffline` | ✅ |
| 麦克风权限被拒(对讲) | 引导弹窗 | 开关 `permsDenied` 后点 Talk/对讲 | ✅ |
| 相册权限被拒(保存) | 引导弹窗 | `permsDenied` 后截图/开始录像 | ✅ |
| 截图 / 录像保存失败 | 错误 toast(全屏内为深色本地提示) | `failOps` 后截图/停止录像 | ✅ |
| 预设位上限 | 蓝色 info toast(上限 6 个) | 添加第 7 个预设位(自然触发) | ✅ |
| 巡航无预设位 | 弹窗引导 | 预设位 <2 时开巡航(自然触发) | ✅ |
| 云台到边界 / 清晰度切换失败 | 轻提示 | 待真实云台/码流接口(无可信模拟点) | ⏸ |

## 6. 回放(DevPlayback)/ 剪辑(DevDownload)

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| SD 卡未插入 | 整页空态 + Storage Settings 按钮 | 开关 `noSdCard` | ✅ |
| 云存未开通 / 已过期 | 整页说明态(蓝色云朵) | 开关 `cloudExpired` | ✅ |
| 当日无录像 | 时间轴区空态 + 播放器无录像文案 | 开关 `emptyDay` | ✅ |
| 时间轴数据加载失败 | 整页错误态 + Retry | 开关 `failLoad` | ✅ |
| 回放流播放失败 | 播放器内错误 + Retry | 开关 `failStream` | ✅ |
| 录像保存失败 | 错误 toast | `failOps` 停止录像 | ✅ |
| 剪辑保存失败 | 错误 toast | `failOps` 点 Save to Album | ✅ |
| 下载进度 + 取消 | 进度弹窗(进度条 + % + Cancel) | DevDownload 点 Save to Album(自然触发) | ✅ |
| 下载中断失败 | 进度至 60% 中断 + 错误 toast | `failOps` 时同上 | ✅ |

## 7. 消息通知(NotifCenter / NotifDetail / DevMessages)

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 列表加载失败 | 整页 Failed to load Notification + Retry(对齐设计稿 4531 错误区块) | 开关 `failLoad` | ✅ |
| 空状态 | 邮筒插画(设计稿资产) | 删除全部消息(自然触发) | ✅ |
| 删除失败(单条/批量) | 错误 toast,列表保持 | `failOps` 确认删除 | ✅ |
| 全部已读失败 | 错误 toast,红点保持 | `failOps` 点 All Read(详情页/设备消息页) | ✅ |
| 事件图片加载失败 | 灰底占位(photo 图标 + Failed to load) | 开关 `failLoad` 进详情 | ✅ |
| 图片下载失败 | 保存失败 toast | `failOps` / `permsDenied` 时下载(NotifImage 沿用成功 toast 结构) | ✅ |
| 推送权限未开启 | 列表顶部白色引导条 → 通知权限弹窗 | 开关 `permsDenied` | ✅ |
| 分页加载更多失败 | 底部重试条 | 演示数据无分页,接入后按 failLoad 模式补 | ⏸ |

## 8. 相册(Album / AlbumDetail)

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 空相册 | 空态(photo 圆标 + 说明) | 删除全部内容(自然触发) | ✅ |
| 列表加载失败 | 整页错误态 + Retry | 开关 `failLoad` | ✅ |
| 删除失败 | 错误 toast,保留列表 | `failOps` 确认删除(列表/大图页) | ✅ |
| 保存到系统相册:权限被拒 | 引导弹窗 | `permsDenied` 点下载 | ✅ |
| 保存失败 | 错误 toast | `failOps` 点下载 | ✅ |
| 大图/视频加载失败 | 深色错误态 + Retry | 开关 `failStream` 进大图页 | ✅ |

## 9. AI 助手(AgentChat / AgentHistory)

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 消息发送失败 | 气泡左侧红色感叹号,点击重发(恢复后清除) | 开关 `offline` 后发送 | ✅ |
| 回复失败 / 服务不可用 | 错误气泡(criticalSoft)+ Retry | 开关 `failOps` 后发送 | ✅ |
| 网络断开提示 | 全局顶部断网条 | 开关 `offline` | ✅ |
| 历史记录加载失败 | 整页错误态 + Retry | 开关 `failLoad` 进 Conversations | ✅ |

## 10. 设备设置

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 通用:开关/单选/分段保存失败 | 错误 toast + 状态回滚(kit 层统一守卫,覆盖全部设置页) | 开关 `failOps` 后改任意设置 | ✅ |
| 自定义语音:录音权限被拒 | sheet 内引导弹窗(Go to Settings) | `permsDenied` 点录音 | ✅ |
| 自定义语音:上传失败 | sheet 内红色提示条,不入列表 | `failOps` 停止录音 | ✅ |
| 自定义语音:删除失败 | sheet 内红色提示条 | `failOps` 确认删除 | ✅ |
| 自定义语音:条数上限 | 达 3 条后按钮禁用 | 自然触发 | ✅ |
| 定时开关机:保存 / 删除失败 | 错误 toast,停留/保留 | `failOps` 时 Save / 删除 | ✅ |
| 设备重启失败 | 错误 toast(成功则提示已发送) | `failOps` 确认重启 | ✅ |
| 设备删除失败 | 错误 toast,留在本页 | `failOps` 确认删除 | ✅ |
| SD 卡状态读取失败 / 未插卡 | 状态行显示 `--` / `No card` | 开关 `failLoad` / `noSdCard` | ✅ |
| 格式化进行中 / 失败 | 转圈进度弹窗 → 成功/失败 toast | 确认格式化(自然);`failOps` 时失败 | ✅ |
| 固件:检查更新 | 行内转圈 → 「已是最新」toast | 点 Firmware 行(自然触发) | ✅ |
| 固件:有新版本 | New 红标 + 新版本弹窗(Later / Update Now) | 开关 `otaUpdate` 后点 Firmware | ✅ |
| 固件:升级中 / 失败 | 进度弹窗(不可取消 + 断电警告)→ 成功升至 v2.5.0 / 60% 失败 toast | Update Now(自然);`failOps` 时失败 | ✅ |

## 11. 个人中心

| 状态 | 形式 | 触发 | 现状 |
|---|---|---|---|
| 意见反馈提交失败 | 错误 toast + 保留内容(成功有提交成功 toast) | `failOps` 点 Submit | ✅ |
| 帮助中心内容加载失败 | 整页重试 | 内容目前内置,改后端下发时按 failLoad 模式补 | ⏸ |
| 用户信息加载失败 | 占位 + 重试 | 同上,信息目前本地 | ⏸ |

## 12. 系统权限汇总(PermissionDialog 组件,`permsDenied` 驱动)

| 权限 | 调用点 | 现状 |
|---|---|---|
| 蓝牙开关 / 蓝牙权限 | 进入设备搜索页 | ✅ |
| 定位(Android 扫描) | 组件变体已备,接入时按平台弹出 | ✅ |
| 麦克风 | 对讲、自定义语音录音 | ✅ |
| 相册写入 | 截图/录像/剪辑/图片下载 | ✅ |
| 通知 | 消息中心顶部引导条 | ✅ |

---

### 汇总

- **✅ 已实现 60+ 项**:全部 P0/P1 状态落地,视觉严格沿用 App 规范(白卡 22 圆角弹窗、白胶囊 toast + 状态圆标、软色圆底空/错态、深色播放器态、h54 胶囊按钮)。
- **⏸ 暂缓 7 项**:强更页(无需求)、第三方登录真实报错、封面占位、消息分页、云台边界/码流切换、帮助中心与用户信息后端化 —— 均已有对应组件/模式,接入时照搬即可。
- **演示入口**:我的 → Setting → **State Preview**(分组开关 + 一次性事件 + Reset All)。搜索超时、扫码超时、下载/格式化/OTA 进度、预设位上限、验证码 000000 等为自然触发,无需开关。
- **接入指引**:全局搜索 `getDemoFlags()` / `useDemoFlags()` 即为全部后端接入点;`guardSave`(kit.tsx)是设置项统一保存出口。

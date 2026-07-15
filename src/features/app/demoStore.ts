// 演示用「概率性状态」开关 store —— 对应 docs/edge-states-checklist.md。
// 接入后端前,这些 flag 由 State Preview 页手动打开来演示各失败/空态;
// 接入后端后,把读 flag 的位置换成真实请求结果即可。
import { useSyncExternalStore } from 'react';

export type DemoFlags = {
  offline: boolean; // 断网:全局顶部提示条 + 发送/加载失败
  failOps: boolean; // 写操作失败:保存/删除/开关/上传 → 错误 toast + 回滚
  failLoad: boolean; // 列表加载失败:整页错误态 + Retry
  failStream: boolean; // 直播/回放拉流失败:播放器内错误 + 重试
  deviceOffline: boolean; // 设备详情:离线占位
  permsDenied: boolean; // 系统权限被拒:麦克风/相册/蓝牙/定位/通知 引导弹窗
  noDevices: boolean; // 设备列表空态
  emptyDay: boolean; // 回放:当日无录像
  noSdCard: boolean; // 回放:未插 SD 卡
  cloudExpired: boolean; // 回放:云存过期
  btOff: boolean; // 配网:手机蓝牙未开启
  alreadyBound: boolean; // 配网:设备已被其他账号绑定
  bindFail: boolean; // 配网:连接失败(Connecting → Fail)
  otaUpdate: boolean; // 固件:有新版本
};

const DEFAULTS: DemoFlags = {
  offline: false,
  failOps: false,
  failLoad: false,
  failStream: false,
  deviceOffline: false,
  permsDenied: false,
  noDevices: false,
  emptyDay: false,
  noSdCard: false,
  cloudExpired: false,
  btOff: false,
  alreadyBound: false,
  bindFail: false,
  otaUpdate: false,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const sub = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

let flags: DemoFlags = { ...DEFAULTS };

export const useDemoFlags = () => useSyncExternalStore(sub, () => flags);
export const getDemoFlags = () => flags;

export function setDemoFlag<K extends keyof DemoFlags>(key: K, value: boolean) {
  flags = { ...flags, [key]: value };
  emit();
}

export function resetDemoFlags() {
  flags = { ...DEFAULTS };
  emit();
}

/* ---- 登录态过期(全局弹窗触发器) ---- */
let sessionExpired = false;

export const useSessionExpired = () => useSyncExternalStore(sub, () => sessionExpired);

export function triggerSessionExpired() {
  sessionExpired = true;
  emit();
}

export function clearSessionExpired() {
  sessionExpired = false;
  emit();
}

// 首页 Talk → 设备详情自动开启对讲的一次性意图标记。
// DevHome 点击 Talk 时 requestTalk(),DevDetail 获焦时 consumeTalkIntent() 消费。
let pending = false;

export function requestTalk() {
  pending = true;
}

export function consumeTalkIntent(): boolean {
  const v = pending;
  pending = false;
  return v;
}

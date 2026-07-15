// 全局 toast store —— 任意页面 showToast() 即可,AppToastHost 挂在 App 根部渲染。
import { useSyncExternalStore } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';
export type ToastMsg = { id: number; text: string; variant: ToastVariant };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const sub = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

let current: ToastMsg | null = null;
let seq = 0;
let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastMsg = () => useSyncExternalStore(sub, () => current);

export function showToast(text: string, variant: ToastVariant = 'success') {
  current = { id: ++seq, text, variant };
  emit();
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    emit();
  }, variant === 'error' ? 2400 : 1800);
}

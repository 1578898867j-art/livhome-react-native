import { useEffect, useRef, useState } from 'react';

export type AssistantMode = 'empty' | 'conv';
export type ConversationGroupLabel = 'Today' | 'Yesterday' | 'Within 30 days';
export type ConversationListItem = { id: number; name: string; grp: ConversationGroupLabel };

export const CONVERSATION_GROUPS: ConversationGroupLabel[] = ['Today', 'Yesterday', 'Within 30 days'];

const INITIAL_CONVERSATIONS: ConversationListItem[] = [
  { id: 1, name: "Today's home summary", grp: 'Today' },
  { id: 2, name: 'Any alerts overnight?', grp: 'Today' },
  { id: 3, name: 'Set a daily check-in', grp: 'Yesterday' },
  { id: 4, name: 'Front door notifications', grp: 'Yesterday' },
  { id: 5, name: 'Night vision setup', grp: 'Within 30 days' },
  { id: 6, name: 'Notify family on alerts', grp: 'Within 30 days' },
];

export function useAssistantPrototype() {
  const [mode, setMode] = useState<AssistantMode>('empty');
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearThinkingTimer = () => {
    if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
    thinkingTimer.current = null;
  };

  useEffect(() => clearThinkingTimer, []);

  const send = () => {
    clearThinkingTimer();
    setDraft('');
    setMode('conv');
    setThinking(true);
    thinkingTimer.current = setTimeout(() => setThinking(false), 800);
  };

  const reset = () => {
    clearThinkingTimer();
    setMode('empty');
    setThinking(false);
    setDraft('');
  };

  const openConversation = () => {
    clearThinkingTimer();
    setThinking(false);
    setMode('conv');
  };

  const renameConversation = (id: number | null, name: string) => {
    const nextName = name.trim();
    if (id === null || !nextName) return;
    setConversations((items) => items.map((item) => (
      item.id === id ? { ...item, name: nextName } : item
    )));
  };

  const deleteConversation = (id: number | null) => {
    if (id === null) return;
    setConversations((items) => items.filter((item) => item.id !== id));
  };

  return {
    conversations,
    deleteConversation,
    draft,
    mode,
    openConversation,
    renameConversation,
    reset,
    send,
    setDraft,
    thinking,
  };
}

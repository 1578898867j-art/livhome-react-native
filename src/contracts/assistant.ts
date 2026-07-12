import type { EntityId, ISODateTime } from './common';

export type AssistantRole = 'user' | 'assistant';
export type ConversationGroup = 'today' | 'yesterday' | 'within-30-days';

export type ConversationSummary = {
  id: EntityId;
  title: string;
  group: ConversationGroup;
  updatedAt: ISODateTime;
};

export type AssistantMessage = {
  id: EntityId;
  conversationId: EntityId;
  role: AssistantRole;
  content: string;
  createdAt: ISODateTime;
};

export type SendAssistantMessageInput = {
  conversationId?: EntityId;
  content: string;
};

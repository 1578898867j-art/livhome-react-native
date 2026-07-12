import type { EntityId, ISODateTime } from './common';

export type UserProfile = {
  id: EntityId;
  email: string;
  displayName: string;
  avatarUrl?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: ISODateTime;
  user: UserProfile;
};

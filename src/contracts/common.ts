export type EntityId = string;
export type ISODateTime = string;

export type PageRequest = {
  cursor?: string;
  limit?: number;
};

export type PageResult<T> = {
  items: T[];
  nextCursor?: string;
};

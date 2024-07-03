// src/database/types.ts
import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type GeneratedNullable<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S | null, I | undefined, U | null>
    : ColumnType<T | null, T | undefined, T | null>;

export interface Users {
  id: Generated<number>;
  user_name: string;
}

export interface Templates {
  id: ColumnType<number | null, number | undefined, number | null>;
  message_template: string;
}

export interface Sprints {
  id: Generated<number>;
  sprint_code: string;
  sprint_name: string;
}

export interface Messages {
  id: GeneratedNullable<number>;
  user_id: number;
  template_id: number;
  sprint_id: number;
  timestamp: Generated<string>;
}

export interface DB {
  messages: Messages;
  sprints: Sprints;
  templates: Templates;
  users: Users;
}

// Type for update operations
export type TemplatesUpdate = {
  [K in keyof Templates]: Templates[K] extends ColumnType<
    infer S,
    infer I,
    infer U
  >
    ? S | I | U
    : Templates[K];
};

export type UsersUpdate = {
  [K in keyof Users]: Users[K] extends ColumnType<infer S, infer I, infer U>
    ? S | I | U
    : Users[K];
};

export type MessagesUpdate = {
  [K in keyof Messages]: Messages[K] extends ColumnType<
    infer S,
    infer I,
    infer U
  >
    ? S | I | U
    : Messages[K];
};

export type SprintsUpdate = {
  [K in keyof Sprints]: Sprints[K] extends ColumnType<infer S, infer I, infer U>
    ? S | I | U
    : Sprints[K];
};

export type InsertableMessage = {
  user_id: number;
  template_id: number;
  sprint_id: number;
  timestamp: string;
};

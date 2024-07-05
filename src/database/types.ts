import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface Messages {
  id: Generated<number | null>;
  user_id: number;
  template_id: number;
  sprint_id: number;
  timestamp: Generated<string>;
}

export interface Sprints {
  id: Generated<number>;
  sprint_code: string;
  sprint_name: string;
}

export interface Templates {
  id: Generated<number | null>;
  message_template: string;
}

export interface Users {
  id: Generated<number>;
  user_name: string;
}

export interface DB {
  messages: Messages;
  sprints: Sprints;
  templates: Templates;
  users: Users;
}

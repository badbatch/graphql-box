import { PlainObjectMap } from "@handl/core";

export interface QueryDatabaseArgs {
  cmd: string;
  key?: number;
  value?: any;
}

export interface Inbox {
  emails: Email[];
  id: number;
  total: number;
  unread: number;
}

export interface Email {
  from: string;
  id: number;
  message?: string;
  subject?: string;
  unread: boolean;
}

export interface EmailInput {
  from: string;
  message?: string;
  subject?: string;
}

export interface RequestAndOptions {
  options: PlainObjectMap;
  request: string;
}

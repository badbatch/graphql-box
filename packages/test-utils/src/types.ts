import { type OperationOptions } from '@graphql-box/core';

export interface RawOperationAndOptions {
  operation: string;
  options: OperationOptions;
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

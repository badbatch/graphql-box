import { type PlainObject } from '@graphql-box/core';
import { EMAILS_DELETED, EMAIL_ADDED } from '../constants.ts';
import { type EmailInput } from '../types.ts';
import { addEmail, deleteEmails, getInbox } from './database.ts';
import { publish, subscribe } from './pubsub.ts';

export const resolvers = {
  Mutation: {
    addEmail: (_obj: PlainObject, { input }: { input: EmailInput }) => {
      addEmail(input);
      const result = getInbox();
      publish(EMAIL_ADDED, result);
      return result;
    },
    deleteEmails: (_obj: PlainObject, { id }: { id?: number }) => {
      deleteEmails(id);
      const result = getInbox();
      publish(EMAILS_DELETED, result);
      return result;
    },
  },
  Query: {
    inbox: () => getInbox(),
  },
  Subscription: {
    emailAdded: {
      resolve: (obj: PlainObject) => obj,
      subscribe: () => subscribe(EMAIL_ADDED),
    },
    emailsDeleted: {
      resolve: (obj: PlainObject) => obj,
      subscribe: () => subscribe(EMAILS_DELETED),
    },
  },
};

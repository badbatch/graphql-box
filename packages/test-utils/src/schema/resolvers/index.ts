import { PlainObjectMap } from "@graphql-box/core";
import { EMAILS_DELETED, EMAIL_ADDED } from "../../consts";
import { EmailInput } from "../../defs";
import { addEmail, deleteEmails, getInbox } from "../database";
import { publish, subscribe } from "../pubsub";

const resolvers = {
  Mutation: {
    addEmail: (_obj: PlainObjectMap, { input }: { input: EmailInput }) => {
      addEmail(input);
      const result = getInbox();
      publish(EMAIL_ADDED, result);
      return result;
    },
    deleteEmails: (_obj: PlainObjectMap, { id }: { id?: number }) => {
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
      resolve: (obj: PlainObjectMap) => obj,
      subscribe: () => subscribe(EMAIL_ADDED),
    },
    emailsDeleted: {
      resolve: (obj: PlainObjectMap) => obj,
      subscribe: () => subscribe(EMAILS_DELETED),
    },
  },
};

export default resolvers;

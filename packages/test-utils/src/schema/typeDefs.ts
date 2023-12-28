export const typeDefs = `
  type Email {
    from: String!
    id: Int!
    message: String
    subject: String
    unread: Boolean!
  }

  input EmailInput {
    from: String!
    message: String
    subject: String
  }

  type Inbox {
    emails: [Email]!
    id: Int!
    total: Int!
    unread: Int!
  }

  type Subscription {
    emailAdded: Inbox
    emailsDeleted: Inbox
  }

  type Mutation {
    addEmail(input: EmailInput!): Inbox
    deleteEmails(id: Int): Inbox
  }

  type Query {
    inbox: Inbox!
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

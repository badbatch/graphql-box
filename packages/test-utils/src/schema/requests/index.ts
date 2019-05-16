export const addEmail = `
  mutation ($input: EmailInput!) {
    addEmail(input: $input) {
      emails {
        from
        message
        subject
        unread
      }
      total
      unread
    }
  }
`;

export const deleteEmail = `
  mutation ($id: Int) {
    deleteEmails(id: $id) {
      emails {
        from
        message
        subject
        unread
      }
      total
      unread
    }
  }
`;

export const emailAdded = `
  subscription {
    emailAdded {
      emails {
        from
        message
        subject
        unread
      }
      total
      unread
    }
  }
`;

export const emailsDeleted = `
  subscription {
    emailsDeleted {
      emails {
        from
        message
        subject
        unread
      }
      total
      unread
    }
  }
`;

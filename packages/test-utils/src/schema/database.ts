import { type EmailInput, type Inbox } from '../types.ts';

const inbox: Inbox = {
  emails: [
    {
      from: 'alfa@gmail.com',
      id: 1,
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      subject: 'Hi, this is Alfa',
      unread: false,
    },
    {
      from: 'bravo@gmail.com',
      id: 2,
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      subject: 'Hi, this is Bravo',
      unread: false,
    },
    {
      from: 'charlie@gmail.com',
      id: 3,
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      subject: 'Hi, this is Charlie',
      unread: false,
    },
  ],
  id: 1,
  total: 3,
  unread: 0,
};

let emailID = 3;

export const getInbox = (): Inbox => {
  return inbox;
};

const getUnread = (): number => {
  return inbox.emails.filter(email => !!email.unread).length;
};

export const addEmail = (email: EmailInput): void => {
  emailID += 1;

  inbox.emails.push({
    ...email,
    id: emailID,
    unread: true,
  });

  inbox.total = inbox.emails.length;
  inbox.unread = getUnread();
};

export const deleteEmails = (id?: number): void => {
  if (id) {
    const index = inbox.emails.findIndex(email => email.id === id);
    inbox.emails.splice(index, 1);
  } else {
    inbox.emails = [];
  }

  inbox.total = inbox.emails.length;
  inbox.unread = getUnread();
};

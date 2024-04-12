import { type ReactNode } from 'react';

export type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
};

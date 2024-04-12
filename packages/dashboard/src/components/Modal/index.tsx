import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { reader } from '../../locales/reader.ts';
import { type ModalProps } from './types.ts';

const common = reader.scope('common');

export const Modal = ({ children, onClose, open = false }: ModalProps) => (
  <Dialog
    maxWidth="lg"
    onClose={onClose}
    open={open}
    sx={{
      '> .MuiDialog-container > .MuiPaper-root': {
        borderBottom: '2rem solid #fff',
        borderTop: '2rem solid #fff',
        overflowY: 'visible',
        padding: '0px 2.5rem 0px 2rem',
      },
    }}
    transitionDuration={{ exit: 0 }}
  >
    <IconButton
      aria-label={common.read('close')}
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: '0.3rem',
        top: '-1.6rem',
        zIndex: 1,
      }}
    >
      <Close />
    </IconButton>
    <DialogContent
      sx={{
        '> .MuiPaper-root': {
          boxShadow: 'none',
          padding: 0,
        },
        padding: 0,
        width: '100%',
      }}
    >
      {children}
    </DialogContent>
  </Dialog>
);

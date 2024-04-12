import { styled } from '@mui/material';

export const RequestGroupWrapper = styled('div')(() => ({
  backgroundColor: '#eee',
  borderRadius: '4px',
  display: 'inline-flex',
  height: '7rem',
  marginBottom: '0.5rem',
  width: '100%',
}));

export const ScrollWrapper = styled('div')(() => ({
  '> li': {
    '&:last-child': {
      marginRight: '0.5rem',
    },
    marginLeft: '0.5rem',
  },
  display: 'inline-flex',
  height: '100%',
  overflowX: 'scroll',
  overflowY: 'hidden',
  width: '100%',
}));

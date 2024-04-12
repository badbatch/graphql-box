import { styled } from '@mui/material';

export const ScrollWrapper = styled('div')(() => ({
  '> li': { margin: '0.5rem 0' },
  height: '7rem',
  overflowY: 'scroll',
}));

import { styled } from '@mui/material';

export const Container = styled('div', { shouldForwardProp: prop => prop !== 'showMore' })<{ showMore: boolean }>(
  ({ showMore }) => ({
    maxHeight: showMore ? 'none' : '80px',
    overflow: 'hidden',
    position: 'relative',
  })
);

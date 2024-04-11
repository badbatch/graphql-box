import { styled } from '@mui/material';
import { type TimeWindowProps } from './types.ts';

export const Container = styled('div', { shouldForwardProp: prop => prop !== 'layout' })<{
  layout: TimeWindowProps['layout'];
}>(({ layout }) => ({
  display: 'flex',
  ...(layout === 'inline'
    ? {
        '> div': {
          marginRight: '0.5rem',
        },
        '> div:last-child': {
          marginRight: '0',
        },
        alignItems: 'center',
      }
    : {
        flexDirection: 'column',
      }),
}));

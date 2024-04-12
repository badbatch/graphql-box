import { styled } from '@mui/material';

export const DiffsContainer = styled('div')({
  display: 'flex',
});

export const DiffContainer = styled('div')({
  ':last-child': {
    marginRight: 0,
  },
  marginRight: '1rem',
});

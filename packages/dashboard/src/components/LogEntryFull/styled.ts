import { styled } from '@mui/material';

export const DescList = styled('dl')(() => ({
  display: 'grid',
  gap: '4px',
  gridTemplateColumns: '25% 75%',
  margin: 0,
  width: '100%',
}));

export const DescName = styled('dt')(() => ({
  backgroundColor: '#f6f8fa',
  padding: '0 0.5rem',
}));

import { styled } from '@mui/material';

export const Pre = styled('pre', { shouldForwardProp: prop => prop !== 'size' })<{ size?: 'lg' | 'sm' }>(
  ({ size = 'lg' }) => ({
    '::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',
    backgroundColor: '#fff',
    borderLeft: size === 'lg' ? '0.5rem solid #f6f8fa' : 'none',
    borderRight: size === 'lg' ? '0.5rem solid #f6f8fa' : 'none',
    margin: 0,
    overflowX: 'scroll',
    paddingBottom: size === 'lg' ? '0.2rem' : undefined,
    paddingTop: size === 'lg' ? '0.2rem' : undefined,
    scrollbarWidth: 'none',
    span: {
      fontSize: size === 'lg' ? '1rem' : '0.7rem',
    },
  })
);

export const Line = styled('div', {
  shouldForwardProp: prop => prop !== 'diff' && prop !== 'diffType' && prop !== 'size',
})<{ diff: boolean; diffType?: 'add' | 'remove'; size?: 'lg' | 'sm' }>(({ diff, diffType, size }) => ({
  backgroundColor:
    // eslint-disable-next-line no-nested-ternary
    diffType === 'add' ? 'rgba(51,153,51,.1)' : diffType === 'remove' ? 'rgba(172,0,0,.1)' : undefined,
  lineHeight: size === 'sm' ? 1 : undefined,
  paddingLeft: diff ? '0.5rem' : undefined,
  paddingRight: diff ? '0.5rem' : undefined,
}));

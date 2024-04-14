import { styled } from '@mui/material';

export const Header = styled('header')({
  alignItems: 'center',
  display: 'flex',
  marginBottom: '1rem',
});

export const ListingsContainer = styled('div', { shouldForwardProp: prop => prop !== 'fitersOpen' })<{
  fitersOpen: boolean;
}>(({ fitersOpen }) => ({
  '> .request-group-summaries': {
    gridColumnStart: fitersOpen ? 2 : 1,
  },
  '> .request-group-summary-headings': {
    gridColumnStart: fitersOpen ? 2 : 1,
    gridRowStart: 1,
  },
  '> form': {
    borderRight: '1px solid #ddd',
    display: fitersOpen ? 'block' : 'none',
    gridRowEnd: 3,
    gridRowStart: 1,
    paddingRight: '0.5rem',
    paddingTop: '0.5rem',
    position: 'sticky',
    top: '3.6rem',
  },
  alignItems: 'start',
  display: 'grid',
  gridColumnGap: '0.5rem',
  gridTemplateColumns: fitersOpen ? '320px minmax(0, 1fr)' : 'minmax(0, 1fr)',
  gridTemplateRows: 'minmax(1rem, max-content)',
  minHeight: '20rem',
}));

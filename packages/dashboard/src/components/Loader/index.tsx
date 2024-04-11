import { CircularProgress } from '@mui/material';
import { Container } from './styled.ts';
import { type LoaderProps } from './types.ts';

export const Loader = ({ size = 50, sx }: LoaderProps) => (
  <Container sx={sx}>
    <CircularProgress size={size} />
  </Container>
);

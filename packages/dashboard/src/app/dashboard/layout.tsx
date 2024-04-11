import { Container, Typography, useTheme } from '@mui/material';
import { type ReactNode } from 'react';
import { GraphqlBoxLogo } from '../../svgs/GraphqlBoxLogo.tsx';
import { Header } from './styled.ts';

const DashboardLayout = (props: { children: ReactNode }) => {
  const { children } = props;
  const theme = useTheme();

  return (
    <Container
      maxWidth={false}
      sx={{
        paddingBottom: theme.spacing(8),
        paddingTop: theme.spacing(2),
      }}
    >
      <Header>
        <GraphqlBoxLogo />
        <Typography component="h1" sx={{ marginLeft: '0.2rem' }} variant="h4">
          GraphQL
          <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Box</span>
        </Typography>
      </Header>
      {children}
    </Container>
  );
};

// nextjs requires this to be default export
// eslint-disable-next-line import/no-default-export
export default DashboardLayout;

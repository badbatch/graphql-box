'use client';

import { type ReactNode } from 'react';
import { AppScaffold } from '../components/AppScaffold/AppScaffold.tsx';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <AppScaffold>{children}</AppScaffold>
      </body>
    </html>
  );
};

// nextjs requires this to be default export
// eslint-disable-next-line import/no-default-export
export default RootLayout;

import { type SxProps, type Theme } from '@mui/material';
import { type ReactNode } from 'react';

export type NavBarProps = {
  children: ReactNode;
  position: 'bottom' | 'top';
  sx?: SxProps<Theme>;
};

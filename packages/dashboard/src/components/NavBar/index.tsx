import { NavBarContainer } from './styled.ts';
import { type NavBarProps } from './types.ts';

export const NavBar = ({ children, position, sx = {} }: NavBarProps) => (
  <NavBarContainer
    sx={{
      [position]: 0,
      ...sx,
    }}
  >
    {children}
  </NavBarContainer>
);

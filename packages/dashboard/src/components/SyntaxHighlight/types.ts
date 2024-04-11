import { type Language, type PrismTheme } from 'prism-react-renderer';
import { type CSSProperties, type RefObject } from 'react';

export type SyntaxHightlightProps = {
  code: string;
  diff?: boolean;
  forwardRef?: RefObject<HTMLPreElement>;
  language: Language;
  size?: 'sm' | 'lg';
  styleOverrides?: CSSProperties;
  theme?: PrismTheme;
};

import Highlight, { defaultProps } from 'prism-react-renderer';
import github from 'prism-react-renderer/themes/github';
import { Line, Pre } from './styled.ts';
import { type SyntaxHightlightProps } from './types.ts';

export const SyntaxHighlight = ({
  code,
  diff = false,
  forwardRef,
  language,
  size = 'lg',
  styleOverrides = {},
  theme = github,
}: SyntaxHightlightProps) => (
  <Highlight {...defaultProps} code={code} language={language} theme={theme}>
    {({ className, getLineProps, getTokenProps, style, tokens }) => (
      <Pre className={className} ref={forwardRef} size={size} style={{ ...style, ...styleOverrides }}>
        {tokens.map((line, i) => (
          <Line
            diff={diff}
            diffType={
              line[0]?.content.startsWith('+') ? 'add' : line[0]?.content.startsWith('-') ? 'remove' : undefined
            }
            size={size}
            {...getLineProps({ key: i, line })}
          >
            {line.map((token, key) => (
              <span {...getTokenProps({ key, token })} />
            ))}
          </Line>
        ))}
      </Pre>
    )}
  </Highlight>
);

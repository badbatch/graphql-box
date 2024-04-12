import { Difference } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { requestVersionDialog } from '../../features/ui/slice.ts';
import { reader } from '../../locales/reader.ts';
import { CopyToClipboard } from '../CopyToClipboard/index.tsx';
import { ShowMore } from '../ShowMore/index.tsx';
import { SyntaxHighlight } from '../SyntaxHighlight/index.tsx';
import { DescValue } from './styled.ts';
import { type LogEntryFullDescValueProps } from './types.ts';

const button = reader.scope('logEntryFullDescValue.button');

export const LogEntryFullDescValue = ({ code, descKey, language }: LogEntryFullDescValueProps) => {
  const elementRef = useRef<HTMLPreElement>(null);
  const dispatch = useDispatch();
  const ariaLabel = button.read('ariaLabel');

  return (
    <DescValue>
      <ShowMore>
        <>
          <SyntaxHighlight
            code={code}
            forwardRef={elementRef}
            language={language}
            styleOverrides={{ marginRight: '2rem' }}
          />
          {language === 'graphql' ? (
            <IconButton
              aria-label={ariaLabel}
              onClick={() => {
                dispatch(requestVersionDialog(descKey));
              }}
              size="small"
              sx={{ bottom: '1.7rem', position: 'absolute', right: '0.3rem' }}
            >
              <Difference sx={{ fontSize: '1rem' }} titleAccess={ariaLabel} />
            </IconButton>
          ) : null}
          <CopyToClipboard copyTargetRef={elementRef} />
        </>
      </ShowMore>
    </DescValue>
  );
};

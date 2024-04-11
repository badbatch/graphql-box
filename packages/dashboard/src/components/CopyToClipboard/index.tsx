import { ContentCopy } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { reader } from '../../locales/reader.ts';
import { type CopyToClipboardProps } from './types.ts';

const copyToClipboard = reader.scope('copyToClipboard');

export const CopyToClipboard = ({ copyTargetRef }: CopyToClipboardProps) => {
  const ariaLabel = copyToClipboard.read('ariaLabel');

  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={() => {
        if (copyTargetRef.current) {
          const { children } = copyTargetRef.current;

          let content = [...children]
            .map(child => child.textContent)
            .filter(entry => !!entry)
            .join('\n');

          if (content.startsWith('"') && content.endsWith('"')) {
            content = content.slice(1, -1);
          }

          void window.navigator.clipboard.writeText(content);
        }
      }}
      size="small"
      sx={{ bottom: '0.1rem', position: 'absolute', right: '0.3rem' }}
    >
      <ContentCopy sx={{ fontSize: '1rem' }} titleAccess={ariaLabel} />
    </IconButton>
  );
};

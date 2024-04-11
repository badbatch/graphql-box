import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useLayoutEffect, useRef, useState } from 'react';
import { reader } from '../../locales/reader.ts';
import { Container } from './styled.ts';
import { type ShowMoreProps } from './types.ts';

const common = reader.scope('common');

export const ShowMore = ({ children }: ShowMoreProps) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const isTextClamped = ref.current.scrollHeight > ref.current.clientHeight;

      if (isTextClamped) {
        setShowMore(true);
      }
    }
  }, []);

  const KeyboardArrow = open ? KeyboardArrowUp : KeyboardArrowDown;
  const ariaLabel = open ? common.read('close') : common.read('open');

  return (
    <Container ref={ref} showMore={open}>
      {showMore ? (
        <IconButton
          aria-label={ariaLabel}
          onClick={() => setOpen(!open)}
          sx={{ position: 'absolute', right: '2.2rem', top: '0.2rem' }}
        >
          <KeyboardArrow />
        </IconButton>
      ) : undefined}
      {children}
    </Container>
  );
};

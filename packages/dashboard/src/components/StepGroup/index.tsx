import { Badge, List } from '@mui/material';
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectStepById } from '../../features/steps/slice.ts';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver/index.ts';
import { type Store } from '../../types.ts';
import { LogEntryBrief } from '../LogEntryBrief/index.tsx';
import { ScrollWrapper } from './styled.ts';
import { type StepGroupProps } from './types.ts';

export const StepGroup = ({ stepId }: StepGroupProps) => {
  const step = useSelector((state: Store) => selectStepById(state, stepId));
  const intersectionRootRef = useRef<HTMLUListElement>(null);

  const [firstElementRef, isFirstElementVisible] = useIntersectionObserver<HTMLLIElement>({
    root: intersectionRootRef.current,
    threshold: 1,
  });

  const [lastElementRef, isLastElementVisible] = useIntersectionObserver<HTMLLIElement>({
    root: intersectionRootRef.current,
    threshold: 1,
  });

  if (!step) {
    return null;
  }

  const dependencyKey = JSON.stringify(step.entries);

  const memoListItems = useMemo(
    () =>
      step.entries.map((logId, index) => {
        // eslint-disable-next-line no-nested-ternary
        const ref = index === 0 ? firstElementRef : index === step.entries.length - 1 ? lastElementRef : undefined;

        return (
          <li key={logId} ref={ref}>
            <LogEntryBrief logId={logId} />
          </li>
        );
      }),
    [dependencyKey, firstElementRef, lastElementRef] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <List
      data-componentName="StepGroup"
      ref={intersectionRootRef}
      sx={{
        display: 'inline-block',
        height: '7rem',
        padding: 0,
        position: 'relative',
        width: '15rem',
        ...(step.entries.length > 1
          ? {
              '&::after': {
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.2))',
                bottom: 0,
                opacity: isLastElementVisible ? 0 : 1,
              },
              '&::before': {
                background: 'linear-gradient(to top, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.2))',
                opacity: isFirstElementVisible ? 0 : 1,
                top: 0,
              },
              '&::before,&::after': {
                content: '""',
                height: '0.5rem',
                left: 0,
                position: 'absolute',
                right: 0,
                transition: 'opacity 0.1s',
                zIndex: 1,
              },
            }
          : {}),
      }}
    >
      {step.entries.length > 1 ? (
        <Badge
          badgeContent={step.entries.length}
          sx={{
            '.MuiBadge-badge': { backgroundColor: '#282a36', color: '#fff', opacity: '0.7' },
            position: 'absolute',
            right: '10px',
            top: '12px',
          }}
        />
      ) : null}
      <ScrollWrapper>{memoListItems}</ScrollWrapper>
    </List>
  );
};

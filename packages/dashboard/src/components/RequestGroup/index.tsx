import { List } from '@mui/material';
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectRequestGroupById } from '../../features/requestGroups/slice.ts';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver/index.ts';
import { type Store } from '../../types.ts';
import { EnvGroup } from '../EnvGroup/index.tsx';
import { RequestGroupWrapper, ScrollWrapper } from './styled.ts';
import { type RequestGroupProps } from './types.ts';

export const RequestGroup = ({ requestGroupId }: RequestGroupProps) => {
  const requestGroup = useSelector((state: Store) => selectRequestGroupById(state, requestGroupId));
  const intersectionRootRef = useRef<HTMLUListElement>(null);

  const [firstElementRef, isFirstElementVisible] = useIntersectionObserver<HTMLLIElement>({
    root: intersectionRootRef.current,
    threshold: 1,
  });

  const [lastElementRef, isLastElementVisible] = useIntersectionObserver<HTMLLIElement>({
    root: intersectionRootRef.current,
    threshold: 1,
  });

  if (!requestGroup) {
    return null;
  }

  const dependencyKey = JSON.stringify(requestGroup.envs);

  const memoListItems = useMemo(
    () =>
      requestGroup.envs.map((envId, index) => {
        const ref =
          // eslint-disable-next-line no-nested-ternary
          index === 0 ? firstElementRef : index === requestGroup.envs.length - 1 ? lastElementRef : undefined;

        return (
          <li key={envId} ref={ref}>
            <EnvGroup envId={envId} />
          </li>
        );
      }),
    [dependencyKey, firstElementRef, lastElementRef] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <RequestGroupWrapper>
      <List
        data-componentName="RequestGroup"
        sx={{
          '&::after': {
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.2))',
            opacity: isLastElementVisible ? 0 : 1,
            right: 0,
          },
          '&::before': {
            background: 'linear-gradient(to left, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.2))',
            left: 0,
            opacity: isFirstElementVisible ? 0 : 1,
          },
          '&::before,&::after': {
            bottom: 0,
            content: '""',
            position: 'absolute',
            top: 0,
            transition: 'opacity 0.1s',
            width: '0.5rem',
            zIndex: 1,
          },
          overflow: 'hidden',
          padding: 0,
          width: '100%',
        }}
      >
        <ScrollWrapper>{memoListItems}</ScrollWrapper>
      </List>
    </RequestGroupWrapper>
  );
};

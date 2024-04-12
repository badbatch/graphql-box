import { List } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectEnvById } from '../../features/envs/slice.ts';
import { type Store } from '../../types.ts';
import { StepGroup } from '../StepGroup/index.tsx';
import { type EnvGroupProps } from './types.ts';

export const EnvGroup = ({ envId }: EnvGroupProps) => {
  const env = useSelector((state: Store) => selectEnvById(state, envId));

  if (!env) {
    return null;
  }

  return (
    <List
      data-componentName="EnvGroup"
      sx={{
        '> li': { marginRight: '0.5rem' },
        '> li:last-child': { marginRight: 0 },
        display: 'inline-flex',
        height: '100%',
        padding: 0,
      }}
    >
      {env.steps.map(stepId => (
        <li key={stepId} style={{ position: 'relative' }}>
          <StepGroup stepId={stepId} />
        </li>
      ))}
    </List>
  );
};

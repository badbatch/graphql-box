import { Typography } from '@mui/material';
import { get } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectLogById } from '../../features/logs/slice.ts';
import { type Store } from '../../types.ts';
import { SyntaxHighlight } from '../SyntaxHighlight/index.tsx';
import { generateCode } from './helpers/generateCode.ts';
import { DiffContainer, DiffsContainer } from './styled.ts';
import { type RequestVersionDiffProps } from './types.ts';

export const RequestVersionDiff = ({ requestDiff }: RequestVersionDiffProps) => {
  const [logId, activeRequestVersion, compareToVersion] = requestDiff;
  const logEntry = useSelector((state: Store) => selectLogById(state, logId));
  const activeRequest = get(logEntry, activeRequestVersion) as string;
  const compareToRequest = get(logEntry, compareToVersion) as string;
  const [[activeDiff, compareToDiff], setCode] = useState(['', '']);

  useEffect(() => {
    setCode([generateCode(activeRequest, compareToRequest, true), generateCode(activeRequest, compareToRequest)]);
  }, [activeRequest, compareToRequest]);

  return (
    <DiffsContainer>
      <DiffContainer>
        <Typography sx={{ marginBottom: '0.5rem' }} variant="h6">
          {activeRequestVersion}
        </Typography>
        <SyntaxHighlight code={activeDiff} diff language="graphql" />
      </DiffContainer>
      <DiffContainer>
        <Typography sx={{ marginBottom: '0.5rem' }} variant="h6">
          {compareToVersion}
        </Typography>
        <SyntaxHighlight code={compareToDiff} diff language="graphql" />
      </DiffContainer>
    </DiffsContainer>
  );
};

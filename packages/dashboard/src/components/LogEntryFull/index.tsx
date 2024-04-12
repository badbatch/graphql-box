import { Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type ValueOf } from 'type-fest';
import { selectLogById } from '../../features/logs/slice.ts';
import { requestDiffModal, requestVersionDialog } from '../../features/ui/slice.ts';
import { type LogEntry, type Store } from '../../types.ts';
import { DiffSelectDialog } from '../DiffSelectDialog/index.tsx';
import { LogEntryFullDescValue } from '../LogEntryFullDescValue/index.tsx';
import { Modal } from '../Modal/index.tsx';
import { RequestVersionDiff } from '../RequestVersionDiff/index.tsx';
import { conditionallyStringify } from './helpers/conditionallyStringify.ts';
import { deriveLanguage } from './helpers/deriveLanguage.ts';
import { DescList, DescName } from './styled.ts';
import { type LogEntryFullProps } from './types.ts';

export const LogEntryFull = ({ logId }: LogEntryFullProps) => {
  const logEntry = useSelector((state: Store) => selectLogById(state, logId));
  const dispatch = useDispatch();
  const requestVersion = useSelector((state: Store) => state.ui.requestVersionDialog);
  const requestDiff = useSelector((state: Store) => state.ui.requestDiffModal);

  const memoLogEntryFull = useMemo(
    () =>
      logEntry ? (
        <Paper elevation={2} sx={{ padding: '1rem' }} variant="elevation">
          <DescList>
            {Object.keys(logEntry).map(key => {
              const descKey = key as keyof LogEntry;

              if (descKey !== 'labels' && descKey !== 'log' && descKey !== 'ecs.version') {
                return (
                  <>
                    <DescName>
                      <Typography>{descKey}</Typography>
                    </DescName>
                    <LogEntryFullDescValue
                      code={conditionallyStringify(logEntry[descKey])}
                      descKey={descKey}
                      language="javascript"
                    />
                  </>
                );
              }

              const descValue = logEntry[descKey];

              return Object.keys(descValue).map(descValueKey => {
                const language = deriveLanguage(descValueKey);
                const childDescKey = `${key}.${descValueKey}`;

                return (
                  <>
                    <DescName>
                      <Typography>{childDescKey}</Typography>
                    </DescName>
                    <LogEntryFullDescValue
                      code={conditionallyStringify(descValue[descValueKey as keyof ValueOf<LogEntry>], language)}
                      descKey={childDescKey}
                      language={language}
                    />
                  </>
                );
              });
            })}
          </DescList>
        </Paper>
      ) : undefined,
    [logId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      {memoLogEntryFull}
      <DiffSelectDialog
        activeRequestVersion={requestVersion}
        logId={logId}
        onClose={() => dispatch(requestVersionDialog(''))}
        open={!!requestVersion}
      />
      <Modal onClose={() => dispatch(requestDiffModal([]))} open={requestDiff.length > 0}>
        {requestDiff.length > 0 ? (
          <RequestVersionDiff requestDiff={requestDiff as [string, string, string]} />
        ) : undefined}
      </Modal>
    </>
  );
};

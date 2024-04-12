import { List } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { type JsonObject } from 'type-fest';
import {
  selectRequestGroupErrorMessage,
  selectRequestGroupFieldKeyValuePairs,
  selectRequestGroupFieldValueMissing,
} from '../../features/requestGroups/slice.ts';
import { type RequestGroupField, type Store } from '../../types.ts';
import { RequestGroup } from '../RequestGroup/index.tsx';
import { SyntaxHighlight } from '../SyntaxHighlight/index.tsx';
import { ListItem } from './styled.ts';
import { type RequestGroupSummaryProps } from './types.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fieldValueTransformers: Record<RequestGroupField, null | ((value: any) => string)> = {
  complexity: String,
  depth: (value: number) => (value ? String(value) : '?'),
  duration: (value: number) => (value ? String(Math.round(value * 100) / 100) : '???'),
  error: null,
  operation: null,
  operationName: null,
  origin: null,
  timestamp: null,
  variables: (value: JsonObject) => JSON.stringify(value),
};

export const RequestGroupSummary = ({ fields, requestGroupId }: RequestGroupSummaryProps) => {
  const fieldKeyValuePairs = useSelector((state: Store) =>
    selectRequestGroupFieldKeyValuePairs(state, requestGroupId, fields)
  );

  const missingValue = useSelector((state: Store) =>
    selectRequestGroupFieldValueMissing(state, requestGroupId, fields)
  );

  const error = useSelector((state: Store) => selectRequestGroupErrorMessage(state, requestGroupId));
  const [requestGroupOpen, setRequestGroupOpen] = useState(false);

  const getBackgroundColor = () => {
    if (error) {
      return '#ffdddd';
    }

    return missingValue ? '#ccc' : '#eee';
  };

  return (
    <>
      <List
        onClick={() => setRequestGroupOpen(!requestGroupOpen)}
        sx={{
          '> li': {
            '&:last-child': {
              marginRight: '1rem',
            },
            marginLeft: '1rem',
          },
          backgroundColor: getBackgroundColor(),
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'inline-flex',
          height: '100%',
          padding: 0,
          width: '100%',
        }}
      >
        {fieldKeyValuePairs.map(([key, value]) => {
          const sanitizedValue = (fieldValueTransformers[key]?.(value) ?? value) as string;

          if (!sanitizedValue) {
            return <ListItem fieldKey={key} key={key} />;
          }

          return (
            <ListItem fieldKey={key} key={key}>
              <SyntaxHighlight
                code={sanitizedValue}
                language="markdown"
                size="sm"
                styleOverrides={{ backgroundColor: getBackgroundColor() }}
              />
            </ListItem>
          );
        })}
      </List>
      {requestGroupOpen ? <RequestGroup requestGroupId={requestGroupId} /> : null}
    </>
  );
};

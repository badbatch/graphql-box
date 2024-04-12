import { List, Typography } from '@mui/material';
import { startCase } from 'lodash-es';
import { ListItem } from './styled.ts';
import { type RequestGroupSummaryHeadingsProps } from './types.ts';

export const RequestGroupSummaryHeadings = ({ fields }: RequestGroupSummaryHeadingsProps) => (
  <List
    className="request-group-summary-headings"
    sx={{
      '> li': {
        '&:last-child': {
          marginRight: '1rem',
        },
        marginLeft: '1rem',
      },
      backgroundColor: '#fff',
      borderBottom: '1px solid #ddd',
      display: 'inline-flex',
      height: '100%',
      padding: 0,
      position: 'sticky',
      top: '3.6rem',
      width: '100%',
      zIndex: 1,
    }}
  >
    {fields.map(fieldName => (
      <ListItem fieldKey={fieldName} key={fieldName}>
        <Typography variant="caption">{startCase(fieldName)}</Typography>
      </ListItem>
    ))}
  </List>
);

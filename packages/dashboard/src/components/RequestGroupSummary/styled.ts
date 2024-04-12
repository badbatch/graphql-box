import { styled } from '@mui/material';
import { getFieldSummaryWidth } from '../../helpers/getFieldSummaryWidth.ts';
import { type RequestGroupField } from '../../types.ts';

export const ListItem = styled('li', { shouldForwardProp: prop => prop !== 'fieldKey' })<{
  fieldKey: RequestGroupField;
}>(({ fieldKey }) => ({
  overflowX: 'scroll',
  width: `${getFieldSummaryWidth(fieldKey)}rem`,
}));

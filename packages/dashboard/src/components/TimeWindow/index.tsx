import { MenuItem, Select, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { reader } from '../../locales/reader.ts';
import { Container } from './styled.ts';
import { type TimeWindowProps, TimeWindowRange } from './types.ts';

const timeWindow = reader.scope('filters.timeWindow');

export const TimeWindow = ({
  ariaLabelledBy,
  errors,
  layout = 'inline',
  name,
  setFieldError,
  setFieldValue,
  value,
}: TimeWindowProps) => (
  <Container layout={layout}>
    <Select
      aria-labelledby={ariaLabelledBy}
      name={`${name}.range`}
      onChange={event => {
        void setFieldValue(`${name}.range`, event.target.value);
        setFieldError(`${name}.from`, '');
        setFieldError(`${name}.to`, '');
      }}
      size="small"
      value={value?.range ?? ''}
    >
      <MenuItem value={TimeWindowRange.LAST_15_MINS}>{timeWindow.read('last15Minutes')}</MenuItem>
      <MenuItem value={TimeWindowRange.LAST_1_HOUR}>{timeWindow.read('last1Hour')}</MenuItem>
      <MenuItem value={TimeWindowRange.LAST_24_HOURS}>{timeWindow.read('last24Hours')}</MenuItem>
      <MenuItem value={TimeWindowRange.SELECT_DATES}>{timeWindow.read('selectDates')}</MenuItem>
    </Select>
    {value?.range === TimeWindowRange.SELECT_DATES ? (
      <>
        <DesktopDatePicker
          disableFuture
          inputFormat="dd/MM/yyyy"
          label={timeWindow.read('from')}
          onChange={newValue => {
            void setFieldValue(`${name}.from`, newValue ? newValue.valueOf() : undefined);
          }}
          renderInput={props => (
            <TextField
              {...props}
              error={!!errors?.from}
              helperText={errors?.from}
              size="small"
              sx={{ marginBottom: '1rem', marginTop: '1rem' }}
            />
          )}
          value={value.from ? new Date(value.from) : undefined}
        />
        <DesktopDatePicker
          disableFuture
          inputFormat="dd/MM/yyyy"
          label={timeWindow.read('to')}
          onChange={newValue => {
            void setFieldValue(`${name}.to`, newValue ? newValue.valueOf() : undefined);
          }}
          renderInput={props => <TextField {...props} error={!!errors?.to} helperText={errors?.to} size="small" />}
          value={value.to ? new Date(value.to) : undefined}
        />
      </>
    ) : undefined}
  </Container>
);

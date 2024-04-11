import { Autocomplete, Button, Checkbox, FormControlLabel, InputLabel, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { isBoolean, isEmpty, isEqual, isString } from 'lodash-es';
import { usePathname, useRouter, useSearchParams } from 'next/navigation.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectFilteredRequestGroupErrorTypes,
  selectFilteredRequestGroupOperationNames,
} from '../../features/requestGroups/slice.ts';
import { reader } from '../../locales/reader.ts';
import { type Store } from '../../types.ts';
import { TimeWindow } from '../TimeWindow/index.tsx';
import { TimeWindowRange, type TimeWindowValue } from '../TimeWindow/types.ts';
import { getFiltersParam } from './helpers/getFiltersParam.ts';
import { schema } from './schema.ts';
import { FormField } from './styled.ts';
import { type FiltersProps, type FiltersValues } from './types.ts';

const filtersScope = reader.scope('filters');

export const Filters = ({ filters }: FiltersProps) => {
  const operationNames = useSelector((store: Store) => selectFilteredRequestGroupOperationNames(store, filters));
  const errorTypes = useSelector((store: Store) => selectFilteredRequestGroupErrorTypes(store, filters));
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams());
  const filtersParam = getFiltersParam(searchParams);

  const formik = useFormik({
    initialValues: {
      args: '',
      errorType: '',
      errors: false,
      operationName: '',
      origin: '',
      requestId: '',
      timeWindow: {
        range: TimeWindowRange.LAST_15_MINS,
      },
      ...filtersParam,
    } as FiltersValues,
    onSubmit: values => {
      const sanitizedValues = Object.entries(values).reduce<Partial<FiltersValues>>((acc, [key, value]) => {
        const propName = key as keyof FiltersValues;

        if (propName === 'timeWindow') {
          const timeWindowValue = value as TimeWindowValue;

          if (timeWindowValue.range !== TimeWindowRange.SELECT_DATES) {
            timeWindowValue.from = undefined;
            timeWindowValue.to = undefined;
          }

          if (timeWindowValue.range !== TimeWindowRange.LAST_15_MINS) {
            acc[propName] = timeWindowValue;
          }
        } else if (isString(value) && !!value && propName !== 'errors') {
          acc[propName] = value;
        } else if (isBoolean(value) && !!value && propName === 'errors') {
          acc[propName] = value;
        }

        return acc;
      }, {});

      if (!isEqual(sanitizedValues, filtersParam)) {
        if (isEmpty(sanitizedValues)) {
          searchParams.delete('filters');
        } else {
          searchParams.set('filters', JSON.stringify(sanitizedValues));
        }

        searchParams.delete('page');
        const newHref = [...searchParams].length > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
        router.push(newHref);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: schema(),
  });

  const operationNameDependencyKey = operationNames.toString();

  const operationNameOptions = useMemo(
    () => operationNames.reduce((options: { label: string }[], name) => [...options, { label: name }], []),
    [operationNameDependencyKey] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const errorTypeDependencyKey = errorTypes.toString();

  const errorTypeOptions = useMemo(
    () => errorTypes.reduce((options: { label: string }[], name) => [...options, { label: name }], []),
    [errorTypeDependencyKey] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormField>
        <InputLabel id="time-window-filter-label" shrink>
          {filtersScope.read('timeWindow.label')}
        </InputLabel>
        <TimeWindow
          ariaLabelledBy="request-id-filter-label"
          errors={formik.errors.timeWindow as { from?: string; to?: string } | undefined}
          layout="stacked"
          name="timeWindow"
          setFieldError={formik.setFieldError}
          setFieldValue={formik.setFieldValue}
          value={formik.values.timeWindow}
        />
      </FormField>
      <FormField>
        <InputLabel id="request-id-filter-label" shrink>
          {filtersScope.read('requestId.label')}
        </InputLabel>
        <TextField
          aria-labelledby="request-id-filter-label"
          fullWidth
          hiddenLabel
          name="requestId"
          onChange={formik.handleChange}
          placeholder={filtersScope.read('requestId.placeholder')}
          size="small"
          value={formik.values.requestId}
        />
      </FormField>
      <FormField>
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.errors}
              name="errors"
              onChange={event => {
                void formik.setFieldValue('errors', event.target.checked);

                if (!event.target.checked) {
                  void formik.setFieldValue('errorType', '');
                }
              }}
              sx={{ paddingBottom: 0, paddingTop: 0 }}
            />
          }
          label={filtersScope.read('errors.label')}
        />
      </FormField>
      {formik.values.errors ? (
        <FormField>
          <InputLabel id="error-type-filter-label" shrink>
            {filtersScope.read('errorType.label')}
          </InputLabel>
          <Autocomplete
            autoComplete
            filterSelectedOptions
            getOptionLabel={option => option.label}
            includeInputInList
            noOptionsText=""
            onChange={(_e, option) => {
              void formik.setFieldValue('errorType', option?.label ?? '');
            }}
            options={errorTypeOptions}
            renderInput={props => (
              <TextField
                {...props}
                aria-labelledby="error-type-filter-label"
                error={!!formik.errors.errorType}
                fullWidth
                helperText={formik.errors.errorType}
                hiddenLabel
                name="errorType"
                placeholder={filtersScope.read('errorType.placeholder')}
                size="small"
              />
            )}
            value={formik.values.errorType ? { label: formik.values.errorType } : undefined}
          />
        </FormField>
      ) : undefined}
      <FormField>
        <InputLabel id="operation-name-filter-label" shrink>
          {filtersScope.read('operationName.label')}
        </InputLabel>
        <Autocomplete
          autoComplete
          filterSelectedOptions
          getOptionLabel={option => option.label}
          includeInputInList
          noOptionsText=""
          onChange={(_e, option) => {
            void formik.setFieldValue('operationName', option?.label ?? '');
          }}
          options={operationNameOptions}
          renderInput={props => (
            <TextField
              {...props}
              aria-labelledby="operation-name-filter-label"
              error={!!formik.errors.operationName}
              fullWidth
              helperText={formik.errors.operationName}
              hiddenLabel
              name="operationName"
              placeholder={filtersScope.read('operationName.placeholder')}
              size="small"
            />
          )}
          value={formik.values.operationName ? { label: formik.values.operationName } : undefined}
        />
      </FormField>
      <FormField>
        <InputLabel id="args-filter-label" shrink>
          {filtersScope.read('args.label')}
        </InputLabel>
        <TextField
          aria-labelledby="args-filter-label"
          error={!!formik.errors.args}
          fullWidth
          helperText={formik.errors.args}
          hiddenLabel
          name="args"
          onChange={formik.handleChange}
          placeholder={filtersScope.read('args.placeholder')}
          size="small"
          value={formik.values.args}
        />
      </FormField>
      <FormField>
        <InputLabel id="origin-filter-label" shrink>
          {filtersScope.read('origin.label')}
        </InputLabel>
        <TextField
          aria-labelledby="origin-filter-label"
          error={!!formik.errors.origin}
          fullWidth
          helperText={formik.errors.origin}
          hiddenLabel
          name="origin"
          onChange={formik.handleChange}
          placeholder={filtersScope.read('origin.placeholder')}
          size="small"
          value={formik.values.origin}
        />
      </FormField>
      <div>
        <Button fullWidth sx={{ marginBottom: '0.5rem' }} type="submit" variant="contained">
          {filtersScope.read('apply')}
        </Button>
        <Button
          color="inherit"
          fullWidth
          onClick={e => {
            formik.handleReset(e);
            searchParams.delete('filters');
            searchParams.delete('page');
            const newHref = [...searchParams].length > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
            router.push(newHref);
          }}
          sx={{ marginBottom: '1rem' }}
          variant="contained"
        >
          {filtersScope.read('clear')}
        </Button>
      </div>
    </form>
  );
};

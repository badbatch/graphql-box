export const content = {
  common: {
    close: 'Close',
    open: 'Open',
  },
  copyToClipboard: {
    ariaLabel: 'Copy to clipboard',
  },
  diffSelectDialog: {
    title: {
      withFilters: 'Diff against {{activeRequestVersion}}',
      withoutFilters: 'No other versions to diff against',
    },
  },
  filters: {
    apply: 'Apply',
    args: {
      label: 'Args',
      placeholder: 'Enter args as JSON',
    },
    clear: 'Clear',
    errorType: {
      label: 'Error type',
      placeholder: 'Enter error type',
    },
    errors: {
      label: 'Only errors',
    },
    operationName: {
      label: 'Operation name',
      placeholder: 'Enter operation name',
    },
    origin: {
      label: 'Origin',
      placeholder: 'Enter origin regex',
    },
    requestId: {
      label: 'Request ID',
      placeholder: 'Enter request ID',
    },
    timeWindow: {
      from: 'From',
      label: 'Time window',
      last1Hour: 'Last 1 hour',
      last15Minutes: 'Last 15 mins',
      last24Hours: 'Last 24 hours',
      selectDates: 'Select dates',
      to: 'To',
    },
  },
  logEntryFullDescValue: {
    button: {
      ariaLabel: 'Diff against other request versions',
    },
  },
} as const;

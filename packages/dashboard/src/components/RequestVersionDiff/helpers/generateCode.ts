import { diffLines } from 'diff';

const addPrefixToEachLine = (value: string, prefix: string) =>
  value
    .split('\n')
    .map(line => (line ? `${prefix} ${line}` : line))
    .join('\n');

const addSpaceToEachLine = (value: string) =>
  value
    .split('\n')
    .map(line => (line ? `  ${line}` : line))
    .join('\n');

const addEmptyLines = (value: string) =>
  value
    .split('\n')
    .map(() => '')
    .join('\n');

export const generateCode = (compareFrom: string, compareTo: string, isActive?: boolean) => {
  const changes = diffLines(compareFrom, compareTo);

  return changes.reduce((acc, change) => {
    if (change.added) {
      return isActive ? `${acc}${addEmptyLines(change.value)}` : `${acc}${addPrefixToEachLine(change.value, '+')}`;
    }

    if (change.removed) {
      return isActive ? `${acc}${addPrefixToEachLine(change.value, '-')}` : `${acc}${addEmptyLines(change.value)}`;
    }

    return `${acc}${addSpaceToEachLine(change.value)}`;
  }, '');
};

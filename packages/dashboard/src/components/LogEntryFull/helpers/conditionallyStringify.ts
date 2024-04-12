import { type ValueOf } from 'type-fest';
import { type LogEntry, type SyntaxLang } from '../../../types.ts';

const isGraphql = (_value: ValueOf<LogEntry>, language?: SyntaxLang): _value is string => language === 'graphql';
const isJson = (_value: ValueOf<LogEntry>, language?: SyntaxLang): _value is string => language === 'json';

export const conditionallyStringify = (value: ValueOf<LogEntry>, language?: SyntaxLang) => {
  if (isGraphql(value, language)) {
    return value.trim();
  }

  if (isJson(value, language)) {
    return JSON.stringify(value, null, 2);
  }

  return JSON.stringify(value, null, 2).trim();
};

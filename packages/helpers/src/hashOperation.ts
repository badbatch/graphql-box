import { Md5 } from 'ts-md5';

export const hashOperation = (value: string): string => Md5.hashStr(value.replaceAll(/\s/g, ''));

import Logger from 'iso-logger';

const level = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
export default new Logger({ consoleOptions: { level }, winstonOptions: { level } });

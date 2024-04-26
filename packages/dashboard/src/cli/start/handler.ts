import colors from 'ansi-colors';
import { resolve } from 'node:path';
import shelljs from 'shelljs';

export type StartHandlerArgv = {
  https?: boolean;
  'log-tail-path': string;
  'module-system': string;
};

export const handler = (argv: StartHandlerArgv) => {
  const logTailPath = argv['log-tail-path'];
  const https = argv.https ?? false;
  const moduleSystem = argv['module-system'];
  const cwd = process.cwd();
  const fullLogTailPath = resolve(cwd, logTailPath);
  const envVars = `HTTPS=${String(https)} LOG_TAIL_PATH=${fullLogTailPath} NODE_ENV=production`;

  shelljs.echo(colors.blue(`logTailPath: ${logTailPath}`));
  shelljs.echo(colors.blue(`https: ${String(https)}`));
  shelljs.echo(colors.blue(`moduleSystem: ${moduleSystem}`));
  shelljs.echo(colors.blue(`cwd: ${cwd}`));
  shelljs.echo(colors.blue(`fullLogTailPath: ${fullLogTailPath}`));
  shelljs.echo(colors.blue(`envVars: ${envVars}`));

  try {
    shelljs.exec(`${envVars} next build && rollup -c ./rollup.config.cjs && node dist/${moduleSystem}/server.mjs`);
    return shelljs.exit(0);
  } catch (error: unknown) {
    shelljs.echo(colors.red(`Error: ${(error as Error).message}`));
    return shelljs.exit(1);
  }
};

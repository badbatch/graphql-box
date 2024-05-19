import colors from 'ansi-colors';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import shelljs from 'shelljs';

export type StartHandlerArgv = {
  https?: boolean;
  'log-tail-path': string;
  'monitoring-port'?: number;
  port?: number;
};

export const handler = (argv: StartHandlerArgv) => {
  const logTailPath = argv['log-tail-path'];
  const https = argv.https ?? false;
  const monitoringPort = argv['monitoring-port'] ?? 3000;
  const port = argv.port ?? 3002;
  const fullLogTailPath = resolve(process.cwd(), logTailPath);
  const envVars = `PORT=${port} HTTPS=${String(https)} LOG_TAIL_PATH=${fullLogTailPath} NODE_ENV=production`;
  const filePath = fileURLToPath(import.meta.url);
  const dashboardRootDir = resolve(filePath, '../../');

  shelljs.echo(colors.blue(`> logTailPath: ${logTailPath}`));
  shelljs.echo(colors.blue(`> https: ${String(https)}`));
  shelljs.echo(colors.blue(`> cwd: ${process.cwd()}`));
  shelljs.echo(colors.blue(`> fullLogTailPath: ${fullLogTailPath}`));
  shelljs.echo(colors.blue(`> envVars: ${envVars}`));
  shelljs.echo(colors.blue(`> filePath: ${filePath}`));
  shelljs.echo(colors.blue(`> dashboardRootDir: ${dashboardRootDir}`));
  shelljs.echo(`Changing working directory to ${dashboardRootDir}`);

  process.chdir(dashboardRootDir);
  shelljs.echo(colors.blue(`> new cwd: ${process.cwd()}`));
  const protocol = https ? 'https' : 'http';

  try {
    shelljs.exec(
      `${envVars} concurrently "wait-on tcp:${monitoringPort} && node dist/server.mjs" "wait-on tcp:${monitoringPort} open ${protocol}://localhost:${port}"`
    );

    return shelljs.exit(0);
  } catch (error: unknown) {
    shelljs.echo(colors.red(`Error: ${(error as Error).message}`));
    return shelljs.exit(1);
  }
};

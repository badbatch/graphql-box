import colors from 'ansi-colors';
import semver from 'semver';
import shelljs from 'shelljs';
import { type PackageJson } from 'type-fest';
import yargs from 'yargs';
import packageJson from '../../package.json';
import * as startCommand from './start/command.ts';

const castPackageJson = packageJson as PackageJson;

export const cli = () => {
  const skipNodeVersionCheck = (yargs.argv['skip-node-version-check'] ?? false) as boolean;
  shelljs.echo(`cli options:\n${JSON.stringify(yargs.argv, undefined, 2)}\n`);

  if (
    skipNodeVersionCheck ||
    !castPackageJson.engines?.node ||
    semver.satisfies(process.versions.node, castPackageJson.engines.node)
  ) {
    shelljs.echo('Passed node version check, initialising commands.');
    yargs.command(startCommand).help().argv;
  } else {
    shelljs.echo(
      `${colors.red(
        `Error: node version ${process.versions.node} does not satisfy package requirement of ${castPackageJson.engines.node}`
      )}`
    );

    shelljs.exit(1);
  }
};

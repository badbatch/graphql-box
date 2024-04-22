#!/usr/bin/env node

const { cli } = await import('../dist/cjs/cli.cjs'); // eslint-disable-line import/no-unresolved
cli();

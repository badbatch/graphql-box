const fs = require('node:fs');
const path = require('node:path');

const dirents = [...fs.readdirSync(path.resolve(__dirname, './packages'), { withFileTypes: true })];
const directories = dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

module.exports = {
  extends: ['@repodog/commitlint-config'],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-enum': [2, 'always', ['root', ...directories]],
  },
};

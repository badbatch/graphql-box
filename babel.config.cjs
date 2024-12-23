const repodogConfig = require('@repodog/babel-config');

const babelConfig = api => ({
  ...repodogConfig(api),
});

module.exports = babelConfig;

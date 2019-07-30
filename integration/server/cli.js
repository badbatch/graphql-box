require('@babel/register')({
  configFile: './babel.config.js',
  extensions: '.ts',
});

const graphqlServer = require('./index.ts').default;

graphqlServer();

const tsConfig = require('../../../tsconfig.test.json');
require('ts-node').register(tsConfig); // eslint-disable-line
const { mockRestRequest } = require('../../../test/helpers/index.ts');
const graphqlServer = require('../../../test/server/index.ts').default;

module.exports = function createGraphqlServer() {
  const server = graphqlServer();
  mockRestRequest('product', '402-5806');

  this.onRunComplete = () => {
    server.close();
  };
};

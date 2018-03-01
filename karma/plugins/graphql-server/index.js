const tsConfig = require('../../../tsconfig.test.json');
require('ts-node').register(tsConfig); // eslint-disable-line
require('source-map-support').install(); // eslint-disable-line
const { mockRestRequest } = require('../../../test/helpers/index.ts');
const graphqlServer = require('../../../test/server/index.ts').default;

module.exports = function createGraphqlServer() {
  let _server;

  graphqlServer().then((server) => {
    _server = server;
  });

  mockRestRequest('product', '402-5806');
  mockRestRequest('product', '522-7645');
  mockRestRequest('sku', '104-7702');
  mockRestRequest('sku', '134-5203');

  this.onRunComplete = () => {
    _server.close();
  };
};

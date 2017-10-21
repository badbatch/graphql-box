import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import fetchMock from 'fetch-mock';
import { GraphQLSchema } from 'graphql';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { github, tesco } from '../data/graphql';

import {
  createClient,
  githubURL,
  mockGQLRequest,
  mockRestRequest,
  parseMap,
  updateQuery,
} from '../helpers';

import Client from '../../src';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('when the client is initialised in internal mode', () => {
  it('should create an instance of the Client with the correct properties', () => {
    const client = createClient('internal', true);
    expect(client).to.be.instanceOf(Client);
    expect(client._mode).to.eql('internal');
    expect(client._schema).to.be.instanceof(GraphQLSchema);
    expect(client._cache.res._env).to.eql('node');
    expect(client._cache.res._storageType).to.eql('redis');
  });

  describe('when a schema is not passed in', () => {
    it('should throw an error', () => {
      const initializer = () => new Client({ mode: 'internal', newInstance: true });
      const message = 'Schema is a mandatory argument for a client in internal mode.';
      expect(initializer).to.throw(Error, message);
    });
  });
});

describe('when the client is initialised in external mode', () => {
  it('should create an instance of the Client with the correct properties', () => {
    const client = createClient('external', true);
    expect(client).to.be.instanceOf(Client);
    expect(client._mode).to.eql('external');
    expect(client._schema).to.be.instanceof(GraphQLSchema);
    expect(client._url).to.eql(githubURL);
    expect(client._cache.res._env).to.eql('node');
    expect(client._cache.res._storageType).to.eql('redis');
  });

  describe('when an introspection query and url are not passed in', () => {
    it('should throw an error', () => {
      const initializer = () => new Client({ mode: 'external', newInstance: true });
      const message = 'Introspection query and URL are mandatory arguments for a client in external mode.';
      expect(initializer).to.throw(Error, message);
    });
  });
});

describe('when the client is initialised for use on the browser', () => {
  it('should create an instance of the Client with the correct properties', () => {
    process.env.WEB_ENV = true;
    const client = createClient('external', true);
    expect(client).to.be.instanceOf(Client);
    expect(client._mode).to.eql('external');
    expect(client._schema).to.be.instanceof(GraphQLSchema);
    expect(client._url).to.eql(githubURL);
    expect(client._cache.res._env).to.eql('web');
    expect(client._cache.res._storageType).to.eql('local');
    delete process.env.WEB_ENV;
  });
});

describe('when the client is in internal mode', () => {
  let client;

  before(() => {
    client = createClient('internal', true);
  });

  describe('when a single query is requested from the server', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      spy(client, '_fetch');
      res = await client.request(tesco.requests.singleQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data', async () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should have made a call to the graphql server', () => {
      expect(client._fetch.calledOnce).to.be.true();
    });

    it('should have made the request to the server', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(singleQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should cache each response object against its query path', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when the same query is subsquently requested', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.singleQuery);
      fetchMock.reset();
      spy(client, '_fetch');
      res = await client.request(tesco.requests.singleQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data from the response cache', () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should not have made a call to the graphql server', () => {
      expect(client._fetch.notCalled).to.be.true();
    });

    it('should not have made the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(0);
    });

    it('should not change the size of the response cache', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(singleQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when the same query with an operation name is subsequently requested', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.singleQuery);
      fetchMock.reset();
      spy(client, '_fetch');
      res = await client.request(tesco.requests.namedQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data from the object cache', () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should not have made a call to the graphql server', () => {
      expect(client._fetch.notCalled).to.be.true();
    });

    it('should not have made the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(0);
    });

    it('should cache the response against the named query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(3);
      const namedQuery = updateQuery(tesco.requests.namedQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(namedQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when the same query with variables is subsequently requested', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.singleQuery);
      fetchMock.reset();
      spy(client, '_fetch');
      res = await client.request(tesco.requests.variableQuery, { variables: { id: '402-5806' } });
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data from the response cache', () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should not have made a call to the graphql server', () => {
      expect(client._fetch.notCalled).to.be.true();
    });

    it('should not have made the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(0);
    });

    it('should not change the size of the response cache', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(singleQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when the same query with aliases is subsequently requested', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.singleQuery);
      fetchMock.reset();
      spy(client, '_fetch');
      res = await client.request(tesco.requests.aliasQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the data from the object cache', () => {
      const { favourite } = res.data;
      expect(favourite.id).to.eql('402-5806');
      expect(favourite.optionsInfo[0].name).to.eql('Colour');
      expect(favourite.optionsInfo[1].name).to.eql('Size');
      expect(favourite.cost.price).to.eql('19.00');
      expect(favourite.userActionable).to.be.true();
    });

    it('should not have made a call to the graphql server', () => {
      expect(client._fetch.notCalled).to.be.true();
    });

    it('should not have made the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(0);
    });

    it('should cache the response against the aliased query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(3);
      const aliasQuery = updateQuery(tesco.requests.aliasQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(aliasQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when part of a single query is in the object cache', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.partOneQuery);
      spy(client, '_fetch');
      res = await client.request(tesco.requests.singleQuery);
    });

    afterEach(() => {
      fetchMock.restore();
      client._fetch.restore();
      client.clearCache();
    });

    it('should return the requested data', () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should make a request to the graphql server and API for the missing data', () => {
      const spiedQuery = client._fetch.getCall(0).args[0].replace(/\s/g, '');
      const partTwoQuery = tesco.requests.partTwoQuery.replace(/\s/g, '');
      expect(spiedQuery).to.eql(partTwoQuery);
    });

    it('should cache the partial and full response against the respective queries', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(4);
      const partOneQuery = updateQuery(tesco.requests.partOneQuery);
      expect(await cache.has(partOneQuery, { hash: true })).to.be.a('object');
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      expect(await cache.has(singleQuery, { hash: true })).to.be.a('object');
      const partTwoQuery = tesco.requests.partTwoQuery.replace(/\s/g, '');
      expect(await cache.has(partTwoQuery, { hash: true })).to.be.a('object');
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when a query with variables is requested from the server', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      spy(client, '_fetch');
      res = await client.request(tesco.requests.variableQuery, { variables: { id: '402-5806' } });
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data', async () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should have made a call to the graphql server', () => {
      expect(client._fetch.calledOnce).to.be.true();
    });

    it('should have made the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the query populated with the variable', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(singleQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });
  });

  describe('when a subsequent query is made for the same data', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.variableQuery, { variables: { id: '402-5806' } });
      fetchMock.reset();
      spy(client, '_fetch');
      res = await client.request(tesco.requests.singleQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the data from the response cache', () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should not have made a call to the graphql server', () => {
      expect(client._fetch.notCalled).to.be.true();
    });

    it('should not have make the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(0);
    });

    it('should not change the size of the response cache', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(singleQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });
  });

  describe('when a query with fragments is requested from the server', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      spy(client, '_fetch');
      res = await client.request(tesco.requests.fragmentQuery, { fragments: [
        tesco.requests.optionsInfoFragment, tesco.requests.priceFragment,
      ] });
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data', async () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should have made a call to the graphql server', () => {
      expect(client._fetch.calledOnce).to.be.true();
    });

    it('should have made the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the query populated with the fragments', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(singleQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });
  });

  describe('when a query with inline fragments is requested from the server', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      spy(client, '_fetch');
      res = await client.request(tesco.requests.inlineFragmentQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data', async () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should have made a call to the graphql server', () => {
      expect(client._fetch.calledOnce).to.be.true();
    });

    it('should have made the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the query with inline fragments', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const inlineFragmentQuery = updateQuery(tesco.requests.inlineFragmentQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(inlineFragmentQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should cache each response object against its query path', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when a similar query with inline fragments is requested from the server', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.inlineFragmentQuery);
      fetchMock.reset();
      spy(client, '_fetch');
      res = await client.request(tesco.requests.inlineFragmentQueryExtra);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data', async () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[0].internalName).to.eql('colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.optionsInfo[1].internalName).to.eql('p_size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.prices.clubcardPoints).to.eql('19');
      expect(product.userActionable).to.be.true();
    });

    it('should have made a call to the graphql server', () => {
      expect(client._fetch.calledOnce).to.be.true();
    });

    it('should have make the request to the API for the missing data', () => {
      const spiedQuery = client._fetch.getCall(0).args[0].replace(/\s/g, '');
      const inlineFragmentQuerySpied = tesco.requests.inlineFragmentQuerySpied.replace(/\s/g, '');
      expect(spiedQuery).to.eql(inlineFragmentQuerySpied);
    });

    it('should cache the responses against the full query and filtered query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(4);
      const inlineFragmentQueryExtra = updateQuery(tesco.requests.inlineFragmentQueryExtra);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;

      expect(await cache.get(
        inlineFragmentQueryExtra, { hash: true }),
      ).to.eql({ cacheMetadata, data });
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when a query with aliases is requested from the server', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      spy(client, '_fetch');
      res = await client.request(tesco.requests.aliasQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data', () => {
      const { favourite } = res.data;
      expect(favourite.id).to.eql('402-5806');
      expect(favourite.optionsInfo[0].name).to.eql('Colour');
      expect(favourite.optionsInfo[1].name).to.eql('Size');
      expect(favourite.cost.price).to.eql('19.00');
      expect(favourite.userActionable).to.be.true();
    });

    it('should have made a call to the graphql server', () => {
      expect(client._fetch.calledOnce).to.be.true();
    });

    it('should have made the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the aliased query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const aliasQuery = updateQuery(tesco.requests.aliasQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(aliasQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should cache each response object against its query path', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when a subsequent query is made for the same data without the aliases', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.aliasQuery);
      spy(client, '_fetch');
      res = await client.request(tesco.requests.singleQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the data from the object cache', () => {
      const { product } = res.data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should not have made a call to the graphql server', () => {
      expect(client._fetch.notCalled).to.be.true();
    });

    it('should not have make the request to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the non-aliased query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(3);
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      const cacheMetadata = parseMap(res.cacheMetadata);
      const data = res.data;
      expect(await cache.get(singleQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when the same query is requested in quick succession', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      spy(client, '_fetch');
      const promises = [];
      promises.push(client.request(tesco.requests.singleQuery));
      promises.push(client.request(tesco.requests.singleQuery));
      res = await Promise.all(promises);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data for both requests', async () => {
      expect(res[0].data.product.id).to.eql('402-5806');
      expect(res[0].data.product.optionsInfo[0].name).to.eql('Colour');
      expect(res[0].data.product.optionsInfo[1].name).to.eql('Size');
      expect(res[0].data.product.prices.price).to.eql('19.00');
      expect(res[0].data.product.userActionable).to.be.true();
      expect(res[1].data.product.id).to.eql('402-5806');
      expect(res[1].data.product.optionsInfo[0].name).to.eql('Colour');
      expect(res[1].data.product.optionsInfo[1].name).to.eql('Size');
      expect(res[1].data.product.prices.price).to.eql('19.00');
      expect(res[1].data.product.userActionable).to.be.true();
    });

    it('should have make just one request to the graphql server and API', () => {
      expect(client._fetch.calledOnce).to.be.true();
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache just one response against the query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = updateQuery(tesco.requests.singleQuery);
      const cacheMetadata = parseMap(res[0].cacheMetadata);
      const data = res[0].data;
      expect(await cache.get(singleQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });

  describe('when multiple queries are requested as the same time', () => {
    let res;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      mockRestRequest('sku', '104-7702');
      spy(client, '_fetch');
      res = await client.request(tesco.requests.multiQuery);
    });

    afterEach(() => {
      client.clearCache();
      client._fetch.restore();
      fetchMock.restore();
    });

    it('should return the requested data for both requests', async () => {
      const { product } = res[0].data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
      const { sku } = res[1].data;
      expect(sku.id).to.eql('104-7702');
      expect(sku.displayName).to.eql('F&F Double Bell Sleeve Shift Dress 12 Navy');
      expect(sku.publicLink).to.eql('/direct/ff-double-bell-sleeve-shift-dress/559-5302.prd?skuId=104-7702');
      expect(sku.prices.price).to.eql('18.00');
    });

    it('should have made two calls to the graphql server', () => {
      expect(client._fetch.calledTwice).to.be.true();
    });

    it('should have made two requests to the API', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(2);
    });

    it('should cache the responses against the individual queries', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(3);
      const namedQuery = updateQuery(tesco.requests.namedQuery);
      let cacheMetadata = parseMap(res[0].cacheMetadata);
      let data = res[0].data;
      expect(await cache.get(namedQuery, { hash: true })).to.eql({ cacheMetadata, data });
      const skuQuery = updateQuery(tesco.requests.skuQuery);
      cacheMetadata = parseMap(res[1].cacheMetadata);
      data = res[1].data;
      expect(await cache.get(skuQuery, { hash: true })).to.eql({ cacheMetadata, data });
    });

    it('should cache each response object against its query path', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(8);
    });
  });
});

describe('when the client is in external mode', () => {
  let client;

  before(() => {
    client = createClient('external', true);
  });

  describe('when a mutation is sent to the server', () => {
    let res;

    beforeEach(async () => {
      mockGQLRequest(github.requests.singleMutation);
      res = await client.request(github.requests.singleMutation);
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return the data requested in the mutation', () => {
      expect(res.data).to.eql(github.responses.singleMutation.data);
    });
  });

  describe('when a mutation with variables is sent to the server', () => {
    let res;

    beforeEach(async () => {
      mockGQLRequest(github.requests.singleMutation);

      res = await client.request(github.requests.variableMutation, {
        variables: { ownerId: 'MDEwOlJlcG9zaXRvcnk5ODU4ODQxNg==', name: 'wip' },
      });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return the data requested in the mutation', () => {
      expect(res.data).to.eql(github.responses.singleMutation.data);
    });

    it('should populate the variables in the mutation before sending the request', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });
  });
});

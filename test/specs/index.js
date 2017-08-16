import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import fetchMock from 'fetch-mock';
import { GraphQLSchema } from 'graphql';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { github, tesco } from '../data/graphql';
import { createClient, githubURL, mockGQLRequest, mockRestRequest } from '../helpers';
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
    let data;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      data = await client.request(tesco.requests.singleQuery);
    });

    afterEach(() => {
      client.clearCache();
      fetchMock.restore();
    });

    it('should return the requested data', async () => {
      const { product } = data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should have make the request to the server', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = tesco.requests.singleQuery.replace(/\s/g, '');
      expect(await cache.get(singleQuery, { hash: true })).to.eql(data);
    });

    it('should cache each response object against its query path', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });

    describe('when the same query is subsquently requested', () => {
      beforeEach(async () => {
        data = await client.request(tesco.requests.singleQuery);
      });

      it('should return the requested data from the response cache', () => {
        const { product } = data;
        expect(product.id).to.eql('402-5806');
        expect(product.optionsInfo[0].name).to.eql('Colour');
        expect(product.optionsInfo[1].name).to.eql('Size');
        expect(product.prices.price).to.eql('19.00');
        expect(product.userActionable).to.be.true();
      });

      it('should not have make the request to the server', () => {
        expect(fetchMock.calls().matched).to.have.lengthOf(1);
      });

      it('should not change the size of the response cache', async () => {
        const cache = client._cache.res;
        expect(await cache.size()).to.eql(2);
        const singleQuery = tesco.requests.singleQuery.replace(/\s/g, '');
        expect(await cache.get(singleQuery, { hash: true })).to.eql(data);
      });

      it('should not change the size of the object cache', async () => {
        const cache = client._cache.obj;
        expect(await cache.size()).to.eql(6);
      });
    });

    describe('when the same query with variables is subsequently requested', () => {
      beforeEach(async () => {
        data = await client.request(tesco.requests.variableQuery, { variables: { id: '402-5806' } });
      });

      it('should return the requested data from the response cache', () => {
        const { product } = data;
        expect(product.id).to.eql('402-5806');
        expect(product.optionsInfo[0].name).to.eql('Colour');
        expect(product.optionsInfo[1].name).to.eql('Size');
        expect(product.prices.price).to.eql('19.00');
        expect(product.userActionable).to.be.true();
      });

      it('should not have make the request to the server', () => {
        expect(fetchMock.calls().matched).to.have.lengthOf(1);
      });

      it('should not change the size of the response cache', async () => {
        const cache = client._cache.res;
        expect(await cache.size()).to.eql(2);
        const singleQuery = tesco.requests.singleQuery.replace(/\s/g, '');
        expect(await cache.get(singleQuery, { hash: true })).to.eql(data);
      });

      it('should not change the size of the object cache', async () => {
        const cache = client._cache.obj;
        expect(await cache.size()).to.eql(6);
      });
    });

    describe('when the same query with aliases is subsequently requested', () => {
      beforeEach(async () => {
        data = await client.request(tesco.requests.aliasQuery);
      });

      it('should return the data from the object cache', () => {
        const { favourite } = data;
        expect(favourite.id).to.eql('402-5806');
        expect(favourite.optionsInfo[0].name).to.eql('Colour');
        expect(favourite.optionsInfo[1].name).to.eql('Size');
        expect(favourite.cost.price).to.eql('19.00');
        expect(favourite.userActionable).to.be.true();
      });

      it('should not have make the request to the server', () => {
        expect(fetchMock.calls().matched).to.have.lengthOf(1);
      });

      it('should cache the response against the aliased query', async () => {
        const cache = client._cache.res;
        expect(await cache.size()).to.eql(3);
        const aliasQuery = tesco.requests.aliasQuery.replace(/\s/g, '');
        expect(await cache.get(aliasQuery, { hash: true })).to.eql(data);
      });

      it('should not change the size of the object cache', async () => {
        const cache = client._cache.obj;
        expect(await cache.size()).to.eql(6);
      });
    });
  });

  describe('when part of a single query is in the object cache', () => {
    let data;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      await client.request(tesco.requests.partOneQuery);
      spy(client, '_fetch');
      data = await client.request(tesco.requests.singleQuery);
    });

    afterEach(() => {
      fetchMock.restore();
      client._fetch.restore();
      client.clearCache();
    });

    it('should return the requested data', () => {
      const { product } = data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should make a request to the server for the missing data', () => {
      const spiedQuery = client._fetch.getCall(0).args[0].replace(/\s/g, '');
      const partTwoQuery = tesco.requests.partTwoQuery.replace(/\s/g, '');
      expect(spiedQuery).to.eql(partTwoQuery);
    });

    it('should cache the partial and full response against the respective queries', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(4);
      const partOneQuery = tesco.requests.partOneQuery.replace(/\s/g, '');
      expect(await cache.has(partOneQuery, { hash: true })).to.be.a('object');
      const singleQuery = tesco.requests.singleQuery.replace(/\s/g, '');
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
    let data;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      data = await client.request(tesco.requests.variableQuery, { variables: { id: '402-5806' } });
    });

    afterEach(() => {
      client.clearCache();
      fetchMock.restore();
    });

    it('should return the requested data', async () => {
      const { product } = data;
      expect(product.id).to.eql('402-5806');
      expect(product.optionsInfo[0].name).to.eql('Colour');
      expect(product.optionsInfo[1].name).to.eql('Size');
      expect(product.prices.price).to.eql('19.00');
      expect(product.userActionable).to.be.true();
    });

    it('should have make the request to the server', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the query populated with the variable', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = tesco.requests.singleQuery.replace(/\s/g, '');
      expect(await cache.get(singleQuery, { hash: true })).to.eql(data);
    });

    describe('when a subsequent query is made for the same data', () => {
      beforeEach(async () => {
        data = await client.request(tesco.requests.singleQuery);
      });

      it('should return the data from the response cache', () => {
        const { product } = data;
        expect(product.id).to.eql('402-5806');
        expect(product.optionsInfo[0].name).to.eql('Colour');
        expect(product.optionsInfo[1].name).to.eql('Size');
        expect(product.prices.price).to.eql('19.00');
        expect(product.userActionable).to.be.true();
      });

      it('should not have make the request to the server', () => {
        expect(fetchMock.calls().matched).to.have.lengthOf(1);
      });

      it('should not change the size of the response cache', async () => {
        const cache = client._cache.res;
        expect(await cache.size()).to.eql(2);
        const singleQuery = tesco.requests.singleQuery.replace(/\s/g, '');
        expect(await cache.get(singleQuery, { hash: true })).to.eql(data);
      });
    });
  });

  describe('when a query with aliases is requested from the server', () => {
    let data;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      data = await client.request(tesco.requests.aliasQuery);
    });

    afterEach(() => {
      client.clearCache();
      fetchMock.restore();
    });

    it('should return the requested data', () => {
      const { favourite } = data;
      expect(favourite.id).to.eql('402-5806');
      expect(favourite.optionsInfo[0].name).to.eql('Colour');
      expect(favourite.optionsInfo[1].name).to.eql('Size');
      expect(favourite.cost.price).to.eql('19.00');
      expect(favourite.userActionable).to.be.true();
    });

    it('should have make the request to the server', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache the response against the aliased query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const aliasQuery = tesco.requests.aliasQuery.replace(/\s/g, '');
      expect(await cache.get(aliasQuery, { hash: true })).to.eql(data);
    });

    it('should cache each response object against its query path', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });

    describe('when a subsequent query is made for the same data without the aliases', () => {
      beforeEach(async () => {
        data = await client.request(tesco.requests.singleQuery);
      });

      it('should return the data from the object cache', () => {
        const { product } = data;
        expect(product.id).to.eql('402-5806');
        expect(product.optionsInfo[0].name).to.eql('Colour');
        expect(product.optionsInfo[1].name).to.eql('Size');
        expect(product.prices.price).to.eql('19.00');
        expect(product.userActionable).to.be.true();
      });

      it('should not have make the request to the server', () => {
        expect(fetchMock.calls().matched).to.have.lengthOf(1);
      });

      it('should cache the response against the non-aliased query', async () => {
        const cache = client._cache.res;
        expect(await cache.size()).to.eql(3);
        const singleQuery = tesco.requests.singleQuery.replace(/\s/g, '');
        expect(await cache.get(singleQuery, { hash: true })).to.eql(data);
      });

      it('should not change the size of the object cache', async () => {
        const cache = client._cache.obj;
        expect(await cache.size()).to.eql(6);
      });
    });
  });

  describe('when the same query is requested in quick succession', () => {
    let data;

    beforeEach(async () => {
      mockRestRequest('product', '402-5806');
      const promises = [];
      promises.push(client.request(tesco.requests.singleQuery));
      promises.push(client.request(tesco.requests.singleQuery));
      data = await Promise.all(promises);
    });

    afterEach(() => {
      client.clearCache();
      fetchMock.restore();
    });

    it('should return the requested data for both requests', async () => {
      expect(data[0].product.id).to.eql('402-5806');
      expect(data[0].product.optionsInfo[0].name).to.eql('Colour');
      expect(data[0].product.optionsInfo[1].name).to.eql('Size');
      expect(data[0].product.prices.price).to.eql('19.00');
      expect(data[0].product.userActionable).to.be.true();
      expect(data[1].product.id).to.eql('402-5806');
      expect(data[1].product.optionsInfo[0].name).to.eql('Colour');
      expect(data[1].product.optionsInfo[1].name).to.eql('Size');
      expect(data[1].product.prices.price).to.eql('19.00');
      expect(data[1].product.userActionable).to.be.true();
    });

    it('should have make just one request to the server', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });

    it('should cache just one response against the query', async () => {
      const cache = client._cache.res;
      expect(await cache.size()).to.eql(2);
      const singleQuery = tesco.requests.singleQuery.replace(/\s/g, '');
      expect(await cache.get(singleQuery, { hash: true })).to.eql(data[0]);
    });

    it('should not change the size of the object cache', async () => {
      const cache = client._cache.obj;
      expect(await cache.size()).to.eql(6);
    });
  });
});

describe('when the client is in external mode', () => {
  let client;

  before(() => {
    client = createClient('external', true);
  });

  describe('when a mutation is sent to the server', () => {
    let data;

    beforeEach(async () => {
      mockGQLRequest(github.requests.singleMutation);
      data = await client.request(github.requests.singleMutation);
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return the data requested in the mutation', () => {
      expect(data).to.eql(github.responses.singleMutation);
    });
  });

  describe('when a mutation with variables is sent to the server', () => {
    let data;

    beforeEach(async () => {
      mockGQLRequest(github.requests.singleMutation);

      data = await client.request(github.requests.variableMutation, {
        variables: { ownerId: 'MDEwOlJlcG9zaXRvcnk5ODU4ODQxNg==', name: 'wip' },
      });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return the data requested in the mutation', () => {
      expect(data).to.eql(github.responses.singleMutation);
    });

    it('should populate the variables in the mutation before sending the request', () => {
      expect(fetchMock.calls().matched).to.have.lengthOf(1);
    });
  });
});

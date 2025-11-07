import { Core } from '@cachemap/core';
import { init as map } from '@cachemap/map';
import { instrumentOperation } from '@graphql-box/operation-parser';
import {
  getOperationContext,
  getOperationData,
  githubIntrospection,
  parsedOperations,
  prepareOperationForComparison,
  responses,
} from '@graphql-box/test-utils';
import { expect, jest } from '@jest/globals';
import { parse } from 'graphql';
import { type IntrospectionQuery, OperationTypeNode, buildClientSchema } from 'graphql/index.js';
import { CacheManager, type CacheManagerDef } from './index.ts';

describe('@graphql-box/cache-manager', () => {
  const realDateNow = Date.now.bind(globalThis.Date);
  let cacheManager: CacheManagerDef;

  const createCacheManager = () =>
    new CacheManager({
      cache: new Core({
        name: 'cache',
        store: map(),
        type: 'test',
      }),
    });

  const getFieldPaths = (operation: string) => {
    const { fieldPaths } = instrumentOperation(
      parse(operation),
      buildClientSchema(githubIntrospection as IntrospectionQuery),
      {
        operation,
        operationType: OperationTypeNode.QUERY,
      },
    );

    return fieldPaths;
  };

  beforeAll(() => {
    globalThis.Date.now = jest.fn<() => number>().mockReturnValue(Date.parse('June 6, 1979 GMT'));
  });

  afterAll(() => {
    globalThis.Date.now = realDateNow;
  });

  describe('analyzeQuery', () => {
    beforeEach(() => {
      cacheManager = createCacheManager();
    });

    describe('when no field paths are resolved', () => {
      it('should return the operation data unmodified', async () => {
        const fieldPaths = getFieldPaths(parsedOperations.query);

        const { operationData } = await cacheManager.analyzeQuery(
          getOperationData(parsedOperations.query),
          getOperationContext({ fieldPaths }),
        );

        expect(operationData!.operation).toBe(parsedOperations.query);
      });
    });

    describe('when all field paths are resolved', () => {
      const fieldPaths = getFieldPaths(parsedOperations.query);

      beforeEach(async () => {
        await cacheManager.cacheQuery(responses.query, getOperationContext({ fieldPaths }));
      });

      it('should return the expected response data', async () => {
        const operationData = getOperationData(parsedOperations.query);

        await expect(cacheManager.analyzeQuery(operationData, getOperationContext({ fieldPaths }))).resolves.toEqual({
          responseData: responses.query,
        });
      });
    });

    describe('when some field paths are resolved', () => {
      const fieldPaths = getFieldPaths(parsedOperations.query);
      const response = structuredClone(responses.query);

      // @ts-expect-error does not matter for test purposes
      response.__cacheMetadata['organization.email'] = {
        cacheControl: {
          maxAge: 0,
          ttl: 0,
        },
      };

      beforeEach(async () => {
        await cacheManager.cacheQuery(response, getOperationContext({ fieldPaths }));
      });

      it('should return the filtered operation data', async () => {
        const operationDataToExpect = getOperationData(`
          {
            organization(login: "facebook") {
              email
            }
          }
        `);

        const { operationData } = await cacheManager.analyzeQuery(
          getOperationData(parsedOperations.query),
          getOperationContext({ fieldPaths }),
        );

        expect(prepareOperationForComparison(operationData!.operation)).toBe(
          prepareOperationForComparison(operationDataToExpect.operation),
        );
      });
    });
  });

  describe('cacheQuery', () => {
    beforeEach(() => {
      cacheManager = createCacheManager();
    });

    it('should store the expected response data against each field path', async () => {
      const fieldPaths = getFieldPaths(parsedOperations.query);
      await cacheManager.cacheQuery(responses.query, getOperationContext({ fieldPaths }));

      expect(await cacheManager.cache!.export()).toMatchInlineSnapshot(`
        {
          "entries": [
            [
              "organization({"login":"facebook"}).email",
              "",
            ],
            [
              "organization({"login":"facebook"}).id",
              "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
            ],
            [
              "organization({"login":"facebook"}).login",
              "facebook",
            ],
            [
              "organization({"login":"facebook"}).name",
              "Facebook",
            ],
          ],
          "metadata": [
            {
              "accessedCount": 0,
              "added": 297475200000,
              "cacheability": Cacheability {
                "metadata": {
                  "cacheControl": {
                    "maxAge": 5,
                  },
                  "etag": undefined,
                  "ttl": 297475205000,
                },
              },
              "key": "organization({"login":"facebook"}).email",
              "lastAccessed": 297475200000,
              "lastUpdated": 297475200000,
              "size": 4,
              "tags": [],
              "updatedCount": 0,
            },
            {
              "accessedCount": 0,
              "added": 297475200000,
              "cacheability": Cacheability {
                "metadata": {
                  "cacheControl": {
                    "maxAge": 5,
                  },
                  "etag": undefined,
                  "ttl": 297475205000,
                },
              },
              "key": "organization({"login":"facebook"}).id",
              "lastAccessed": 297475200000,
              "lastUpdated": 297475200000,
              "size": 60,
              "tags": [],
              "updatedCount": 0,
            },
            {
              "accessedCount": 0,
              "added": 297475200000,
              "cacheability": Cacheability {
                "metadata": {
                  "cacheControl": {
                    "maxAge": 5,
                  },
                  "etag": undefined,
                  "ttl": 297475205000,
                },
              },
              "key": "organization({"login":"facebook"}).login",
              "lastAccessed": 297475200000,
              "lastUpdated": 297475200000,
              "size": 20,
              "tags": [],
              "updatedCount": 0,
            },
            {
              "accessedCount": 0,
              "added": 297475200000,
              "cacheability": Cacheability {
                "metadata": {
                  "cacheControl": {
                    "maxAge": 5,
                  },
                  "etag": undefined,
                  "ttl": 297475205000,
                },
              },
              "key": "organization({"login":"facebook"}).name",
              "lastAccessed": 297475200000,
              "lastUpdated": 297475200000,
              "size": 20,
              "tags": [],
              "updatedCount": 0,
            },
          ],
        }
      `);
    });
  });
});

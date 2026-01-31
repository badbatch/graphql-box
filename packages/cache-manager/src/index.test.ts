import { Core } from '@cachemap/core';
import { type ExportResult } from '@cachemap/core';
import { init as map } from '@cachemap/map';
import { instrumentOperation } from '@graphql-box/operation-parser';
import {
  getOperationContext,
  getOperationData,
  githubIntrospection,
  parsedOperations,
  responses,
} from '@graphql-box/test-utils';
import { describe, expect, jest } from '@jest/globals';
import { type IntrospectionQuery, OperationTypeNode, buildClientSchema, parse } from 'graphql';
import { CacheManager, type CacheManagerDef } from './index.ts';

const serialiseExport = ({ entries, metadata }: ExportResult<unknown>) => ({
  entries,
  metadata: metadata.map(({ cacheability, ...rest }) => ({ ...rest, cacheability: cacheability.metadata })),
});

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
        idKey: 'id',
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

        // @ts-expect-error Okay for test file
        const { kind, operationData } = await cacheManager.analyzeQuery(
          getOperationData(parsedOperations.query),
          getOperationContext({ fieldPaths }),
        );

        expect(kind).toBe('cache-miss');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(operationData.operation).toBe(parsedOperations.query);
      });
    });

    describe('when all field paths are resolved', () => {
      const operationData = getOperationData(parsedOperations.query);
      const fieldPaths = getFieldPaths(parsedOperations.query);

      beforeEach(async () => {
        await cacheManager.cacheQuery(operationData, responses.facebookQuery, getOperationContext({ fieldPaths }));
      });

      it('should return the expected response data', async () => {
        const result = await cacheManager.analyzeQuery(operationData, getOperationContext({ fieldPaths }));

        expect(result).toMatchInlineSnapshot(`
          {
            "kind": "cache-hit",
            "responseData": {
              "data": {
                "organization": {
                  "__typename": "Organization",
                  "email": "opensource@fb.com",
                  "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  "login": "facebook",
                  "name": "Facebook",
                },
              },
              "extensions": {
                "cacheMetadata": {
                  "Organization:MDEyOk9yZ2FuaXphdGlvbjY5NjMx": {
                    "cacheControl": {
                      "maxAge": 5,
                    },
                    "ttl": 297475205000,
                  },
                  "organization({"login":"facebook"})": {
                    "cacheControl": {
                      "maxAge": 5,
                    },
                    "ttl": 297475205000,
                  },
                },
              },
            },
          }
        `);
      });
    });

    describe('when some field paths are resolved', () => {
      const operationData = getOperationData(parsedOperations.queryWithConnectionWithNestedInlineFragment);
      const fieldPaths = getFieldPaths(parsedOperations.queryWithConnectionWithNestedInlineFragment);
      const response = structuredClone(responses.facebookQueryWithConnectionWithNestedInlineFragment);

      response.extensions.cacheMetadata['organization({"login":"facebook"}).repositories({"first": 6})'] = {
        cacheControl: {
          maxAge: 0,
        },
        ttl: 0,
      };

      response.extensions.cacheMetadata['organization({"login":"facebook"}).repositories({"first": 6}).edges[]'] = {
        cacheControl: {
          maxAge: 0,
        },
        ttl: 0,
      };

      beforeEach(async () => {
        await cacheManager.cacheQuery(operationData, response, getOperationContext({ fieldPaths }));
      });

      it('should return the filtered operation data', async () => {
        const result = await cacheManager.analyzeQuery(operationData, getOperationContext({ fieldPaths }));

        // @ts-expect-error does not matter for test purposes
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(result.operationData.operation).toMatchInlineSnapshot(`
          "{
            organization(login: "facebook") {
              repositories(first: 6) {
                edges {
                  node {
                    description
                    homepageUrl
                    name
                    owner {
                      url
                      ... on Organization {
                        login
                        name
                      }
                    }
                  }
                }
              }
            }
          }"
        `);
      });
    });
  });

  // TODO: This test is passing individually, but failing when run in a group
  describe.skip('cacheQuery', () => {
    beforeEach(() => {
      cacheManager = createCacheManager();
    });

    it('should store the expected response data against each field path', async () => {
      const operationData = getOperationData(parsedOperations.query);
      const fieldPaths = getFieldPaths(parsedOperations.query);
      await cacheManager.cacheQuery(operationData, responses.facebookQuery, getOperationContext({ fieldPaths }));
      const exported = serialiseExport(await cacheManager.cache!.export());

      expect(exported.entries).toMatchInlineSnapshot(`
        [
          [
            "Entity:Organization:MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
            {
              "extensions": {
                "cacheability": {
                  "cacheControl": {
                    "maxAge": 5,
                  },
                  "ttl": 297475205000,
                },
              },
              "kind": "entity",
              "refTargets": {},
              "value": {
                "__typename": "Organization",
                "email": "opensource@fb.com",
                "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                "login": "facebook",
                "name": "Facebook",
              },
            },
          ],
          [
            "Operation:  {    organization(login: "facebook") {      email      login      name    }  }",
            {
              "extensions": {
                "cacheMetadata": {
                  "Organization:MDEyOk9yZ2FuaXphdGlvbjY5NjMx": {
                    "cacheControl": {
                      "maxAge": 5,
                    },
                    "ttl": 297475205000,
                  },
                  "organization({"login":"facebook"})": {
                    "cacheControl": {
                      "maxAge": 5,
                    },
                    "ttl": 297475205000,
                  },
                },
              },
              "kind": "operation",
              "refTargets": {
                "organization({"login":"facebook"})": [
                  "organization",
                ],
              },
            },
          ],
          [
            "OperationPath:organization({"login":"facebook"})",
            {
              "extensions": {
                "cacheability": {
                  "cacheControl": {
                    "maxAge": 5,
                  },
                  "ttl": 297475205000,
                },
                "fieldPathMetadata": {
                  "fieldArgs": {
                    "login": "facebook",
                  },
                  "fieldDepth": 1,
                  "hasArgs": true,
                  "isCacheBoundary": true,
                  "isEntity": true,
                  "isRootPath": true,
                  "pathCacheKey": "organization({"login":"facebook"})",
                  "pathResponseKey": "organization",
                  "requiredFields": {
                    "__typename": [
                      "__typename",
                      "email",
                      "id",
                      "login",
                      "name",
                    ],
                  },
                  "typeName": "Organization",
                },
              },
              "kind": "operationPath",
              "refTargets": {
                "Organization:MDEyOk9yZ2FuaXphdGlvbjY5NjMx": [
                  "",
                ],
              },
              "value": {
                "__kind": "entity",
                "__ref": "Organization:MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
              },
            },
          ],
        ]
      `);
    });
  });
});

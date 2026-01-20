import { getOperationContext, githubIntrospection, rawOperationsAndOptions } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { type IntrospectionQuery, OperationTypeNode } from 'graphql';
import { OperationParser, type OperationParserDef } from './index.ts';

describe('@graphql-box/operation-parser', () => {
  let operationParser: OperationParserDef;

  describe('when query has no variables', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithoutVariable;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithoutVariable;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has operation name', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithOperationName;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "query GetOrganization {
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithOperationName;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "GetOrganization",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when the query has a default', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithDefault;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "google") {
            __typename
            description
            email
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithDefault;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "google",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"google"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when the query has a number default', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithNumberDefault;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "google") {
            __typename
            description
            email
            id
            login
            name
            repositories(first: 20) {
              edges {
                node {
                  __typename
                  description
                  id
                  name
                }
              }
            }
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithNumberDefault;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 5,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "google",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"google"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.repositories": {
              "fieldArgs": {
                "first": 20,
              },
              "fieldDepth": 2,
              "hasArgs": true,
              "pathCacheKey": "repositories({"first":20})",
              "pathResponseKey": "repositories",
              "typeName": "RepositoryConnection",
            },
            "organization.repositories.edges": {
              "fieldDepth": 3,
              "isList": true,
              "pathCacheKey": "edges[]",
              "pathResponseKey": "edges",
              "typeName": "RepositoryEdge",
            },
            "organization.repositories.edges.node": {
              "fieldDepth": 4,
              "isEntity": true,
              "pathCacheKey": "node",
              "pathResponseKey": "node",
              "typeName": "Repository",
            },
            "organization.repositories.edges.node.__typename": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.repositories.edges.node.description": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.repositories.edges.node.id": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.name": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when a query has a variable', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariable;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariable;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when a query has a variable with a default', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableWithDefault;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableWithDefault;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when a query has an enum variable', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithEnumVariable;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            repositories(first: 6, ownerAffiliations: [OWNER, COLLABORATOR]) {
              edges {
                node {
                  __typename
                  description
                  homepageUrl
                  id
                  name
                  owner {
                    __typename
                    id
                    login
                    url
                  }
                }
              }
            }
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithEnumVariable;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 6,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.repositories": {
              "fieldArgs": {
                "first": 6,
                "ownerAffiliations": [
                  "OWNER",
                  "COLLABORATOR",
                ],
              },
              "fieldDepth": 2,
              "hasArgs": true,
              "pathCacheKey": "repositories({"first":6,"ownerAffiliations":["OWNER","COLLABORATOR"]})",
              "pathResponseKey": "repositories",
              "typeName": "RepositoryConnection",
            },
            "organization.repositories.edges": {
              "fieldDepth": 3,
              "isList": true,
              "pathCacheKey": "edges[]",
              "pathResponseKey": "edges",
              "typeName": "RepositoryEdge",
            },
            "organization.repositories.edges.node": {
              "fieldDepth": 4,
              "isEntity": true,
              "pathCacheKey": "node",
              "pathResponseKey": "node",
              "typeName": "Repository",
            },
            "organization.repositories.edges.node.__typename": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.repositories.edges.node.description": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.repositories.edges.node.homepageUrl": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "homepageUrl",
              "pathResponseKey": "homepageUrl",
              "typeName": "URI",
            },
            "organization.repositories.edges.node.id": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.name": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner": {
              "fieldDepth": 5,
              "isEntity": true,
              "pathCacheKey": "owner",
              "pathResponseKey": "owner",
              "typeName": "RepositoryOwner",
            },
            "organization.repositories.edges.node.owner.__typename": {
              "fieldDepth": 6,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.id": {
              "fieldDepth": 6,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.owner.login": {
              "fieldDepth": 6,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.url": {
              "fieldDepth": 6,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when a query has multiple variables', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariables;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            repositories(first: 6, ownerAffiliations: [OWNER, COLLABORATOR]) {
              edges {
                node {
                  __typename
                  description
                  homepageUrl
                  id
                  name
                  owner {
                    __typename
                    login
                    url
                    ... on Organization {
                      id
                      name
                    }
                  }
                }
              }
            }
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariables;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 6,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.repositories": {
              "fieldArgs": {
                "first": 6,
                "ownerAffiliations": [
                  "OWNER",
                  "COLLABORATOR",
                ],
              },
              "fieldDepth": 2,
              "hasArgs": true,
              "pathCacheKey": "repositories({"first":6,"ownerAffiliations":["OWNER","COLLABORATOR"]})",
              "pathResponseKey": "repositories",
              "typeName": "RepositoryConnection",
            },
            "organization.repositories.edges": {
              "fieldDepth": 3,
              "isList": true,
              "pathCacheKey": "edges[]",
              "pathResponseKey": "edges",
              "typeName": "RepositoryEdge",
            },
            "organization.repositories.edges.node": {
              "fieldDepth": 4,
              "isEntity": true,
              "pathCacheKey": "node",
              "pathResponseKey": "node",
              "typeName": "Repository",
            },
            "organization.repositories.edges.node.__typename": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.repositories.edges.node.description": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.repositories.edges.node.homepageUrl": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "homepageUrl",
              "pathResponseKey": "homepageUrl",
              "typeName": "URI",
            },
            "organization.repositories.edges.node.id": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.name": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner": {
              "fieldDepth": 5,
              "isEntity": true,
              "pathCacheKey": "owner",
              "pathResponseKey": "owner",
              "typeName": "RepositoryOwner",
            },
            "organization.repositories.edges.node.owner.__typename": {
              "fieldDepth": 6,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.id": {
              "fieldDepth": 6,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "organization.repositories.edges.node.owner.login": {
              "fieldDepth": 6,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.name": {
              "fieldDepth": 6,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.url": {
              "fieldDepth": 6,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has field alias', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithAlias;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            fullName: name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithAlias;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.fullName": {
              "fieldDepth": 2,
              "fieldName": "name",
              "hasAlias": true,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "fullName",
              "pathResponseKey": "fullName",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has an include false directive', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithIncludeFalseDirective;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithIncludeFalseDirective;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has a skip true directive', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithSkipTrueDirective;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithSkipTrueDirective;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has an inline fragment', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithInlineFragment;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          repositoryOwner(login: "facebook") {
            __typename
            ... on Organization {
              description
              email
              id
              login
              name
              url
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithAlias;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.fullName": {
              "fieldDepth": 2,
              "fieldName": "name",
              "hasAlias": true,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "fullName",
              "pathResponseKey": "fullName",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has an inline fragment with no type condition', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithInlineFragmentWithNoTypeCondition;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            id
            ... {
              description
              email
              login
              name
              url
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithInlineFragmentWithNoTypeCondition;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has a variable inside an inline fragment', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInInlineFragment;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          repositoryOwner(login: "facebook") {
            __typename
            ... on Organization {
              description
              email
              id
              login
              repositories(first: 6) {
                edges {
                  node {
                    __typename
                    description
                    homepageUrl
                    id
                    name
                  }
                }
              }
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInInlineFragment;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 5,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "repositoryOwner": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "repositoryOwner({"login":"facebook"})",
              "pathResponseKey": "repositoryOwner",
              "typeName": "RepositoryOwner",
            },
            "repositoryOwner.__typename": {
              "fieldDepth": 2,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "repositoryOwner.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "repositoryOwner.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories": {
              "fieldArgs": {
                "first": 6,
              },
              "fieldDepth": 2,
              "hasArgs": true,
              "pathCacheKey": "repositories({"first":6})",
              "pathResponseKey": "repositories",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "RepositoryConnection",
            },
            "repositoryOwner.repositories.edges": {
              "fieldDepth": 3,
              "isList": true,
              "pathCacheKey": "edges[]",
              "pathResponseKey": "edges",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "RepositoryEdge",
            },
            "repositoryOwner.repositories.edges.node": {
              "fieldDepth": 4,
              "isEntity": true,
              "pathCacheKey": "node",
              "pathResponseKey": "node",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "Repository",
            },
            "repositoryOwner.repositories.edges.node.__typename": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories.edges.node.description": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories.edges.node.homepageUrl": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "homepageUrl",
              "pathResponseKey": "homepageUrl",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "URI",
            },
            "repositoryOwner.repositories.edges.node.id": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "repositoryOwner.repositories.edges.node.name": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
          },
        }
      `);
    });
  });

  describe('when query has fragment spread', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithFragmentSpread;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithFragmentSpread;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has a nested fragment spread', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithNestedFragmentSpread;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithNestedFragmentSpread;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.email": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "email",
              "pathResponseKey": "email",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.login": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "login",
              "pathResponseKey": "login",
              "typeName": "String",
            },
            "organization.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
            "organization.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query has a variable in a fragment spread', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInFragmentSpread;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            id
            repositories(first: 6) {
              edges {
                node {
                  __typename
                  description
                  homepageUrl
                  id
                  name
                }
              }
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInFragmentSpread;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 5,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "organization({"login":"facebook"})",
              "pathResponseKey": "organization",
              "typeName": "Organization",
            },
            "organization.__typename": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "Organization",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.repositories": {
              "fieldArgs": {
                "first": 6,
              },
              "fieldDepth": 2,
              "hasArgs": true,
              "pathCacheKey": "repositories({"first":6})",
              "pathResponseKey": "repositories",
              "typeName": "RepositoryConnection",
            },
            "organization.repositories.edges": {
              "fieldDepth": 3,
              "isList": true,
              "pathCacheKey": "edges[]",
              "pathResponseKey": "edges",
              "typeName": "RepositoryEdge",
            },
            "organization.repositories.edges.node": {
              "fieldDepth": 4,
              "isEntity": true,
              "pathCacheKey": "node",
              "pathResponseKey": "node",
              "typeName": "Repository",
            },
            "organization.repositories.edges.node.__typename": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "organization.repositories.edges.node.description": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeName": "String",
            },
            "organization.repositories.edges.node.homepageUrl": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "homepageUrl",
              "pathResponseKey": "homepageUrl",
              "typeName": "URI",
            },
            "organization.repositories.edges.node.id": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.name": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeName": "String",
            },
          },
        }
      `);
    });
  });

  describe('when query has a variable in an inline fragment in a fragment spread', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInInlineFragmentInNestedFragmentSpread;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          repositoryOwner(login: "facebook") {
            __typename
            ... on Organization {
              description
              id
              name
              repositories(first: 6) {
                edges {
                  node {
                    __typename
                    description
                    homepageUrl
                    id
                    name
                  }
                }
              }
              url
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInInlineFragmentInNestedFragmentSpread;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 5,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "repositoryOwner": {
              "fieldArgs": {
                "login": "facebook",
              },
              "fieldDepth": 1,
              "hasArgs": true,
              "isEntity": true,
              "isRootEntity": true,
              "pathCacheKey": "repositoryOwner({"login":"facebook"})",
              "pathResponseKey": "repositoryOwner",
              "typeName": "RepositoryOwner",
            },
            "repositoryOwner.__typename": {
              "fieldDepth": 2,
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeName": "String",
            },
            "repositoryOwner.description": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.id": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "repositoryOwner.name": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories": {
              "fieldArgs": {
                "first": 6,
              },
              "fieldDepth": 2,
              "hasArgs": true,
              "pathCacheKey": "repositories({"first":6})",
              "pathResponseKey": "repositories",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "RepositoryConnection",
            },
            "repositoryOwner.repositories.edges": {
              "fieldDepth": 3,
              "isList": true,
              "pathCacheKey": "edges[]",
              "pathResponseKey": "edges",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "RepositoryEdge",
            },
            "repositoryOwner.repositories.edges.node": {
              "fieldDepth": 4,
              "isEntity": true,
              "pathCacheKey": "node",
              "pathResponseKey": "node",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "Repository",
            },
            "repositoryOwner.repositories.edges.node.__typename": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "__typename",
              "pathResponseKey": "__typename",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories.edges.node.description": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "description",
              "pathResponseKey": "description",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories.edges.node.homepageUrl": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "homepageUrl",
              "pathResponseKey": "homepageUrl",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "URI",
            },
            "repositoryOwner.repositories.edges.node.id": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "id",
              "pathResponseKey": "id",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "repositoryOwner.repositories.edges.node.name": {
              "fieldDepth": 5,
              "isLeaf": true,
              "leafEntity": "Repository",
              "pathCacheKey": "name",
              "pathResponseKey": "name",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.url": {
              "fieldDepth": 2,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "pathCacheKey": "url",
              "pathResponseKey": "url",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "URI",
            },
          },
        }
      `);
    });
  });

  describe('when query field depth exceeds max field depth', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
        maxFieldDepth: 1,
      });
    });

    it('should throw the expected error', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithoutVariable;
      const operationContext = getOperationContext();

      expect(() => {
        operationParser.buildOperationData(operation, options, operationContext);
      }).toThrow('@graphql-box/request-parser >> request field depth of 2 exceeded max field depth of 1');
    });
  });

  describe('when query type complexity is greater than max type complexity', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
        maxTypeComplexity: 9,
        typeComplexityMap: {
          Organization: 4,
          Repository: 2,
          RepositoryOwner: 4,
        },
      });
    });

    it('should throw the expected error', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariables;
      const operationContext = getOperationContext();

      expect(() => {
        operationParser.buildOperationData(operation, options, operationContext);
      }).toThrow('@graphql-box/request-parser >> request type complexity of 10 exceeded max type complexity of 9');
    });
  });

  describe('when mutation has an input object type', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.mutationWithInputObjectType;
      const operationContext = getOperationContext({ data: { operationType: OperationTypeNode.MUTATION } });
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "mutation {
          addStar(
            input: {starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=", clientMutationId: "1"}
          ) {
            clientMutationId
            starrable {
              __typename
              ... on Repository {
                id
                stargazers(first: 6) {
                  edges {
                    node {
                      __typename
                      id
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

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.mutationWithInputObjectType;
      const operationContext = getOperationContext({ data: { operationType: OperationTypeNode.MUTATION } });
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 6,
            "operationName": "",
            "operationType": "mutation",
            "operationTypeComplexity": 0,
            "rawOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {},
        }
      `);
    });
  });
});

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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "google",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "google",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.repositories": {
              "fieldArgs": {
                "first": 20,
              },
              "hasArgs": true,
              "typeName": "RepositoryConnection",
            },
            "organization.repositories.edges": {
              "isList": true,
              "typeName": "RepositoryEdge",
            },
            "organization.repositories.edges.node": {
              "isEntity": true,
              "typeName": "Repository",
            },
            "organization.repositories.edges.node.__typename": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.description": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.id": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.name": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
              "hasArgs": true,
              "typeName": "RepositoryConnection",
            },
            "organization.repositories.edges": {
              "isList": true,
              "typeName": "RepositoryEdge",
            },
            "organization.repositories.edges.node": {
              "isEntity": true,
              "typeName": "Repository",
            },
            "organization.repositories.edges.node.__typename": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.description": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.homepageUrl": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "URI",
            },
            "organization.repositories.edges.node.id": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.name": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner": {
              "isEntity": true,
              "typeName": "RepositoryOwner",
            },
            "organization.repositories.edges.node.owner.__typename": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.id": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.owner.login": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.url": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "URI",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
              "hasArgs": true,
              "typeName": "RepositoryConnection",
            },
            "organization.repositories.edges": {
              "isList": true,
              "typeName": "RepositoryEdge",
            },
            "organization.repositories.edges.node": {
              "isEntity": true,
              "typeName": "Repository",
            },
            "organization.repositories.edges.node.__typename": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.description": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.homepageUrl": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "URI",
            },
            "organization.repositories.edges.node.id": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.name": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner": {
              "isEntity": true,
              "typeName": "RepositoryOwner",
            },
            "organization.repositories.edges.node.owner.__typename": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.id": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "organization.repositories.edges.node.owner.login": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.name": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "organization.repositories.edges.node.owner.url": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "URI",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "fieldAlias": "fullName",
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "fieldAlias": "fullName",
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.__typename": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.id": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "ID",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "repositoryOwner": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "RepositoryOwner",
            },
            "repositoryOwner.__typename": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "String",
            },
            "repositoryOwner.description": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.email": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.id": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "repositoryOwner.login": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories": {
              "fieldArgs": {
                "first": 6,
              },
              "hasArgs": true,
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "RepositoryConnection",
            },
            "repositoryOwner.repositories.edges": {
              "isList": true,
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "RepositoryEdge",
            },
            "repositoryOwner.repositories.edges.node": {
              "isEntity": true,
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "Repository",
            },
            "repositoryOwner.repositories.edges.node.__typename": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories.edges.node.description": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories.edges.node.homepageUrl": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "URI",
            },
            "repositoryOwner.repositories.edges.node.id": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "repositoryOwner.repositories.edges.node.name": {
              "isLeaf": true,
              "leafEntity": "Repository",
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
            description
            email
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            description
            email
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.email": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.login": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.name": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.url": {
              "isLeaf": true,
              "leafEntity": "Organization",
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
            description
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "Organization",
            },
            "organization.description": {
              "isLeaf": true,
              "leafEntity": "Organization",
              "typeName": "String",
            },
            "organization.repositories": {
              "fieldArgs": {
                "first": 6,
              },
              "hasArgs": true,
              "typeName": "RepositoryConnection",
            },
            "organization.repositories.edges": {
              "isList": true,
              "typeName": "RepositoryEdge",
            },
            "organization.repositories.edges.node": {
              "isEntity": true,
              "typeName": "Repository",
            },
            "organization.repositories.edges.node.__typename": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.description": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "String",
            },
            "organization.repositories.edges.node.homepageUrl": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "URI",
            },
            "organization.repositories.edges.node.id": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeName": "ID",
            },
            "organization.repositories.edges.node.name": {
              "isLeaf": true,
              "leafEntity": "Repository",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "repositoryOwner": {
              "fieldArgs": {
                "login": "facebook",
              },
              "hasArgs": true,
              "isEntity": true,
              "typeName": "RepositoryOwner",
            },
            "repositoryOwner.__typename": {
              "isAbstract": true,
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeName": "String",
            },
            "repositoryOwner.description": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.name": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories": {
              "fieldArgs": {
                "first": 6,
              },
              "hasArgs": true,
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "RepositoryConnection",
            },
            "repositoryOwner.repositories.edges": {
              "isList": true,
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "RepositoryEdge",
            },
            "repositoryOwner.repositories.edges.node": {
              "isEntity": true,
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "Repository",
            },
            "repositoryOwner.repositories.edges.node.__typename": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories.edges.node.description": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.repositories.edges.node.homepageUrl": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "URI",
            },
            "repositoryOwner.repositories.edges.node.id": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "ID",
            },
            "repositoryOwner.repositories.edges.node.name": {
              "isLeaf": true,
              "leafEntity": "Repository",
              "typeConditions": Set {
                "Organization",
              },
              "typeName": "String",
            },
            "repositoryOwner.url": {
              "isLeaf": true,
              "leafEntity": "RepositoryOwner",
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
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {},
        }
      `);
    });
  });
});

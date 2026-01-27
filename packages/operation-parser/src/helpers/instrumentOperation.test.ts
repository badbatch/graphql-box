import { githubIntrospection, parsedOperations } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { type IntrospectionQuery, OperationTypeNode, buildClientSchema, parse, print } from 'graphql';
import { instrumentOperation } from '#helpers/instrumentOperation.ts';

const {
  query,
  queryWithAlias,
  queryWithConnection,
  queryWithConnectionWithDoubleFigures,
  queryWithInlineFragment,
  queryWithInlineFragmentWithNoTypeCondition,
  queryWithUnion,
} = parsedOperations;

describe('instrumentOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('query', () => {
    it('should return the expected operation', () => {
      const ast = parse(query);

      const { instrumentedAst } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: query,
        operationType: OperationTypeNode.QUERY,
      });

      expect(print(instrumentedAst)).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            email
            id
            login
            name
          }
        }"
      `);
    });

    it('should return the expected type occurrences', () => {
      const ast = parse(query);

      const { typeOccurrences } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: query,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeOccurrences).toMatchInlineSnapshot(`
        {
          "Organization": 1,
        }
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(query);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: query,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.__typename": 2,
          "organization.email": 2,
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(query);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: query,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization": {
            "fieldArgs": {
              "login": "facebook",
            },
            "fieldDepth": 1,
            "hasArgs": true,
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
          "organization.__typename": {
            "fieldDepth": 2,
            "isLeaf": true,
            "leafEntity": "Organization",
            "pathCacheKey": "__typename",
            "pathResponseKey": "__typename",
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
        }
      `);
    });
  });

  describe('queryWithAlias', () => {
    it('should return the expected operation', () => {
      const ast = parse(queryWithAlias);

      const { instrumentedAst } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithAlias,
        operationType: OperationTypeNode.QUERY,
      });

      expect(print(instrumentedAst)).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            email
            id
            login
            fullName: name
          }
        }"
      `);
    });

    it('should return the expected type list', () => {
      const ast = parse(queryWithAlias);

      const { typeOccurrences } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithAlias,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeOccurrences).toMatchInlineSnapshot(`
        {
          "Organization": 1,
        }
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithAlias);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithAlias,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.__typename": 2,
          "organization.email": 2,
          "organization.fullName": 2,
          "organization.id": 2,
          "organization.login": 2,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithAlias);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithAlias,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization": {
            "fieldArgs": {
              "login": "facebook",
            },
            "fieldDepth": 1,
            "hasArgs": true,
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
                "fullName",
              ],
            },
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
        }
      `);
    });
  });

  describe('queryWithInlineFragment', () => {
    it('should return the expected operation', () => {
      const ast = parse(queryWithInlineFragment);

      const { instrumentedAst } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragment,
        operationType: OperationTypeNode.QUERY,
      });

      expect(print(instrumentedAst)).toMatchInlineSnapshot(`
        "{
          repositoryOwner(login: "facebook") {
            __typename
            email
            ... on Organization {
              id
              login
              name
            }
          }
        }"
      `);
    });

    it('should return the expected type list', () => {
      const ast = parse(queryWithInlineFragment);

      const { typeOccurrences } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragment,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeOccurrences).toMatchInlineSnapshot(`
        {
          "Organization": 1,
        }
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithInlineFragment);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragment,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "repositoryOwner.__typename": 2,
          "repositoryOwner.email": 2,
          "repositoryOwner.id": 2,
          "repositoryOwner.login": 2,
          "repositoryOwner.name": 2,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithInlineFragment);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragment,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "repositoryOwner": {
            "fieldArgs": {
              "login": "facebook",
            },
            "fieldDepth": 1,
            "hasArgs": true,
            "isEntity": true,
            "isRootPath": true,
            "pathCacheKey": "repositoryOwner({"login":"facebook"})",
            "pathResponseKey": "repositoryOwner",
            "requiredFields": {
              "Organization": [
                "id",
                "login",
                "name",
              ],
              "__typename": [
                "__typename",
                "email",
              ],
            },
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
          "repositoryOwner.id": {
            "fieldDepth": 2,
            "isLeaf": true,
            "leafEntity": "RepositoryOwner",
            "pathCacheKey": "id",
            "pathResponseKey": "id",
            "typeConditions": [
              "Organization",
            ],
            "typeName": "ID",
          },
          "repositoryOwner.login": {
            "fieldDepth": 2,
            "isLeaf": true,
            "leafEntity": "RepositoryOwner",
            "pathCacheKey": "login",
            "pathResponseKey": "login",
            "typeConditions": [
              "Organization",
            ],
            "typeName": "String",
          },
          "repositoryOwner.name": {
            "fieldDepth": 2,
            "isLeaf": true,
            "leafEntity": "RepositoryOwner",
            "pathCacheKey": "name",
            "pathResponseKey": "name",
            "typeConditions": [
              "Organization",
            ],
            "typeName": "String",
          },
        }
      `);
    });
  });

  describe('queryWithInlineFragmentWithNoTypeCondition', () => {
    it('should return the expected operation', () => {
      const ast = parse(queryWithInlineFragmentWithNoTypeCondition);

      const { instrumentedAst } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragmentWithNoTypeCondition,
        operationType: OperationTypeNode.QUERY,
      });

      expect(print(instrumentedAst)).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            email
            id
            ... {
              login
              name
            }
          }
        }"
      `);
    });

    it('should return the expected type list', () => {
      const ast = parse(queryWithInlineFragmentWithNoTypeCondition);

      const { typeOccurrences } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragmentWithNoTypeCondition,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeOccurrences).toMatchInlineSnapshot(`
        {
          "Organization": 1,
        }
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithInlineFragmentWithNoTypeCondition);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragmentWithNoTypeCondition,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.__typename": 2,
          "organization.email": 2,
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithInlineFragmentWithNoTypeCondition);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragmentWithNoTypeCondition,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization": {
            "fieldArgs": {
              "login": "facebook",
            },
            "fieldDepth": 1,
            "hasArgs": true,
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
          "organization.__typename": {
            "fieldDepth": 2,
            "isLeaf": true,
            "leafEntity": "Organization",
            "pathCacheKey": "__typename",
            "pathResponseKey": "__typename",
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
        }
      `);
    });
  });

  describe('queryWithConnection', () => {
    it('should return the expected operation', () => {
      const ast = parse(queryWithConnection);

      const { instrumentedAst } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithConnection,
        operationType: OperationTypeNode.QUERY,
      });

      expect(print(instrumentedAst)).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
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
          }
        }"
      `);
    });

    it('should return the expected type list', () => {
      const ast = parse(queryWithConnection);

      const { typeOccurrences } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithConnection,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeOccurrences).toMatchInlineSnapshot(`
        {
          "Organization": 1,
          "Repository": 1,
          "RepositoryConnection": 1,
          "RepositoryEdge": 1,
        }
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithConnection);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithConnection,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.__typename": 2,
          "organization.description": 2,
          "organization.email": 2,
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
          "organization.repositories.edges.node.__typename": 5,
          "organization.repositories.edges.node.description": 5,
          "organization.repositories.edges.node.homepageUrl": 5,
          "organization.repositories.edges.node.id": 5,
          "organization.repositories.edges.node.name": 5,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithConnection);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithConnection,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization": {
            "fieldArgs": {
              "login": "facebook",
            },
            "fieldDepth": 1,
            "hasArgs": true,
            "isEntity": true,
            "isRootPath": true,
            "pathCacheKey": "organization({"login":"facebook"})",
            "pathResponseKey": "organization",
            "requiredFields": {
              "__typename": [
                "__typename",
                "description",
                "email",
                "id",
                "login",
                "name",
              ],
            },
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
            "requiredFields": {
              "__typename": [
                "__typename",
                "description",
                "homepageUrl",
                "id",
                "name",
              ],
            },
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
        }
      `);
    });
  });

  describe('queryWithConnectionWithDoubleFigures', () => {
    it('should return the expected operation', () => {
      const ast = parse(queryWithConnectionWithDoubleFigures);

      const { instrumentedAst } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithConnectionWithDoubleFigures,
        operationType: OperationTypeNode.QUERY,
      });

      expect(print(instrumentedAst)).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            description
            email
            id
            login
            name
            repositories(first: 11) {
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

    it('should return the expected type list', () => {
      const ast = parse(queryWithConnectionWithDoubleFigures);

      const { typeOccurrences } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithConnectionWithDoubleFigures,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeOccurrences).toMatchInlineSnapshot(`
        {
          "Organization": 1,
          "Repository": 1,
          "RepositoryConnection": 1,
          "RepositoryEdge": 1,
        }
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithConnectionWithDoubleFigures);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithConnectionWithDoubleFigures,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.__typename": 2,
          "organization.description": 2,
          "organization.email": 2,
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
          "organization.repositories.edges.node.__typename": 5,
          "organization.repositories.edges.node.description": 5,
          "organization.repositories.edges.node.homepageUrl": 5,
          "organization.repositories.edges.node.id": 5,
          "organization.repositories.edges.node.name": 5,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithConnectionWithDoubleFigures);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithConnectionWithDoubleFigures,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization": {
            "fieldArgs": {
              "login": "facebook",
            },
            "fieldDepth": 1,
            "hasArgs": true,
            "isEntity": true,
            "isRootPath": true,
            "pathCacheKey": "organization({"login":"facebook"})",
            "pathResponseKey": "organization",
            "requiredFields": {
              "__typename": [
                "__typename",
                "description",
                "email",
                "id",
                "login",
                "name",
              ],
            },
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
              "first": 11,
            },
            "fieldDepth": 2,
            "hasArgs": true,
            "pathCacheKey": "repositories({"first":11})",
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
            "requiredFields": {
              "__typename": [
                "__typename",
                "description",
                "homepageUrl",
                "id",
                "name",
              ],
            },
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
        }
      `);
    });
  });

  describe('queryWithUnion', () => {
    it('should return the expected operation', () => {
      const ast = parse(queryWithUnion);

      const { instrumentedAst } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithUnion,
        operationType: OperationTypeNode.QUERY,
      });

      expect(print(instrumentedAst)).toMatchInlineSnapshot(`
        "{
          search(query: "react", first: 10, type: REPOSITORY) {
            edges {
              node {
                __typename
                ... on Issue {
                  bodyText
                  id
                  number
                  title
                }
                ... on MarketplaceListing {
                  howItWorks
                  id
                  shortDescription
                  slug
                }
                ... on Organization {
                  description
                  id
                  login
                  organizationName: name
                }
                ... on PullRequest {
                  bodyText
                  id
                  number
                  title
                }
                ... on Repository {
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

    it('should return the expected type list', () => {
      const ast = parse(queryWithUnion);

      const { typeOccurrences } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithUnion,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeOccurrences).toMatchInlineSnapshot(`
        {
          "Issue": 1,
          "MarketplaceListing": 1,
          "Organization": 1,
          "PullRequest": 1,
          "Repository": 1,
          "SearchResultItemConnection": 1,
          "SearchResultItemEdge": 1,
        }
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithUnion);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithUnion,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "search.edges.node.__typename": 4,
          "search.edges.node.bodyText": 4,
          "search.edges.node.description": 4,
          "search.edges.node.homepageUrl": 4,
          "search.edges.node.howItWorks": 4,
          "search.edges.node.id": 4,
          "search.edges.node.login": 4,
          "search.edges.node.name": 4,
          "search.edges.node.number": 4,
          "search.edges.node.organizationName": 4,
          "search.edges.node.shortDescription": 4,
          "search.edges.node.slug": 4,
          "search.edges.node.title": 4,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithUnion);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithUnion,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "search": {
            "fieldArgs": {
              "first": 10,
              "query": "react",
              "type": "REPOSITORY",
            },
            "fieldDepth": 1,
            "hasArgs": true,
            "isRootPath": true,
            "pathCacheKey": "search({"first":10,"query":"react","type":"REPOSITORY"})",
            "pathResponseKey": "search",
            "typeName": "SearchResultItemConnection",
          },
          "search.edges": {
            "fieldDepth": 2,
            "isList": true,
            "pathCacheKey": "edges[]",
            "pathResponseKey": "edges",
            "typeName": "SearchResultItemEdge",
          },
          "search.edges.node": {
            "fieldDepth": 3,
            "isEntity": true,
            "pathCacheKey": "node",
            "pathResponseKey": "node",
            "requiredFields": {
              "Issue": [
                "bodyText",
                "id",
                "number",
                "title",
              ],
              "MarketplaceListing": [
                "howItWorks",
                "id",
                "shortDescription",
                "slug",
              ],
              "Organization": [
                "description",
                "id",
                "login",
                "organizationName",
              ],
              "PullRequest": [
                "bodyText",
                "id",
                "number",
                "title",
              ],
              "Repository": [
                "description",
                "homepageUrl",
                "id",
                "name",
              ],
              "__typename": [
                "__typename",
              ],
            },
            "typeName": "SearchResultItem",
          },
          "search.edges.node.__typename": {
            "fieldDepth": 4,
            "isAbstract": true,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "__typename",
            "pathResponseKey": "__typename",
            "typeName": "String",
          },
          "search.edges.node.bodyText": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "bodyText",
            "pathResponseKey": "bodyText",
            "typeConditions": [
              "Issue",
              "PullRequest",
            ],
            "typeName": "String",
          },
          "search.edges.node.description": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "description",
            "pathResponseKey": "description",
            "typeConditions": [
              "Organization",
              "Repository",
            ],
            "typeName": "String",
          },
          "search.edges.node.homepageUrl": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "homepageUrl",
            "pathResponseKey": "homepageUrl",
            "typeConditions": [
              "Repository",
            ],
            "typeName": "URI",
          },
          "search.edges.node.howItWorks": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "howItWorks",
            "pathResponseKey": "howItWorks",
            "typeConditions": [
              "MarketplaceListing",
            ],
            "typeName": "String",
          },
          "search.edges.node.id": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "id",
            "pathResponseKey": "id",
            "typeConditions": [
              "Organization",
              "Issue",
              "MarketplaceListing",
              "PullRequest",
              "Repository",
            ],
            "typeName": "ID",
          },
          "search.edges.node.login": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "login",
            "pathResponseKey": "login",
            "typeConditions": [
              "Organization",
            ],
            "typeName": "String",
          },
          "search.edges.node.name": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "name",
            "pathResponseKey": "name",
            "typeConditions": [
              "Repository",
            ],
            "typeName": "String",
          },
          "search.edges.node.number": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "number",
            "pathResponseKey": "number",
            "typeConditions": [
              "Issue",
              "PullRequest",
            ],
            "typeName": "Int",
          },
          "search.edges.node.organizationName": {
            "fieldDepth": 4,
            "fieldName": "name",
            "hasAlias": true,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "organizationName",
            "pathResponseKey": "organizationName",
            "typeConditions": [
              "Organization",
            ],
            "typeName": "String",
          },
          "search.edges.node.shortDescription": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "shortDescription",
            "pathResponseKey": "shortDescription",
            "typeConditions": [
              "MarketplaceListing",
            ],
            "typeName": "String",
          },
          "search.edges.node.slug": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "slug",
            "pathResponseKey": "slug",
            "typeConditions": [
              "MarketplaceListing",
            ],
            "typeName": "String",
          },
          "search.edges.node.title": {
            "fieldDepth": 4,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "pathCacheKey": "title",
            "pathResponseKey": "title",
            "typeConditions": [
              "Issue",
              "PullRequest",
            ],
            "typeName": "String",
          },
        }
      `);
    });
  });
});

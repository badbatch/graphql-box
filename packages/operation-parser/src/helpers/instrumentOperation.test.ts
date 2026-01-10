import { githubIntrospection, parsedOperations } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { type IntrospectionQuery, OperationTypeNode, buildClientSchema, parse } from 'graphql';
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
            "hasArgs": true,
            "isEntity": true,
            "typeName": "Organization",
          },
          "organization.__typename": {
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
        }
      `);
    });
  });

  describe('queryWithAlias', () => {
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
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
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
            "hasArgs": true,
            "isEntity": true,
            "typeName": "Organization",
          },
          "organization.__typename": {
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
        }
      `);
    });
  });

  describe('queryWithInlineFragment', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithInlineFragment);

      const { typeOccurrences } = instrumentOperation(ast, githubSchema, {
        idKey: 'id',
        operation: queryWithInlineFragment,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeOccurrences).toMatchInlineSnapshot(`
        {
          "Organization": 2,
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
          "organization.__typename": 2,
          "organization.email": 2,
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
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
          "organization.email": {
            "isLeaf": true,
            "leafEntity": "Organization",
            "typeName": "String",
          },
          "organization.id": {
            "isLeaf": true,
            "leafEntity": "Organization",
            "typeConditions": Set {
              "Organization",
            },
            "typeName": "ID",
          },
          "organization.login": {
            "isLeaf": true,
            "leafEntity": "Organization",
            "typeConditions": Set {
              "Organization",
            },
            "typeName": "String",
          },
          "organization.name": {
            "isLeaf": true,
            "leafEntity": "Organization",
            "typeConditions": Set {
              "Organization",
            },
            "typeName": "String",
          },
        }
      `);
    });
  });

  describe('queryWithInlineFragmentWithNoTypeCondition', () => {
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
            "hasArgs": true,
            "isEntity": true,
            "typeName": "Organization",
          },
          "organization.__typename": {
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
        }
      `);
    });
  });

  describe('queryWithConnection', () => {
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
        }
      `);
    });
  });

  describe('queryWithConnectionWithDoubleFigures', () => {
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
              "first": 11,
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
        }
      `);
    });
  });

  describe('queryWithUnion', () => {
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
            "hasArgs": true,
            "typeName": "SearchResultItemConnection",
          },
          "search.edges": {
            "isList": true,
            "typeName": "SearchResultItemEdge",
          },
          "search.edges.node": {
            "isEntity": true,
            "typeName": "SearchResultItem",
          },
          "search.edges.node.__typename": {
            "isAbstract": true,
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeName": "String",
          },
          "search.edges.node.bodyText": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "PullRequest",
              "Issue",
            },
            "typeName": "String",
          },
          "search.edges.node.description": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "Repository",
              "Organization",
            },
            "typeName": "String",
          },
          "search.edges.node.homepageUrl": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "Repository",
            },
            "typeName": "URI",
          },
          "search.edges.node.howItWorks": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "MarketplaceListing",
            },
            "typeName": "String",
          },
          "search.edges.node.id": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "Repository",
              "PullRequest",
              "MarketplaceListing",
              "Issue",
              "Organization",
            },
            "typeName": "ID",
          },
          "search.edges.node.login": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "Organization",
            },
            "typeName": "String",
          },
          "search.edges.node.name": {
            "fieldAlias": "organizationName",
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "Repository",
              "Organization",
            },
            "typeName": "String",
          },
          "search.edges.node.number": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "PullRequest",
              "Issue",
            },
            "typeName": "Int",
          },
          "search.edges.node.shortDescription": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "MarketplaceListing",
            },
            "typeName": "String",
          },
          "search.edges.node.slug": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "MarketplaceListing",
            },
            "typeName": "String",
          },
          "search.edges.node.title": {
            "isLeaf": true,
            "leafEntity": "SearchResultItem",
            "typeConditions": Set {
              "PullRequest",
              "Issue",
            },
            "typeName": "String",
          },
        }
      `);
    });
  });
});

import { githubIntrospection, parsedOperations } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { type IntrospectionQuery, OperationTypeNode, buildClientSchema, parse } from 'graphql';
import { instrumentOperation } from '#helpers/instrumentOperation.ts';

const {
  query,
  queryWithAlias,
  queryWithConnection,
  queryWithConnectionWithDoubleFigures,
  queryWithIncludeFalseDirective,
  queryWithIncludeTrueDirective,
  queryWithInlineFragment,
  queryWithInlineFragmentWithNoTypeCondition,
  queryWithSkipFalseDirective,
  queryWithSkipTrueDirective,
} = parsedOperations;

describe('instrumentOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('query', () => {
    it('should return the expected type list', () => {
      const ast = parse(query);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: query,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(query);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: query,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
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
        operation: query,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithAlias', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithAlias);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithAlias,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithAlias);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithAlias,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
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
        operation: queryWithAlias,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.fullName": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.fullName",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithIncludeTrueDirective', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithIncludeTrueDirective);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithIncludeTrueDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithIncludeTrueDirective);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithIncludeTrueDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.email": 2,
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithIncludeTrueDirective);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        operation: queryWithIncludeTrueDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithIncludeFalseDirective', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithIncludeFalseDirective);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithIncludeFalseDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithIncludeFalseDirective);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithIncludeFalseDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithIncludeFalseDirective);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        operation: queryWithIncludeFalseDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithSkipTrueDirective', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithSkipTrueDirective);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithSkipTrueDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithSkipTrueDirective);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithSkipTrueDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithSkipTrueDirective);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        operation: queryWithSkipTrueDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithSkipFalseDirective', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithSkipFalseDirective);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithSkipFalseDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithSkipFalseDirective);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithSkipFalseDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.email": 2,
          "organization.id": 2,
          "organization.login": 2,
          "organization.name": 2,
        }
      `);
    });

    it('should return the expected field paths', () => {
      const ast = parse(queryWithSkipFalseDirective);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        operation: queryWithSkipFalseDirective,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithInlineFragment', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithInlineFragment);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithInlineFragment,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithInlineFragment);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithInlineFragment,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
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
        operation: queryWithInlineFragment,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithInlineFragmentWithNoTypeCondition', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithInlineFragmentWithNoTypeCondition);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithInlineFragmentWithNoTypeCondition,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithInlineFragmentWithNoTypeCondition);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithInlineFragmentWithNoTypeCondition,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
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
        operation: queryWithInlineFragmentWithNoTypeCondition,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithConnection', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithConnection);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithConnection,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "String",
          "String",
          "RepositoryConnection",
          "RepositoryEdge",
          "Repository",
          "String",
          "URI",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithConnection);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithConnection,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.description": 2,
          "organization.email": 2,
          "organization.login": 2,
          "organization.name": 2,
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
        operation: queryWithConnection,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.description": {
            "cachePaths": [
              "organization({"login":"facebook"}).description",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.description",
            ],
          },
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
          "organization.repositories.edges.node.description": {
            "cachePaths": [
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.description",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.description",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.description",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.description",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.description",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.description",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.repositories.edges[0].node.description",
              "organization.repositories.edges[1].node.description",
              "organization.repositories.edges[2].node.description",
              "organization.repositories.edges[3].node.description",
              "organization.repositories.edges[4].node.description",
              "organization.repositories.edges[5].node.description",
            ],
          },
          "organization.repositories.edges.node.homepageUrl": {
            "cachePaths": [
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.homepageUrl",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.repositories.edges[0].node.homepageUrl",
              "organization.repositories.edges[1].node.homepageUrl",
              "organization.repositories.edges[2].node.homepageUrl",
              "organization.repositories.edges[3].node.homepageUrl",
              "organization.repositories.edges[4].node.homepageUrl",
              "organization.repositories.edges[5].node.homepageUrl",
            ],
          },
          "organization.repositories.edges.node.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.id",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.id",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.id",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.id",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.id",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.repositories.edges[0].node.id",
              "organization.repositories.edges[1].node.id",
              "organization.repositories.edges[2].node.id",
              "organization.repositories.edges[3].node.id",
              "organization.repositories.edges[4].node.id",
              "organization.repositories.edges[5].node.id",
            ],
          },
          "organization.repositories.edges.node.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.name",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.name",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.name",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.name",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.name",
              "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.repositories.edges[0].node.name",
              "organization.repositories.edges[1].node.name",
              "organization.repositories.edges[2].node.name",
              "organization.repositories.edges[3].node.name",
              "organization.repositories.edges[4].node.name",
              "organization.repositories.edges[5].node.name",
            ],
          },
        }
      `);
    });
  });

  describe('queryWithConnectionWithDoubleFigures', () => {
    it('should return the expected type list', () => {
      const ast = parse(queryWithConnectionWithDoubleFigures);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        operation: queryWithConnectionWithDoubleFigures,
        operationType: OperationTypeNode.QUERY,
      });

      expect(typeList).toMatchInlineSnapshot(`
        [
          "Organization",
          "String",
          "String",
          "String",
          "String",
          "RepositoryConnection",
          "RepositoryEdge",
          "Repository",
          "String",
          "URI",
          "String",
          "ID",
        ]
      `);
    });

    it('should return the expected depth chart', () => {
      const ast = parse(queryWithConnectionWithDoubleFigures);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        operation: queryWithConnectionWithDoubleFigures,
        operationType: OperationTypeNode.QUERY,
      });

      expect(depthChart).toMatchInlineSnapshot(`
        {
          "organization.description": 2,
          "organization.email": 2,
          "organization.login": 2,
          "organization.name": 2,
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
        operation: queryWithConnectionWithDoubleFigures,
        operationType: OperationTypeNode.QUERY,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.description": {
            "cachePaths": [
              "organization({"login":"facebook"}).description",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.description",
            ],
          },
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.name",
            ],
          },
          "organization.repositories.edges.node.description": {
            "cachePaths": [
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[0].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[1].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[2].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[3].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[4].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[5].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[6].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[7].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[8].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[9].node.description",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[10].node.description",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.repositories.edges[0].node.description",
              "organization.repositories.edges[1].node.description",
              "organization.repositories.edges[2].node.description",
              "organization.repositories.edges[3].node.description",
              "organization.repositories.edges[4].node.description",
              "organization.repositories.edges[5].node.description",
              "organization.repositories.edges[6].node.description",
              "organization.repositories.edges[7].node.description",
              "organization.repositories.edges[8].node.description",
              "organization.repositories.edges[9].node.description",
              "organization.repositories.edges[10].node.description",
            ],
          },
          "organization.repositories.edges.node.homepageUrl": {
            "cachePaths": [
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[0].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[1].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[2].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[3].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[4].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[5].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[6].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[7].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[8].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[9].node.homepageUrl",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[10].node.homepageUrl",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.repositories.edges[0].node.homepageUrl",
              "organization.repositories.edges[1].node.homepageUrl",
              "organization.repositories.edges[2].node.homepageUrl",
              "organization.repositories.edges[3].node.homepageUrl",
              "organization.repositories.edges[4].node.homepageUrl",
              "organization.repositories.edges[5].node.homepageUrl",
              "organization.repositories.edges[6].node.homepageUrl",
              "organization.repositories.edges[7].node.homepageUrl",
              "organization.repositories.edges[8].node.homepageUrl",
              "organization.repositories.edges[9].node.homepageUrl",
              "organization.repositories.edges[10].node.homepageUrl",
            ],
          },
          "organization.repositories.edges.node.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[0].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[1].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[2].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[3].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[4].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[5].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[6].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[7].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[8].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[9].node.id",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[10].node.id",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.repositories.edges[0].node.id",
              "organization.repositories.edges[1].node.id",
              "organization.repositories.edges[2].node.id",
              "organization.repositories.edges[3].node.id",
              "organization.repositories.edges[4].node.id",
              "organization.repositories.edges[5].node.id",
              "organization.repositories.edges[6].node.id",
              "organization.repositories.edges[7].node.id",
              "organization.repositories.edges[8].node.id",
              "organization.repositories.edges[9].node.id",
              "organization.repositories.edges[10].node.id",
            ],
          },
          "organization.repositories.edges.node.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[0].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[1].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[2].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[3].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[4].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[5].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[6].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[7].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[8].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[9].node.name",
              "organization({"login":"facebook"}).repositories({"first":"11"}).edges[10].node.name",
            ],
            "isPathWithinUnion": false,
            "responsePaths": [
              "organization.repositories.edges[0].node.name",
              "organization.repositories.edges[1].node.name",
              "organization.repositories.edges[2].node.name",
              "organization.repositories.edges[3].node.name",
              "organization.repositories.edges[4].node.name",
              "organization.repositories.edges[5].node.name",
              "organization.repositories.edges[6].node.name",
              "organization.repositories.edges[7].node.name",
              "organization.repositories.edges[8].node.name",
              "organization.repositories.edges[9].node.name",
              "organization.repositories.edges[10].node.name",
            ],
          },
        }
      `);
    });
  });
});

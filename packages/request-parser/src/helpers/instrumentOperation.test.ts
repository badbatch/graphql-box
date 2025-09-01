import { githubIntrospection, parsedRequests } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { type IntrospectionQuery, buildClientSchema, parse } from 'graphql';
import { instrumentOperation } from '#helpers/instrumentOperation.ts';

const {
  query,
  queryWithAlias,
  queryWithConnection,
  queryWithIncludeFalseDirective,
  queryWithIncludeTrueDirective,
  queryWithInlineFragment,
  queryWithInlineFragmentWithNoTypeCondition,
  queryWithSkipFalseDirective,
  queryWithSkipTrueDirective,
} = parsedRequests;

describe('instrumentOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('query', () => {
    it('should return the expected type list', () => {
      const ast = parse(query);
      const { typeList } = instrumentOperation(ast, githubSchema, { query });

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
      const { depthChart } = instrumentOperation(ast, githubSchema, { query });

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
      const { fieldPaths } = instrumentOperation(ast, githubSchema, { query });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
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
      const { typeList } = instrumentOperation(ast, githubSchema, { query: queryWithAlias });

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
      const { depthChart } = instrumentOperation(ast, githubSchema, { query: queryWithAlias });

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
      const { fieldPaths } = instrumentOperation(ast, githubSchema, { query: queryWithAlias });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.fullName": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
            "responsePaths": [
              "organization.fullName",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
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
        query: queryWithIncludeTrueDirective,
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
        query: queryWithIncludeTrueDirective,
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
        query: queryWithIncludeTrueDirective,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
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
        query: queryWithIncludeFalseDirective,
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
        query: queryWithIncludeFalseDirective,
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
        query: queryWithIncludeFalseDirective,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
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
        query: queryWithSkipTrueDirective,
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
        query: queryWithSkipTrueDirective,
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
        query: queryWithSkipTrueDirective,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
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
        query: queryWithSkipFalseDirective,
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
        query: queryWithSkipFalseDirective,
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
        query: queryWithSkipFalseDirective,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
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
      const { typeList } = instrumentOperation(ast, githubSchema, { query: queryWithInlineFragment });

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
      const { depthChart } = instrumentOperation(ast, githubSchema, { query: queryWithInlineFragment });

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
      const { fieldPaths } = instrumentOperation(ast, githubSchema, { query: queryWithInlineFragment });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
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
        query: queryWithInlineFragmentWithNoTypeCondition,
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
        query: queryWithInlineFragmentWithNoTypeCondition,
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
        query: queryWithInlineFragmentWithNoTypeCondition,
      });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.id": {
            "cachePaths": [
              "organization({"login":"facebook"}).id",
            ],
            "responsePaths": [
              "organization.id",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
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
      const { typeList } = instrumentOperation(ast, githubSchema, { query: queryWithConnection });

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
      const { depthChart } = instrumentOperation(ast, githubSchema, { query: queryWithConnection });

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
      const { fieldPaths } = instrumentOperation(ast, githubSchema, { query: queryWithConnection });

      expect(fieldPaths).toMatchInlineSnapshot(`
        {
          "organization.description": {
            "cachePaths": [
              "organization({"login":"facebook"}).description",
            ],
            "responsePaths": [
              "organization.description",
            ],
          },
          "organization.email": {
            "cachePaths": [
              "organization({"login":"facebook"}).email",
            ],
            "responsePaths": [
              "organization.email",
            ],
          },
          "organization.login": {
            "cachePaths": [
              "organization({"login":"facebook"}).login",
            ],
            "responsePaths": [
              "organization.login",
            ],
          },
          "organization.name": {
            "cachePaths": [
              "organization({"login":"facebook"}).name",
            ],
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
});

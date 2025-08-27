import { githubIntrospection, parsedRequests } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { type IntrospectionQuery, buildClientSchema, parse } from 'graphql';
import { instrumentOperation } from '#helpers/instrumentOperation.ts';

const {
  singleTypeQuery,
  singleTypeQueryWithAlias,
  singleTypeQueryWithIncludeFalseDirective,
  singleTypeQueryWithIncludeTrueDirective,
  singleTypeQueryWithInlineFragment,
  singleTypeQueryWithInlineFragmentWithNoTypeCondition,
  singleTypeQueryWithSkipFalseDirective,
  singleTypeQueryWithSkipTrueDirective,
} = parsedRequests;

describe('instrumentOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('singleTypeQuery', () => {
    it('should return the expected type list', () => {
      const ast = parse(singleTypeQuery);
      const { typeList } = instrumentOperation(ast, githubSchema, { query: singleTypeQuery });

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
      const ast = parse(singleTypeQuery);
      const { depthChart } = instrumentOperation(ast, githubSchema, { query: singleTypeQuery });

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
      const ast = parse(singleTypeQuery);
      const { fieldPaths } = instrumentOperation(ast, githubSchema, { query: singleTypeQuery });

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

  describe('singleTypeQueryWithAlias', () => {
    it('should return the expected type list', () => {
      const ast = parse(singleTypeQueryWithAlias);
      const { typeList } = instrumentOperation(ast, githubSchema, { query: singleTypeQueryWithAlias });

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
      const ast = parse(singleTypeQueryWithAlias);
      const { depthChart } = instrumentOperation(ast, githubSchema, { query: singleTypeQueryWithAlias });

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
      const ast = parse(singleTypeQueryWithAlias);
      const { fieldPaths } = instrumentOperation(ast, githubSchema, { query: singleTypeQueryWithAlias });

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

  describe('singleTypeQueryWithIncludeTrueDirective', () => {
    it('should return the expected type list', () => {
      const ast = parse(singleTypeQueryWithIncludeTrueDirective);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithIncludeTrueDirective,
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
      const ast = parse(singleTypeQueryWithIncludeTrueDirective);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithIncludeTrueDirective,
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
      const ast = parse(singleTypeQueryWithIncludeTrueDirective);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithIncludeTrueDirective,
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

  describe('singleTypeQueryWithIncludeFalseDirective', () => {
    it('should return the expected type list', () => {
      const ast = parse(singleTypeQueryWithIncludeFalseDirective);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithIncludeFalseDirective,
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
      const ast = parse(singleTypeQueryWithIncludeFalseDirective);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithIncludeFalseDirective,
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
      const ast = parse(singleTypeQueryWithIncludeFalseDirective);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithIncludeFalseDirective,
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

  describe('singleTypeQueryWithSkipTrueDirective', () => {
    it('should return the expected type list', () => {
      const ast = parse(singleTypeQueryWithSkipTrueDirective);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithSkipTrueDirective,
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
      const ast = parse(singleTypeQueryWithSkipTrueDirective);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithSkipTrueDirective,
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
      const ast = parse(singleTypeQueryWithSkipTrueDirective);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithSkipTrueDirective,
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

  describe('singleTypeQueryWithSkipFalseDirective', () => {
    it('should return the expected type list', () => {
      const ast = parse(singleTypeQueryWithSkipFalseDirective);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithSkipFalseDirective,
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
      const ast = parse(singleTypeQueryWithSkipFalseDirective);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithSkipFalseDirective,
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
      const ast = parse(singleTypeQueryWithSkipFalseDirective);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithSkipFalseDirective,
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

  describe('singleTypeQueryWithInlineFragment', () => {
    it('should return the expected type list', () => {
      const ast = parse(singleTypeQueryWithInlineFragment);
      const { typeList } = instrumentOperation(ast, githubSchema, { query: singleTypeQueryWithInlineFragment });

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
      const ast = parse(singleTypeQueryWithInlineFragment);
      const { depthChart } = instrumentOperation(ast, githubSchema, { query: singleTypeQueryWithInlineFragment });

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
      const ast = parse(singleTypeQueryWithInlineFragment);
      const { fieldPaths } = instrumentOperation(ast, githubSchema, { query: singleTypeQueryWithInlineFragment });

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

  describe('singleTypeQueryWithInlineFragmentWithNoTypeCondition', () => {
    it('should return the expected type list', () => {
      const ast = parse(singleTypeQueryWithInlineFragmentWithNoTypeCondition);

      const { typeList } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithInlineFragmentWithNoTypeCondition,
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
      const ast = parse(singleTypeQueryWithInlineFragmentWithNoTypeCondition);

      const { depthChart } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithInlineFragmentWithNoTypeCondition,
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
      const ast = parse(singleTypeQueryWithInlineFragmentWithNoTypeCondition);

      const { fieldPaths } = instrumentOperation(ast, githubSchema, {
        query: singleTypeQueryWithInlineFragmentWithNoTypeCondition,
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
});

// describe('singleTypeQuery', () => {
//   it('should return the expected type list', () => {
//     const ast = parse(singleTypeQuery);
//     const { typeList } = instrumentOperation(ast, githubSchema, { query: singleTypeQuery });
//
//     expect(typeList).toMatchInlineSnapshot();
//   });
//
//   it('should return the expected depth chart', () => {
//     const ast = parse(singleTypeQuery);
//     const { depthChart } = instrumentOperation(ast, githubSchema, { query: singleTypeQuery });
//
//     expect(depthChart).toMatchInlineSnapshot();
//   });
//
//   it('should return the expected field paths', () => {
//     const ast = parse(singleTypeQuery);
//     const { fieldPaths } = instrumentOperation(ast, githubSchema, { query: singleTypeQuery });
//
//     expect(fieldPaths).toMatchInlineSnapshot();
//   });
// });

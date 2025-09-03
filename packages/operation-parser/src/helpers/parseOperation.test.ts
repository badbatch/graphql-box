import { githubIntrospection, rawOperationsAndOptions } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { buildClientSchema, parse, print } from 'graphql';
import { type IntrospectionQuery } from 'graphql';
import { parseOperation } from './parseOperation.ts';

const {
  mutationWithInputObjectType,
  queryWithDefault,
  queryWithDirectiveInInlineFragment,
  queryWithEnumVariable,
  queryWithFragmentSpread,
  queryWithIncludeTrueDirective,
  queryWithInlineFragment,
  queryWithNestedFragmentSpread,
  queryWithNumberDefault,
  queryWithReusedFragmentSpread,
  queryWithSiblingFragmentSpreads,
  queryWithVariable,
  queryWithVariableInFragmentSpread,
  queryWithVariableInInlineFragment,
  queryWithVariableInInlineFragmentInNestedFragmentSpread,
  queryWithVariableInNestedFragmentSpread,
  queryWithVariableWithDefault,
  queryWithVariables,
} = rawOperationsAndOptions;

describe('parseOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('queryWithDefault', () => {
    it('should replace the variable node with the default value', () => {
      const ast = parse(queryWithDefault.operation);

      expect(print(parseOperation(ast, githubSchema, { operation: queryWithDefault.operation })))
        .toMatchInlineSnapshot(`
        "{
          organization(login: "google") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });
  });

  describe('queryWithNumberDefault', () => {
    it('should replace the variable node with the default value', () => {
      const ast = parse(queryWithNumberDefault.operation);

      expect(print(parseOperation(ast, githubSchema, { operation: queryWithNumberDefault.operation })))
        .toMatchInlineSnapshot(`
        "{
          organization(login: "google") {
            description
            email
            login
            name
            repositories(first: 20) {
              edges {
                node {
                  description
                  name
                }
              }
            }
            url
          }
        }"
      `);
    });
  });

  describe('queryWithVariable', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariable.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithVariable.operation,
            variables: queryWithVariable.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
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
  });

  describe('queryWithVariableWithDefault', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableWithDefault.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithVariableWithDefault.operation,
            variables: queryWithVariableWithDefault.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
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
  });

  describe('queryWithEnumVariable', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithEnumVariable.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithEnumVariable.operation,
            variables: queryWithEnumVariable.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            repositories(first: 6, ownerAffiliations: [OWNER, COLLABORATOR]) {
              edges {
                node {
                  description
                  homepageUrl
                  name
                  owner {
                    login
                    url
                    ... on Organization {
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
  });

  describe('queryWithVariables', () => {
    it('should replace the variable nodes with the variable values', () => {
      const ast = parse(queryWithVariables.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithVariables.operation,
            variables: queryWithVariables.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            repositories(first: 6, ownerAffiliations: [OWNER, COLLABORATOR]) {
              edges {
                node {
                  description
                  homepageUrl
                  name
                  owner {
                    login
                    url
                    ... on Organization {
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
  });

  describe('queryWithDirective', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithIncludeTrueDirective.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithIncludeTrueDirective.operation,
            variables: queryWithIncludeTrueDirective.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email @include(if: true)
            login
            name
            url
          }
        }"
      `);
    });
  });

  describe('queryWithInlineFragment', () => {
    it('should parse the query as is', () => {
      const ast = parse(queryWithInlineFragment.operation);

      expect(print(parseOperation(ast, githubSchema, { operation: queryWithInlineFragment.operation })))
        .toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            ... on Organization {
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
  });

  describe('queryWithVariableInInlineFragment', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableInInlineFragment.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithVariableInInlineFragment.operation,
            variables: queryWithVariableInInlineFragment.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            ... on Organization {
              description
              email
              login
              repositories(first: 6) {
                edges {
                  node {
                    description
                    homepageUrl
                    name
                  }
                }
              }
            }
          }
        }"
      `);
    });
  });

  describe('queryWithDirectiveInInlineFragment', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithDirectiveInInlineFragment.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithDirectiveInInlineFragment.operation,
            variables: queryWithDirectiveInInlineFragment.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            ... on Organization {
              description
              email @include(if: false)
              login
              name
              url
            }
          }
        }"
      `);
    });
  });

  describe('queryWithFragmentSpread', () => {
    it('should replace the fragment spread with its field nodes', () => {
      const ast = parse(queryWithFragmentSpread.operation);

      expect(print(parseOperation(ast, githubSchema, { operation: queryWithFragmentSpread.operation })))
        .toMatchInlineSnapshot(`
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
  });

  describe('queryWithNestedFragmentSpread', () => {
    it('should replace the fragment spread with its field nodes', () => {
      const ast = parse(queryWithNestedFragmentSpread.operation);

      expect(print(parseOperation(ast, githubSchema, { operation: queryWithNestedFragmentSpread.operation })))
        .toMatchInlineSnapshot(`
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
  });

  describe('queryWithSiblingFragmentSpreads', () => {
    it('should replace the fragment spread with its field nodes', () => {
      const ast = parse(queryWithSiblingFragmentSpreads.operation);

      expect(print(parseOperation(ast, githubSchema, { operation: queryWithSiblingFragmentSpreads.operation })))
        .toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            name
            url
            description
            email
            login
          }
        }"
      `);
    });
  });

  describe('queryWithReusedFragmentSpread', () => {
    it('should replace the fragment spread with its field nodes', () => {
      const ast = parse(queryWithReusedFragmentSpread.operation);

      expect(print(parseOperation(ast, githubSchema, { operation: queryWithReusedFragmentSpread.operation })))
        .toMatchInlineSnapshot(`
        "{
          organization: facebook(login: "facebook") {
            description
            email
            login
            name
            url
          }
          organization: google(login: "google") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });
  });

  describe('queryWithVariableInFragmentSpread', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableInFragmentSpread.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithVariableInFragmentSpread.operation,
            variables: queryWithVariableInFragmentSpread.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            repositories(first: 6) {
              edges {
                node {
                  description
                  homepageUrl
                  name
                }
              }
            }
          }
        }"
      `);
    });
  });

  describe('queryWithVariableInNestedFragmentSpread', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableInNestedFragmentSpread.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithVariableInNestedFragmentSpread.operation,
            variables: queryWithVariableInNestedFragmentSpread.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            repositories(first: 6) {
              edges {
                node {
                  description
                  homepageUrl
                  name
                }
              }
            }
            name
            url
          }
        }"
      `);
    });
  });

  describe('queryWithVariableInInlineFragmentInNestedFragmentSpread', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableInInlineFragmentInNestedFragmentSpread.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: queryWithVariableInInlineFragmentInNestedFragmentSpread.operation,
            variables: queryWithVariableInInlineFragmentInNestedFragmentSpread.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            ... on Organization {
              description
              repositories(first: 6) {
                edges {
                  node {
                    description
                    homepageUrl
                    name
                  }
                }
              }
            }
            name
            url
          }
        }"
      `);
    });
  });

  describe('mutationWithInputObjectType', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(mutationWithInputObjectType.operation);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            operation: mutationWithInputObjectType.operation,
            variables: mutationWithInputObjectType.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "mutation {
          addStar(
            input: {clientMutationId: "1", starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg="}
          ) {
            clientMutationId
            starrable {
              ... on Repository {
                stargazers(first: 6) {
                  edges {
                    node {
                      name
                      login
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

import { githubIntrospection, rawOperationsAndOptions } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { buildClientSchema, parse, print } from 'graphql';
import { type IntrospectionQuery } from 'graphql';
import { normaliseOperation } from './normaliseOperation.ts';

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
  queryWithUnion,
  queryWithVariable,
  queryWithVariableInFragmentSpread,
  queryWithVariableInInlineFragment,
  queryWithVariableInInlineFragmentInNestedFragmentSpread,
  queryWithVariableInNestedFragmentSpread,
  queryWithVariableWithDefault,
  queryWithVariables,
} = rawOperationsAndOptions;

describe('normaliseOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('queryWithDefault', () => {
    it('should replace the variable node with the default value', () => {
      const ast = parse(queryWithDefault.operation);

      expect(print(normaliseOperation(ast, githubSchema, { operation: queryWithDefault.operation })))
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

      expect(print(normaliseOperation(ast, githubSchema, { operation: queryWithNumberDefault.operation })))
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
          normaliseOperation(ast, githubSchema, {
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
          normaliseOperation(ast, githubSchema, {
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
          normaliseOperation(ast, githubSchema, {
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
          normaliseOperation(ast, githubSchema, {
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
          normaliseOperation(ast, githubSchema, {
            operation: queryWithIncludeTrueDirective.operation,
            variables: queryWithIncludeTrueDirective.options.variables,
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

  describe('queryWithInlineFragment', () => {
    it('should parse the query as is', () => {
      const ast = parse(queryWithInlineFragment.operation);

      expect(print(normaliseOperation(ast, githubSchema, { operation: queryWithInlineFragment.operation })))
        .toMatchInlineSnapshot(`
        "{
          repositoryOwner(login: "facebook") {
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
          normaliseOperation(ast, githubSchema, {
            operation: queryWithVariableInInlineFragment.operation,
            variables: queryWithVariableInInlineFragment.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          repositoryOwner(login: "facebook") {
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
          normaliseOperation(ast, githubSchema, {
            operation: queryWithDirectiveInInlineFragment.operation,
            variables: queryWithDirectiveInInlineFragment.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          repositoryOwner(login: "facebook") {
            ... on Organization {
              description
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

      expect(print(normaliseOperation(ast, githubSchema, { operation: queryWithFragmentSpread.operation })))
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

      expect(print(normaliseOperation(ast, githubSchema, { operation: queryWithNestedFragmentSpread.operation })))
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

      expect(print(normaliseOperation(ast, githubSchema, { operation: queryWithSiblingFragmentSpreads.operation })))
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

  describe('queryWithReusedFragmentSpread', () => {
    it('should replace the fragment spread with its field nodes', () => {
      const ast = parse(queryWithReusedFragmentSpread.operation);

      expect(print(normaliseOperation(ast, githubSchema, { operation: queryWithReusedFragmentSpread.operation })))
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
          normaliseOperation(ast, githubSchema, {
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
          normaliseOperation(ast, githubSchema, {
            operation: queryWithVariableInNestedFragmentSpread.operation,
            variables: queryWithVariableInNestedFragmentSpread.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            name
            repositories(first: 6) {
              edges {
                node {
                  description
                  homepageUrl
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

  describe('queryWithVariableInInlineFragmentInNestedFragmentSpread', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableInInlineFragmentInNestedFragmentSpread.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            operation: queryWithVariableInInlineFragmentInNestedFragmentSpread.operation,
            variables: queryWithVariableInInlineFragmentInNestedFragmentSpread.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          repositoryOwner(login: "facebook") {
            ... on Organization {
              description
              name
              repositories(first: 6) {
                edges {
                  node {
                    description
                    homepageUrl
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
  });

  describe('queryWithUnion', () => {
    it('should inject the id and typename fields', () => {
      const ast = parse(queryWithUnion.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            operation: queryWithUnion.operation,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          search(query: "react", first: 10, type: REPOSITORY) {
            edges {
              node {
                ... on Issue {
                  bodyText
                  number
                  title
                }
                ... on MarketplaceListing {
                  howItWorks
                  shortDescription
                  slug
                }
                ... on Organization {
                  description
                  login
                  organizationName: name
                }
                ... on PullRequest {
                  bodyText
                  number
                  title
                }
                ... on Repository {
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

  describe('mutationWithInputObjectType', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(mutationWithInputObjectType.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            operation: mutationWithInputObjectType.operation,
            variables: mutationWithInputObjectType.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "mutation {
          addStar(
            input: {starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=", clientMutationId: "1"}
          ) {
            clientMutationId
            starrable {
              ... on Repository {
                stargazers(first: 6) {
                  edges {
                    node {
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

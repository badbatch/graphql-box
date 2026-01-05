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

      expect(print(normaliseOperation(ast, githubSchema, { idKey: 'id', operation: queryWithDefault.operation })))
        .toMatchInlineSnapshot(`
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
  });

  describe('queryWithNumberDefault', () => {
    it('should replace the variable node with the default value', () => {
      const ast = parse(queryWithNumberDefault.operation);

      expect(print(normaliseOperation(ast, githubSchema, { idKey: 'id', operation: queryWithNumberDefault.operation })))
        .toMatchInlineSnapshot(`
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
  });

  describe('queryWithVariable', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariable.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
            operation: queryWithVariable.operation,
            variables: queryWithVariable.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
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
  });

  describe('queryWithVariableWithDefault', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableWithDefault.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
            operation: queryWithVariableWithDefault.operation,
            variables: queryWithVariableWithDefault.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
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
  });

  describe('queryWithEnumVariable', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithEnumVariable.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
            operation: queryWithEnumVariable.operation,
            variables: queryWithEnumVariable.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
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
  });

  describe('queryWithVariables', () => {
    it('should replace the variable nodes with the variable values', () => {
      const ast = parse(queryWithVariables.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
            operation: queryWithVariables.operation,
            variables: queryWithVariables.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
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
  });

  describe('queryWithDirective', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithIncludeTrueDirective.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
            operation: queryWithIncludeTrueDirective.operation,
            variables: queryWithIncludeTrueDirective.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
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
  });

  describe('queryWithInlineFragment', () => {
    it('should parse the query as is', () => {
      const ast = parse(queryWithInlineFragment.operation);

      expect(
        print(normaliseOperation(ast, githubSchema, { idKey: 'id', operation: queryWithInlineFragment.operation })),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            id
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
  });

  describe('queryWithVariableInInlineFragment', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableInInlineFragment.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
            operation: queryWithVariableInInlineFragment.operation,
            variables: queryWithVariableInInlineFragment.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            id
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
  });

  describe('queryWithDirectiveInInlineFragment', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithDirectiveInInlineFragment.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
            operation: queryWithDirectiveInInlineFragment.operation,
            variables: queryWithDirectiveInInlineFragment.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            __typename
            id
            ... on Organization {
              description
              id
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

      expect(
        print(normaliseOperation(ast, githubSchema, { idKey: 'id', operation: queryWithFragmentSpread.operation })),
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

  describe('queryWithNestedFragmentSpread', () => {
    it('should replace the fragment spread with its field nodes', () => {
      const ast = parse(queryWithNestedFragmentSpread.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, { idKey: 'id', operation: queryWithNestedFragmentSpread.operation }),
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

  describe('queryWithSiblingFragmentSpreads', () => {
    it('should replace the fragment spread with its field nodes', () => {
      const ast = parse(queryWithSiblingFragmentSpreads.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, { idKey: 'id', operation: queryWithSiblingFragmentSpreads.operation }),
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

  describe('queryWithReusedFragmentSpread', () => {
    it('should replace the fragment spread with its field nodes', () => {
      const ast = parse(queryWithReusedFragmentSpread.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, { idKey: 'id', operation: queryWithReusedFragmentSpread.operation }),
        ),
      ).toMatchInlineSnapshot(`
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
            idKey: 'id',
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
  });

  describe('queryWithVariableInNestedFragmentSpread', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(queryWithVariableInNestedFragmentSpread.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
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
            idKey: 'id',
            operation: queryWithVariableInInlineFragmentInNestedFragmentSpread.operation,
            variables: queryWithVariableInInlineFragmentInNestedFragmentSpread.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            name
            url
            ... on Organization {
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
            idKey: 'id',
            operation: queryWithUnion.operation,
          }),
        ),
      ).toMatchInlineSnapshot(`
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
  });

  describe('mutationWithInputObjectType', () => {
    it('should replace the variable node with the variable value', () => {
      const ast = parse(mutationWithInputObjectType.operation);

      expect(
        print(
          normaliseOperation(ast, githubSchema, {
            idKey: 'id',
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
  });
});

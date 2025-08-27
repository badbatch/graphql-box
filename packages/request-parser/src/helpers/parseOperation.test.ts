import { githubIntrospection, requestsAndOptions } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { buildClientSchema, parse, print } from 'graphql';
import { type IntrospectionQuery } from 'graphql';
import { parseOperation } from './parseOperation.ts';

const {
  mutationWithInputObjectType,
  queryWithDefault,
  queryWithDirective,
  queryWithDirectiveInInlineFragment,
  queryWithEnumVariable,
  queryWithFragmentSpread,
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
} = requestsAndOptions;

describe('parseOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('queryWithDefault', () => {
    it('should replace the variable node with the default value', () => {
      const ast = parse(queryWithDefault.request);

      expect(print(parseOperation(ast, githubSchema, { query: queryWithDefault.request }))).toMatchInlineSnapshot(`
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
      const ast = parse(queryWithNumberDefault.request);

      expect(print(parseOperation(ast, githubSchema, { query: queryWithNumberDefault.request })))
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
      const ast = parse(queryWithVariable.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithVariable.request,
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
      const ast = parse(queryWithVariableWithDefault.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithVariableWithDefault.request,
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
      const ast = parse(queryWithEnumVariable.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithEnumVariable.request,
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
      const ast = parse(queryWithVariables.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithVariables.request,
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
      const ast = parse(queryWithDirective.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithDirective.request,
            variables: queryWithDirective.options.variables,
          }),
        ),
      ).toMatchInlineSnapshot(`
          "{
            organization(login: "facebook") {
              description
              email @include(if: false)
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
      const ast = parse(queryWithInlineFragment.request);

      expect(print(parseOperation(ast, githubSchema, { query: queryWithInlineFragment.request })))
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
      const ast = parse(queryWithVariableInInlineFragment.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithVariableInInlineFragment.request,
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
      const ast = parse(queryWithDirectiveInInlineFragment.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithDirectiveInInlineFragment.request,
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
      const ast = parse(queryWithFragmentSpread.request);

      expect(print(parseOperation(ast, githubSchema, { query: queryWithFragmentSpread.request })))
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
      const ast = parse(queryWithNestedFragmentSpread.request);

      expect(print(parseOperation(ast, githubSchema, { query: queryWithNestedFragmentSpread.request })))
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
      const ast = parse(queryWithSiblingFragmentSpreads.request);

      expect(print(parseOperation(ast, githubSchema, { query: queryWithSiblingFragmentSpreads.request })))
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
      const ast = parse(queryWithReusedFragmentSpread.request);

      expect(print(parseOperation(ast, githubSchema, { query: queryWithReusedFragmentSpread.request })))
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
      const ast = parse(queryWithVariableInFragmentSpread.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithVariableInFragmentSpread.request,
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
      const ast = parse(queryWithVariableInNestedFragmentSpread.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithVariableInNestedFragmentSpread.request,
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
      const ast = parse(queryWithVariableInInlineFragmentInNestedFragmentSpread.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: queryWithVariableInInlineFragmentInNestedFragmentSpread.request,
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
      const ast = parse(mutationWithInputObjectType.request);

      expect(
        print(
          parseOperation(ast, githubSchema, {
            query: mutationWithInputObjectType.request,
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

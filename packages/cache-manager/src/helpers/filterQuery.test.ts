import { parsedRequests } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { parse } from 'graphql/index.js';
import { filterQuery } from './filterQuery.ts';

describe('filterQuery', () => {
  describe('singleTypeQuery', () => {
    it('should remove the matching resolved operation paths', () => {
      const ast = parse(parsedRequests.singleTypeQuery);

      expect(filterQuery(ast, ['organization.description', 'organization.url'])).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            email
            login
            name
            id
          }
        }"
      `);
    });

    describe('when all fields within the operation are resolved', () => {
      it('should do something...', () => {
        const ast = parse(parsedRequests.singleTypeQuery);

        expect(
          filterQuery(ast, [
            'organization.description',
            'organization.email',
            'organization.login',
            'organization.name',
            'organization.id',
            'organization.url',
          ]),
        ).toMatchInlineSnapshot(`""`);
      });
    });
  });

  describe('nestedTypeQuery', () => {
    it('should remove the matching resolved operation paths', () => {
      const ast = parse(parsedRequests.nestedTypeQuery);

      expect(
        filterQuery(ast, [
          'organization.description',
          'organization.url',
          'organization.repositories.edges.node.homepageUrl',
          'organization.repositories.edges.node.owner.login',
        ]),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            email
            login
            name
            repositories(first: 6) {
              edges {
                node {
                  description
                  name
                  id
                  owner {
                    url
                    ... on Organization {
                      name
                      id
                    }
                    __typename
                  }
                }
              }
            }
            id
          }
        }"
      `);
    });

    describe('when all fields within an inline fragment are resolved', () => {
      it('should remove the empty inline fragment', () => {
        const ast = parse(parsedRequests.nestedTypeQuery);

        expect(
          filterQuery(ast, [
            'organization.repositories.edges.node.owner.name',
            'organization.repositories.edges.node.owner.id',
          ]),
        ).toMatchInlineSnapshot(`
          "{
            organization(login: "facebook") {
              description
              email
              login
              name
              repositories(first: 6) {
                edges {
                  node {
                    description
                    homepageUrl
                    name
                    id
                    owner {
                      login
                      url
                      __typename
                    }
                  }
                }
              }
              url
              id
            }
          }"
        `);
      });
    });

    describe('when all fields within a field are resolved', () => {
      it('should remove the empty field', () => {
        const ast = parse(parsedRequests.nestedTypeQuery);

        expect(
          filterQuery(ast, [
            'organization.repositories.edges.node.owner.id',
            'organization.repositories.edges.node.owner.login',
            'organization.repositories.edges.node.owner.name',
            'organization.repositories.edges.node.owner.url',
            'organization.repositories.edges.node.owner.__typename',
          ]),
        ).toMatchInlineSnapshot(`
          "{
            organization(login: "facebook") {
              description
              email
              login
              name
              repositories(first: 6) {
                edges {
                  node {
                    description
                    homepageUrl
                    name
                    id
                  }
                }
              }
              url
              id
            }
          }"
        `);
      });
    });

    describe('when all fields within nested fields are resolved', () => {
      it('should remove the nested empty fields', () => {
        const ast = parse(parsedRequests.nestedTypeQuery);

        expect(
          filterQuery(ast, [
            'organization.repositories.edges.node.description',
            'organization.repositories.edges.node.homepageUrl',
            'organization.repositories.edges.node.name',
            'organization.repositories.edges.node.id',
            'organization.repositories.edges.node.owner.id',
            'organization.repositories.edges.node.owner.login',
            'organization.repositories.edges.node.owner.name',
            'organization.repositories.edges.node.owner.url',
            'organization.repositories.edges.node.owner.__typename',
          ]),
        ).toMatchInlineSnapshot(`
          "{
            organization(login: "facebook") {
              description
              email
              login
              name
              url
              id
            }
          }"
        `);
      });
    });
  });

  describe('nestedTypeQueryWithFragments', () => {
    it('should remove the matching resolved operation paths', () => {
      const ast = parse(parsedRequests.nestedTypeQueryWithFragments);

      expect(
        filterQuery(ast, [
          'organization.description',
          'organization.name',
          'organization.repositories.edges.node.homepageUrl',
          'organization.repositories.edges.node.owner.name',
          'organization.repositories.edges.node.owner.url',
        ]),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            email
            isVerified
            location
            login
            repositories(first: 6) {
              edges {
                node {
                  ... on Repository {
                    description
                    name
                    owner {
                      login
                      ... on Organization {
                        id
                      }
                      __typename
                    }
                    id
                  }
                }
              }
            }
            url
            id
          }
        }"
      `);
    });

    describe('when all fields within nested fields are resolved', () => {
      it('should remove the nested empty fields', () => {
        const ast = parse(parsedRequests.nestedTypeQueryWithFragments);

        expect(
          filterQuery(ast, [
            'organization.repositories.edges.node.description',
            'organization.repositories.edges.node.homepageUrl',
            'organization.repositories.edges.node.id',
            'organization.repositories.edges.node.name',
            'organization.repositories.edges.node.owner.id',
            'organization.repositories.edges.node.owner.login',
            'organization.repositories.edges.node.owner.name',
            'organization.repositories.edges.node.owner.url',
            'organization.repositories.edges.node.owner.__typename',
          ]),
        ).toMatchInlineSnapshot(`
          "{
            organization(login: "facebook") {
              email
              description
              isVerified
              location
              login
              name
              url
              id
            }
          }"
        `);
      });
    });
  });

  describe('nestedUnionQuery', () => {
    it('should remove the matching resolved operation paths', () => {
      const ast = parse(parsedRequests.nestedUnionQuery);

      expect(
        filterQuery(ast, [
          'search.edges.node.description',
          'search.edges.node.homepageUrl',
          'search.edges.node.number',
          'search.edges.node.shortDescription',
          'search.edges.node.title',
        ]),
      ).toMatchInlineSnapshot(`
        "{
          search(query: "react", first: 10, type: REPOSITORY) {
            edges {
              node {
                ... on Organization {
                  login
                  organizationName: name
                  id
                }
                ... on Issue {
                  bodyText
                  id
                }
                ... on MarketplaceListing {
                  slug
                  howItWorks
                  id
                }
                ... on PullRequest {
                  bodyText
                  id
                }
                ... on Repository {
                  name
                  id
                }
                __typename
              }
            }
          }
        }"
      `);
    });

    describe('when all fields within an inline fragment are resolved', () => {
      it('should remove the empty inline fragment', () => {
        const ast = parse(parsedRequests.nestedUnionQuery);

        expect(
          filterQuery(ast, [
            'search.edges.node.description',
            'search.edges.node.homepageUrl',
            'search.edges.node.id',
            'search.edges.node.login',
            'search.edges.node.name',
            'search.edges.node.number',
            'search.edges.node.organizationName',
            'search.edges.node.shortDescription',
            'search.edges.node.title',
          ]),
        ).toMatchInlineSnapshot(`
          "{
            search(query: "react", first: 10, type: REPOSITORY) {
              edges {
                node {
                  ... on Issue {
                    bodyText
                  }
                  ... on MarketplaceListing {
                    slug
                    howItWorks
                  }
                  ... on PullRequest {
                    bodyText
                  }
                  __typename
                }
              }
            }
          }"
        `);
      });
    });
  });
});

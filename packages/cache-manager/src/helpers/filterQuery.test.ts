import { parsedOperations } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { parse, print } from 'graphql';
import { filterQuery } from './filterQuery.ts';

describe('filterQuery', () => {
  describe('when an operation is filtered', () => {
    it('should remove the matching resolved operation paths', () => {
      const ast = parse(parsedOperations.query);

      expect(print(filterQuery(ast, ['organization.email', 'organization.login']))).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            name
            id
          }
        }"
      `);
    });

    describe('when all fields within the operation are resolved', () => {
      it('should return an empty string', () => {
        const ast = parse(parsedOperations.query);

        expect(
          print(filterQuery(ast, ['organization.email', 'organization.login', 'organization.name', 'organization.id'])),
        ).toMatchInlineSnapshot(`""`);
      });
    });
  });

  describe('when all fields within an inline fragment are resolved', () => {
    it('should remove the empty inline fragment', () => {
      const ast = parse(parsedOperations.queryWithInlineFragment);

      expect(print(filterQuery(ast, ['organization.login', 'organization.name', 'organization.id'])))
        .toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            email
          }
        }"
      `);
    });
  });

  describe('when an operation with a connection is filtered', () => {
    it('should remove the matching resolved operation paths', () => {
      const ast = parse(parsedOperations.queryWithConnection);

      expect(
        print(
          filterQuery(ast, [
            'organization.description',
            'organization.email',
            'organization.repositories.edges.node.homepageUrl',
            'organization.repositories.edges.node.id',
          ]),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            login
            name
            repositories(first: 6) {
              edges {
                node {
                  description
                  name
                }
              }
            }
          }
        }"
      `);
    });
  });

  describe('when all fields within a field are resolved', () => {
    it('should remove the empty field', () => {
      const ast = parse(parsedOperations.queryWithConnection);

      expect(
        print(
          filterQuery(ast, [
            'organization.repositories.edges.node.description',
            'organization.repositories.edges.node.name',
            'organization.repositories.edges.node.homepageUrl',
            'organization.repositories.edges.node.id',
          ]),
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
          }
        }"
      `);
    });
  });

  describe('when all fields within nested fields are resolved', () => {
    it('should remove the nested empty fields', () => {
      const ast = parse(parsedOperations.queryWithConnectionWithNestedInlineFragment);

      expect(
        print(
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
        ),
      ).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
          }
        }"
      `);
    });
  });

  describe('when an operation with a union is filtered', () => {
    it('should remove the matching resolved operation paths', () => {
      const ast = parse(parsedOperations.queryWithUnion);

      expect(
        print(
          filterQuery(ast, [
            'search.edges.node.description',
            'search.edges.node.homepageUrl',
            'search.edges.node.number',
            'search.edges.node.shortDescription',
            'search.edges.node.title',
          ]),
        ),
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

    describe('when all fields within a union inline fragment are resolved', () => {
      it('should remove the empty inline fragment', () => {
        const ast = parse(parsedOperations.queryWithUnion);

        expect(
          print(
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
          ),
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

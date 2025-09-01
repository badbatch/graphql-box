import { githubIntrospection, parsedRequests } from '@graphql-box/test-utils';
import { type IntrospectionQuery, buildClientSchema, parse } from 'graphql';
import { validateOperation } from './validateOperation.ts';

const { query, queryWithConnection, queryWithIncludeTrueDirective } = parsedRequests;

describe('validateOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('maxDepth', () => {
    describe('when maxDepth is greater than maxFieldDepth', () => {
      it('should throw the expected error', () => {
        const ast = parse(query);

        const depthChart = {
          'organization.email': 2,
          'organization.id': 2,
          'organization.login': 2,
          'organization.name': 2,
        };

        const typeList = ['Organization', 'String', 'String', 'String', 'ID'];

        expect(() => {
          validateOperation({
            ast,
            depthChart,
            maxFieldDepth: 1,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeList,
          });
        }).toThrow('@graphql-box/request-parser >> request field depth of 2 exceeded max field depth of 1');
      });
    });

    describe('when maxDepth is less than maxFieldDepth', () => {
      it('should not throw an error', () => {
        const ast = parse(query);

        const depthChart = {
          'organization.email': 2,
          'organization.id': 2,
          'organization.login': 2,
          'organization.name': 2,
        };

        const typeList = ['Organization', 'String', 'String', 'String', 'ID'];

        expect(() => {
          validateOperation({
            ast,
            depthChart,
            maxFieldDepth: 3,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeList,
          });
        }).not.toThrow();
      });
    });

    describe('when maxDepth is equal to maxFieldDepth', () => {
      it('should not throw an error', () => {
        const ast = parse(query);

        const depthChart = {
          'organization.email': 2,
          'organization.id': 2,
          'organization.login': 2,
          'organization.name': 2,
        };

        const typeList = ['Organization', 'String', 'String', 'String', 'ID'];

        expect(() => {
          validateOperation({
            ast,
            depthChart,
            maxFieldDepth: 2,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeList,
          });
        }).not.toThrow();
      });
    });
  });

  describe('typeComplexity', () => {
    describe('when typeComplexity is greater than maxTypeComplexity', () => {
      it('should throw the expected error', () => {
        const ast = parse(queryWithConnection);

        const depthChart = {
          'organization.description': 2,
          'organization.email': 2,
          'organization.login': 2,
          'organization.name': 2,
          'organization.repositories.edges.node.description': 5,
          'organization.repositories.edges.node.homepageUrl': 5,
          'organization.repositories.edges.node.id': 5,
          'organization.repositories.edges.node.name': 5,
        };

        const typeList = [
          'Organization',
          'String',
          'String',
          'String',
          'String',
          'RepositoryConnection',
          'RepositoryEdge',
          'Repository',
          'String',
          'URI',
          'String',
          'ID',
        ];

        expect(() => {
          validateOperation({
            ast,
            depthChart,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: 9,
            schema: githubSchema,
            typeComplexityMap: {
              Organization: 3,
              Repository: 3,
              RepositoryConnection: 4,
            },
            typeList,
          });
        }).toThrow('@graphql-box/request-parser >> request type complexity of 10 exceeded max type complexity of 9');
      });
    });

    describe('when typeComplexity is less than maxTypeComplexity', () => {
      it('should not throw an error', () => {
        const ast = parse(queryWithConnection);

        const depthChart = {
          'organization.description': 2,
          'organization.email': 2,
          'organization.login': 2,
          'organization.name': 2,
          'organization.repositories.edges.node.description': 5,
          'organization.repositories.edges.node.homepageUrl': 5,
          'organization.repositories.edges.node.id': 5,
          'organization.repositories.edges.node.name': 5,
        };

        const typeList = [
          'Organization',
          'String',
          'String',
          'String',
          'String',
          'RepositoryConnection',
          'RepositoryEdge',
          'Repository',
          'String',
          'URI',
          'String',
          'ID',
        ];

        expect(() => {
          validateOperation({
            ast,
            depthChart,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: 9,
            schema: githubSchema,
            typeComplexityMap: {
              Organization: 3,
              Repository: 3,
              RepositoryConnection: 2,
            },
            typeList,
          });
        }).not.toThrow();
      });
    });

    describe('when typeComplexity is equal to maxTypeComplexity', () => {
      it('should not throw an error', () => {
        const ast = parse(queryWithConnection);

        const depthChart = {
          'organization.description': 2,
          'organization.email': 2,
          'organization.login': 2,
          'organization.name': 2,
          'organization.repositories.edges.node.description': 5,
          'organization.repositories.edges.node.homepageUrl': 5,
          'organization.repositories.edges.node.id': 5,
          'organization.repositories.edges.node.name': 5,
        };

        const typeList = [
          'Organization',
          'String',
          'String',
          'String',
          'String',
          'RepositoryConnection',
          'RepositoryEdge',
          'Repository',
          'String',
          'URI',
          'String',
          'ID',
        ];

        expect(() => {
          validateOperation({
            ast,
            depthChart,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: 9,
            schema: githubSchema,
            typeComplexityMap: {
              Organization: 3,
              Repository: 3,
              RepositoryConnection: 3,
            },
            typeList,
          });
        }).not.toThrow();
      });
    });
  });

  describe('AST', () => {
    describe('when the AST is invalid', () => {
      it('should throw the expected error', () => {
        const queryWithInvalidDirective = `{
          organization(login: "facebook") {
            email @blah
            login
            name
            id
          }
        }`;

        const ast = parse(queryWithInvalidDirective);

        const depthChart = {
          'organization.email': 2,
          'organization.id': 2,
          'organization.login': 2,
          'organization.name': 2,
        };

        const typeList = ['Organization', 'String', 'String', 'String', 'ID'];

        expect(() => {
          validateOperation({
            ast,
            depthChart,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeList,
          });
        }).toThrow('@graphql-box/request-parser AST validation errors');
      });
    });

    describe('when the AST is valid', () => {
      it('should not throw an error', () => {
        const ast = parse(queryWithIncludeTrueDirective);

        const depthChart = {
          'organization.email': 2,
          'organization.id': 2,
          'organization.login': 2,
          'organization.name': 2,
        };

        const typeList = ['Organization', 'String', 'String', 'String', 'ID'];

        expect(() => {
          validateOperation({
            ast,
            depthChart,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeList,
          });
        }).not.toThrow();
      });
    });
  });
});

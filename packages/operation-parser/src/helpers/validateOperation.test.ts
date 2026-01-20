import { githubIntrospection, parsedOperations } from '@graphql-box/test-utils';
import { type IntrospectionQuery, buildClientSchema, parse } from 'graphql';
import { validateOperation } from './validateOperation.ts';

const { query, queryWithConnection } = parsedOperations;

describe('validateOperation', () => {
  const githubSchema = buildClientSchema(githubIntrospection as IntrospectionQuery);

  describe('maxDepth', () => {
    describe('when maxDepth is greater than maxFieldDepth', () => {
      it('should throw the expected error', () => {
        const ast = parse(query);

        expect(() => {
          validateOperation({
            ast,
            fieldDepth: 2,
            maxFieldDepth: 1,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeComplexity: 0,
          });
        }).toThrow('@graphql-box/request-parser >> request field depth of 2 exceeded max field depth of 1');
      });
    });

    describe('when maxDepth is less than maxFieldDepth', () => {
      it('should not throw an error', () => {
        const ast = parse(query);

        expect(() => {
          validateOperation({
            ast,
            fieldDepth: 2,
            maxFieldDepth: 3,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeComplexity: 0,
          });
        }).not.toThrow();
      });
    });

    describe('when maxDepth is equal to maxFieldDepth', () => {
      it('should not throw an error', () => {
        const ast = parse(query);

        expect(() => {
          validateOperation({
            ast,
            fieldDepth: 2,
            maxFieldDepth: 2,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeComplexity: 0,
          });
        }).not.toThrow();
      });
    });
  });

  describe('typeComplexity', () => {
    describe('when typeComplexity is greater than maxTypeComplexity', () => {
      it('should throw the expected error', () => {
        const ast = parse(queryWithConnection);

        expect(() => {
          validateOperation({
            ast,
            fieldDepth: 5,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: 9,
            schema: githubSchema,
            typeComplexity: 10,
          });
        }).toThrow('@graphql-box/request-parser >> request type complexity of 10 exceeded max type complexity of 9');
      });
    });

    describe('when typeComplexity is less than maxTypeComplexity', () => {
      it('should not throw an error', () => {
        const ast = parse(queryWithConnection);

        expect(() => {
          validateOperation({
            ast,
            fieldDepth: 5,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: 9,
            schema: githubSchema,
            typeComplexity: 7,
          });
        }).not.toThrow();
      });
    });

    describe('when typeComplexity is equal to maxTypeComplexity', () => {
      it('should not throw an error', () => {
        const ast = parse(queryWithConnection);

        expect(() => {
          validateOperation({
            ast,
            fieldDepth: 5,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: 9,
            schema: githubSchema,
            typeComplexity: 9,
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

        expect(() => {
          validateOperation({
            ast,
            fieldDepth: 2,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeComplexity: 0,
          });
        }).toThrow('@graphql-box/request-parser AST validation errors');
      });
    });

    describe('when the AST is valid', () => {
      it('should not throw an error', () => {
        const ast = parse(query);

        expect(() => {
          validateOperation({
            ast,
            fieldDepth: 2,
            maxFieldDepth: Number.POSITIVE_INFINITY,
            maxTypeComplexity: Number.POSITIVE_INFINITY,
            schema: githubSchema,
            typeComplexity: 0,
          });
        }).not.toThrow();
      });
    });
  });
});

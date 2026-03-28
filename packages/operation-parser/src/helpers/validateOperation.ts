import { InternalError } from '@graphql-box/helpers';
import { type DocumentNode, type GraphQLSchema, validate } from 'graphql';

export type ValidateOperationOptions = {
  ast: DocumentNode;
  fieldDepth: number;
  maxFieldDepth: number;
  maxTypeComplexity: number;
  schema: GraphQLSchema;
  typeComplexity: number;
};

export const validateOperation = ({
  ast,
  fieldDepth,
  maxFieldDepth,
  maxTypeComplexity,
  schema,
  typeComplexity,
}: ValidateOperationOptions): void => {
  const errors = validate(schema, ast);

  if (errors.length > 0) {
    throw new AggregateError(errors, '@graphql-box/request-parser AST validation errors');
  }

  if (fieldDepth > maxFieldDepth) {
    throw new InternalError(
      `@graphql-box/request-parser: request field depth of ${String(fieldDepth)} exceeded max field depth of ${String(maxFieldDepth)}`,
    );
  }

  if (typeComplexity > maxTypeComplexity) {
    throw new InternalError(
      `@graphql-box/request-parser: request type complexity of ${String(typeComplexity)} exceeded max type complexity of ${String(maxTypeComplexity)}`,
    );
  }
};

import { GroupedError } from '@graphql-box/helpers';
import { type DocumentNode, type GraphQLSchema, validate } from 'graphql';
import { calcTypeComplexity } from '#helpers/calcTypeComplexity.ts';
import { getMaxDepthFromChart } from '#helpers/getMaxDepthFromChart.ts';

export type ValidateOperationOptions = {
  ast: DocumentNode;
  depthChart: Record<string, number>;
  maxFieldDepth: number;
  maxTypeComplexity: number;
  schema: GraphQLSchema;
  typeComplexityMap?: Record<string, number>;
  typeList: string[];
};

export const validateOperation = ({
  ast,
  depthChart,
  maxFieldDepth,
  maxTypeComplexity,
  schema,
  typeComplexityMap,
  typeList,
}: ValidateOperationOptions): void => {
  const maxDepth = getMaxDepthFromChart(depthChart);

  if (maxDepth > maxFieldDepth) {
    throw new Error(
      `@graphql-box/request-parser >> request field depth of ${String(maxDepth)} exceeded max field depth of ${String(maxFieldDepth)}`,
    );
  }

  if (typeComplexityMap) {
    const typeComplexity = calcTypeComplexity(typeList, typeComplexityMap);

    if (typeComplexity > maxTypeComplexity) {
      throw new Error(
        `@graphql-box/request-parser >> request type complexity of ${String(typeComplexity)} exceeded max type complexity of ${String(maxTypeComplexity)}`,
      );
    }
  }

  const errors = validate(schema, ast);

  if (errors.length > 0) {
    throw new GroupedError('@graphql-box/request-parser AST validation errors', errors);
  }
};

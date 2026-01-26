import { type GraphQLResolveInfo } from 'graphql';
import { type Path } from 'graphql/jsutils/Path.js';

export const getOperationPathFromResolverInfo = ({ path }: GraphQLResolveInfo): string => {
  const operationPathStack: string[] = [];
  let current: Path | undefined = path;

  while (current) {
    if (typeof current.key === 'string') {
      operationPathStack.unshift(current.key);
    }

    current = current.prev;
  }

  return operationPathStack.join('.');
};

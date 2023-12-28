import { expect } from '@jest/globals';
import { type ASTNode, GraphQLError, Source } from 'graphql';
import { deserializeErrors, serializeErrors } from './index.ts';

const nodes = [
  {
    arguments: [],
    directives: [],
    kind: 'Field',
    loc: { end: 147, start: 59 },
    name: { kind: 'Name', loc: { end: 71, start: 59 }, value: 'releaseDates' },
    selectionSet: {
      kind: 'SelectionSet',
      loc: { end: 147, start: 72 },
      selections: [
        {
          arguments: [],
          directives: [],
          kind: 'Field',
          loc: { end: 90, start: 80 },
          name: { kind: 'Name', loc: { end: 90, start: 80 }, value: 'iso_3166_1' },
        },
        {
          arguments: [],
          directives: [],
          kind: 'Field',
          loc: { end: 141, start: 97 },
          name: { kind: 'Name', loc: { end: 109, start: 97 }, value: 'releaseDates' },
          selectionSet: {
            kind: 'SelectionSet',
            loc: { end: 141, start: 110 },
            selections: [
              {
                arguments: [],
                directives: [],
                kind: 'Field',
                loc: { end: 133, start: 120 },
                name: { kind: 'Name', loc: { end: 133, start: 120 }, value: 'certification' },
              },
            ],
          },
        },
      ],
    },
  },
];

const originalErrorFields = {
  message: 'Oops',
  stack:
    'Error: Oops\n    at Object.resolveMovieReleaseDates [as releaseDates] (/Users/dylan.aubrey/workspaces/dollygrip/graphql/resolvers/dist/cjs/index.js:1380:11)\n    at executeField (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:542:20)\n    at executeFields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:458:20)\n    at collectAndExecuteSubfields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1225:21)\n    at completeObjectValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1193:10)\n    at completeValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:716:12)\n    at /Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:547:9\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at async Promise.all (index 0)\n    at async Execute.execute (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/@graphql-box/execute/lib/main/main/index.js:88:29)',
};

const path = ['movie', 'releaseDates'];
const positions = [59];

const sourceFields = {
  body: 'query GetMovieCertifications {\\n  movie(id: "675054") {\\n    releaseDates {\\n      iso_3166_1\\n      releaseDates {\\n        certification\\n      }\\n    }\\n    id\\n  }\\n}',
  locationOffset: { column: 1, line: 1 },
  name: 'GraphQL request',
};

const deserializedError = {
  extensions: {},
  locations: [{ column: 5, line: 3 }],
  message: 'Oops',
  name: 'GraphQLError',
  nodes,
  originalError: originalErrorFields,
  path,
  positions,
  source: sourceFields,
  stack:
    'Error: Oops\n    at Object.resolveMovieReleaseDates [as releaseDates] (/Users/dylan.aubrey/workspaces/dollygrip/graphql/resolvers/dist/cjs/index.js:1380:11)\n    at executeField (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:542:20)\n    at executeFields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:458:20)\n    at collectAndExecuteSubfields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1225:21)\n    at completeObjectValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1193:10)\n    at completeValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:716:12)\n    at /Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:547:9\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at async Promise.all (index 0)\n    at async Execute.execute (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/@graphql-box/execute/lib/main/main/index.js:88:29)',
};

describe('deserializeErrors >>', () => {
  let deserialized: GraphQLError;

  beforeEach(() => {
    deserialized = deserializeErrors({ errors: [deserializedError] }).errors[0] as unknown as GraphQLError;
  });

  it('should return an instance of a GraphQLError', () => {
    expect(deserialized instanceof GraphQLError).toBe(true);
  });

  it('should deserialise the error correctly', () => {
    expect(deserialized).toEqual(
      expect.objectContaining({
        message: 'Oops',
        name: 'GraphQLError',
        nodes,
        originalError: expect.any(Error),
        path,
        positions,
        source: expect.any(Source),
        stack: deserializedError.stack,
      })
    );
  });
});

describe('serializeErrors >>', () => {
  const originalError = new Error(originalErrorFields.message);
  originalError.stack = originalErrorFields.stack;

  const graphqlError = new GraphQLError('Oops', {
    nodes: nodes as unknown as ASTNode[],
    originalError,
    path,
    positions,
    source: new Source(sourceFields.body, sourceFields.name, sourceFields.locationOffset),
  });

  graphqlError.stack =
    'Error: Oops\n    at Object.resolveMovieReleaseDates [as releaseDates] (/Users/dylan.aubrey/workspaces/dollygrip/graphql/resolvers/dist/cjs/index.js:1380:11)\n    at executeField (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:542:20)\n    at executeFields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:458:20)\n    at collectAndExecuteSubfields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1225:21)\n    at completeObjectValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1193:10)\n    at completeValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:716:12)\n    at /Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:547:9\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at async Promise.all (index 0)\n    at async Execute.execute (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/@graphql-box/execute/lib/main/main/index.js:88:29)';

  it('should serialise the error correctly', () => {
    const serialized = serializeErrors({ errors: [graphqlError] });
    expect(serialized.errors[0]).toMatchSnapshot();
  });
});

import { ASTNode, GraphQLError, Source } from "graphql";
import { deserializeErrors, serializeErrors } from ".";

const nodes = [
  {
    arguments: [],
    directives: [],
    kind: "Field",
    loc: { start: 59, end: 147 },
    name: { kind: "Name", value: "releaseDates", loc: { start: 59, end: 71 } },
    selectionSet: {
      kind: "SelectionSet",
      loc: { start: 72, end: 147 },
      selections: [
        {
          arguments: [],
          directives: [],
          kind: "Field",
          loc: { start: 80, end: 90 },
          name: { kind: "Name", value: "iso_3166_1", loc: { start: 80, end: 90 } },
        },
        {
          arguments: [],
          directives: [],
          kind: "Field",
          loc: { start: 97, end: 141 },
          name: { kind: "Name", value: "releaseDates", loc: { start: 97, end: 109 } },
          selectionSet: {
            kind: "SelectionSet",
            loc: { start: 110, end: 141 },
            selections: [
              {
                arguments: [],
                directives: [],
                kind: "Field",
                loc: { start: 120, end: 133 },
                name: { kind: "Name", value: "certification", loc: { start: 120, end: 133 } },
              },
            ],
          },
        },
      ],
    },
  },
];

const originalErrorFields = {
  message: "Oops",
  stack:
    "Error: Oops\n    at Object.resolveMovieReleaseDates [as releaseDates] (/Users/dylan.aubrey/workspaces/dollygrip/graphql/resolvers/dist/cjs/index.js:1380:11)\n    at executeField (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:542:20)\n    at executeFields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:458:20)\n    at collectAndExecuteSubfields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1225:21)\n    at completeObjectValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1193:10)\n    at completeValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:716:12)\n    at /Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:547:9\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at async Promise.all (index 0)\n    at async Execute.execute (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/@graphql-box/execute/lib/main/main/index.js:88:29)",
};

const path = ["movie", "releaseDates"];
const positions = [59];

const sourceFields = {
  body:
    'query GetMovieCertifications {\\n  movie(id: "675054") {\\n    releaseDates {\\n      iso_3166_1\\n      releaseDates {\\n        certification\\n      }\\n    }\\n    id\\n  }\\n}',
  locationOffset: { line: 1, column: 1 },
  name: "GraphQL request",
};

const deserializedError = {
  extensions: {},
  locations: [{ line: 3, column: 5 }],
  message: "Oops",
  name: "GraphQLError",
  nodes,
  originalError: originalErrorFields,
  path,
  positions,
  source: sourceFields,
  stack:
    "Error: Oops\n    at Object.resolveMovieReleaseDates [as releaseDates] (/Users/dylan.aubrey/workspaces/dollygrip/graphql/resolvers/dist/cjs/index.js:1380:11)\n    at executeField (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:542:20)\n    at executeFields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:458:20)\n    at collectAndExecuteSubfields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1225:21)\n    at completeObjectValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1193:10)\n    at completeValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:716:12)\n    at /Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:547:9\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at async Promise.all (index 0)\n    at async Execute.execute (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/@graphql-box/execute/lib/main/main/index.js:88:29)",
};

describe("deserializeErrors >>", () => {
  it("should deserialise the error correctly", () => {
    const deserialized = deserializeErrors({ errors: [deserializedError] });
    expect(deserialized.errors[0] instanceof GraphQLError).toBe(true);
    const error = deserialized.errors[0];
    expect(error.message).toBe("Oops");
    expect(error.name).toBe("GraphQLError");
    expect(error.nodes).toEqual(nodes);
    expect(error.originalError instanceof Error).toBe(true);
    expect(error.path).toEqual(path);
    expect(error.positions).toEqual(positions);
    expect(error.source instanceof Source).toBe(true);
    expect(error.stack).toBe(deserializedError.stack);
  });
});

describe("serializeErrors >>", () => {
  const originalError = new Error(originalErrorFields.message);
  originalError.stack = originalErrorFields.stack;

  const graphqlError = new GraphQLError(
    "Oops",
    (nodes as unknown) as ASTNode[],
    new Source(sourceFields.body, sourceFields.name, sourceFields.locationOffset),
    positions,
    path,
    originalError,
  );

  graphqlError.stack =
    "Error: Oops\n    at Object.resolveMovieReleaseDates [as releaseDates] (/Users/dylan.aubrey/workspaces/dollygrip/graphql/resolvers/dist/cjs/index.js:1380:11)\n    at executeField (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:542:20)\n    at executeFields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:458:20)\n    at collectAndExecuteSubfields (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1225:21)\n    at completeObjectValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:1193:10)\n    at completeValue (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:716:12)\n    at /Users/dylan.aubrey/workspaces/dollygrip/node_modules/graphql/execution/execute.js:547:9\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at async Promise.all (index 0)\n    at async Execute.execute (/Users/dylan.aubrey/workspaces/dollygrip/node_modules/@graphql-box/execute/lib/main/main/index.js:88:29)";

  it("should serialise the error correctly", () => {
    const serialized = serializeErrors({ errors: [graphqlError] });
    expect(serialized.errors[0]).toMatchSnapshot();
  });
});

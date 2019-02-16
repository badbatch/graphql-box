import { RequestAndOptions } from "../../defs";

export const withInputType: RequestAndOptions = {
  options: {
    variables: {
      input: {
        clientMutationId: "1",
        starrableId: "MDEwOlJlcG9zaXRvcnkzODMwNzQyOA==",
      },
    },
  },
  request: `
    mutation ($input: AddStarInput!) {
      addStar(input: $input) {
        clientMutationId
        starrable {
          viewerHasStarred
        }
      }
    }
  `,
};

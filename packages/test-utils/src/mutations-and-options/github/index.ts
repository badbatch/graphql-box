import { RequestAndOptions } from "../../defs";

export const withInputType: RequestAndOptions = {
  options: {
    variables: {
      input: {
        clientMutationId: "1",
        starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=",
      },
    },
  },
  request: `
    mutation ($input: AddStarInput!) {
      addStar(input: $input) {
        clientMutationId
        starrable {
          viewerHasStarred

          ... on Repository {
            stargazers(first: 6) {
              edges {
                node {
                  name
                  login
                }
              }
            }
          }
        }
      }
    }
  `,
};

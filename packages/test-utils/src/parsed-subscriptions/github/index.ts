export const nestedInterfaceWithEdges = `
  subscription {
    starAdded {
      ... on Repository {
        stargazers(first: 6) {
          edges {
            node {
              name
              login
              id
            }
          }
        }
        id
      }
      __typename
    }
  }
`;

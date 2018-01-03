export const singleQuery = `
  {
    organization(login: "facebook") {
      email
      id
      name
      repositories(first: 6) {
        edges {
          node {
            description
            id
            name
            resourcePath
          }
        }
      }
    }
  }
`;

export const editedSingleQuery = `
  {
    organization(login: "facebook") {
      id
      name
      repositories(first: 6) {
        edges {
          node {
            description
            id
            name
          }
        }
      }
    }
  }
`;

export const aliasQuery = `
  {
    facebook: organization(login: "facebook") {
      id
      name
      firstSix: repositories(first: 6) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export const singleMutation = `
  mutation {
    createProject(input: { ownerId: "MDEwOlJlcG9zaXRvcnk5ODU4ODQxNg==", name: "wip" }) {
      project {
        createdAt
        databaseId
        id
        name
      }
    }
  }
`;

export const variableMutation = `
  mutation ($ownerId: ID!, $name: String!) {
    createProject(input: { ownerId: $ownerId, name: $name }) {
      project {
        createdAt
        databaseId
        id
        name
      }
    }
  }
`;

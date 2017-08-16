/**
 *
 * @type {string}
 */
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

/**
 *
 * @type {string}
 */
export const singleMutation = `
  mutation {
    createProject(input: { ownerId: "MDEwOlJlcG9zaXRvcnk5ODU4ODQxNg==", name: "wip" }) {
      project {
        databaseId
        name
        createdAt
      }
    }
  }
`;

/**
 *
 * @type {string}
 */
export const variableMutation = `
  mutation ($ownerId: ID!, $name: String!) {
    createProject(input: { ownerId: $ownerId, name: $name }) {
      project {
        databaseId
        name
        createdAt
      }
    }
  }
`;

/**
 *
 * @type {string}
 */
export const singleQuery = `
  {
    organization(login: "facebook") {
      id
      name
      repositories(first: 6) {
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

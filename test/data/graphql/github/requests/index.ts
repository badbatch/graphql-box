export const singleQuery = `
  query ($login: String!) {
    organization(login: $login) {
      description
      email
      id
      login
      name
      repositories(first: 6) {
        edges {
          node {
            description
            id
            name
            owner {
              ... on Organization {
                description
                email
                id
                login
                name
              }
            }
          }
        }
      }
      url
    }
  }
`;

export const updatedSingleQuery = `
  {
    organization(login: "facebook") {
      description
      email
      id
      login
      name
      repositories(first: 6) {
        edges {
          node {
            description
            id
            name
            owner {
              ... on Organization {
                description
                email
                id
                login
                name
              }
            }
          }
        }
      }
      url
    }
  }
`;

export const reducedSingleQuery = `
  query ($login: String!) {
    organization(login: $login) {
      description
      email
      id
      login
      name
      repositories(first: 6) {
        edges {
          node {
            description
            id
            name
            owner {
              ... on Organization {
                description
                email
                id
                login
                name
              }
            }
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

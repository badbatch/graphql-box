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

export const singleMutation = `
  mutation ($input: AddStarInput!) {
    addStar(input: $input) {
      clientMutationId
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

export const updatedSingleMutation = `
  mutation {
    addStar(input: { clientMutationId: "1", starrableId: "MDEwOlJlcG9zaXRvcnkzODMwNzQyOA==" }) {
      clientMutationId
      starrable {
        id
        viewerHasStarred
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

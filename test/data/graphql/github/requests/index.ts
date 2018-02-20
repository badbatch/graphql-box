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

export const extendedSingleQuery = `
  query ($login: String!) {
    organization(login: $login) {
      description
      email
      id
      location
      login
      name
      repositories(first: 6) {
        edges {
          node {
            description
            homepageUrl
            id
            name
            owner {
              ... on Organization {
                description
                email
                id
                login
                name
                url
                websiteUrl
              }
            }
            primaryLanguage {
              name
            }
          }
        }
      }
      url
      websiteUrl
    }
  }
`;

export const partialSingleQuery = `
  {
    organization(login: "facebook") {
      location
      repositories(first: 6) {
        edges {
          node {
            homepageUrl
            owner {
              ... on Organization {
                url
                websiteUrl
              }
            }
            primaryLanguage {
              name
              id
            }
          }
        }
      }
      websiteUrl
    }
  }
`;

export const sugaredSingleQuery = `
  query OrganizationAndRepositories($login: String!) {
    organization(login: $login) {
      description
      email
      login
      name
      firstSix: repositories(first: 6) {
        edges {
          node {
            ...repositoryFields
          }
        }
      }
      url
    }
  }
`;

export const sugaredSingleQueryFragment = `
  fragment repositoryFields on Repository {
    description
    name
    owner {
      ... on Organization {
        description
        email
        login
        name
      }
    }
  }
`;

export const updatedSugaredSingleQuery = `
  query OrganizationAndRepositories {
    organization(login: "facebook") {
      description
      email
      login
      name
      firstSix: repositories(first: 6) {
        edges {
          node {
            description
            name
            owner {
              ... on Organization {
                description
                email
                login
                name
                id
              }
            }
            id
          }
        }
      }
      url
      id
    }
  }
`;

export const addMutation = `
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

export const updatedAddMutation = `
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

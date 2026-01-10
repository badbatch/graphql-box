export const query = `
  {
    organization(login: "facebook") {
      __typename
      email
      id
      login
      name
    }
  }
`;

export const queryWithAlias = `
  {
    organization(login: "facebook") {
      __typename
      email
      fullName: name
      id
      login
    }
  }
`;

export const queryWithInlineFragment = `
  {
    repositoryOwner(login: "facebook") {
      __typename
      email
      ... on Organization {
        id
        login
        name
      }
    }
  }
`;

export const queryWithInlineFragmentWithNoTypeCondition = `
  {
    organization(login: "facebook") {
      __typename
      email
      id
      ... {
        login
        name
      }
    }
  }
`;

export const queryWithConnection = `
  {
    organization(login: "facebook") {
      __typename
      description
      email
      id
      login
      name
      repositories(first: 6) {
        edges {
          node {
            __typename
            description
            homepageUrl
            id
            name
          }
        }
      }
    }
  }
`;

export const queryWithConnectionWithNestedInlineFragment = `
  {
    organization(login: "facebook") {
      __typename
      description
      email
      id
      login
      name
      repositories(first: 6) {
        edges {
          node {
            __typename
            description
            homepageUrl
            id
            name
            owner {
              __typename
              url
              ... on Organization {
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

export const queryWithConnectionWithDoubleFigures = `
  {
    organization(login: "facebook") {
      __typename
      description
      email
      id
      login
      name
      repositories(first: 11) {
        edges {
          node {
            __typename
            description
            homepageUrl
            id
            name
          }
        }
      }

    }
  }
`;

export const queryWithUnion = `
  {
    search(query: "react", first: 10, type: REPOSITORY) {
      edges {
        node {
          __typename
          ... on Organization {
            description
            id
            login
            organizationName: name
          }
          ... on Issue {
            bodyText
            id
            number
            title
          }
          ... on MarketplaceListing {
            howItWorks
            id
            shortDescription
            slug
          }
          ... on PullRequest {
            bodyText
            id
            number
            title
          }
          ... on Repository {
            description
            homepageUrl
            id
            name
          } 
        }
      }
    }
  }
`;

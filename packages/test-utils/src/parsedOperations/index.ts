export const query = `
  {
    organization(login: "facebook") {
      email
      login
      name
    }
  }
`;

export const queryWithAlias = `
  {
    organization(login: "facebook") {
      email
      fullName: name
      login
    }
  }
`;

export const queryWithInlineFragment = `
  {
    repositoryOwner(login: "facebook") {
      email
      ... on Organization {
        login
        name
      }
    }
  }
`;

export const queryWithInlineFragmentWithNoTypeCondition = `
  {
    organization(login: "facebook") {
      email
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
      description
      email
      login
      name
      repositories(first: 6) {
        edges {
          node {
            description
            homepageUrl
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
      description
      email
      login
      name
      repositories(first: 6) {
        edges {
          node {
            description
            homepageUrl
            name
            owner {
              url
              ... on Organization {
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
      description
      email
      login
      name
      repositories(first: 11) {
        edges {
          node {
            description
            homepageUrl
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
          ... on Organization {
            description
            login
            organizationName: name
          }
          ... on Issue {
            bodyText
            number
            title
          }
          ... on MarketplaceListing {
            howItWorks
            shortDescription
            slug
          }
          ... on PullRequest {
            bodyText
            number
            title
          }
          ... on Repository {
            description
            homepageUrl
            name
          } 
        }
      }
    }
  }
`;

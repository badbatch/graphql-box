export const singleType = `
  query {
    organization(login: "facebook") {
      description
      email
      login
      name
      url
      id
    }
  }
`;

export const nestedTypeWithEdges = `
  query {
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
            id
          }
        }
      }
      url
      id
    }
  }
`;

export const nestedUnionWithEdges = `
  query {
    search(query: "react", first: 10, type: REPOSITORY) {
      edges {
        node {
          ... on Organization {
            description
            login
            organizationName: name
            id
          }
          ... on Issue {
            bodyText
            number
            title
            id
          }
          ... on MarketplaceListing {
            slug
            shortDescription
            howItWorks
            id
          }
          ... on PullRequest {
            bodyText
            number
            title
            id
          }
          ... on Repository {
            description
            homepageUrl
            name
            id
          }
        }
      }
    }
  }
`;

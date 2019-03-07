import { ParsedQueryWithFilter } from "../../defs";

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

export const singleTypeWithFilter: ParsedQueryWithFilter = {
  full: singleType,
  initial: `
    query {
      organization(login: "facebook") {
        description
        login
        id
      }
    }
  `,
  updated: `
    query {
      organization(login: "facebook") {
        email
        name
        url
        id
      }
    }
  `,
};

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
            owner {
              login
              url
              id
            }
          }
        }
      }
      url
      id
    }
  }
`;

export const nestedTypeWithEdgesWithFilter: ParsedQueryWithFilter = {
  full: nestedTypeWithEdges,
  initial: `
    query {
      organization(login: "facebook") {
        login
        name
        repositories(first: 6) {
          edges {
            node {
              name
              id
              owner {
                url
                id
              }
            }
          }
        }
        id
      }
    }
  `,
  updated: `
    query {
      organization(login: "facebook") {
        description
        email
        repositories(first: 6) {
          edges {
            node {
              description
              homepageUrl
              id
              owner {
                login
                id
              }
            }
          }
        }
        url
        id
      }
    }
  `,
};

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

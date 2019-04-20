import { ParsedQuerySet } from "../defs";

export const singleTypeQuery = `
  {
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

export const singleTypeQuerySet: ParsedQuerySet = {
  full: singleTypeQuery,
  initial: `
    {
      organization(login: "facebook") {
        description
        login
        id
      }
    }
  `,
  updated: `
    {
      organization(login: "facebook") {
        email
        name
        url
        id
      }
    }
  `,
};

export const nestedTypeQuery = `
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
            id
            owner {
              login
              url
              ... on Organization {
                name
                id
              }
              __typename
            }
          }
        }
      }
      url
      id
    }
  }
`;

export const nestedTypeQuerySet: ParsedQuerySet = {
  full: nestedTypeQuery,
  initial: `
    {
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
                ... on Organization {
                  name
                  id
                }
                __typename
              }
            }
          }
        }
        id
      }
    }
  `,
  updated: `
    {
      organization(login: "facebook") {
        description
        email
        repositories(first: 6) {
          edges {
            node {
              description
              homepageUrl
              id
            }
          }
        }
        url
        id
      }
    }
  `,
};

export const nestedUnionQuery = `
  {
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
          __typename
        }
      }
    }
  }
`;

export const nestedUnionQuerySet: ParsedQuerySet = {
  full: nestedUnionQuery,
  initial: `
    {
      search(query: "react", first: 10, type: REPOSITORY) {
        edges {
          node {
            ... on Organization {
              organizationName: name
              id
            }
            ... on Issue {
              title
              id
            }
            ... on MarketplaceListing {
              slug
              shortDescription
              id
            }
            ... on PullRequest {
              title
              id
            }
            ... on Repository {
              name
              id
            }
            __typename
          }
        }
      }
    }
  `,
  updated: `
    {
      search(query: "react", first: 10, type: REPOSITORY) {
        edges {
          node {
            ... on Repository {
              description
              homepageUrl
              id
            }
            __typename
          }
        }
      }
    }
  `,
};

export const nestedInterfaceMutation = `
  mutation {
    addStar(input: { clientMutationId: "1", starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=" }) {
      clientMutationId
      starrable {
        viewerHasStarred
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
  }
`;

export const nestedInterfaceSubscription = `
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

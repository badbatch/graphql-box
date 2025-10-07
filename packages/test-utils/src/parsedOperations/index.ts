export const query = `
  {
    organization(login: "facebook") {
      email
      login
      name
      id
    }
  }
`;

export const queryWithAlias = `
  {
    organization(login: "facebook") {
      email
      login
      fullName: name
      id
    }
  }
`;

export const queryWithIncludeTrueDirective = `
  {
    organization(login: "facebook") {
      email @include(if: true)
      login
      name
      id
    }
  }
`;

export const queryWithIncludeFalseDirective = `
  {
    organization(login: "facebook") {
      email @include(if: false)
      login
      name
      id
    }
  }
`;

export const queryWithSkipTrueDirective = `
  {
    organization(login: "facebook") {
      email @skip(if: true)
      login
      name
      id
    }
  }
`;

export const queryWithSkipFalseDirective = `
  {
    organization(login: "facebook") {
      email @skip(if: false)
      login
      name
      id
    }
  }
`;

export const queryWithInlineFragment = `
  {
    organization(login: "facebook") {
      email
      ... on Organization {
        login
        name
        id
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
        id
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
            id
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
            id
            owner {
              url
              ... on Organization {
                id
                login
                name
              }
              __typename
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
            id
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

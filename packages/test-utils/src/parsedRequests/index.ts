export const singleTypeQuery = `
  {
    organization(login: "facebook") {
      email
      login
      name
      id
    }
  }
`;

export const singleTypeQueryWithAlias = `
  {
    organization(login: "facebook") {
      email
      login
      fullName: name
      id
    }
  }
`;

export const singleTypeQueryWithIncludeTrueDirective = `
  {
    organization(login: "facebook") {
      email @include(if: true)
      login
      name
      id
    }
  }
`;

export const singleTypeQueryWithIncludeFalseDirective = `
  {
    organization(login: "facebook") {
      email @include(if: false)
      login
      name
      id
    }
  }
`;

export const singleTypeQueryWithSkipTrueDirective = `
  {
    organization(login: "facebook") {
      email @skip(if: true)
      login
      name
      id
    }
  }
`;

export const singleTypeQueryWithSkipFalseDirective = `
  {
    organization(login: "facebook") {
      email @skip(if: false)
      login
      name
      id
    }
  }
`;

export const singleTypeQueryWithInlineFragment = `
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

export const singleTypeQueryWithInlineFragmentWithNoTypeCondition = `
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

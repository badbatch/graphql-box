import { type RawOperationAndOptions } from '../types.ts';

export const queryWithoutVariable: RawOperationAndOptions = {
  operation: `
    query {
      organization(login: "facebook") {
        description
        email
        login
        name
        url
      }
    }
  `,
  options: {},
};

export const queryWithDefault: RawOperationAndOptions = {
  operation: `
    query ($login: String = "google") {
      organization(login: $login) {
        description
        email
        login
        name
        url
      }
    }
  `,
  options: {},
};

export const queryWithNumberDefault: RawOperationAndOptions = {
  operation: `
    query ($first: Int = 20) {
      organization(login: "google") {
        description
        email
        login
        name
        repositories(first: $first) {
          edges {
            node {
              description
              name
            }
          }
        }
        url
      }
    }
  `,
  options: {},
};

export const queryWithOperationName: RawOperationAndOptions = {
  operation: `
    query GetOrganization {
      organization(login: "facebook") {
        description
        email
        login
        name
        url
      }
    }
  `,
  options: {},
};

export const queryWithAlias: RawOperationAndOptions = {
  operation: `
    query {
      organization(login: "facebook") {
        description
        email
        login
        fullName: name
        url
      }
    }
  `,
  options: {},
};

export const queryWithVariable: RawOperationAndOptions = {
  operation: `
    query ($login: String!) {
      organization(login: $login) {
        description
        email
        login
        name
        url
      }
    }
  `,
  options: {
    variables: {
      login: 'facebook',
    },
  },
};

export const queryWithVariableWithDefault: RawOperationAndOptions = {
  operation: `
    query ($login: String = "google") {
      organization(login: $login) {
        description
        email
        login
        name
        url
      }
    }
  `,
  options: {
    variables: {
      login: 'facebook',
    },
  },
};

export const queryWithEnumVariable: RawOperationAndOptions = {
  operation: `
    query ($ownerAffiliations: [RepositoryAffiliation]) {
      organization(login: "facebook") {
        description
        email
        login
        name
        repositories(first: 6, ownerAffiliations: $ownerAffiliations) {
          edges {
            node {
              description
              homepageUrl
              name
              owner {
                login
                url
              }
            }
          }
        }
        url
      }
    }
  `,
  options: {
    variables: {
      ownerAffiliations: ['OWNER', 'COLLABORATOR'],
    },
  },
};

export const queryWithVariables: RawOperationAndOptions = {
  operation: `
    query ($login: String!, $first: Int!, $ownerAffiliations: [RepositoryAffiliation]!) {
      organization(login: $login) {
        description
        email
        login
        name
        repositories(first: $first, ownerAffiliations: $ownerAffiliations) {
          edges {
            node {
              description
              homepageUrl
              name
              owner {
                login
                url
                ... on Organization {
                  name
                }
              }
            }
          }
        }
        url
      }
    }
  `,
  options: {
    variables: {
      first: 6,
      login: 'facebook',
      ownerAffiliations: ['OWNER', 'COLLABORATOR'],
    },
  },
};

export const queryWithIncludeTrueDirective: RawOperationAndOptions = {
  operation: `
    query ($withEmail: Boolean!) {
      organization(login: "facebook") {
        description
        email @include(if: $withEmail)
        login
        name
        url
      }
    }
  `,
  options: {
    variables: {
      withEmail: true,
    },
  },
};

export const queryWithIncludeFalseDirective: RawOperationAndOptions = {
  operation: `
    query ($withEmail: Boolean!) {
      organization(login: "facebook") {
        description
        email @include(if: $withEmail)
        login
        name
        url
      }
    }
  `,
  options: {
    variables: {
      withEmail: false,
    },
  },
};

export const queryWithSkipTrueDirective: RawOperationAndOptions = {
  operation: `
    query ($withoutEmail: Boolean!) {
      organization(login: "facebook") {
        description
        email @skip(if: $withoutEmail)
        login
        name
        url
      }
    }
  `,
  options: {
    variables: {
      withoutEmail: true,
    },
  },
};

export const queryWithSkipFalseDirective: RawOperationAndOptions = {
  operation: `
    query ($withoutEmail: Boolean!) {
      organization(login: "facebook") {
        description
        email @include(if: $withoutEmail)
        login
        name
        url
      }
    }
  `,
  options: {
    variables: {
      withoutEmail: false,
    },
  },
};

// TODO: change this for an interface root query
export const queryWithInlineFragment: RawOperationAndOptions = {
  operation: `
    query {
      organization(login: "facebook") {
        ... on Organization {
          description
          email
          login
          name
          url
        }
      }
    }
  `,
  options: {},
};

export const queryWithInlineFragmentWithNoTypeCondition: RawOperationAndOptions = {
  operation: `
    query {
      organization(login: "facebook") {
        ... {
          description
          email
          login
          name
          url
        }
      }
    }
  `,
  options: {},
};

export const queryWithVariableInInlineFragment: RawOperationAndOptions = {
  operation: `
    query ($first: Int!) {
      organization(login: "facebook") {
        ... on Organization {
          description
          email
          login
          repositories(first: $first) {
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
    }
  `,
  options: {
    variables: {
      first: 6,
    },
  },
};

// TODO: change this for an interface root query
export const queryWithDirectiveInInlineFragment: RawOperationAndOptions = {
  operation: `
    query ($withEmail: Boolean!) {
      organization(login: "facebook") {
        ... on Organization {
          description
          email @include(if: $withEmail)
          login
          name
          url
        }
      }
    }
  `,
  options: {
    variables: {
      withEmail: false,
    },
  },
};

export const queryWithFragmentSpread: RawOperationAndOptions = {
  operation: `
    fragment organizationFields on Organization {
      description
      email
      login
      name
      url
    }

    query {
      organization(login: "facebook") {
        ...organizationFields
      }
    }
  `,
  options: {},
};

export const queryWithNestedFragmentSpread: RawOperationAndOptions = {
  operation: `
    fragment organizationFieldsB on Organization {
      description
      email
      login
    }
    
    fragment organizationFieldsA on Organization {
      ...organizationFieldsB
      name
      url
    }

    query {
      organization(login: "facebook") {
        ...organizationFieldsA
      }
    }
  `,
  options: {},
};

export const queryWithSiblingFragmentSpreads: RawOperationAndOptions = {
  operation: `
    fragment organizationFieldsB on Organization {
      description
      email
      login
    }
    
    fragment organizationFieldsA on Organization {
      name
      url
    }

    query {
      organization(login: "facebook") {
        ...organizationFieldsA
        ...organizationFieldsB
      }
    }
  `,
  options: {},
};

export const queryWithReusedFragmentSpread: RawOperationAndOptions = {
  operation: `
    fragment organizationFields on Organization {
      description
      email
      login
      name
      url
    }
    
    query {
      organization: facebook(login: "facebook") {
        ...organizationFields
      }
      organization: google(login: "google") {
        ...organizationFields
      }
    }
  `,
  options: {},
};

export const queryWithVariableInFragmentSpread: RawOperationAndOptions = {
  operation: `
    fragment organizationFields on Organization {
      description
      repositories(first: $first) {
        edges {
          node {
            description
            homepageUrl
            name
          }
        }
      }
    }

    query ($first: Int!) {
      organization(login: "facebook") {
        ...organizationFields
      }
    }
  `,
  options: {
    variables: {
      first: 6,
    },
  },
};

export const queryWithVariableInNestedFragmentSpread: RawOperationAndOptions = {
  operation: `
    fragment organizationFieldsB on Organization {
      description
      repositories(first: $first) {
        edges {
          node {
            description
            homepageUrl
            name
          }
        }
      }
    }
    
    fragment organizationFieldsA on Organization {
      ...organizationFieldsB
      name
      url
    }

    query ($first: Int!) {
      organization(login: "facebook") {
        ...organizationFieldsA
      }
    }
  `,
  options: {
    variables: {
      first: 6,
    },
  },
};

export const queryWithVariableInInlineFragmentInNestedFragmentSpread: RawOperationAndOptions = {
  operation: `
    fragment organizationFieldsB on Organization {
      ... on Organization {
        description
        repositories(first: $first) {
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
    
    fragment organizationFieldsA on Organization {
      ...organizationFieldsB
      name
      url
    }

    query ($first: Int!) {
      organization(login: "facebook") {
        ...organizationFieldsA
      }
    }
  `,
  options: {
    variables: {
      first: 6,
    },
  },
};

export const queryWithUnion: RawOperationAndOptions = {
  operation: `
    query {
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
              slug
              shortDescription
              howItWorks
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
  `,
  options: {},
};

export const mutationWithInputObjectType: RawOperationAndOptions = {
  operation: `
    mutation ($input: AddStarInput!) {
      addStar(input: $input) {
        clientMutationId
        starrable {
          ... on Repository {
            stargazers(first: 6) {
              edges {
                node {
                  name
                  login
                }
              }
            }
          }
        }
      }
    }
  `,
  options: {
    variables: {
      input: {
        clientMutationId: '1',
        starrableId: 'MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=',
      },
    },
  },
};

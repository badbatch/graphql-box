import { type RequestAndOptions } from '../types.ts';

export const queryWithoutVariable: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithDefault: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithNumberDefault: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithOperationName: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithVariable: RequestAndOptions = {
  options: {
    variables: {
      login: 'facebook',
    },
  },
  request: `
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
};

export const queryWithVariableWithDefault: RequestAndOptions = {
  options: {
    variables: {
      login: 'facebook',
    },
  },
  request: `
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
};

export const queryWithEnumVariable: RequestAndOptions = {
  options: {
    variables: {
      ownerAffiliations: ['OWNER', 'COLLABORATOR'],
    },
  },
  request: `
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
};

export const queryWithVariables: RequestAndOptions = {
  options: {
    variables: {
      first: 6,
      login: 'facebook',
      ownerAffiliations: ['OWNER', 'COLLABORATOR'],
    },
  },
  request: `
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
};

export const queryWithDirective: RequestAndOptions = {
  options: {
    variables: {
      withEmail: false,
    },
  },
  request: `
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
};

export const queryWithInlineFragment: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithVariableInInlineFragment: RequestAndOptions = {
  options: {
    variables: {
      first: 6,
    },
  },
  request: `
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
};

export const queryWithDirectiveInInlineFragment: RequestAndOptions = {
  options: {
    variables: {
      withEmail: false,
    },
  },
  request: `
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
};

export const queryWithFragmentSpread: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithNestedFragmentSpread: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithSiblingFragmentSpreads: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithReusedFragmentSpread: RequestAndOptions = {
  options: {},
  request: `
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
};

export const queryWithVariableInFragmentSpread: RequestAndOptions = {
  options: {
    variables: {
      first: 6,
    },
  },
  request: `
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
};

export const queryWithVariableInNestedFragmentSpread: RequestAndOptions = {
  options: {
    variables: {
      first: 6,
    },
  },
  request: `
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
};

export const queryWithVariableInInlineFragmentInNestedFragmentSpread: RequestAndOptions = {
  options: {
    variables: {
      first: 6,
    },
  },
  request: `
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
};

export const mutationWithInputObjectType: RequestAndOptions = {
  options: {
    variables: {
      input: {
        clientMutationId: '1',
        starrableId: 'MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=',
      },
    },
  },
  request: `
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
};

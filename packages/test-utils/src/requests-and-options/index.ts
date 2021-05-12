import { RequestAndOptions } from "../defs";

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
      login: "facebook",
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
      login: "facebook",
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

export const queryWithVariables: RequestAndOptions = {
  options: {
    variables: {
      first: 6,
      login: "facebook",
    },
  },
  request: `
    query ($login: String!, $first: Int!) {
      organization(login: $login) {
        description
        email
        login
        name
        repositories(first: $first) {
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

export const queryWithEnumVariable: RequestAndOptions = {
  options: {
    variables: {
      first: 6,
      login: "facebook",
      ownerAffiliations: ["OWNER", "COLLABORATOR"],
    },
  },
  request: `
    query ($login: String!, $first: Int!, $ownerAffiliations: [RepositoryAffiliation]) {
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
      first: 6,
      login: "facebook",
      withRepos: true,
    },
  },
  request: `
    query ($login: String!, $withRepos: Boolean!) {
      organization(login: $login) {
        description
        email
        login
        name
        repositories(first: $first) @include(if: $withRepos) {
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

export const queryWithInlineFragment: RequestAndOptions = {
  options: {
    variables: {
      login: "facebook",
    },
  },
  request: `
    query ($login: String!) {
      organization(login: $login) {
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

export const queryWithUnionInlineFragments: RequestAndOptions = {
  options: {
    variables: {
      first: 10,
      query: "react",
      type: "REPOSITORY",
    },
  },
  request: `
    query ($query: String!, $first: Int!, $type: SearchType!) {
      search(query: $query, first: $first, type: $type) {
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
};

export const queryWithFragmentSpread: RequestAndOptions = {
  options: {
    variables: {
      login: "facebook",
    },
  },
  request: `
    fragment organizationFields on Organization {
      description
      email
      login
      name
      url
    }

    query ($login: String!) {
      organization(login: $login) {
        ...organizationFields
      }
    }
  `,
};

export const queryWithFragmentOption: RequestAndOptions = {
  options: {
    fragments: [
      `
        fragment organizationFields on Organization {
          description
          email
          login
          name
          url
        }
      `,
    ],
    variables: {
      login: "facebook",
    },
  },
  request: `
    query ($login: String!) {
      organization(login: $login) {
        ...organizationFields
      }
    }
  `,
};

export const nestedInterfaceMutation: RequestAndOptions = {
  options: {
    variables: {
      input: {
        clientMutationId: "1",
        starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=",
      },
    },
  },
  request: `
    mutation ($input: AddStarInput!) {
      addStar(input: $input) {
        clientMutationId
        starrable {
          viewerHasStarred

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

export const nestedTypeMutation: RequestAndOptions = {
  options: {
    variables: {
      input: {
        from: "delta@gmail.com",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        subject: "Hi, this is Delta",
      },
    },
  },
  request: `
    mutation ($input: EmailInput!) {
      addEmail(input: $input) {
        emails {
          from
          message
          subject
          unread
        }
        total
        unread
      }
    }
  `,
};

export const nestedTypeSubscription: RequestAndOptions = {
  options: {},
  request: `
    subscription {
      emailAdded {
        emails {
          from
          message
          subject
          unread
        }
        total
        unread
      }
    }
  `,
};

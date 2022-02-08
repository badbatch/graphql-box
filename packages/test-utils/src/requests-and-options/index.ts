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

export const queryWithNumberDefault: RequestAndOptions = {
  options: {},
  request: `
    query ($login: String = "google", $first: Int = 20) {
      organization(login: $login) {
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
      withEmail: true,
      withRepos: true,
    },
  },
  request: `
    query ($login: String!, $withEmail: Boolean!, $withRepos: Boolean!) {
      organization(login: $login) {
        description
        email @include(if: $withEmail)
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

export const queryWithUnionInlineFragmentsAndFragmentSpread: RequestAndOptions = {
  options: {
    variables: {
      first: 10,
      query: "react",
      type: "REPOSITORY",
    },
  },
  request: `
    fragment organizationFields on Organization {
      description
      email
      login
      organizationName: name
      url
    }

    query ($query: String!, $first: Int!, $type: SearchType!) {
      search(query: $query, first: $first, type: $type) {
        edges {
          node {
            ... on Organization {
              ...organizationFields
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

export const queryWithDefer: RequestAndOptions = {
  options: {
    variables: {
      deferCondition: true,
      first: 10,
      login: "facebook",
      streamCondition: true,
    },
  },
  request: `
    fragment OrganizationFieldsA on Organization {
      email @include(if: true)
      ...on Organization {
        description
      }
      ...OrganizationFieldsC
    }

    fragment OrganizationFieldsB on Organization {
      login
      ...on Organization {
        name
      }
    }

    fragment OrganizationFieldsC on Organization {
      isVerified
      location
    }

    fragment RepositoryFields on Repository {
      description
      homepageUrl
      name
    }

    query ($login: String!, $deferCondition: Boolean!, $streamCondition: Boolean!) {
      organization(login: $login) {
        ...OrganizationFieldsA @defer(if: $deferCondition, label: "organizationDefer")
        ...OrganizationFieldsB
        repositories(first: $first) {
          edges {
            node {
              ...on Repository @include(if: true) {
                licenseInfo {
                  permissions {
                    label @skip(if: true)
                  }
                }
                ...RepositoryFields @skip(if: true) @defer(if: $deferCondition, label: "repositoryDefer")
              }
            }
          }
        }
        url
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

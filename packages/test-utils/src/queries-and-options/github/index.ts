import { RequestAndOptions } from "../../defs";

export const withoutVariable: RequestAndOptions = {
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

export const withOperationName: RequestAndOptions = {
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

export const withVariable: RequestAndOptions = {
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

export const withVariables: RequestAndOptions = {
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
            }
          }
        }
        url
      }
    }
  `,
};

export const withEnumVariable: RequestAndOptions = {
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
            }
          }
        }
        url
      }
    }
  `,
};

export const withDirective: RequestAndOptions = {
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
            }
          }
        }
        url
      }
    }
  `,
};

export const withInlineFragment: RequestAndOptions = {
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

export const withUnionInlineFragments: RequestAndOptions = {
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

export const withFragmentSpread: RequestAndOptions = {
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

export const withFragmentOption: RequestAndOptions = {
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

import * as defs from "../../defs";

export const withoutVariable: defs.RequestAndOptions = {
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

export const withOperationName: defs.RequestAndOptions = {
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

export const withVariable: defs.RequestAndOptions = {
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

export const withVariables: defs.RequestAndOptions = {
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

export const withEnumVariable: defs.RequestAndOptions = {
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

export const withDirective: defs.RequestAndOptions = {
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

export const withInlineFragment: defs.RequestAndOptions = {
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

export const withFragmentSpread: defs.RequestAndOptions = {
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

export const withFragmentOption: defs.RequestAndOptions = {
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

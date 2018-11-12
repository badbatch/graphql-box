import * as defs from "../../defs";

export const withoutVariable: defs.RequestAndOptions = {
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

export const withVariable: defs.RequestAndOptions = {
  options: { variables: { login: "facebook" } },
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

export const withInlineFragment: defs.RequestAndOptions = {
  options: { variables: { login: "facebook" } },
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
  options: { variables: { login: "facebook" } },
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
    variables: { login: "facebook" },
  },
  request: `
    query ($login: String!) {
      organization(login: $login) {
        ...organizationFields
      }
    }
  `,
};

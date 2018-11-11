export const withVariable = `
  query ($login: String!) {
    organization(login: $login) {
      description
      email
      id
      login
      name
      url
    }
  }
`;

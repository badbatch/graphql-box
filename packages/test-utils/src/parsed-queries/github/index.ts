export const organizationSmall = `
  query {
    organization(login: "facebook") {
      description
      email
      login
      name
      url
      id
    }
  }
`;

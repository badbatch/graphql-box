export const singleType = `
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

export const nestedTypeWithEdges = `
  query {
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
          }
        }
      }
      url
      id
    }
  }
`;

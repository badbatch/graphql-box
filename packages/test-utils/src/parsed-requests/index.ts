/* tslint:disable:max-line-length */

import { ParsedQuerySet } from "../defs";

export const singleTypeQuery = `
  {
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

export const singleTypeQuerySet: ParsedQuerySet = {
  full: singleTypeQuery,
  initial: `
    {
      organization(login: "facebook") {
        description
        login
        id
      }
    }
  `,
  updated: `
    {
      organization(login: "facebook") {
        email
        name
        url
        id
      }
    }
  `,
};

export const nestedTypeQuery = `
  {
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
            owner {
              login
              url
              ... on Organization {
                name
                id
              }
              __typename
            }
          }
        }
      }
      url
      id
    }
  }
`;

export const nestedTypeQuerySet: ParsedQuerySet = {
  full: nestedTypeQuery,
  initial: `
    {
      organization(login: "facebook") {
        login
        name
        repositories(first: 6) {
          edges {
            node {
              name
              id
              owner {
                url
                ... on Organization {
                  name
                  id
                }
                __typename
              }
            }
          }
        }
        id
      }
    }
  `,
  updated: `
    {
      organization(login: "facebook") {
        description
        email
        repositories(first: 6) {
          edges {
            node {
              description
              homepageUrl
              id
            }
          }
        }
        url
        id
      }
    }
  `,
};

export const nestedUnionQuery = `
  {
    search(query: "react", first: 10, type: REPOSITORY) {
      edges {
        node {
          ... on Organization {
            description
            login
            organizationName: name
            id
          }
          ... on Issue {
            bodyText
            number
            title
            id
          }
          ... on MarketplaceListing {
            slug
            shortDescription
            howItWorks
            id
          }
          ... on PullRequest {
            bodyText
            number
            title
            id
          }
          ... on Repository {
            description
            homepageUrl
            name
            id
          }
          __typename
        }
      }
    }
  }
`;

export const nestedUnionQuerySet: ParsedQuerySet = {
  full: nestedUnionQuery,
  initial: `
    {
      search(query: "react", first: 10, type: REPOSITORY) {
        edges {
          node {
            ... on Organization {
              organizationName: name
              id
            }
            ... on Issue {
              title
              id
            }
            ... on MarketplaceListing {
              slug
              shortDescription
              id
            }
            ... on PullRequest {
              title
              id
            }
            ... on Repository {
              name
              id
            }
            __typename
          }
        }
      }
    }
  `,
  updated: `
    {
      search(query: "react", first: 10, type: REPOSITORY) {
        edges {
          node {
            ... on Repository {
              description
              homepageUrl
              id
            }
            __typename
          }
        }
      }
    }
  `,
};

export const deferQuery = `
  {
    organization(login: "facebook") {
      ...OrganizationFieldsA @defer(if: true, label: "organizationDefer")
      login
      name
      repositories(first: 10) {
        edges {
          node {
            ... on Repository @include(if: true) {
              licenseInfo {
                permissions {
                  ...PermissionsFields @defer(if: true, label: "permissionsDefer")
                }
                id
              }
              ...RepositoryFields @skip(if: false) @defer(if: true, label: "repositoryDefer")
              id
            }
          }
        }
      }
      url
      id
    }
  }

  fragment OrganizationFieldsA on Organization {
    email @include(if: true)
    description
    isVerified
    location
  }

  fragment RepositoryFields on Repository {
    description
    homepageUrl
    name
  }

  fragment PermissionsFields on LicenseRule {
    label @skip(if: false)
  }
`;

export const deferQuerySet: ParsedQuerySet = {
  full: deferQuery,
  initial: `
    {
      organization(login: "facebook") {
        ...OrganizationFieldsA @defer(if: true, label: "organizationDefer")
        name
        repositories(first: 10) {
          edges {
            node {
              ... on Repository @include(if: true) {
                licenseInfo {
                  permissions {
                    ...PermissionsFields @defer(if: true, label: "permissionsDefer")
                  }
                  id
                }
                ...RepositoryFields @skip(if: false) @defer(if: true, label: "repositoryDefer")
                id
              }
            }
          }
        }
        url
        id
      }
    }

    fragment OrganizationFieldsA on Organization {
      email @include(if: false)
      description
    }

    fragment RepositoryFields on Repository {
      description
      homepageUrl
      name
    }

    fragment PermissionsFields on LicenseRule {
      label @skip(if: true)
    }
  `,
  updated: `
    {
      organization(login: "facebook") {
        ...OrganizationFieldsA @defer(if: true, label: "organizationDefer")
        login
        repositories(first: 10) {
          edges {
            node {
              ... on Repository @include(if: true) {
                licenseInfo {
                  permissions {
                    ...PermissionsFields @defer(if: true, label: "permissionsDefer")
                  }
                  id
                }
                id
              }
            }
          }
        }
        id
      }
    }

    fragment OrganizationFieldsA on Organization {
      email @include(if: true)
      isVerified
      location
    }

    fragment PermissionsFields on LicenseRule {
      label @skip(if: false)
    }
  `,
};

export const nestedTypeMutation = `
  mutation {
    addEmail(input: { from: "delta@gmail.com", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit", subject: "Hi, this is Delta" }) {
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
`;

export const nestedInterfaceMutation = `
  mutation {
    addStar(input: { clientMutationId: "1", starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=" }) {
      clientMutationId
      starrable {
        viewerHasStarred
        ... on Repository {
          stargazers(first: 6) {
            edges {
              node {
                name
                login
                id
              }
            }
          }
          id
        }
        __typename
      }
    }
  }
`;

export const nestedTypeSubscription = `
  subscription {
    emailAdded {
      emails {
        from
        message
        subject
        unread
        id
      }
      total
      unread
      id
    }
  }
`;

export const nestedInterfaceSubscription = `
  subscription {
    starAdded {
      ... on Repository {
        stargazers(first: 6) {
          edges {
            node {
              name
              login
              id
            }
          }
        }
        id
      }
      __typename
    }
  }
`;

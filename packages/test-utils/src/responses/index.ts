import { RawResponseDataWithMaybeCacheMetadata } from "@graphql-box/core";
import { QueryResponseSet } from "../defs";

/* tslint:disable max-line-length */

export const singleTypeQuery: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    organization: {
      description:
        "We are working to build community through open source technology. NB: members must have two-factor auth.",
      email: "",
      id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      login: "facebook",
      name: "Facebook",
      url: "https://github.com/facebook",
    },
  },
  headers: new Headers({ "Cache-Control": "public, max-age=5" }),
};

export const singleTypeQuerySet: QueryResponseSet = {
  initial: {
    data: {
      organization: {
        description:
          "We are working to build community through open source technology. NB: members must have two-factor auth.",
        id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        login: "facebook",
      },
    },
    headers: new Headers({ "Cache-Control": "public, max-age=5" }),
  },
  partial: {
    cacheMetadata: {
      query: {
        cacheControl: {
          maxAge: 10,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
      "query.organization": {
        cacheControl: {
          maxAge: 10,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
    },
    data: {
      organization: {
        description:
          "We are working to build community through open source technology. NB: members must have two-factor auth.",
        id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        login: "facebook",
      },
    },
  },
  updated: {
    data: {
      organization: {
        email: "",
        id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        name: "Facebook",
        url: "https://github.com/facebook",
      },
    },
    headers: new Headers({ "Cache-Control": "public, max-age=5" }),
  },
};

export const nestedTypeQuery: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    organization: {
      description:
        "We are working to build community through open source technology. NB: members must have two-factor auth.",
      email: "",
      id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      login: "facebook",
      name: "Facebook",
      repositories: {
        edges: [
          {
            node: {
              description:
                "Codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention. Codemod was developed at Facebook and released as open source.",
              homepageUrl: "",
              id: "MDEwOlJlcG9zaXRvcnkxNjU4ODM=",
              name: "codemod",
              owner: {
                __typename: "Organization",
                id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                login: "facebook",
                name: "Facebook",
                url: "https://github.com/facebook",
              },
            },
          },
          {
            node: {
              description: "A virtual machine for executing programs written in Hack.",
              homepageUrl: "https://hhvm.com",
              id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
              name: "hhvm",
              owner: {
                __typename: "Organization",
                id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                login: "facebook",
                name: "Facebook",
                url: "https://github.com/facebook",
              },
            },
          },
          {
            node: {
              description: "Python wrapper for RE2",
              homepageUrl: "",
              id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
              name: "pyre2",
              owner: {
                __typename: "Organization",
                id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                login: "facebook",
                name: "Facebook",
                url: "https://github.com/facebook",
              },
            },
          },
          {
            node: {
              description: null,
              homepageUrl: "http://ogp.me",
              id: "MDEwOlJlcG9zaXRvcnk2MTkyNDA=",
              name: "open-graph-protocol",
              owner: {
                __typename: "Organization",
                id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                login: "facebook",
                name: "Facebook",
                url: "https://github.com/facebook",
              },
            },
          },
          {
            node: {
              description: "Used to integrate Android apps with Facebook Platform.",
              homepageUrl: "https://developers.facebook.com/docs/android",
              id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
              name: "facebook-android-sdk",
              owner: {
                __typename: "Organization",
                id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                login: "facebook",
                name: "Facebook",
                url: "https://github.com/facebook",
              },
            },
          },
          {
            node: {
              description: "Used to integrate the Facebook Platform with your iOS & tvOS apps.",
              homepageUrl: "https://developers.facebook.com/docs/ios",
              id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
              name: "facebook-objc-sdk",
              owner: {
                __typename: "Organization",
                id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                login: "facebook",
                name: "Facebook",
                url: "https://github.com/facebook",
              },
            },
          },
        ],
      },
      url: "https://github.com/facebook",
    },
  },
  headers: new Headers({ "Cache-Control": "public, max-age=5" }),
};

export const nestedTypeQuerySet: QueryResponseSet = {
  initial: {
    data: {
      organization: {
        id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        login: "facebook",
        name: "Facebook",
        repositories: {
          edges: [
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnkxNjU4ODM=",
                name: "codemod",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
                name: "hhvm",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
                name: "pyre2",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk2MTkyNDA=",
                name: "open-graph-protocol",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
                name: "facebook-android-sdk",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
                name: "facebook-objc-sdk",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
          ],
        },
      },
    },
    headers: new Headers({ "Cache-Control": "public, max-age=5" }),
  },
  partial: {
    cacheMetadata: {
      query: {
        cacheControl: {
          maxAge: 5,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
      "query.organization": {
        cacheControl: {
          maxAge: 5,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
      "query.organization.repositories": {
        cacheControl: {
          maxAge: 5,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
      "query.organization.repositories.edges.node": {
        cacheControl: {
          maxAge: 5,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
      "query.organization.repositories.edges.node.owner": {
        cacheControl: {
          maxAge: 5,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
    },
    data: {
      organization: {
        id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        login: "facebook",
        name: "Facebook",
        repositories: {
          edges: [
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnkxNjU4ODM=",
                name: "codemod",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  login: "facebook",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
                name: "hhvm",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  login: "facebook",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
                name: "pyre2",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  login: "facebook",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk2MTkyNDA=",
                name: "open-graph-protocol",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  login: "facebook",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
                name: "facebook-android-sdk",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  login: "facebook",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
            {
              node: {
                id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
                name: "facebook-objc-sdk",
                owner: {
                  __typename: "Organization",
                  id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
                  login: "facebook",
                  name: "Facebook",
                  url: "https://github.com/facebook",
                },
              },
            },
          ],
        },
      },
    },
  },
  updated: {
    data: {
      organization: {
        description:
          "We are working to build community through open source technology. NB: members must have two-factor auth.",
        email: "",
        id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        repositories: {
          edges: [
            {
              node: {
                description:
                  "Codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention. Codemod was developed at Facebook and released as open source.",
                homepageUrl: "",
                id: "MDEwOlJlcG9zaXRvcnkxNjU4ODM=",
              },
            },
            {
              node: {
                description: "A virtual machine for executing programs written in Hack.",
                homepageUrl: "https://hhvm.com",
                id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
              },
            },
            {
              node: {
                description: "Python wrapper for RE2",
                homepageUrl: "",
                id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
              },
            },
            {
              node: {
                description: null,
                homepageUrl: "http://ogp.me",
                id: "MDEwOlJlcG9zaXRvcnk2MTkyNDA=",
              },
            },
            {
              node: {
                description: "Used to integrate Android apps with Facebook Platform.",
                homepageUrl: "https://developers.facebook.com/docs/android",
                id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
              },
            },
            {
              node: {
                description: "Used to integrate the Facebook Platform with your iOS & tvOS apps.",
                homepageUrl: "https://developers.facebook.com/docs/ios",
                id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
              },
            },
          ],
        },
        url: "https://github.com/facebook",
      },
    },
    headers: new Headers({ "Cache-Control": "public, max-age=5" }),
  },
};

export const nestedUnionQuery: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    search: {
      edges: [
        {
          node: {
            __typename: "Repository",
            description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
            homepageUrl: "https://reactjs.org",
            id: "MDEwOlJlcG9zaXRvcnkxMDI3MDI1MA==",
            name: "react",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "Event-driven, non-blocking I/O with PHP.",
            homepageUrl: "https://reactphp.org",
            id: "MDEwOlJlcG9zaXRvcnk0Mjg3OTIx",
            name: "react",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "React background management framework | React全家桶后台管理框架",
            homepageUrl: "",
            id: "MDEwOlJlcG9zaXRvcnk3NTM5NjU3NQ==",
            name: "react",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "React docs in Chinese | React 中文文档翻译",
            homepageUrl: "https://react.docschina.org/",
            id: "MDEwOlJlcG9zaXRvcnk5MDc1OTkzMA==",
            name: "react",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "京东首页构建",
            homepageUrl: null,
            id: "MDEwOlJlcG9zaXRvcnk3MjYyODI4NQ==",
            name: "react",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "基于react的企业后台管理开发框架",
            homepageUrl: "",
            id: "MDEwOlJlcG9zaXRvcnk3NzUxMzQxOQ==",
            name: "react",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "Streams of values over time",
            homepageUrl: "",
            id: "MDEwOlJlcG9zaXRvcnkzNjA2NjI0",
            name: "ReactiveCocoa",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "A framework for building native apps with React.",
            homepageUrl: "https://facebook.github.io/react-native/",
            id: "MDEwOlJlcG9zaXRvcnkyOTAyODc3NQ==",
            name: "react-native",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "Declarative routing for React",
            homepageUrl: "https://reacttraining.com/react-router/",
            id: "MDEwOlJlcG9zaXRvcnkxOTg3MjQ1Ng==",
            name: "react-router",
          },
        },
        {
          node: {
            __typename: "Repository",
            description: "Set up a modern web app by running one command.",
            homepageUrl: "https://facebook.github.io/create-react-app/",
            id: "MDEwOlJlcG9zaXRvcnk2MzUzNzI0OQ==",
            name: "create-react-app",
          },
        },
      ],
    },
  },
  headers: new Headers({ "Cache-Control": "public, max-age=5" }),
};

export const nestedUnionQuerySet: QueryResponseSet = {
  initial: {
    data: {
      search: {
        edges: [
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnkxMDI3MDI1MA==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk0Mjg3OTIx",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk3NTM5NjU3NQ==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk5MDc1OTkzMA==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk3MjYyODI4NQ==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk3NzUxMzQxOQ==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnkzNjA2NjI0",
              name: "ReactiveCocoa",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnkyOTAyODc3NQ==",
              name: "react-native",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnkxOTg3MjQ1Ng==",
              name: "react-router",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk2MzUzNzI0OQ==",
              name: "create-react-app",
            },
          },
        ],
      },
    },
    headers: new Headers({ "Cache-Control": "public, max-age=5" }),
  },
  partial: {
    cacheMetadata: {
      query: {
        cacheControl: {
          maxAge: 5,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
      "query.search": {
        cacheControl: {
          maxAge: 5,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
      "query.search.edges.node": {
        cacheControl: {
          maxAge: 5,
          public: true,
        },
        etag: undefined,
        ttl: 297471605000,
      },
    },
    data: {
      search: {
        edges: [
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnkxMDI3MDI1MA==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk0Mjg3OTIx",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk3NTM5NjU3NQ==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk5MDc1OTkzMA==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk3MjYyODI4NQ==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk3NzUxMzQxOQ==",
              name: "react",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnkzNjA2NjI0",
              name: "ReactiveCocoa",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnkyOTAyODc3NQ==",
              name: "react-native",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnkxOTg3MjQ1Ng==",
              name: "react-router",
            },
          },
          {
            node: {
              __typename: "Repository",
              id: "MDEwOlJlcG9zaXRvcnk2MzUzNzI0OQ==",
              name: "create-react-app",
            },
          },
        ],
      },
    },
  },
  updated: {
    data: {
      search: {
        edges: [
          {
            node: {
              __typename: "Repository",
              description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
              homepageUrl: "https://reactjs.org",
              id: "MDEwOlJlcG9zaXRvcnkxMDI3MDI1MA==",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "Event-driven, non-blocking I/O with PHP.",
              homepageUrl: "https://reactphp.org",
              id: "MDEwOlJlcG9zaXRvcnk0Mjg3OTIx",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "React background management framework | React全家桶后台管理框架",
              homepageUrl: "",
              id: "MDEwOlJlcG9zaXRvcnk3NTM5NjU3NQ==",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "React docs in Chinese | React 中文文档翻译",
              homepageUrl: "https://react.docschina.org/",
              id: "MDEwOlJlcG9zaXRvcnk5MDc1OTkzMA==",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "京东首页构建",
              homepageUrl: null,
              id: "MDEwOlJlcG9zaXRvcnk3MjYyODI4NQ==",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "基于react的企业后台管理开发框架",
              homepageUrl: "",
              id: "MDEwOlJlcG9zaXRvcnk3NzUxMzQxOQ==",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "Streams of values over time",
              homepageUrl: "",
              id: "MDEwOlJlcG9zaXRvcnkzNjA2NjI0",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "A framework for building native apps with React.",
              homepageUrl: "https://facebook.github.io/react-native/",
              id: "MDEwOlJlcG9zaXRvcnkyOTAyODc3NQ==",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "Declarative routing for React",
              homepageUrl: "https://reacttraining.com/react-router/",
              id: "MDEwOlJlcG9zaXRvcnkxOTg3MjQ1Ng==",
            },
          },
          {
            node: {
              __typename: "Repository",
              description: "Set up a modern web app by running one command.",
              homepageUrl: "https://facebook.github.io/create-react-app/",
              id: "MDEwOlJlcG9zaXRvcnk2MzUzNzI0OQ==",
            },
          },
        ],
      },
    },
    headers: new Headers({ "Cache-Control": "public, max-age=5" }),
  },
};

export const deferQuery: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    organization: {
      description:
        "We are working to build community through open source technology. NB: members must have two-factor auth.",
      email: null,
      id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      isVerified: true,
      location: "Menlo Park, California",
      login: "facebook",
      name: "Meta",
      repositories: {
        edges: [
          {
            node: {
              description: "A virtual machine for executing programs written in Hack.",
              homepageUrl: "https://hhvm.com",
              id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
              licenseInfo: {
                id: "MDc6TGljZW5zZTA=",
                permissions: [],
              },
              name: "hhvm",
            },
          },
          {
            node: {
              description: "Python wrapper for RE2",
              homepageUrl: "",
              id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
              licenseInfo: {
                id: "MDc6TGljZW5zZTU=",
                permissions: [
                  {
                    label: "Commercial use",
                  },
                  {
                    label: "Modification",
                  },
                  {
                    label: "Distribution",
                  },
                  {
                    label: "Private use",
                  },
                ],
              },
              name: "pyre2",
            },
          },
          {
            node: {
              description: "Used to integrate Android apps with Facebook Platform.",
              homepageUrl: "https://developers.facebook.com/docs/android",
              id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
              licenseInfo: {
                id: "MDc6TGljZW5zZTA=",
                permissions: [],
              },
              name: "facebook-android-sdk",
            },
          },
          {
            node: {
              description: "Used to integrate the Facebook Platform with your iOS & tvOS apps.",
              homepageUrl: "https://developers.facebook.com/docs/ios",
              id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
              licenseInfo: {
                id: "MDc6TGljZW5zZTA=",
                permissions: [],
              },
              name: "facebook-ios-sdk",
            },
          },
          {
            node: {
              description: "An open-source C++ library developed and used at Facebook.",
              homepageUrl: "https://groups.google.com/forum/?fromgroups#!forum/facebook-folly",
              id: "MDEwOlJlcG9zaXRvcnk0NTI0MTgx",
              licenseInfo: {
                id: "MDc6TGljZW5zZTI=",
                permissions: [
                  {
                    label: "Commercial use",
                  },
                  {
                    label: "Modification",
                  },
                  {
                    label: "Distribution",
                  },
                  {
                    label: "Patent use",
                  },
                  {
                    label: "Private use",
                  },
                ],
              },
              name: "folly",
            },
          },
          {
            node: {
              description:
                "Nailgun is a client, protocol, and server for running Java programs from the command line without incurring the JVM startup overhead.",
              homepageUrl: "https://github.com/facebook/nailgun",
              id: "MDEwOlJlcG9zaXRvcnk2ODMzMzQ1",
              licenseInfo: {
                id: "MDc6TGljZW5zZTA=",
                permissions: [],
              },
              name: "nailgun",
            },
          },
          {
            node: {
              description: "Watches files and records, or triggers actions, when they change. ",
              homepageUrl: "https://facebook.github.io/watchman/",
              id: "MDEwOlJlcG9zaXRvcnk2OTMwNDg5",
              licenseInfo: {
                id: "MDc6TGljZW5zZTEz",
                permissions: [
                  {
                    label: "Commercial use",
                  },
                  {
                    label: "Modification",
                  },
                  {
                    label: "Distribution",
                  },
                  {
                    label: "Private use",
                  },
                ],
              },
              name: "watchman",
            },
          },
          {
            node: {
              description: "A library that provides an embeddable, persistent key-value store for fast storage.",
              homepageUrl: "http://rocksdb.org",
              id: "MDEwOlJlcG9zaXRvcnk2OTM0Mzk1",
              licenseInfo: {
                id: "MDc6TGljZW5zZTA=",
                permissions: [],
              },
              name: "rocksdb",
            },
          },
          {
            node: {
              description: "Utilities related to Chef",
              homepageUrl: null,
              id: "MDEwOlJlcG9zaXRvcnk4MzIyNjQ5",
              licenseInfo: {
                id: "MDc6TGljZW5zZTI=",
                permissions: [
                  {
                    label: "Commercial use",
                  },
                  {
                    label: "Modification",
                  },
                  {
                    label: "Distribution",
                  },
                  {
                    label: "Patent use",
                  },
                  {
                    label: "Private use",
                  },
                ],
              },
              name: "chef-utils",
            },
          },
          {
            node: {
              description: "Facebook's branch of the Oracle MySQL v5.6 database. This includes MyRocks.",
              homepageUrl: "http://myrocks.io",
              id: "MDEwOlJlcG9zaXRvcnk5NDU0Njc1",
              licenseInfo: {
                id: "MDc6TGljZW5zZTg=",
                permissions: [
                  {
                    label: "Commercial use",
                  },
                  {
                    label: "Modification",
                  },
                  {
                    label: "Distribution",
                  },
                  {
                    label: "Private use",
                  },
                ],
              },
              name: "mysql-5.6",
            },
          },
        ],
      },
      url: "https://github.com/facebook",
    },
  },
  headers: new Headers({ "Cache-Control": "public, max-age=60" }),
};

export const deferQuerySet: QueryResponseSet = {
  initial: {
    data: {
      organization: {
        description:
          "We are working to build community through open source technology. NB: members must have two-factor auth.",
        id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        name: "Meta",
        repositories: {
          edges: [
            {
              node: {
                description: "A virtual machine for executing programs written in Hack.",
                homepageUrl: "https://hhvm.com",
                id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "hhvm",
              },
            },
            {
              node: {
                description: "Python wrapper for RE2",
                homepageUrl: "",
                id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTU=",
                  permissions: [{}, {}, {}, {}],
                },
                name: "pyre2",
              },
            },
            {
              node: {
                description: "Used to integrate Android apps with Facebook Platform.",
                homepageUrl: "https://developers.facebook.com/docs/android",
                id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "facebook-android-sdk",
              },
            },
            {
              node: {
                description: "Used to integrate the Facebook Platform with your iOS & tvOS apps.",
                homepageUrl: "https://developers.facebook.com/docs/ios",
                id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "facebook-ios-sdk",
              },
            },
            {
              node: {
                description: "An open-source C++ library developed and used at Facebook.",
                homepageUrl: "https://groups.google.com/forum/?fromgroups#!forum/facebook-folly",
                id: "MDEwOlJlcG9zaXRvcnk0NTI0MTgx",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTI=",
                  permissions: [{}, {}, {}, {}, {}],
                },
                name: "folly",
              },
            },
            {
              node: {
                description:
                  "Nailgun is a client, protocol, and server for running Java programs from the command line without incurring the JVM startup overhead.",
                homepageUrl: "https://github.com/facebook/nailgun",
                id: "MDEwOlJlcG9zaXRvcnk2ODMzMzQ1",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "nailgun",
              },
            },
            {
              node: {
                description: "Watches files and records, or triggers actions, when they change. ",
                homepageUrl: "https://facebook.github.io/watchman/",
                id: "MDEwOlJlcG9zaXRvcnk2OTMwNDg5",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTEz",
                  permissions: [{}, {}, {}, {}],
                },
                name: "watchman",
              },
            },
            {
              node: {
                description: "A library that provides an embeddable, persistent key-value store for fast storage.",
                homepageUrl: "http://rocksdb.org",
                id: "MDEwOlJlcG9zaXRvcnk2OTM0Mzk1",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "rocksdb",
              },
            },
            {
              node: {
                description: "Utilities related to Chef",
                homepageUrl: null,
                id: "MDEwOlJlcG9zaXRvcnk4MzIyNjQ5",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTI=",
                  permissions: [{}, {}, {}, {}, {}],
                },
                name: "chef-utils",
              },
            },
            {
              node: {
                description: "Facebook's branch of the Oracle MySQL v5.6 database. This includes MyRocks.",
                homepageUrl: "http://myrocks.io",
                id: "MDEwOlJlcG9zaXRvcnk5NDU0Njc1",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTg=",
                  permissions: [{}, {}, {}, {}],
                },
                name: "mysql-5.6",
              },
            },
          ],
        },
        url: "https://github.com/facebook",
      },
    },
    headers: new Headers({ "Cache-Control": "public, max-age=60" }),
  },
  partial: {
    cacheMetadata: {
      query: {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization.description": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization.repositories": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization.repositories.edges.node": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization.repositories.edges.node.description": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization.repositories.edges.node.homepageUrl": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization.repositories.edges.node.id": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization.repositories.edges.node.licenseInfo": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
      "query.organization.repositories.edges.node.name": {
        cacheControl: {
          maxAge: 60,
          public: true,
        },
        etag: undefined,
        ttl: 297475260000,
      },
    },
    data: {
      organization: {
        description:
          "We are working to build community through open source technology. NB: members must have two-factor auth.",
        id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        name: "Meta",
        repositories: {
          edges: [
            {
              node: {
                description: "A virtual machine for executing programs written in Hack.",
                homepageUrl: "https://hhvm.com",
                id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "hhvm",
              },
            },
            {
              node: {
                description: "Python wrapper for RE2",
                homepageUrl: "",
                id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTU=",
                  permissions: [{}, {}, {}, {}],
                },
                name: "pyre2",
              },
            },
            {
              node: {
                description: "Used to integrate Android apps with Facebook Platform.",
                homepageUrl: "https://developers.facebook.com/docs/android",
                id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "facebook-android-sdk",
              },
            },
            {
              node: {
                description: "Used to integrate the Facebook Platform with your iOS & tvOS apps.",
                homepageUrl: "https://developers.facebook.com/docs/ios",
                id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "facebook-ios-sdk",
              },
            },
            {
              node: {
                description: "An open-source C++ library developed and used at Facebook.",
                homepageUrl: "https://groups.google.com/forum/?fromgroups#!forum/facebook-folly",
                id: "MDEwOlJlcG9zaXRvcnk0NTI0MTgx",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTI=",
                  permissions: [{}, {}, {}, {}, {}],
                },
                name: "folly",
              },
            },
            {
              node: {
                description:
                  "Nailgun is a client, protocol, and server for running Java programs from the command line without incurring the JVM startup overhead.",
                homepageUrl: "https://github.com/facebook/nailgun",
                id: "MDEwOlJlcG9zaXRvcnk2ODMzMzQ1",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "nailgun",
              },
            },
            {
              node: {
                description: "Watches files and records, or triggers actions, when they change. ",
                homepageUrl: "https://facebook.github.io/watchman/",
                id: "MDEwOlJlcG9zaXRvcnk2OTMwNDg5",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTEz",
                  permissions: [{}, {}, {}, {}],
                },
                name: "watchman",
              },
            },
            {
              node: {
                description: "A library that provides an embeddable, persistent key-value store for fast storage.",
                homepageUrl: "http://rocksdb.org",
                id: "MDEwOlJlcG9zaXRvcnk2OTM0Mzk1",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTA=",
                  permissions: [],
                },
                name: "rocksdb",
              },
            },
            {
              node: {
                description: "Utilities related to Chef",
                homepageUrl: null,
                id: "MDEwOlJlcG9zaXRvcnk4MzIyNjQ5",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTI=",
                  permissions: [{}, {}, {}, {}, {}],
                },
                name: "chef-utils",
              },
            },
            {
              node: {
                description: "Facebook's branch of the Oracle MySQL v5.6 database. This includes MyRocks.",
                homepageUrl: "http://myrocks.io",
                id: "MDEwOlJlcG9zaXRvcnk5NDU0Njc1",
                licenseInfo: {
                  id: "MDc6TGljZW5zZTg=",
                  permissions: [{}, {}, {}, {}],
                },
                name: "mysql-5.6",
              },
            },
          ],
        },
        url: "https://github.com/facebook",
      },
    },
  },
  updated: [
    {
      data: {
        organization: {
          id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
          login: "facebook",
          repositories: {
            edges: [
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTA=",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTU=",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTA=",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTA=",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk0NTI0MTgx",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTI=",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk2ODMzMzQ1",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTA=",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk2OTMwNDg5",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTEz",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk2OTM0Mzk1",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTA=",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk4MzIyNjQ5",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTI=",
                  },
                },
              },
              {
                node: {
                  id: "MDEwOlJlcG9zaXRvcnk5NDU0Njc1",
                  licenseInfo: {
                    id: "MDc6TGljZW5zZTg=",
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
    },
    {
      data: {
        organization: {
          email: null,
          isVerified: true,
          location: "Menlo Park, California",
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              {
                node: {
                  licenseInfo: {
                    permissions: [],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.0.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [
                      {
                        label: "Commercial use",
                      },
                      {
                        label: "Modification",
                      },
                      {
                        label: "Distribution",
                      },
                      {
                        label: "Private use",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.1.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.2.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              undefined,
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.3.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              undefined,
              undefined,
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [
                      {
                        label: "Commercial use",
                      },
                      {
                        label: "Modification",
                      },
                      {
                        label: "Distribution",
                      },
                      {
                        label: "Patent use",
                      },
                      {
                        label: "Private use",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.4.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.5.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [
                      {
                        label: "Commercial use",
                      },
                      {
                        label: "Modification",
                      },
                      {
                        label: "Distribution",
                      },
                      {
                        label: "Private use",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.6.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.7.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [
                      {
                        label: "Commercial use",
                      },
                      {
                        label: "Modification",
                      },
                      {
                        label: "Distribution",
                      },
                      {
                        label: "Patent use",
                      },
                      {
                        label: "Private use",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: true,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.8.node.licenseInfo.permissions"],
    },
    {
      data: {
        organization: {
          repositories: {
            edges: [
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              {
                node: {
                  licenseInfo: {
                    permissions: [
                      {
                        label: "Commercial use",
                      },
                      {
                        label: "Modification",
                      },
                      {
                        label: "Distribution",
                      },
                      {
                        label: "Private use",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      hasNext: false,
      headers: new Headers({ "Cache-Control": "public, max-age=60" }),
      paths: ["organisation.repositories.edges.9.node.licenseInfo.permissions"],
    },
  ],
};

export const nestedInterfaceMutation: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    addStar: {
      clientMutationId: "1",
      starrable: {
        __typename: "Repository",
        id: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=",
        name: "handl",
        stargazers: {
          edges: [
            {
              node: {
                id: "MDQ6VXNlcjk5MzQzMjc=",
                login: "duataud",
                name: "Yamir",
              },
            },
            {
              node: {
                id: "MDQ6VXNlcjI5NTMwMjU=",
                login: "fabiodr",
                name: "Fabio Dias Rollo",
              },
            },
            {
              node: {
                id: "MDQ6VXNlcjc2OTYxNDU=",
                login: "kevinsegal",
                name: "Kevin Segal",
              },
            },
            {
              node: {
                id: "MDQ6VXNlcjE2MjcxNjIx",
                login: "darcyturk",
                name: "Darcy Turk",
              },
            },
            {
              node: {
                id: "MDQ6VXNlcjE3NTM0MDA2",
                login: "nicholas-b-carter",
                name: "Nick Carter",
              },
            },
            {
              node: {
                id: "MDQ6VXNlcjE3MzQ2OTc4",
                login: "dylanaubrey",
                name: "Dylan Aubrey",
              },
            },
          ],
        },
      },
    },
  },
  headers: new Headers({ "Cache-Control": "public, max-age=5" }),
};

export const nestedInterfaceSubscription: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    __typename: "Repository",
    id: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg=",
    name: "graphql-box",
    stargazers: {
      edges: [
        {
          node: {
            id: "MDQ6VXNlcjk5MzQzMjc=",
            login: "duataud",
            name: "Yamir",
          },
        },
        {
          node: {
            id: "MDQ6VXNlcjI5NTMwMjU=",
            login: "fabiodr",
            name: "Fabio Dias Rollo",
          },
        },
        {
          node: {
            id: "MDQ6VXNlcjc2OTYxNDU=",
            login: "kevinsegal",
            name: "Kevin Segal",
          },
        },
        {
          node: {
            id: "MDQ6VXNlcjE2MjcxNjIx",
            login: "darcyturk",
            name: "Darcy Turk",
          },
        },
        {
          node: {
            id: "MDQ6VXNlcjE3NTM0MDA2",
            login: "nicholas-b-carter",
            name: "Nick Carter",
          },
        },
        {
          node: {
            id: "MDQ6VXNlcjE3MzQ2OTc4",
            login: "dylanaubrey",
            name: "Dylan Aubrey",
          },
        },
      ],
    },
  },
};

export const nestedTypeSubscription: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    emailAdded: {
      emails: [
        {
          from: "alfa@gmail.com",
          id: 1,
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          subject: "Hi, this is Alfa",
          unread: false,
        },
        {
          from: "bravo@gmail.com",
          id: 2,
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          subject: "Hi, this is Bravo",
          unread: false,
        },
        {
          from: "charlie@gmail.com",
          id: 3,
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          subject: "Hi, this is Charlie",
          unread: false,
        },
        {
          from: "delta@gmail.com",
          id: 4,
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          subject: "Hi, this is Delta",
          unread: true,
        },
      ],
      id: 1,
      total: 4,
      unread: 1,
    },
  },
  headers: new Headers({ "Cache-Control": "public, max-age=5" }),
};

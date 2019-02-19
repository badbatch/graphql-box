import { RawResponseDataWithMaybeCacheMetadata } from "@handl/core";

/* tslint:disable max-line-length */

export const singleType: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    organization: {
      description: "We are working to build community through open source technology. NB: members must have two-factor auth.",
      email: "",
      id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      login: "facebook",
      name: "Facebook",
      url: "https://github.com/facebook",
    },
  },
  headers: new Headers({ "Cache-Control": "public, max-age=5" }),
};

export const nestedTypeWithEdges: RawResponseDataWithMaybeCacheMetadata = {
  data: {
    organization: {
      description: "We are working to build community through open source technology. NB: members must have two-factor auth.",
      email: "",
      id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      login: "facebook",
      name: "Facebook",
      repositories: {
        edges: [
          {
            node: {
              description: "Codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention. Codemod was developed at Facebook and released as open source.",
              homepageUrl: "",
              id: "MDEwOlJlcG9zaXRvcnkxNjU4ODM=",
              name: "codemod",
            },
          },
          {
            node: {
              description: "A virtual machine for executing programs written in Hack.",
              homepageUrl: "https://hhvm.com",
              id: "MDEwOlJlcG9zaXRvcnk0NTU2MDA=",
              name: "hhvm",
            },
          },
          {
            node: {
              description: "Python wrapper for RE2",
              homepageUrl: "",
              id: "MDEwOlJlcG9zaXRvcnk1NjU0MjY=",
              name: "pyre2",
            },
          },
          {
            node: {
              description: null,
              homepageUrl: "http://ogp.me",
              id: "MDEwOlJlcG9zaXRvcnk2MTkyNDA=",
              name: "open-graph-protocol",
            },
          },
          {
            node: {
              description: "Used to integrate Android apps with Facebook Platform.",
              homepageUrl: "https://developers.facebook.com/docs/android",
              id: "MDEwOlJlcG9zaXRvcnk2NTkzNDE=",
              name: "facebook-android-sdk",
            },
          },
          {
            node: {
              description: "Used to integrate the Facebook Platform with your iOS & tvOS apps.",
              homepageUrl: "https://developers.facebook.com/docs/ios",
              id: "MDEwOlJlcG9zaXRvcnk3Mzg0OTE=",
              name: "facebook-objc-sdk",
            },
          },
        ],
      },
      url: "https://github.com/facebook",
    },
  },
  headers: new Headers({ "Cache-Control": "public, max-age=5" }),
};

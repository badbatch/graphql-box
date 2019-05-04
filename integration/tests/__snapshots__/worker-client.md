# `worker-client`

## `request`

##   `no match`

####     `correct response data`

```
Object {
  "_cacheMetadata": Object {
    "query": Object {
      "cacheControl": Object {
        "maxAge": 1,
        "public": true,
      },
      "etag": undefined,
      "ttl": 297471601000,
    },
    "query.organization": Object {
      "cacheControl": Object {
        "maxAge": 1,
        "public": true,
      },
      "etag": undefined,
      "ttl": 297471601000,
    },
  },
  "data": Object {
    "organization": Object {
      "description": "We are working to build community through open source technology. NB: members must have two-factor auth.",
      "email": "",
      "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      "login": "facebook",
      "name": "Facebook",
      "url": "https://github.com/facebook",
    },
  },
}
```

####     `correct cache data`

```
Object {
  "entries": Array [
    Array [
      "requestFieldPaths::5256db516a2438a7e5488a00413f4809",
      Object {
        "description": "We are working to build community through open source technology. NB: members must have two-factor auth.",
        "email": "",
        "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        "login": "facebook",
        "name": "Facebook",
        "url": "https://github.com/facebook",
      },
    ],
    Array [
      "dataEntities::Organization::MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      Object {
        "description": "We are working to build community through open source technology. NB: members must have two-factor auth.",
        "email": "",
        "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
        "login": "facebook",
        "name": "Facebook",
        "url": "https://github.com/facebook",
      },
    ],
    Array [
      "queryResponses::ea1cbc58eca798225b53f59d95ffb23a",
      Object {
        "cacheMetadata": Object {
          "query": Object {
            "cacheControl": Object {
              "maxAge": 1,
              "public": true,
            },
            "etag": undefined,
            "ttl": 297471601000,
          },
          "query.organization": Object {
            "cacheControl": Object {
              "maxAge": 1,
              "public": true,
            },
            "etag": undefined,
            "ttl": 297471601000,
          },
        },
        "data": Object {
          "organization": Object {
            "description": "We are working to build community through open source technology. NB: members must have two-factor auth.",
            "email": "",
            "id": "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
            "login": "facebook",
            "name": "Facebook",
            "url": "https://github.com/facebook",
          },
        },
      },
    ],
  ],
  "metadata": Array [
    Object {
      "accessedCount": 0,
      "added": 297471600000,
      "cacheability": Cacheability {
        "metadata": Object {
          "cacheControl": Object {
            "maxAge": 1,
            "public": true,
          },
          "etag": undefined,
          "ttl": 297471601000,
        },
      },
      "key": "requestFieldPaths::5256db516a2438a7e5488a00413f4809",
      "lastAccessed": 297471600000,
      "lastUpdated": 297471600000,
      "size": 410,
      "tags": Array [],
      "updatedCount": 0,
    },
    Object {
      "accessedCount": 0,
      "added": 297471600000,
      "cacheability": Cacheability {
        "metadata": Object {
          "cacheControl": Object {
            "maxAge": 1,
            "public": true,
          },
          "etag": undefined,
          "ttl": 297471601000,
        },
      },
      "key": "dataEntities::Organization::MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      "lastAccessed": 297471600000,
      "lastUpdated": 297471600000,
      "size": 410,
      "tags": Array [],
      "updatedCount": 0,
    },
    Object {
      "accessedCount": 0,
      "added": 297471600000,
      "cacheability": Cacheability {
        "metadata": Object {
          "cacheControl": Object {
            "maxAge": 1,
            "public": true,
          },
          "etag": undefined,
          "ttl": 297471601000,
        },
      },
      "key": "queryResponses::ea1cbc58eca798225b53f59d95ffb23a",
      "lastAccessed": 297471600000,
      "lastUpdated": 297471600000,
      "size": 678,
      "tags": Array [],
      "updatedCount": 0,
    },
  ],
}
```


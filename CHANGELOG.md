# Changelog

## 5.5.39 (2025-04-19)

### Refactors

* **server:**  update request options on server (b70b8523)

## 5.5.38 (2025-04-18)

### New Features

* **connection-resolver:**  enrich log entries (3633d918)

### Refactors

* **connection-resolver:**  update logging (c3ccda0c)

## 5.5.37 (2025-04-17)

### Refactors

* **connection-resolver,server:**  update logging data (aeed9439)

## 5.5.36 (2025-04-17)

### Refactors

* **connection-resolver,fetch-manager,server:**  update headers and context (febeeb85)

## 5.5.35 (2025-04-17)

### Refactors

* **server:**  update context data (3ce133d2)

## 5.5.34 (2025-04-17)

### Refactors

* **core,execute:**  update context type (c2876366)

## 5.5.33 (2025-04-16)

### Refactors

* **execute:**  change how contextValue is structured and populated (00512c41)

## 5.5.32 (2025-04-05)

### Bug Fixes

* **root:**  vulnerabilities (cca5dfa0)

## 5.5.31 (2025-04-05)

### Chores

* **deps-dev:**  bump next from 14.2.25 to 14.2.26 (885f4160)

### Refactors

* **connection-resolver:**  remove status from return type (e62a335a)

## 5.5.30 (2025-03-31)

### Chores

* **deps-dev:**  bump next from 14.2.21 to 14.2.25 (6ac0a151)

### Refactors

* **connection-resolver:**  update return type (ec33ce3a)

## 5.5.29 (2025-03-26)

### Refactors

* **connection-resolver:**  rename variable (64f63687)

## 5.5.28 (2025-03-25)

### New Features

* **connection-resolver:**  add logging and cache control setting (396e7846)

### Bug Fixes

* **root:**  vulnerabilities (51795c9a)

### Refactors

* **execute:**  pass operation name into context (da18d5df)

## 5.5.27 (2025-02-18)

### New Features

* **react:**  export connection type (c725838b)

## 5.5.26 (2025-02-15)

### Chores

* **react:**  add debug with logging of duplicate entries (0fbd2e67)

## 5.5.25 (2025-02-15)

### Bug Fixes

* **react:**  filter out duplicate entries from connection (dff1de02)

## 5.5.24 (2025-02-14)

### Bug Fixes

* **react:**  another change to use query state (26b59e2a)

## 5.5.23 (2025-02-14)

### Bug Fixes

* **react:**  loading state bug (0e291e01)

## 5.5.22 (2025-02-12)

### Refactors

* **react:**  move connection listings to use query (49b5d550)

## 5.5.21 (2025-02-11)

### Bug Fixes

* **react:**  create useQuery hook (6cfe8523)

## 5.5.20 (2025-02-11)

### New Features

* **worker-client:**  enforce cache manager and request parser (62179c0c)

### Bug Fixes

* **react:**  update provider should update worker cache (ee729af9)
* **worker-client:**
  * minor change (fb95d288)
  * release message queue (4f53f1a9)

## 5.5.19 (2025-02-10)

### New Features

* **react:**  add update provider for graphql (e5fdde49)

## 5.5.18 (2025-02-09)

### New Features

* **core:**  add request result type (dff94ad7)

## 5.5.17 (2025-02-09)

### New Features

* **core:**  make partial request result generic (6930c3e2)

## 5.5.16 (2025-02-09)

### Other Changes

* **react:**  add support for server action" (8e7dfdcb)

## 5.5.15 (2025-02-09)

### New Features

* **react:**  add support for server action (0ca16470)

## 5.5.14 (2025-02-08)

### New Features

* **worker-client:**  add worker setter (85d560ef)

## 5.5.13 (2025-02-08)

### Chores

* **worker-client:**  spacing (7c7aa764)

### Refactors

* **worker-client:**  make callback promisable (4b594660)

## 5.5.12 (2025-02-08)

### New Features

* **worker-client:**  support lazy init of worker (235d62b6)

## 5.5.11 (2025-02-08)

### New Features

* **cache-manager:**  support lazy init of cache (f8afb8d0)

## 5.5.10 (2025-02-08)

### Refactors

* **react:**  simplify provider (5cac6ee8)

## 5.5.9 (2025-01-11)

### New Features

* **react:**  add multi query and mutation hooks (32e26f10)

### Bug Fixes

* **root:**  remove rust config in github actions (9dcb386d)

## 5.5.8 (2025-01-04)

### Chores

* **deps-dev:**  bump next from 14.2.20 to 14.2.21 (57e6ca75)

### Refactors

* **gql.macro:**  manually generate types (a47b6eb4)

## 5.5.7 (2025-01-04)

### Chores

* **fetch-manager:**  fix formatting (cee94dcb)

### Refactors

* **root:**  remove swc plugin until it works properly (cfd85357)

## 5.5.6 (2025-01-01)

### Bug Fixes

* **swc-plugin-gql:**  importGql signature (afc44ffd)

## 5.5.5 (2025-01-01)

### Bug Fixes

* **swc-plugin-gql:**  change type signature of importGql (d4c2e4ad)

## 5.5.4 (2025-01-01)

### Bug Fixes

* **swc-plugin-gql:**  exclude target from npm (7bce5b95)

## 5.5.3 (2025-01-01)

### Bug Fixes

* **swc-plugin-gql:**
  * wrong build npm script (cc29ad4b)
  * copy wasm output to dist folder and ignore target (750fa2f6)

## 5.5.2 (2025-01-01)

### Chores

* **root:**  minor changes (8642a228)

### Bug Fixes

* **swc-plugin-gql:**  output wasm filename wrongame wrong (47ea8464)

### Refactors

* **swc-plugin-gql:**  change how files are ignored (f47fd6d9)

## 5.5.1 (2024-12-30)

### Chores

* **root:**  update mise config to include rust (fd46854d)

### Bug Fixes

* **swc-plugin-gql:**
  * add clippy explicitely in lint script (23474f16)
  * linting suggestions (17fd477a)
* **root:**  add rust flags to enable clippy (ba3e00db)

### Refactors

* **swc-plugin-gql:**  config changes (6384b26c)

## 5.5.0 (2024-12-30)

### Chores

* **swc-plugin-gql:**  add readme and license (6225cf61)

### New Features

* **swc-plugin-gql:**  remaining changes for plugin (16c45748)
* **swc-plugin:**  add initial code for plugin (dce26d23)

## 5.4.0 (2024-12-23)

### Chores

* **root:**
  * fix automoation tests (4f08fa7e)
  * fix remaining integration tests (71bf1ecd)
  * save work in progress (8cb88b6d)
* **graphql-box:**
  * save work in progress (9e622ed5)
  * initial lint fixes (c02d477a)
  * initial config changes (a0df959e)

### Bug Fixes

* **root:**
  * prop ordering (4aa62a64)
  * sort vulnerabilities (b0954c46)
  * update metadata order (899213f4)

### Other Changes

* **cache-manager:**  wrap caching in settimeout to defer" (e8c0c9f5)

### Refactors

* **root:**  change metadata order in integration tests (c59849b3)
* **graphql-box:**  update deps and make code mods (850bdee7)
* **debug-manager:**  upgrade deps (0f93f496)

## 5.3.3 (2024-07-22)

### Refactors

* **cache-manager:**  disable entity and requestPath cache tiers by default (7b4f47ef)

## 5.3.3-alpha-54321.1 (2024-07-13)

### Refactors

* **helpers:**  change way error is deserialised (df0f6d49)

## 5.3.3-alpha-54321.0 (2024-07-12)

### Bug Fixes

* **helpers:**  nest source in location to satisfiy to string (cb594d7c)

## 5.3.2 (2024-07-07)

### New Features

* **cache-manager:**  make cache tiers configurable (4b32c075)

## 5.3.1 (2024-06-26)

### New Features

* **server:**  add nextjs middleware (c7066930)

## 5.3.0 (2024-06-23)

### Chores

* **deps-dev:**  bump ws from 8.14.2 to 8.17.1 (ec3d1cab)

### Refactors

* **server:**  turn into framework specific classes (2c73fbf5)

## 5.2.16 (2024-06-17)

### Refactors

* **react:**  support lazy initialisation of client (606b7bcd)

## 5.2.15 (2024-06-08)

### Chores

* **deps-dev:**  bump express from 4.18.2 to 4.19.2 (0eebb5d3)
* **graphql-box:**  upgrade husky (757f5398)

### New Features

* **fetch-manager:**  log graphql errors to console in dev mode (aea17ac1)

## 5.2.14 (2024-03-19)

### New Features

* **react:**  pass all request options through connection listings (6a443eac)

## 5.2.13 (2024-03-18)

### Refactors

* **cache-manager:**  tidy up cache entry setting logic (771c163c)

## 5.2.12 (2024-03-18)

### Chores

* **graphql-box:**  bump cachemap and update tests (1b0c31b9)

## 5.2.11 (2024-03-18)

### Chores

* **graphql-box:**  update deps and fix issues (2b134c8e)

## 5.2.9 (2024-03-18)

### Chores

* manually bump minor version past previous to skip reverted code (98292ed4)

## 5.0.8 (2024-03-11)

### Chores

* republish packages with prod build outputs (ca9c2494)

## 5.0.7 (2024-02-25)

### Refactors

* **execute:**  loosen up the default resolver type (dcded3b6)

## 5.0.6 (2024-02-25)

### Bug Fixes

* **react:**  typo in provider name (457c37b9)
* add .tsx to command line lint script (c8c68e0a)

## 5.0.5 (2024-01-12)

### Chores

* bump deps (62f0f332)

## 5.0.4 (2024-01-06)

### Refactors

* change macro to type module (589597d5)

## 5.0.3 (2024-01-06)

### Bug Fixes

* another attempt to align macro types for runtime (2e75186c)

## 5.0.2 (2024-01-06)

### Bug Fixes

* whitespace in package json (ef5306e3)
* bonehead mistake with default export (4ba4b89c)

## 5.0.1 (2024-01-05)

### Bug Fixes

* wait for server to start before running tests (74f3c3f9)

### Refactors

* change way macro is exported and add type casting (3caea583)

## 5.0.0 (2024-01-02)

### Bug Fixes

* internal peer deps mismatch (0d840f43)

## 4.1.7 (2023-12-28)

### Chores

* save work in progress (a0be689f)

### New Features

* migrate gql.macro and use exports map for all packages (969a0847)

### Bug Fixes

* add generate changelog dependency (013183d5)
* readme tweaks (46650e26)
* revert to npm for concurrently scripts (175ca361)
* remove redundant snapshots (17dfe36c)
* regression in type checking fetch manager (63fd0987)
* tsconfig reference order (00d4f01a)

### Refactors

* migrate worker integration tests (d32d8b55)
* better support cjs (37519aff)
* move server to esmodule (87cb8f87)
* move react to esmodule (d89ff2cb)
* migrate worker client to esmodule (15b844d3)
* regig cachemap deps (fee56243)
* migrate client to esmodule (c7fd99de)
* move websocket manager to esmodule (f679dc59)
* migrate subscribe to esmodules (bfe6b115)
* move request parser to esmodule (a4b21c76)
* move fetch manager to esmodules (77e65412)
* migrate execute module to esmodules (99c82b14)
* migrate debug manager to esmodules (db1d1802)
* migrate connection resolver to esmodules (19e419a6)
* update way types are passed to reduce (c7875d69)
* remove cli module (0e5e31cc)
* migrate cache manager to esmodules (2598dca0)
* migrate test-utils (1374a77b)
* move helpers package to esmodules (fb829d38)

## 4.1.7 (2023-08-13)

### Chores

* **deps:**
  * bump word-wrap from 1.2.3 to 1.2.5 ([aa231f74](https://github.com/badbatch/graphql-box/commit/aa231f740e435b6e0211690240385335d682276a))
  * bump socket.io-parser from 4.2.1 to 4.2.4 ([c9a3e70c](https://github.com/badbatch/graphql-box/commit/c9a3e70c72219623daf3b7b90d63602d70ac00b1))
  * bump semver from 5.7.1 to 5.7.2 ([4c716c53](https://github.com/badbatch/graphql-box/commit/4c716c537b76dc2c69591e176f46e1e78de54cd3))

### Bug Fixes

* output mjs files for module ([870b4903](https://github.com/badbatch/graphql-box/commit/870b49030713f8670f86321356a6d85de656ea83))

## 4.1.6 (2023-07-13)

### Bug Fixes

* add named export ([2410fc32](https://github.com/badbatch/graphql-box/commit/2410fc3253ace350cd979f1d45e7033661fc6edd))

## 4.1.5 (2023-07-10)

### Chores

* **deps:**
  * bump ua-parser-js from 0.7.32 to 0.7.33 ([36937e5d](https://github.com/badbatch/graphql-box/commit/36937e5d31e5609063bb029b55b413b841d1ce0a))
  * bump qs from 6.5.2 to 6.5.3 ([01214b2c](https://github.com/badbatch/graphql-box/commit/01214b2c653873801361debe47b020c712164ce6))
  * bump decode-uri-component from 0.2.0 to 0.2.2 ([5c51d7aa](https://github.com/badbatch/graphql-box/commit/5c51d7aa54a382c7299479de255a4b485edd09e8))
  * bump engine.io from 6.2.0 to 6.2.1 ([5bc78505](https://github.com/badbatch/graphql-box/commit/5bc785057ebe3cf214460ed6deb29d543ff423dc))
* **deps-dev:**  bump express from 4.17.1 to 4.17.3 ([ba4e9819](https://github.com/badbatch/graphql-box/commit/ba4e9819708cf8f769588ff6a70b062807ce9018))

### Bug Fixes

* make compatible with latest version 16 of graphql ([1f1e01d3](https://github.com/badbatch/graphql-box/commit/1f1e01d3b68ed07a45a44a51d99aa04ef165f316))

## 4.1.4 (2022-11-21)

### Documentation Changes

* remove defer/stream blurb ([4de19b11](https://github.com/badbatch/graphql-box/commit/4de19b114b365c27912ae38ee813d66902f1c718))
* add defer/stream info to readme ([63bfb459](https://github.com/badbatch/graphql-box/commit/63bfb459c722b78ad6ccac56131dbc6aa37d153b))

### New Features

* add flag for defer stream ([a4449dc8](https://github.com/badbatch/graphql-box/commit/a4449dc8a52bf0d89d7ebb399b16d9c8d1b9180e))

## 4.1.3 (2022-11-20)

### Bug Fixes

* serialise/deserialise errors passed in logs to server ([3146a3b1](https://github.com/badbatch/graphql-box/commit/3146a3b14b32e0fe91bc8b16d42c2be198b69152))

## 4.1.2 (2022-11-20)

### Bug Fixes

* github workflow not triggering on tag push ([0f66f3fd](https://github.com/badbatch/graphql-box/commit/0f66f3fd310129d56706ee7ca8441597f9154496))

## 4.1.1 (2022-11-18)

### Chores

* **deps:**
  * bump loader-utils from 1.4.0 to 1.4.2 ([4c16daf2](https://github.com/badbatch/graphql-box/commit/4c16daf20c31a1b36e43c554250991235199e6a3))
  * bump follow-redirects from 1.14.1 to 1.15.2 ([70818d49](https://github.com/badbatch/graphql-box/commit/70818d499f16525f7db497825a70a83aae7fbf6b))
  * bump terser from 4.8.0 to 4.8.1 ([0b339fc8](https://github.com/badbatch/graphql-box/commit/0b339fc893c7bb1eb2418ceb0fe86bcce00fa191))
  * bump async from 2.6.3 to 2.6.4 ([45cb572e](https://github.com/badbatch/graphql-box/commit/45cb572ebbf5cf096013d01a723d537a1cdc3db8))
  * bump url-parse from 1.5.1 to 1.5.10 ([36f88f4a](https://github.com/badbatch/graphql-box/commit/36f88f4a0720bd21f26073bcbe56378a02ec8f62))
  * bump trim-off-newlines from 1.0.1 to 1.0.3 ([e9f55b59](https://github.com/badbatch/graphql-box/commit/e9f55b59dafa3e1925aa7632f708f98928a1e05f))
  * bump shelljs from 0.8.4 to 0.8.5 ([75bd7ad5](https://github.com/badbatch/graphql-box/commit/75bd7ad5e1db871ed1115452f36f1cc4a00cd562))
* **deps-dev:**
  * bump undici from 4.14.1 to 5.8.2 ([2a2a6a30](https://github.com/badbatch/graphql-box/commit/2a2a6a30da68516bc4d623f5766ab81474275036))
  * bump karma from 4.4.1 to 6.3.16 ([39a9f57c](https://github.com/badbatch/graphql-box/commit/39a9f57c06da5ec328c2a287ee98a13087bf1e9b))

### Documentation Changes

* update readme ([867d774f](https://github.com/badbatch/graphql-box/commit/867d774f27ebcb59bb7a0d0be7c0130354976fdf))

### New Features

* export graphql serialise/deserialise from helers ([461d7216](https://github.com/badbatch/graphql-box/commit/461d72161298ce9b78f84328bb7fabde20072776))

### Bug Fixes

* update serialize error to cater for graphql error structure ([1db0a372](https://github.com/badbatch/graphql-box/commit/1db0a3722b7a12a2953a167efd556ae709b2974b))
* mismatch peer deps ([99455d9e](https://github.com/badbatch/graphql-box/commit/99455d9e4b7e17a9f7decc491da02c90c7dc7927))
* typo in workflow ([4195cde3](https://github.com/badbatch/graphql-box/commit/4195cde3353f064ee3bf36cafe37fa55025fcf20))
* syntax error ([a7c32bf6](https://github.com/badbatch/graphql-box/commit/a7c32bf6d5a17e22b29d7574ba5f020336a5cc92))
* update pipleine and node version ([fae20462](https://github.com/badbatch/graphql-box/commit/fae204626fb8b910cda16f4b4544ccf087013e1c))

### Refactors

* update workflow ([ec8fb8eb](https://github.com/badbatch/graphql-box/commit/ec8fb8ebc19a7300e9b107f2cfb7df677da77f4e))

### 4.1.0 (2022-11-10)

### Documentation Changes

* add logo to readme ([242f3876](https://github.com/badbatch/graphql-box/commit/242f387653ef7140ed14ff41689d6edb14b4ef79))

### New Features

* add request complexity to context and add tests ([1c5407ab](https://github.com/badbatch/graphql-box/commit/1c5407abe01adc45d1edd43b55bf674968c4f34c))
* addd requestDepth to context for logging and add tests ([899a8b76](https://github.com/badbatch/graphql-box/commit/899a8b763de2a3361a36d50c6dd1134c032d6d72))

### Bug Fixes

* re add logo ([7cfb8465](https://github.com/badbatch/graphql-box/commit/7cfb8465ed4f8df445a2b6e3db98e5016e86eaaa))
* remove logo as styles not applied ([f5db28a9](https://github.com/badbatch/graphql-box/commit/f5db28a9c7d1a9520bcd5dcccf38b475e1f37ae6))

## 4.0.1 (2022-11-08)

### Chores

* add directory field to repository object in package json ([f1852d90](https://github.com/badbatch/graphql-box/commit/f1852d90eeed9fdf5cdc607f25a6f9b5a10f2368))

## 4.0.0 (2022-11-08)

### Refactors

* change remaining packages to class constructor initializer ([72586b55](https://github.com/badbatch/graphql-box/commit/72586b55578f1e16169585b99b6999ea38342770))

## 3.15.9 (2022-11-04)

### Bug Fixes

* lint and type errors ([a215d380](https://github.com/badbatch/graphql-box/commit/a215d380baa559c3d3b701254efaea4e4a36de0f))
* stop setting partial response when only ids are found ([ec5da906](https://github.com/badbatch/graphql-box/commit/ec5da906a7e5b2e6ee5a91c4202d8ddaea842046))

## 3.15.8 (2022-11-03)

### New Features

* add parsed request to context for logging ([fc60c6e3](https://github.com/badbatch/graphql-box/commit/fc60c6e3161c97a3e92dc2d3988091b4131897f5))

## 3.15.7 (2022-11-03)

### New Features

* add filtered request onto context ([7c48d653](https://github.com/badbatch/graphql-box/commit/7c48d653cb8a5396c5a6a7ee5f8f74df012eb1e0))

## 3.15.6 (2022-10-27)

### Bug Fixes

* error in logging order ([05751bfd](https://github.com/badbatch/graphql-box/commit/05751bfd148902927cc87ed7511dfa6c0d2665ae))

## 3.15.5 (2022-10-26)

### Bug Fixes

* useragent changing in pipeline tests ([1f1b3ae4](https://github.com/badbatch/graphql-box/commit/1f1b3ae424cd47271d1f3ea86a1c2d1aa5ae0666))

## 3.15.4 (2022-10-26)

### New Features

* set env specific labels ([a50a8075](https://github.com/badbatch/graphql-box/commit/a50a80757b0499d1ebc32592d03f91e72c9e2d94))

## 3.15.3 (2022-10-25)

### Bug Fixes

* remove logging prop ([c1bd2514](https://github.com/badbatch/graphql-box/commit/c1bd251485bf28373f34e471b0474dfa66adda75))

## 3.15.2 (2022-10-24)

### Refactors

* change debug manager initialisation ([8ceb40cb](https://github.com/badbatch/graphql-box/commit/8ceb40cb41424cea8f4731edab0ae54e255250be))

## 3.15.1 (2022-10-24)

### Bug Fixes

* optional argument ([75cbc234](https://github.com/badbatch/graphql-box/commit/75cbc2344891abd1bea78af5ac2cb325a463db9e))

### 3.15.0 (2022-10-23)

### New Features

* support better logging ([f3e7cda1](https://github.com/badbatch/graphql-box/commit/f3e7cda11de155d9a2f02566c1423b2ee63f74d0))

### 3.14.0 (2022-10-20)

### Bug Fixes

* update logging to improve categorizing ([204add77](https://github.com/badbatch/graphql-box/commit/204add77e94c54067f3ecc85b32bc8218aca698c))

## 3.13.4 (2022-09-09)

### Bug Fixes

* stop trying to parse body when 204 ([4e42c8bb](https://github.com/badbatch/graphql-box/commit/4e42c8bbc114de5954259b0efad498bac9e0d1ac))

## 3.13.3 (2022-09-08)

### New Features

* enable fetch batch max ([0289bea5](https://github.com/badbatch/graphql-box/commit/0289bea566be33799ccc2ba94f161cc902a7ce98))

## 3.13.2 (2022-09-08)

### Bug Fixes

* log handler bug ([85ed3ddc](https://github.com/badbatch/graphql-box/commit/85ed3ddcd187d889fc00dbc972dae26287b37a71))

## 3.13.1 (2022-09-07)

### Bug Fixes

* fetch bugs related to api and log requests ([e26041be](https://github.com/badbatch/graphql-box/commit/e26041be37997d554133fdf93b981a18e02fd54f))

### 3.13.0 (2022-09-07)

### Refactors

* change the way fetch manager and execute are initialised ([f07703b6](https://github.com/badbatch/graphql-box/commit/f07703b652250ed4866153e2dbd9fd39465ed557))

## 3.12.1 (2022-09-07)

### Refactors

* decouple execute and fetch manager types ([be6f26db](https://github.com/badbatch/graphql-box/commit/be6f26dbab50b572c76c01544d5da460bcd315f4))

### 3.12.0 (2022-09-07)

### New Features

* add log methods to fetch manager and server ([67c318bd](https://github.com/badbatch/graphql-box/commit/67c318bd7186602730e32ca787c021d48e525e31))

## 3.11.4 (2022-09-01)

### Bug Fixes

* cater for server options being different ([2fa13c7a](https://github.com/badbatch/graphql-box/commit/2fa13c7ade88baf5a4d623c9218cb4d35995cf5a))

## 3.11.3 (2022-08-31)

### Bug Fixes

* broken snapshot ([6465c5cc](https://github.com/badbatch/graphql-box/commit/6465c5cc3d0a8be391bd744e8aceedf9a85270d9))

## 3.11.2 (2022-08-31)

### Bug Fixes

* sort minor logging enhancements ([e94b582f](https://github.com/badbatch/graphql-box/commit/e94b582ffd64fe73848d3026ea5a2aa0d64ae647))

## 3.11.1 (2022-08-31)

### Bug Fixes

* add defensive coding into transformer ([f1482f8d](https://github.com/badbatch/graphql-box/commit/f1482f8dd629e118c752b4a3fba072ad3e575fbb))

### 3.11.0 (2022-08-30)

### Refactors

* change logging to make it fit for purpose ([692888fc](https://github.com/badbatch/graphql-box/commit/692888fc7d26d169c58492413487e9ed10080951))

## 3.10.1 (2022-08-26)

### Refactors

* change log prop to environment ([cd605b6c](https://github.com/badbatch/graphql-box/commit/cd605b6c51173e0c93b2f5fba71dfdf75385b558))

### 3.10.0 (2022-08-26)

### Bug Fixes

* various logging improvements/fixes ([35dc44a9](https://github.com/badbatch/graphql-box/commit/35dc44a9244534c5df3bf3499bd18d51f6bd1cb1))

## 3.9.3 (2022-08-23)

### Bug Fixes

* filter out empty args when creatinig cache key ([3fa1e6dd](https://github.com/badbatch/graphql-box/commit/3fa1e6ddaf5d1f7ae465fd80a653f565a49f9d96))

## 3.9.2 (2022-08-22)

### Bug Fixes

* update logging output ([7a747f51](https://github.com/badbatch/graphql-box/commit/7a747f51fc4c2c7d264265abb11acc1151ed290e))

## 3.9.1 (2022-08-22)

### Bug Fixes

* log in sequential order ([6a2398d3](https://github.com/badbatch/graphql-box/commit/6a2398d3decae7dbd6712d0d8ad515494c9114bb))

### 3.9.0 (2022-08-22)

### New Features

* enable field match query tracker ([#89](https://github.com/badbatch/graphql-box/pull/89)) ([f858dbf2](https://github.com/badbatch/graphql-box/commit/f858dbf29685e4e91da0b6d5628aabda14428f4d))

### 3.8.0 (2022-08-14)

### New Features

* enable imports within imports to be resolved ([7e0d83be](https://github.com/badbatch/graphql-box/commit/7e0d83be8c92b499897942b037a655532e12277a))

### 3.7.0 (2022-08-10)

### New Features

* gql macro support for schema language comment imports ([bd9b7ae3](https://github.com/badbatch/graphql-box/commit/bd9b7ae3441b6d9384f0cde28922999bd258eeed))

### 3.6.0 (2022-07-13)

### New Features

* add fragment defintions to execute context ([4b3e24fb](https://github.com/badbatch/graphql-box/commit/4b3e24fb8e7ab8106eead2448c188d52a4b8f78a))

## 3.5.4 (2022-07-04)

### Bug Fixes

* deal with server timeout errors better ([c5fe32a4](https://github.com/badbatch/graphql-box/commit/c5fe32a4a76b8070fd8e10d79c087ed3a8d530ea))

## 3.5.3 (2022-06-21)

### Bug Fixes

* connection listings request path change bug ([9d329e09](https://github.com/badbatch/graphql-box/commit/9d329e092487bcef46cef0bd667479c78665be40))

## 3.5.2 (2022-06-21)

### Bug Fixes

* add requestPath into variables hash in connection listings ([e00219a0](https://github.com/badbatch/graphql-box/commit/e00219a0fbf39d8e39d562b4650c1b957c8c398a))

## 3.5.1 (2022-05-25)

### Bug Fixes

* connection resolver unsafe prop access bug ([505b1895](https://github.com/badbatch/graphql-box/commit/505b1895105a4e7f99035de01e4add021ca01ff7))

### 3.5.0 (2022-05-25)

### New Features

* add logs for all graphql errors on client and server ([db0ab9fc](https://github.com/badbatch/graphql-box/commit/db0ab9fc1298c93768ca2ecb461c4f37a95c15ec))

## 3.4.3 (2022-05-24)

### Bug Fixes

* bug compiling code due to type import export issue ([34eeb1de](https://github.com/badbatch/graphql-box/commit/34eeb1de07da2e85c4f5ea4a1884d6849e300281))

## 3.4.2 (2022-05-23)

### Bug Fixes

* expose type for connection listings component ([fae8a390](https://github.com/badbatch/graphql-box/commit/fae8a390c3c1d053183a925280fb57d54c980afd))

## 3.4.1 (2022-05-23)

### Bug Fixes

* connection listings format helper bug ([d57a12a8](https://github.com/badbatch/graphql-box/commit/d57a12a81f71689a3a1dce31674df8b973f8b740))

### 3.4.0 (2022-05-23)

### New Features

* add query and mutation methods and hooks for all ops ([cd7213d5](https://github.com/badbatch/graphql-box/commit/cd7213d5f713765aaff25ab00c2a696de56eb35b))

## 3.3.7 (2022-03-31)

### Chores

* upgrade cachemap modules ([16e36359](https://github.com/badbatch/graphql-box/commit/16e363595c60fd82c69d7e2256ca53323bae152d))

## 3.3.6 (2022-03-22)

### Bug Fixes

* type regression on useQuery ([c173ad28](https://github.com/badbatch/graphql-box/commit/c173ad28df98c2bb04cc81efa8f307e6d2d1228e))
* allow worker client to be passed into provider ([4c649b14](https://github.com/badbatch/graphql-box/commit/4c649b14eb7bba7952a2e99e147bab91b7246664))

## 3.3.5 (2022-03-20)

### Bug Fixes

* bug in fragment spread counter in cache manager ([8e1deb19](https://github.com/badbatch/graphql-box/commit/8e1deb19ce0f24f90747e43ba340c8d322d11b0d))

### Refactors

* move movieDb test data to test utils package ([9f367108](https://github.com/badbatch/graphql-box/commit/9f367108084eb998f00e6a7074bd6f5643b0575d))

## 3.3.4 (2022-03-16)

### Chores

* save work in progress ([313c8d48](https://github.com/badbatch/graphql-box/commit/313c8d48eb230a40951d44f4bb8f1741952d9c03))

### Bug Fixes

* parsing of fragments with nested fields ([54b16811](https://github.com/badbatch/graphql-box/commit/54b1681161f9b5d61cac4018c0cf83ece42530d6))

## 3.3.3 (2022-03-10)

### Bug Fixes

* add back eol ([b5ddbc46](https://github.com/badbatch/graphql-box/commit/b5ddbc46f083ac60c2ed43cbf2f0e887601c34ba))

## 3.3.2 (2022-03-10)

### Bug Fixes

* change way requestWhitelist is written ([3c770898](https://github.com/badbatch/graphql-box/commit/3c77089866c8a1e362fff3863b613b0427eac1ea))

## 3.3.1 (2022-03-10)

### Bug Fixes

* text file line breaks ([5db63dcf](https://github.com/badbatch/graphql-box/commit/5db63dcfc0c2de8e50a09e95cae895026f87adbb))

### 3.3.0 (2022-03-10)

### Bug Fixes

* ensure errors passed in responses are serialized ([5f479b82](https://github.com/badbatch/graphql-box/commit/5f479b82f882f0698e42fc8f8b8601fc116fb59e))
* bug in writing whitelist to file ([2cafabb5](https://github.com/badbatch/graphql-box/commit/2cafabb56df90740fe0ce29154c0dee13ede177b))

## 3.2.1 (2022-03-09)

### Bug Fixes

* default server context to empty obj ([4e410c88](https://github.com/badbatch/graphql-box/commit/4e410c88a5f75341d924ed8713c7f5ab9976f7eb))

### 3.2.0 (2022-03-09)

### New Features

* add server request timeout feature ([45189bc1](https://github.com/badbatch/graphql-box/commit/45189bc126a380e332a6c614bd168be2b396e76c))
* add max request depth and cmoplexity features ([3331b345](https://github.com/badbatch/graphql-box/commit/3331b34524fcd359753df60c744c9e0ed32ffb9c))
* ability to set request depth limit in request parser ([0861dffc](https://github.com/badbatch/graphql-box/commit/0861dffc2887c6aded49792c1260190744f8114f))

## 3.1.1 (2022-03-08)

### Bug Fixes

* gql.macro export bug ([5221a9eb](https://github.com/badbatch/graphql-box/commit/5221a9eb7662969f5ba2a5e79234973f0f5191d7))

### 3.1.0 (2022-03-08)

### New Features

* add request whitelisting ([6718c4a9](https://github.com/badbatch/graphql-box/commit/6718c4a9b5f5ddb3ff312966a5af9d16f5b25194))

## 3.0.0 (2022-03-07)

### New Features

* move to sync initialisation, from async ([cbed1084](https://github.com/badbatch/graphql-box/commit/cbed108472ee1ec91e82836759e4d51223fde6f9))

## 2.6.1 (2022-03-06)

### New Features

* enable batch config per request ([f0217fe5](https://github.com/badbatch/graphql-box/commit/f0217fe543fa9ebd49a1a52e6802d9e1de98e193))

### 2.6.0 (2022-03-06)

### New Features

* deal with defer response caching better ([bf369f2a](https://github.com/badbatch/graphql-box/commit/bf369f2a6a790ef8f3fa6e3efc00b4c082185674))
* update caching to deal with response chunks better ([0f151078](https://github.com/badbatch/graphql-box/commit/0f151078da3947d1a2a7c9c93fc10312340c1346))
* add setCacheMetadata to context, update subs ([90a3388c](https://github.com/badbatch/graphql-box/commit/90a3388cf603597ffc9333cf28da08046d00f3ff))

### Refactors

* rename cache manager methods for clarity ([a9878058](https://github.com/badbatch/graphql-box/commit/a987805887be152c7ccaf90dc1ae1159772fc065))
* standardize errors property ([fab408e7](https://github.com/badbatch/graphql-box/commit/fab408e7f78d9b0258cb8580c8d2358568ae453b))

## 2.5.5 (2022-02-25)

### Bug Fixes

* cache manager nomralizing already normalised client patches ([35d1f390](https://github.com/badbatch/graphql-box/commit/35d1f390ccbbcd7171f2dd723dd206c9223ab52b))

## 2.5.4 (2022-02-25)

### Bug Fixes

* bugs in fetch manager helpers and add tests ([27a200e7](https://github.com/badbatch/graphql-box/commit/27a200e7e7518a184e11aa805ce52822cbc31540))

## 2.5.3 (2022-02-25)

### Bug Fixes

* bug in merging response data errors ([7c0d2fe9](https://github.com/badbatch/graphql-box/commit/7c0d2fe9eb6bfff131282c03cc4481409557bd20))

## 2.5.2 (2022-02-24)

### Refactors

* normalise path as paths with array of string key paths ([e36f8d48](https://github.com/badbatch/graphql-box/commit/e36f8d48dc0638a198bdae60dde5790525cb7433))

## 2.5.1 (2022-02-24)

### Bug Fixes

* pass requestID through useQuery to consumer ([5136da13](https://github.com/badbatch/graphql-box/commit/5136da131abf6e1447f2dda9aa528e41bbc59006))

### 2.5.0 (2022-02-24)

### New Features

* add response batching for defer/stream responses ([1dcbc7d7](https://github.com/badbatch/graphql-box/commit/1dcbc7d775604decc7f6be13270014be047dd3d4))
* return requestID on each request ([2a726470](https://github.com/badbatch/graphql-box/commit/2a7264703703c97bac46ef7ff8dec78ce4316746))

## 2.4.7 (2022-02-23)

### Bug Fixes

* expose path in useQuery hook ([4ea76f52](https://github.com/badbatch/graphql-box/commit/4ea76f52721ea9050fcc309484630b5c7d133bb2))

## 2.4.6 (2022-02-23)

### Bug Fixes

* pass path along and clean patch data on client ([dc19a432](https://github.com/badbatch/graphql-box/commit/dc19a4324df8505294804633252ed07dfbcf8f1f))

## 2.4.5 (2022-02-23)

### Bug Fixes

* do not pass cache metadata to resolver when error ([d6cf5752](https://github.com/badbatch/graphql-box/commit/d6cf5752aa3c2b521ee8d4b5a7e1f68c2b45ca25))

## 2.4.4 (2022-02-23)

### Bug Fixes

* hasNext not being passed through client correctly ([3468b420](https://github.com/badbatch/graphql-box/commit/3468b420dfd477cf5299e450e73f90e6611896f4))

## 2.4.3 (2022-02-23)

### Bug Fixes

* import casing issue ([892c06a9](https://github.com/badbatch/graphql-box/commit/892c06a9ea23e67f9faf47b8936d1230ad47c1bf))

## 2.4.2 (2022-02-23)

### Bug Fixes

* update when server ends response for stream ([fe1f2e5c](https://github.com/badbatch/graphql-box/commit/fe1f2e5cc14103771640a989b06285f3e7143a5b))

## 2.4.1 (2022-02-22)

### Bug Fixes

* react provider export ([2a7ac368](https://github.com/badbatch/graphql-box/commit/2a7ac368decd7cdb0c1b0281e692eb1cf15ccbfa))
* update package json to include public access ([2c5fa193](https://github.com/badbatch/graphql-box/commit/2c5fa1939c582ebdce413d13db76a729b6a161de))
* js linting issue ([4e6e2d18](https://github.com/badbatch/graphql-box/commit/4e6e2d18e4e9a8b227614f62a41cfc0ca2e26dd1))

### 2.4.0 (2022-02-22)

### New Features

* add experimental react package ([bf31fdce](https://github.com/badbatch/graphql-box/commit/bf31fdcee08c8b022a3da10fdb723b495bd22c86))

### 2.3.0 (2022-02-20)

### New Features

* defer stream support ([#77](https://github.com/badbatch/graphql-box/pull/77)) ([9b69bf3d](https://github.com/badbatch/graphql-box/commit/9b69bf3debd70c3294d3b9f9594b690f715cb722))

## 2.2.4 (2022-01-28)

### Bug Fixes

* server not returning batched data in correct format ([f8ef82df](https://github.com/badbatch/graphql-box/commit/f8ef82dfb40ef8037d63ea3b63b6df7b73d3598b))

## 2.2.3 (2022-01-28)

### Bug Fixes

* cache manager unsafe prop check of __typename ([72f19522](https://github.com/badbatch/graphql-box/commit/72f1952295410d171830af188ea84b7f122cc6ed))

## 2.2.2 (2022-01-21)

### Bug Fixes

* remove unused import ([cf51f3c4](https://github.com/badbatch/graphql-box/commit/cf51f3c477c16bdf46103a999317b09930c679e8))
* better derive operation cacheability from request paths ([047b41d0](https://github.com/badbatch/graphql-box/commit/047b41d0100c93e11dca4ff82e59d1c50c8c6657))

## 2.2.1 (2022-01-21)

### Bug Fixes

* add operation into cache metadata ([b9b0d99f](https://github.com/badbatch/graphql-box/commit/b9b0d99fcaec440710bc5a210cf33800b74539eb))

### 2.2.0 (2022-01-21)

### New Features

* pass cache metadata into execute context ([313a3bd6](https://github.com/badbatch/graphql-box/commit/313a3bd602d11971dd9947d6a5cd9070e2a70676))

## 2.1.12 (2022-01-20)

### Bug Fixes

* connection-resolver cursor calculation bug ([e7c44e17](https://github.com/badbatch/graphql-box/commit/e7c44e173ef365872943fbd896a7adef12574e5a))

## 2.1.11 (2022-01-18)

### Bug Fixes

* request parser not replacing fragment spread within inline fragment ([1d38e3b8](https://github.com/badbatch/graphql-box/commit/1d38e3b892bcc34290cd8b10f0658f39d0afb853))

## 2.1.10 (2022-01-11)

### Bug Fixes

* connection resolver obj types ([7c5a3cdc](https://github.com/badbatch/graphql-box/commit/7c5a3cdc34f9a9fd48f5c25480997dde6da9fe63))

## 2.1.9 (2021-12-27)

### Chores

* upgrade dependencies ([5ac2bea3](https://github.com/badbatch/graphql-box/commit/5ac2bea3c9d92157f4d87a3720a493134f774d13))

## 2.1.8 (2021-12-22)

### Chores

* upgrade cachemap modules ([c4347cf6](https://github.com/badbatch/graphql-box/commit/c4347cf69f17b92eac7af28b2e1fbc047660a36d))

## 2.1.7 (2021-12-17)

### Chores

* upgrade cachemap module ([3b7b4f23](https://github.com/badbatch/graphql-box/commit/3b7b4f234e696895ce0bceba6f95fcb23b1de0d8))

## 2.1.6 (2021-10-20)

### Bug Fixes

* change node type to include string or number id ([8635e1c2](https://github.com/badbatch/graphql-box/commit/8635e1c257592487057262679950197e3868aaa0))

## 2.1.5 (2021-10-19)

### Bug Fixes

* allow types to be passed in with options ([cfaf2586](https://github.com/badbatch/graphql-box/commit/cfaf2586328845cd8bd6c48bd763eb343d5c6a78))
* pass types into main function ([a43868f2](https://github.com/badbatch/graphql-box/commit/a43868f2e30a1095ef5e9d9a123c5de20c5568f5))

## 2.1.4 (2021-10-19)

### Bug Fixes

* loosen up type restrictions on plain objects ([25fe9425](https://github.com/badbatch/graphql-box/commit/25fe9425bc0d9b51b59e785b1973fdd88436a50c))

## 2.1.3 (2021-10-19)

### Bug Fixes

* types for user options ([48579b3a](https://github.com/badbatch/graphql-box/commit/48579b3ad89bf946c7a22757ab6cf8ce4412b430))
* incorrect type name ([fe0eca9e](https://github.com/badbatch/graphql-box/commit/fe0eca9eff241005559cd1127a460bd964320e1f))

## 2.1.2 (2021-10-18)

### Bug Fixes

* add main export from index ([8313ce90](https://github.com/badbatch/graphql-box/commit/8313ce905d5925ca0385a9b4147a7ad063619c21))

## 2.1.1 (2021-10-18)

### Bug Fixes

* add public access to package ([7171508f](https://github.com/badbatch/graphql-box/commit/7171508f9f2074213d002e35e31d5c7e1752bd1c))

### 2.1.0 (2021-10-18)

### New Features

* connection resolver ([#69](https://github.com/badbatch/graphql-box/pull/69)) ([a2ab2503](https://github.com/badbatch/graphql-box/commit/a2ab2503bc985f44c56098283dfb065172d2f612))

## 2.0.6 (2021-05-16)

### New Features

* allow context to be passed into init functions ([2aaf296a](https://github.com/badbatch/graphql-box/commit/2aaf296a18f4f5df64f3deff1f349f3e3d924efa))

## 2.0.5 (2021-05-13)

### Bug Fixes

* default value parsing ([8c3dc0a5](https://github.com/badbatch/graphql-box/commit/8c3dc0a5fab17dead9aaca0bf9ade51762dc7088))

## 2.0.4 (2021-05-12)

### Bug Fixes

* enabling request parser to pick up variable definition default ([7974018b](https://github.com/badbatch/graphql-box/commit/7974018b1443f43394a8f8220ba1975858a41798))
* update code examples in readme for cachemap use ([7743b405](https://github.com/badbatch/graphql-box/commit/7743b40523b8f6098accf87dbb4f58869f33dd4b))

## 2.0.3 (2020-03-05)

### New Features

* **helpers:**  export types ([9a898ad5](https://github.com/badbatch/graphql-box/commit/9a898ad5f6cd96e058c6244c70ea1c3d20cb0e80))

## 2.0.2 (2020-03-02)

### Chores

* upgrade dependencies and sort peer versions ([d785ce99](https://github.com/badbatch/graphql-box/commit/d785ce99b68f58329eb271255c5dd65d12343926))

## 2.0.1 (2019-11-13)

### Bug Fixes

* update peer dependency versions ([31c24ca1](https://github.com/badbatch/graphql-box/commit/31c24ca125678b871581e987be0365626be506e0))

## 2.0.0 (2019-11-13)

### Chores

* update dependencies, including core-js ([bdf74fbe](https://github.com/badbatch/graphql-box/commit/bdf74fbe6c4d3cb08eff844c6ecc45a3972e870e))

## 1.0.3 (2019-10-10)

### Chores

* update dependencies ([48642596](https://github.com/badbatch/graphql-box/commit/4864259659debce420ada7176c54a8fe4f227951))

### Bug Fixes

* add sourcemaps to packages ([a3a44b75](https://github.com/badbatch/graphql-box/commit/a3a44b753a485c1e60996a14206419f7ea4810d4))

## 1.0.2 (2019-09-06)

### Chores

* **repo:**
  * update dependencies ([2d19c638](https://github.com/badbatch/graphql-box/commit/2d19c638bef31b43dd84e3e814b2bd26fd086be1))
  * update dependencies. ([151b16f6](https://github.com/badbatch/graphql-box/commit/151b16f607283e80e2e34ab92777d6a89b74c818))
* **cachemap,cacheability:**  updgrade dependencies ([c5e15a53](https://github.com/badbatch/graphql-box/commit/c5e15a53d52da86d4f4446870c45345a57a18ce3))
* **security:**  update vulnerable packages ([188296d6](https://github.com/badbatch/graphql-box/commit/188296d651e307f3c4459e0e49746ba4fa474ef0))

### New Features

* **repo:**  install and configure repodog packages ([b01c5117](https://github.com/badbatch/graphql-box/commit/b01c5117f5ef18048a9b21926a3902390ea7e6cd))
* **repodog:**  add repodog packages\ ([b6cf1fa1](https://github.com/badbatch/graphql-box/commit/b6cf1fa103b20f3bd19855392c6dbd54249f2ce5))

### Bug Fixes

* **travis:**
  * remove integration tests from ci ([61b2303f](https://github.com/badbatch/graphql-box/commit/61b2303f6c04775257941046f3922692f53ce466))
  * update npm script calls ([055190a7](https://github.com/badbatch/graphql-box/commit/055190a77e280e153458f1a52e79c0a213e52ea6))
* **typescript:**  add missing references ([7b5b8cb2](https://github.com/badbatch/graphql-box/commit/7b5b8cb29e0afa9d459d4b0433f40129f289fdb7))
* **npm:**  include src folder in npm package ([309f3a6a](https://github.com/badbatch/graphql-box/commit/309f3a6acd546ff29e35ccafd1e835d8bfa3a980))
* **tsconfig:**  sort formatting errors in json files ([42c25858](https://github.com/badbatch/graphql-box/commit/42c2585884a0ce748ee7cdbefef7a12c9b589d80))
* **readme:**  correct code example. ([9b000e93](https://github.com/badbatch/graphql-box/commit/9b000e933118933cd603a63ccf89e77346c6d4ef))

### Refactors

* **dependencies:**  make internal deps peer deps ([620b9e79](https://github.com/badbatch/graphql-box/commit/620b9e79ad18fb10bedc076b55447791255adb2e))

## 1.0.1 (2019-07-30)

### Documentation Changes

* **package documentation:**  adding typedoc docs to each package. ([c791e229](https://github.com/badbatch/graphql-box/commit/c791e2292ebced2e7dc0ef6ec60edf43f36d44c8))

### Bug Fixes

* **package.json:**  add public publish config to each package. ([22b398cc](https://github.com/badbatch/graphql-box/commit/22b398cc0f312f31480fbb1259ab63553f771824))

## 1.0.0 (2019-07-30)

### Breaking Changes

* **monorepo:**  Refactor library structure to monorepo. ([#45](https://github.com/badbatch/graphql-box/pull/45)) ([3f37edcb](https://github.com/badbatch/graphql-box/commit/3f37edcb8dc1b3632b215c34662ff422deddfd10))

### Documentation Changes

* **readme:**  update link names. ([0437cf80](https://github.com/badbatch/graphql-box/commit/0437cf80b3dc44fc3e5f73528728b28ab4ba53d3))
* **formatting:**  update main readme formatting. ([35bb1415](https://github.com/badbatch/graphql-box/commit/35bb141510950dbca6826edcc08970dd46c8acb4))

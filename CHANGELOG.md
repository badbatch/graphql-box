#### 2.4.1 (2022-02-22)

##### Bug Fixes

*  react provider export ([2a7ac368](https://github.com/badbatch/graphql-box/commit/2a7ac368decd7cdb0c1b0281e692eb1cf15ccbfa))
*  update package json to include public access ([2c5fa193](https://github.com/badbatch/graphql-box/commit/2c5fa1939c582ebdce413d13db76a729b6a161de))
*  js linting issue ([4e6e2d18](https://github.com/badbatch/graphql-box/commit/4e6e2d18e4e9a8b227614f62a41cfc0ca2e26dd1))

### 2.4.0 (2022-02-22)

##### New Features

*  add experimental react package ([bf31fdce](https://github.com/badbatch/graphql-box/commit/bf31fdcee08c8b022a3da10fdb723b495bd22c86))

### 2.3.0 (2022-02-20)

##### New Features

*  defer stream support ([#77](https://github.com/badbatch/graphql-box/pull/77)) ([9b69bf3d](https://github.com/badbatch/graphql-box/commit/9b69bf3debd70c3294d3b9f9594b690f715cb722))

#### 2.2.4 (2022-01-28)

##### Bug Fixes

*  server not returning batched data in correct format ([f8ef82df](https://github.com/badbatch/graphql-box/commit/f8ef82dfb40ef8037d63ea3b63b6df7b73d3598b))

#### 2.2.3 (2022-01-28)

##### Bug Fixes

*  cache manager unsafe prop check of __typename ([72f19522](https://github.com/badbatch/graphql-box/commit/72f1952295410d171830af188ea84b7f122cc6ed))

#### 2.2.2 (2022-01-21)

##### Bug Fixes

*  remove unused import ([cf51f3c4](https://github.com/badbatch/graphql-box/commit/cf51f3c477c16bdf46103a999317b09930c679e8))
*  better derive operation cacheability from request paths ([047b41d0](https://github.com/badbatch/graphql-box/commit/047b41d0100c93e11dca4ff82e59d1c50c8c6657))

#### 2.2.1 (2022-01-21)

##### Bug Fixes

*  add operation into cache metadata ([b9b0d99f](https://github.com/badbatch/graphql-box/commit/b9b0d99fcaec440710bc5a210cf33800b74539eb))

### 2.2.0 (2022-01-21)

##### New Features

*  pass cache metadata into execute context ([313a3bd6](https://github.com/badbatch/graphql-box/commit/313a3bd602d11971dd9947d6a5cd9070e2a70676))

#### 2.1.12 (2022-01-20)

##### Bug Fixes

*  connection-resolver cursor calculation bug ([e7c44e17](https://github.com/badbatch/graphql-box/commit/e7c44e173ef365872943fbd896a7adef12574e5a))

#### 2.1.11 (2022-01-18)

##### Bug Fixes

*  request parser not replacing fragment spread within inline fragment ([1d38e3b8](https://github.com/badbatch/graphql-box/commit/1d38e3b892bcc34290cd8b10f0658f39d0afb853))

#### 2.1.10 (2022-01-11)

##### Bug Fixes

*  connection resolver obj types ([7c5a3cdc](https://github.com/badbatch/graphql-box/commit/7c5a3cdc34f9a9fd48f5c25480997dde6da9fe63))

#### 2.1.9 (2021-12-27)

##### Chores

*  upgrade dependencies ([5ac2bea3](https://github.com/badbatch/graphql-box/commit/5ac2bea3c9d92157f4d87a3720a493134f774d13))

#### 2.1.8 (2021-12-22)

##### Chores

*  upgrade cachemap modules ([c4347cf6](https://github.com/badbatch/graphql-box/commit/c4347cf69f17b92eac7af28b2e1fbc047660a36d))

#### 2.1.7 (2021-12-17)

##### Chores

*  upgrade cachemap module ([3b7b4f23](https://github.com/badbatch/graphql-box/commit/3b7b4f234e696895ce0bceba6f95fcb23b1de0d8))

#### 2.1.6 (2021-10-20)

##### Bug Fixes

*  change node type to include string or number id ([8635e1c2](https://github.com/badbatch/graphql-box/commit/8635e1c257592487057262679950197e3868aaa0))

#### 2.1.5 (2021-10-19)

##### Bug Fixes

*  allow types to be passed in with options ([cfaf2586](https://github.com/badbatch/graphql-box/commit/cfaf2586328845cd8bd6c48bd763eb343d5c6a78))
*  pass types into main function ([a43868f2](https://github.com/badbatch/graphql-box/commit/a43868f2e30a1095ef5e9d9a123c5de20c5568f5))

#### 2.1.4 (2021-10-19)

##### Bug Fixes

*  loosen up type restrictions on plain objects ([25fe9425](https://github.com/badbatch/graphql-box/commit/25fe9425bc0d9b51b59e785b1973fdd88436a50c))

#### 2.1.3 (2021-10-19)

##### Bug Fixes

*  types for user options ([48579b3a](https://github.com/badbatch/graphql-box/commit/48579b3ad89bf946c7a22757ab6cf8ce4412b430))
*  incorrect type name ([fe0eca9e](https://github.com/badbatch/graphql-box/commit/fe0eca9eff241005559cd1127a460bd964320e1f))

#### 2.1.2 (2021-10-18)

##### Bug Fixes

*  add main export from index ([8313ce90](https://github.com/badbatch/graphql-box/commit/8313ce905d5925ca0385a9b4147a7ad063619c21))

#### 2.1.1 (2021-10-18)

##### Bug Fixes

*  add public access to package ([7171508f](https://github.com/badbatch/graphql-box/commit/7171508f9f2074213d002e35e31d5c7e1752bd1c))

### 2.1.0 (2021-10-18)

##### New Features

*  connection resolver ([#69](https://github.com/badbatch/graphql-box/pull/69)) ([a2ab2503](https://github.com/badbatch/graphql-box/commit/a2ab2503bc985f44c56098283dfb065172d2f612))

#### 2.0.6 (2021-05-16)

##### New Features

*  allow context to be passed into init functions ([2aaf296a](https://github.com/badbatch/graphql-box/commit/2aaf296a18f4f5df64f3deff1f349f3e3d924efa))

#### 2.0.5 (2021-05-13)

##### Bug Fixes

*  default value parsing ([8c3dc0a5](https://github.com/badbatch/graphql-box/commit/8c3dc0a5fab17dead9aaca0bf9ade51762dc7088))

#### 2.0.4 (2021-05-12)

##### Bug Fixes

*  enabling request parser to pick up variable definition default ([7974018b](https://github.com/badbatch/graphql-box/commit/7974018b1443f43394a8f8220ba1975858a41798))
*  update code examples in readme for cachemap use ([7743b405](https://github.com/badbatch/graphql-box/commit/7743b40523b8f6098accf87dbb4f58869f33dd4b))

#### 2.0.3 (2020-03-05)

##### New Features

* **helpers:**  export types ([9a898ad5](https://github.com/badbatch/graphql-box/commit/9a898ad5f6cd96e058c6244c70ea1c3d20cb0e80))

#### 2.0.2 (2020-03-02)

##### Chores

*  upgrade dependencies and sort peer versions ([d785ce99](https://github.com/badbatch/graphql-box/commit/d785ce99b68f58329eb271255c5dd65d12343926))

#### 2.0.1 (2019-11-13)

##### Bug Fixes

*  update peer dependency versions ([31c24ca1](https://github.com/badbatch/graphql-box/commit/31c24ca125678b871581e987be0365626be506e0))

## 2.0.0 (2019-11-13)

##### Chores

*  update dependencies, including core-js ([bdf74fbe](https://github.com/badbatch/graphql-box/commit/bdf74fbe6c4d3cb08eff844c6ecc45a3972e870e))

#### 1.0.3 (2019-10-10)

##### Chores

*  update dependencies ([48642596](https://github.com/badbatch/graphql-box/commit/4864259659debce420ada7176c54a8fe4f227951))

##### Bug Fixes

*  add sourcemaps to packages ([a3a44b75](https://github.com/badbatch/graphql-box/commit/a3a44b753a485c1e60996a14206419f7ea4810d4))

#### 1.0.2 (2019-09-06)

##### Chores

* **repo:**
  *  update dependencies ([2d19c638](https://github.com/badbatch/graphql-box/commit/2d19c638bef31b43dd84e3e814b2bd26fd086be1))
  *  update dependencies. ([151b16f6](https://github.com/badbatch/graphql-box/commit/151b16f607283e80e2e34ab92777d6a89b74c818))
* **cachemap,cacheability:**  updgrade dependencies ([c5e15a53](https://github.com/badbatch/graphql-box/commit/c5e15a53d52da86d4f4446870c45345a57a18ce3))
* **security:**  update vulnerable packages ([188296d6](https://github.com/badbatch/graphql-box/commit/188296d651e307f3c4459e0e49746ba4fa474ef0))

##### New Features

* **repo:**  install and configure repodog packages ([b01c5117](https://github.com/badbatch/graphql-box/commit/b01c5117f5ef18048a9b21926a3902390ea7e6cd))
* **repodog:**  add repodog packages\ ([b6cf1fa1](https://github.com/badbatch/graphql-box/commit/b6cf1fa103b20f3bd19855392c6dbd54249f2ce5))

##### Bug Fixes

* **travis:**
  *  remove integration tests from ci ([61b2303f](https://github.com/badbatch/graphql-box/commit/61b2303f6c04775257941046f3922692f53ce466))
  *  update npm script calls ([055190a7](https://github.com/badbatch/graphql-box/commit/055190a77e280e153458f1a52e79c0a213e52ea6))
* **typescript:**  add missing references ([7b5b8cb2](https://github.com/badbatch/graphql-box/commit/7b5b8cb29e0afa9d459d4b0433f40129f289fdb7))
* **npm:**  include src folder in npm package ([309f3a6a](https://github.com/badbatch/graphql-box/commit/309f3a6acd546ff29e35ccafd1e835d8bfa3a980))
* **tsconfig:**  sort formatting errors in json files ([42c25858](https://github.com/badbatch/graphql-box/commit/42c2585884a0ce748ee7cdbefef7a12c9b589d80))
* **readme:**  correct code example. ([9b000e93](https://github.com/badbatch/graphql-box/commit/9b000e933118933cd603a63ccf89e77346c6d4ef))

##### Refactors

* **dependencies:**  make internal deps peer deps ([620b9e79](https://github.com/badbatch/graphql-box/commit/620b9e79ad18fb10bedc076b55447791255adb2e))

#### 1.0.1 (2019-07-30)

##### Documentation Changes

* **package documentation:**  adding typedoc docs to each package. ([c791e229](https://github.com/badbatch/graphql-box/commit/c791e2292ebced2e7dc0ef6ec60edf43f36d44c8))

##### Bug Fixes

* **package.json:**  add public publish config to each package. ([22b398cc](https://github.com/badbatch/graphql-box/commit/22b398cc0f312f31480fbb1259ab63553f771824))

## 1.0.0 (2019-07-30)

##### Breaking Changes

* **monorepo:**  Refactor library structure to monorepo. ([#45](https://github.com/badbatch/graphql-box/pull/45)) ([3f37edcb](https://github.com/badbatch/graphql-box/commit/3f37edcb8dc1b3632b215c34662ff422deddfd10))

##### Documentation Changes

* **readme:**  update link names. ([0437cf80](https://github.com/badbatch/graphql-box/commit/0437cf80b3dc44fc3e5f73528728b28ab4ba53d3))
* **formatting:**  update main readme formatting. ([35bb1415](https://github.com/badbatch/graphql-box/commit/35bb141510950dbca6826edcc08970dd46c8acb4))


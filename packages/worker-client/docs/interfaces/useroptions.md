[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [cache](useroptions.md#cache)
* [debugManager](useroptions.md#optional-debugmanager)
* [experimentalDeferStreamSupport](useroptions.md#optional-experimentaldeferstreamsupport)
* [worker](useroptions.md#worker)

## Properties

###  cache

• **cache**: *WorkerCachemap*

*Defined in [defs/index.ts:9](https://github.com/badbatch/graphql-box/blob/2410fc32/packages/worker-client/src/defs/index.ts#L9)*

The cache.

___

### `Optional` debugManager

• **debugManager**? : *DebugManagerDef*

*Defined in [defs/index.ts:14](https://github.com/badbatch/graphql-box/blob/2410fc32/packages/worker-client/src/defs/index.ts#L14)*

The debug manager.

___

### `Optional` experimentalDeferStreamSupport

• **experimentalDeferStreamSupport**? : *undefined | false | true*

*Defined in [defs/index.ts:20](https://github.com/badbatch/graphql-box/blob/2410fc32/packages/worker-client/src/defs/index.ts#L20)*

Enable support for defer and stream directives. Based on version
of spec in 16.1.0-experimental-stream-defer.6

___

###  worker

• **worker**: *Worker*

*Defined in [defs/index.ts:25](https://github.com/badbatch/graphql-box/blob/2410fc32/packages/worker-client/src/defs/index.ts#L25)*

The web worker instance.

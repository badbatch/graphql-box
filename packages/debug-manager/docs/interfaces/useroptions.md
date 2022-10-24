[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [environment](useroptions.md#optional-environment)
* [log](useroptions.md#optional-log)
* [name](useroptions.md#name)
* [performance](useroptions.md#performance)

## Properties

### `Optional` environment

• **environment**? : *[Environment](../README.md#environment)*

*Defined in [packages/debug-manager/src/defs/index.ts:9](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/debug-manager/src/defs/index.ts#L9)*

Where the debug manager is being used.

___

### `Optional` log

• **log**? : *[Log](../README.md#log)*

*Defined in [packages/debug-manager/src/defs/index.ts:14](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/debug-manager/src/defs/index.ts#L14)*

The callback to pass log messages to your logger.

___

###  name

• **name**: *string*

*Defined in [packages/debug-manager/src/defs/index.ts:20](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/debug-manager/src/defs/index.ts#L20)*

The name of the debug manager. This is used
to distinguish the logs of multiple debug managers.

___

###  performance

• **performance**: *[Performance](performance.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:26](https://github.com/badbatch/graphql-box/blob/8ceb40cb/packages/debug-manager/src/defs/index.ts#L26)*

The performance object to use for measuring method
execution speeds.

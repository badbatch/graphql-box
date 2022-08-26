[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [environment](useroptions.md#optional-environment)
* [logger](useroptions.md#optional-logger)
* [name](useroptions.md#name)
* [performance](useroptions.md#performance)

## Properties

### `Optional` environment

• **environment**? : *[Environment](../README.md#environment)*

*Defined in [packages/debug-manager/src/defs/index.ts:11](https://github.com/badbatch/graphql-box/blob/cd605b6/packages/debug-manager/src/defs/index.ts#L11)*

Where the debug manager is being used.

___

### `Optional` logger

• **logger**? : *[Logger](logger.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:16](https://github.com/badbatch/graphql-box/blob/cd605b6/packages/debug-manager/src/defs/index.ts#L16)*

The logger to use.

___

###  name

• **name**: *string*

*Defined in [packages/debug-manager/src/defs/index.ts:22](https://github.com/badbatch/graphql-box/blob/cd605b6/packages/debug-manager/src/defs/index.ts#L22)*

The name of the debug manager. This is used
to distinguish the logs of multiple debug managers.

___

###  performance

• **performance**: *[Performance](performance.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:28](https://github.com/badbatch/graphql-box/blob/cd605b6/packages/debug-manager/src/defs/index.ts#L28)*

The performance object to use for measuring method
execution speeds.

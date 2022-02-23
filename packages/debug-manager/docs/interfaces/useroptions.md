[Documentation](../README.md) › [UserOptions](useroptions.md)

# Interface: UserOptions

## Hierarchy

* **UserOptions**

## Index

### Properties

* [logger](useroptions.md#optional-logger)
* [name](useroptions.md#name)
* [performance](useroptions.md#performance)

## Properties

### `Optional` logger

• **logger**? : *[Logger](logger.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:11](https://github.com/badbatch/graphql-box/blob/4ea76f5/packages/debug-manager/src/defs/index.ts#L11)*

The logger to use.

___

###  name

• **name**: *string*

*Defined in [packages/debug-manager/src/defs/index.ts:17](https://github.com/badbatch/graphql-box/blob/4ea76f5/packages/debug-manager/src/defs/index.ts#L17)*

The name of the debug manager. This is used
to distinguish the logs of multiple debug managers.

___

###  performance

• **performance**: *[Performance](performance.md)*

*Defined in [packages/debug-manager/src/defs/index.ts:23](https://github.com/badbatch/graphql-box/blob/4ea76f5/packages/debug-manager/src/defs/index.ts#L23)*

The performance object to use for measuring method
execution speeds.

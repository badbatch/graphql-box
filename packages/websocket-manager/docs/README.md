[Documentation](README.md)

# Documentation

## Index

### Classes

* [WebsocketManager](classes/websocketmanager.md)

### Interfaces

* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](README.md#constructoroptions)

### Functions

* [init](README.md#init)
* [onOpen](README.md#onopen)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:9](https://github.com/badbatch/graphql-box/blob/3c77089/packages/websocket-manager/src/defs/index.ts#L9)*

## Functions

###  init

▸ **init**(`userOptions`: [UserOptions](interfaces/useroptions.md)): *SubscriptionsManagerInit*

*Defined in [main/index.ts:90](https://github.com/badbatch/graphql-box/blob/3c77089/packages/websocket-manager/src/main/index.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`userOptions` | [UserOptions](interfaces/useroptions.md) |

**Returns:** *SubscriptionsManagerInit*

___

###  onOpen

▸ **onOpen**(`websocket`: WebSocket): *Promise‹void›*

*Defined in [index.test.ts:7](https://github.com/badbatch/graphql-box/blob/3c77089/packages/websocket-manager/src/index.test.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`websocket` | WebSocket |

**Returns:** *Promise‹void›*

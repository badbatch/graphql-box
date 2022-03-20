[Documentation](README.md)

# Documentation

## Index

### Classes

* [Client](classes/client.md)

### Interfaces

* [PendingQueryData](interfaces/pendingquerydata.md)
* [QueryTracker](interfaces/querytracker.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [PendingQueryResolver](README.md#pendingqueryresolver)

### Variables

* [REQUEST_EXECUTED](README.md#const-request_executed)
* [SUBSCRIPTION_EXECUTED](README.md#const-subscription_executed)

### Functions

* [logRequest](README.md#logrequest)
* [logSubscription](README.md#logsubscription)

## Type aliases

###  PendingQueryResolver

Ƭ **PendingQueryResolver**: *function*

*Defined in [defs/index.ts:45](https://github.com/badbatch/graphql-box/blob/8e1deb1/packages/client/src/defs/index.ts#L45)*

#### Type declaration:

▸ (`value`: MaybeRequestResult): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | MaybeRequestResult |

## Variables

### `Const` REQUEST_EXECUTED

• **REQUEST_EXECUTED**: *"request_executed"* = "request_executed"

*Defined in [consts/index.ts:1](https://github.com/badbatch/graphql-box/blob/8e1deb1/packages/client/src/consts/index.ts#L1)*

___

### `Const` SUBSCRIPTION_EXECUTED

• **SUBSCRIPTION_EXECUTED**: *"subscription_executed"* = "subscription_executed"

*Defined in [consts/index.ts:2](https://github.com/badbatch/graphql-box/blob/8e1deb1/packages/client/src/consts/index.ts#L2)*

## Functions

###  logRequest

▸ **logRequest**(): *(Anonymous function)*

*Defined in [debug/log-request/index.ts:4](https://github.com/badbatch/graphql-box/blob/8e1deb1/packages/client/src/debug/log-request/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

###  logSubscription

▸ **logSubscription**(): *(Anonymous function)*

*Defined in [debug/log-subscription/index.ts:4](https://github.com/badbatch/graphql-box/blob/8e1deb1/packages/client/src/debug/log-subscription/index.ts#L4)*

**Returns:** *(Anonymous function)*

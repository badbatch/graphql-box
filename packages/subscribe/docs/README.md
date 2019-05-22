
#  Documentation

## Index

### Classes

* [Subscribe](classes/subscribe.md)

### Interfaces

* [SubscribeArgs](interfaces/subscribeargs.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](#constructoroptions)
* [GraphQLSubscribe](#graphqlsubscribe)
* [InitOptions](#initoptions)

### Functions

* [init](#init)

---

## Type aliases

<a id="constructoroptions"></a>

###  ConstructorOptions

**Ƭ ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:38](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/defs/index.ts#L38)*

___
<a id="graphqlsubscribe"></a>

###  GraphQLSubscribe

**Ƭ GraphQLSubscribe**: *`function`*

*Defined in [defs/index.ts:40](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/defs/index.ts#L40)*

#### Type declaration
▸<`TData`>(args: *`object`*): `Promise`<`AsyncIterator`<`ExecutionResult`<`TData`>> \| `ExecutionResult`<`TData`>>

**Type parameters:**

#### TData 
**Parameters:**

**args: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` contextValue | `any` |
| document | `DocumentNode` |
| `Optional` fieldResolver | `Maybe`<`GraphQLFieldResolver`<`any`, `any`>> |
| `Optional` operationName | `Maybe`<`string`> |
| `Optional` rootValue | `any` |
| schema | `GraphQLSchema` |
| `Optional` subscribeFieldResolver | `Maybe`<`GraphQLFieldResolver`<`any`, `any`>> |
| `Optional` variableValues | `Maybe`<`object`> |

**Returns:** `Promise`<`AsyncIterator`<`ExecutionResult`<`TData`>> \| `ExecutionResult`<`TData`>>

___
<a id="initoptions"></a>

###  InitOptions

**Ƭ InitOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:36](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/defs/index.ts#L36)*

___

## Functions

<a id="init"></a>

###  init

▸ **init**(userOptions: *[UserOptions](interfaces/useroptions.md)*): `SubscriptionsManagerInit`

*Defined in [main/index.ts:88](https://github.com/bad-batch/handl/blob/20503ed/packages/subscribe/src/main/index.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| userOptions | [UserOptions](interfaces/useroptions.md) |

**Returns:** `SubscriptionsManagerInit`

___


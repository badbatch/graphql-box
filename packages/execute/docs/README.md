
#  Documentation

## Index

### Classes

* [Execute](classes/execute.md)

### Interfaces

* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [ConstructorOptions](#constructoroptions)
* [GraphQLExecute](#graphqlexecute)
* [InitOptions](#initoptions)

### Variables

* [EXECUTE_EXECUTED](#execute_executed)

### Functions

* [init](#init)
* [logExecute](#logexecute)

---

## Type aliases

<a id="constructoroptions"></a>

###  ConstructorOptions

**Ƭ ConstructorOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:33](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/defs/index.ts#L33)*

___
<a id="graphqlexecute"></a>

###  GraphQLExecute

**Ƭ GraphQLExecute**: *`function`*

*Defined in [defs/index.ts:36](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/defs/index.ts#L36)*

#### Type declaration
▸<`TData`>(args: *`ExecutionArgs`*): `PromiseOrValue`<`ExecutionResult`<`TData`>>

**Type parameters:**

#### TData 
**Parameters:**

| Name | Type |
| ------ | ------ |
| args | `ExecutionArgs` |

**Returns:** `PromiseOrValue`<`ExecutionResult`<`TData`>>

___
<a id="initoptions"></a>

###  InitOptions

**Ƭ InitOptions**: *[UserOptions](interfaces/useroptions.md)*

*Defined in [defs/index.ts:31](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/defs/index.ts#L31)*

___

## Variables

<a id="execute_executed"></a>

### `<Const>` EXECUTE_EXECUTED

**● EXECUTE_EXECUTED**: *"execute_executed"* = "execute_executed"

*Defined in [consts/index.ts:1](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/consts/index.ts#L1)*

___

## Functions

<a id="init"></a>

###  init

▸ **init**(userOptions: *[UserOptions](interfaces/useroptions.md)*): `RequestManagerInit`

*Defined in [main/index.ts:71](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/main/index.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| userOptions | [UserOptions](interfaces/useroptions.md) |

**Returns:** `RequestManagerInit`

___
<a id="logexecute"></a>

###  logExecute

▸ **logExecute**(): `(Anonymous function)`

*Defined in [debug/log-execute/index.ts:4](https://github.com/bad-batch/handl/blob/20503ed/packages/execute/src/debug/log-execute/index.ts#L4)*

**Returns:** `(Anonymous function)`

___


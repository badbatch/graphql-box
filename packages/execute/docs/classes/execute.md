> **[Documentation](../README.md)**

[Execute](execute.md) /

# Class: Execute

## Hierarchy

* **Execute**

## Implements

* `RequestManagerDef`

## Index

### Constructors

* [constructor](execute.md#constructor)

### Methods

* [execute](execute.md#execute)
* [init](execute.md#static-init)

## Constructors

###  constructor

\+ **new Execute**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[Execute](execute.md)*

*Defined in [main/index.ts:36](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/execute/src/main/index.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[Execute](execute.md)*

## Methods

###  execute

▸ **execute**(`__namedParameters`: object, `options`: `ServerRequestOptions`, `__namedParameters`: object): *`Promise<MaybeRawResponseData>`*

*Defined in [main/index.ts:46](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/execute/src/main/index.ts#L46)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ast` | undefined \| `DocumentNode` |
`request` | string |

▪ **options**: *`ServerRequestOptions`*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`boxID` | string |

**Returns:** *`Promise<MaybeRawResponseData>`*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../README.md#initoptions)): *`Promise<Execute>`*

*Defined in [main/index.ts:21](https://github.com/badbatch/graphql-box/blob/43ddea2/packages/execute/src/main/index.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../README.md#initoptions) |

**Returns:** *`Promise<Execute>`*
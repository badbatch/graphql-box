[Documentation](../README.md) > [UserOptions](../interfaces/useroptions.md)

# Interface: UserOptions

## Hierarchy

**UserOptions**

## Index

### Properties

* [batch](useroptions.md#batch)
* [batchInterval](useroptions.md#batchinterval)
* [fetchTimeout](useroptions.md#fetchtimeout)
* [headers](useroptions.md#headers)
* [url](useroptions.md#url)

---

## Properties

<a id="batch"></a>

### `<Optional>` batch

**● batch**: *`undefined` \| `false` \| `true`*

*Defined in [defs/index.ts:13](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L13)*

Whether a client should batch query and mutation requests.

___
<a id="batchinterval"></a>

### `<Optional>` batchInterval

**● batchInterval**: *`undefined` \| `number`*

*Defined in [defs/index.ts:19](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L19)*

How long handl should wait to batch requests before making a request.

___
<a id="fetchtimeout"></a>

### `<Optional>` fetchTimeout

**● fetchTimeout**: *`undefined` \| `number`*

*Defined in [defs/index.ts:25](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L25)*

How long handl should wait for a server to respond before timing out.

___
<a id="headers"></a>

### `<Optional>` headers

**● headers**: *`PlainObjectStringMap`*

*Defined in [defs/index.ts:30](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L30)*

Additional headers to be sent with every request.

___
<a id="url"></a>

###  url

**● url**: *`string`*

*Defined in [defs/index.ts:36](https://github.com/bad-batch/handl/blob/20503ed/packages/fetch-manager/src/defs/index.ts#L36)*

The endpoint that handl will use to communicate with the GraphQL server for queries and mutations.

___


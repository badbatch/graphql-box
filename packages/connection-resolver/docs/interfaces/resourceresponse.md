[Documentation](../README.md) › [ResourceResponse](resourceresponse.md)

# Interface: ResourceResponse ‹**Resource**›

## Type parameters

▪ **Resource**: *[PlainObject](../README.md#plainobject)*

## Hierarchy

* [Response](resourceresponse.md#response)

  ↳ **ResourceResponse**

## Index

### Properties

* [Response](resourceresponse.md#response)
* [body](resourceresponse.md#body)
* [bodyUsed](resourceresponse.md#bodyused)
* [data](resourceresponse.md#optional-data)
* [errors](resourceresponse.md#optional-errors)
* [headers](resourceresponse.md#headers)
* [ok](resourceresponse.md#ok)
* [redirected](resourceresponse.md#redirected)
* [status](resourceresponse.md#status)
* [statusText](resourceresponse.md#statustext)
* [trailer](resourceresponse.md#trailer)
* [type](resourceresponse.md#type)
* [url](resourceresponse.md#url)

### Methods

* [arrayBuffer](resourceresponse.md#arraybuffer)
* [blob](resourceresponse.md#blob)
* [clone](resourceresponse.md#clone)
* [formData](resourceresponse.md#formdata)
* [json](resourceresponse.md#json)
* [text](resourceresponse.md#text)

## Properties

###  Response

• **Response**: *object*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12829

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.webworker.d.ts:2882

#### Type declaration:

* **new __type**(`body?`: BodyInit | null, `init?`: ResponseInit): *[Response](resourceresponse.md#response)*

* **prototype**: *[Response](resourceresponse.md#response)*

* **error**(): *[Response](resourceresponse.md#response)*

* **redirect**(`url`: string, `status?`: undefined | number): *[Response](resourceresponse.md#response)*

___

###  body

• **body**: *ReadableStream‹Uint8Array› | null*

*Inherited from [ResourceResponse](resourceresponse.md).[body](resourceresponse.md#body)*

*Overrides [ResourceResponse](resourceresponse.md).[body](resourceresponse.md#body)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:2531

___

###  bodyUsed

• **bodyUsed**: *boolean*

*Inherited from [ResourceResponse](resourceresponse.md).[bodyUsed](resourceresponse.md#bodyused)*

*Overrides [ResourceResponse](resourceresponse.md).[bodyUsed](resourceresponse.md#bodyused)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:2532

___

### `Optional` data

• **data**? : *Resource*

*Defined in [packages/connection-resolver/src/defs/index.ts:55](https://github.com/badbatch/graphql-box/blob/870b4903/packages/connection-resolver/src/defs/index.ts#L55)*

___

### `Optional` errors

• **errors**? : *Error[]*

*Defined in [packages/connection-resolver/src/defs/index.ts:56](https://github.com/badbatch/graphql-box/blob/870b4903/packages/connection-resolver/src/defs/index.ts#L56)*

___

###  headers

• **headers**: *Headers*

*Inherited from [ResourceResponse](resourceresponse.md).[headers](resourceresponse.md#headers)*

*Overrides [ResourceResponse](resourceresponse.md).[headers](resourceresponse.md#headers)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12818

___

###  ok

• **ok**: *boolean*

*Inherited from [ResourceResponse](resourceresponse.md).[ok](resourceresponse.md#ok)*

*Overrides [ResourceResponse](resourceresponse.md).[ok](resourceresponse.md#ok)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12819

___

###  redirected

• **redirected**: *boolean*

*Inherited from [ResourceResponse](resourceresponse.md).[redirected](resourceresponse.md#redirected)*

*Overrides [ResourceResponse](resourceresponse.md).[redirected](resourceresponse.md#redirected)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12820

___

###  status

• **status**: *number*

*Inherited from [ResourceResponse](resourceresponse.md).[status](resourceresponse.md#status)*

*Overrides [ResourceResponse](resourceresponse.md).[status](resourceresponse.md#status)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12821

___

###  statusText

• **statusText**: *string*

*Inherited from [ResourceResponse](resourceresponse.md).[statusText](resourceresponse.md#statustext)*

*Overrides [ResourceResponse](resourceresponse.md).[statusText](resourceresponse.md#statustext)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12822

___

###  trailer

• **trailer**: *Promise‹Headers›*

*Inherited from [ResourceResponse](resourceresponse.md).[trailer](resourceresponse.md#trailer)*

*Overrides [ResourceResponse](resourceresponse.md).[trailer](resourceresponse.md#trailer)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12823

___

###  type

• **type**: *ResponseType*

*Inherited from [ResourceResponse](resourceresponse.md).[type](resourceresponse.md#type)*

*Overrides [ResourceResponse](resourceresponse.md).[type](resourceresponse.md#type)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12824

___

###  url

• **url**: *string*

*Inherited from [ResourceResponse](resourceresponse.md).[url](resourceresponse.md#url)*

*Overrides [ResourceResponse](resourceresponse.md).[url](resourceresponse.md#url)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12825

## Methods

###  arrayBuffer

▸ **arrayBuffer**(): *Promise‹ArrayBuffer›*

*Inherited from [ResourceResponse](resourceresponse.md).[arrayBuffer](resourceresponse.md#arraybuffer)*

*Overrides [ResourceResponse](resourceresponse.md).[arrayBuffer](resourceresponse.md#arraybuffer)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:2533

**Returns:** *Promise‹ArrayBuffer›*

___

###  blob

▸ **blob**(): *Promise‹Blob›*

*Inherited from [ResourceResponse](resourceresponse.md).[blob](resourceresponse.md#blob)*

*Overrides [ResourceResponse](resourceresponse.md).[blob](resourceresponse.md#blob)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:2534

**Returns:** *Promise‹Blob›*

___

###  clone

▸ **clone**(): *[Response](resourceresponse.md#response)*

*Inherited from [ResourceResponse](resourceresponse.md).[clone](resourceresponse.md#clone)*

*Overrides [ResourceResponse](resourceresponse.md).[clone](resourceresponse.md#clone)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:12826

**Returns:** *[Response](resourceresponse.md#response)*

___

###  formData

▸ **formData**(): *Promise‹FormData›*

*Inherited from [ResourceResponse](resourceresponse.md).[formData](resourceresponse.md#formdata)*

*Overrides [ResourceResponse](resourceresponse.md).[formData](resourceresponse.md#formdata)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:2535

**Returns:** *Promise‹FormData›*

___

###  json

▸ **json**(): *Promise‹any›*

*Inherited from [ResourceResponse](resourceresponse.md).[json](resourceresponse.md#json)*

*Overrides [ResourceResponse](resourceresponse.md).[json](resourceresponse.md#json)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:2536

**Returns:** *Promise‹any›*

___

###  text

▸ **text**(): *Promise‹string›*

*Inherited from [ResourceResponse](resourceresponse.md).[text](resourceresponse.md#text)*

*Overrides [ResourceResponse](resourceresponse.md).[text](resourceresponse.md#text)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.dom.d.ts:2537

**Returns:** *Promise‹string›*

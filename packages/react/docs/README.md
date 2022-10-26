[Documentation](README.md)

# Documentation

## Index

### Type aliases

* [ConnectionResponse](README.md#connectionresponse)
* [ConnectionVariables](README.md#connectionvariables)
* [Edge](README.md#edge)
* [GraphQLBoxContext](README.md#graphqlboxcontext)
* [ListingsChildrenProps](README.md#listingschildrenprops)
* [ListingsData](README.md#listingsdata)
* [ListingsProps](README.md#listingsprops)
* [PageInfo](README.md#pageinfo)
* [Props](README.md#props)
* [State](README.md#state)

### Variables

* [defaultValue](README.md#const-defaultvalue)
* [useMutation](README.md#const-usemutation)
* [useQuery](README.md#const-usequery)

### Functions

* [hasRequestPathChanged](README.md#const-hasrequestpathchanged)
* [useRequest](README.md#const-userequest)
* [useSubscription](README.md#const-usesubscription)

### Object literals

* [initialListingsData](README.md#const-initiallistingsdata)

## Type aliases

###  ConnectionResponse

Ƭ **ConnectionResponse**: *object*

*Defined in [components/ConnectionListings/types.ts:11](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/types.ts#L11)*

#### Type declaration:

* \[ **key**: *string*\]: object

* **edges**? : *[Edge](README.md#edge)‹Item›[]*

* **pageInfo**: *[PageInfo](README.md#pageinfo)*

* **totalCount**: *number*

___

###  ConnectionVariables

Ƭ **ConnectionVariables**: *object*

*Defined in [components/ConnectionListings/types.ts:4](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/types.ts#L4)*

#### Type declaration:

* **after**? : *undefined | string*

* **before**? : *undefined | string*

* **first**? : *undefined | number*

* **last**? : *undefined | number*

___

###  Edge

Ƭ **Edge**: *object*

*Defined in [components/ConnectionListings/types.ts:19](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/types.ts#L19)*

#### Type declaration:

* **cursor**: *string*

* **node**: *Item*

___

###  GraphQLBoxContext

Ƭ **GraphQLBoxContext**: *object*

*Defined in [contexts/GraphQLBox/Context.ts:5](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/contexts/GraphQLBox/Context.ts#L5)*

#### Type declaration:

* **graphqlBoxClient**: *Client | WorkerClient*

___

###  ListingsChildrenProps

Ƭ **ListingsChildrenProps**: *object*

*Defined in [components/ConnectionListings/types.ts:24](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/types.ts#L24)*

#### Type declaration:

* **hasNextPage**: *boolean*

* **lastItemRef**: *MutableRefObject‹HTMLDivElement | null›*

* **listings**: *Item[]*

* **loading**: *boolean*

___

###  ListingsData

Ƭ **ListingsData**: *object*

*Defined in [components/ConnectionListings/types.ts:44](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/types.ts#L44)*

#### Type declaration:

* **hasNextPage**: *boolean*

* **listings**: *Map‹string, [ConnectionResponse](README.md#connectionresponse)‹Item››*

___

###  ListingsProps

Ƭ **ListingsProps**: *object*

*Defined in [components/ConnectionListings/types.ts:31](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/types.ts#L31)*

#### Type declaration:

* **children**(): *function*

  * (`props`: [ListingsChildrenProps](README.md#listingschildrenprops)‹Item›): *ReactElement | null*

* **intersectionRoot**? : *IntersectionObserverInit["root"]*

* **intersectionRootMargin**? : *IntersectionObserverInit["rootMargin"]*

* **intersectionThreshold**? : *IntersectionObserverInit["threshold"]*

* **query**: *string*

* **renderError**? : *undefined | function*

* **renderLoader**? : *undefined | function*

* **requestPath**: *string*

* **resultsPerRequest**? : *undefined | number*

* **variables**: *Record‹string, any›*

___

###  PageInfo

Ƭ **PageInfo**: *object*

*Defined in [components/ConnectionListings/types.ts:49](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/types.ts#L49)*

#### Type declaration:

* **__typename**? : *undefined | "PageInfo"*

* **endCursor**? : *string | null*

* **hasNextPage**: *boolean*

* **hasPreviousPage**: *boolean*

* **startCursor**? : *string | null*

___

###  Props

Ƭ **Props**: *object*

*Defined in [contexts/GraphQLBox/Provider.tsx:6](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/contexts/GraphQLBox/Provider.tsx#L6)*

#### Type declaration:

* **children**: *ReactChild*

* **graphqlBoxClient**: *Client | WorkerClient*

___

###  State

Ƭ **State**: *object*

*Defined in [hooks/useRequest/index.ts:6](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/hooks/useRequest/index.ts#L6)*

*Defined in [hooks/useSubscription/index.ts:6](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/hooks/useSubscription/index.ts#L6)*

#### Type declaration:

* **data**: *Data | null | undefined*

* **errors**: *keyof Error[]*

* **hasNext**? : *undefined | false | true*

* **loading**: *boolean*

* **paths**? : *string[]*

* **requestID**: *string*

## Variables

### `Const` defaultValue

• **defaultValue**: *object*

*Defined in [contexts/GraphQLBox/Context.ts:9](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/contexts/GraphQLBox/Context.ts#L9)*

#### Type declaration:

___

### `Const` useMutation

• **useMutation**: *[useRequest](README.md#const-userequest)* = useRequest

*Defined in [index.ts:4](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/index.ts#L4)*

___

### `Const` useQuery

• **useQuery**: *[useRequest](README.md#const-userequest)* = useRequest

*Defined in [index.ts:3](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/index.ts#L3)*

## Functions

### `Const` hasRequestPathChanged

▸ **hasRequestPathChanged**(`requestPath`: string, `data`: PlainObjectMap | null | undefined): *boolean*

*Defined in [components/ConnectionListings/helpers/hasRequestPathChanged.ts:4](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/helpers/hasRequestPathChanged.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`requestPath` | string |
`data` | PlainObjectMap &#124; null &#124; undefined |

**Returns:** *boolean*

___

### `Const` useRequest

▸ **useRequest**‹**Data**›(`request`: string, `__namedParameters`: object): *object*

*Defined in [hooks/useRequest/index.ts:15](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/hooks/useRequest/index.ts#L15)*

**Type parameters:**

▪ **Data**: *PlainObjectMap*

**Parameters:**

▪ **request**: *string*

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`loading` | boolean | false |

**Returns:** *object*

* **execute**: *execute*

___

### `Const` useSubscription

▸ **useSubscription**‹**Data**›(`subscription`: string, `__namedParameters`: object): *object*

*Defined in [hooks/useSubscription/index.ts:15](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/hooks/useSubscription/index.ts#L15)*

**Type parameters:**

▪ **Data**: *PlainObjectMap*

**Parameters:**

▪ **subscription**: *string*

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`loading` | boolean | false |

**Returns:** *object*

* **execute**: *execute*

## Object literals

### `Const` initialListingsData

### ▪ **initialListingsData**: *object*

*Defined in [components/ConnectionListings/index.tsx:12](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/index.tsx#L12)*

###  hasNextPage

• **hasNextPage**: *boolean* = true

*Defined in [components/ConnectionListings/index.tsx:13](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/index.tsx#L13)*

###  listings

• **listings**: *Map‹any, any›* = new Map()

*Defined in [components/ConnectionListings/index.tsx:14](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/react/src/components/ConnectionListings/index.tsx#L14)*

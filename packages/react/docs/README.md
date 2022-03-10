[Documentation](README.md)

# Documentation

## Index

### Type aliases

* [GraphQLBoxContext](README.md#graphqlboxcontext)
* [Props](README.md#props)
* [State](README.md#state)

### Variables

* [defaultValue](README.md#const-defaultvalue)

### Functions

* [useQuery](README.md#const-usequery)

## Type aliases

###  GraphQLBoxContext

Ƭ **GraphQLBoxContext**: *object*

*Defined in [contexts/GraphQLBox/Context.ts:4](https://github.com/badbatch/graphql-box/blob/3c77089/packages/react/src/contexts/GraphQLBox/Context.ts#L4)*

#### Type declaration:

* **graphqlBoxClient**: *Client*

___

###  Props

Ƭ **Props**: *object*

*Defined in [contexts/GraphQLBox/Provider.tsx:5](https://github.com/badbatch/graphql-box/blob/3c77089/packages/react/src/contexts/GraphQLBox/Provider.tsx#L5)*

#### Type declaration:

* **children**: *ReactChild*

* **graphqlBoxClient**: *Client*

___

###  State

Ƭ **State**: *object*

*Defined in [hooks/useQuery/index.ts:6](https://github.com/badbatch/graphql-box/blob/3c77089/packages/react/src/hooks/useQuery/index.ts#L6)*

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

*Defined in [contexts/GraphQLBox/Context.ts:8](https://github.com/badbatch/graphql-box/blob/3c77089/packages/react/src/contexts/GraphQLBox/Context.ts#L8)*

#### Type declaration:

## Functions

### `Const` useQuery

▸ **useQuery**‹**Data**›(`query`: string, `__namedParameters`: object): *object*

*Defined in [hooks/useQuery/index.ts:15](https://github.com/badbatch/graphql-box/blob/3c77089/packages/react/src/hooks/useQuery/index.ts#L15)*

**Type parameters:**

▪ **Data**: *PlainObjectMap*

**Parameters:**

▪ **query**: *string*

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`loading` | boolean | false |

**Returns:** *object*

* **executeQuery**: *executeQuery*

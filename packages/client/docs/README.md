[Documentation](README.md)

# Documentation

## Index

### Classes

* [Client](classes/client.md)

### Interfaces

* [ActiveQueryData](interfaces/activequerydata.md)
* [FilteredDataAndCacheMetadata](interfaces/filtereddataandcachemetadata.md)
* [PendingQueryData](interfaces/pendingquerydata.md)
* [QueryTracker](interfaces/querytracker.md)
* [UserOptions](interfaces/useroptions.md)

### Type aliases

* [PendingQueryResolver](README.md#pendingqueryresolver)

### Variables

* [LOG_NAME](README.md#const-log_name)

### Functions

* [filterDataAndCacheMetadata](README.md#const-filterdataandcachemetadata)
* [logPendingQuery](README.md#logpendingquery)
* [logRequest](README.md#logrequest)
* [logSubscription](README.md#logsubscription)
* [newNodeFieldsPartOfActiveNode](README.md#const-newnodefieldspartofactivenode)
* [parentNodeIncludes](README.md#const-parentnodeincludes)

## Type aliases

###  PendingQueryResolver

Ƭ **PendingQueryResolver**: *function*

*Defined in [defs/index.ts:48](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/client/src/defs/index.ts#L48)*

#### Type declaration:

▸ (`value`: MaybeRequestResult): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | MaybeRequestResult |

## Variables

### `Const` LOG_NAME

• **LOG_NAME**: *"isDataRequestedInActiveQuery"* = "isDataRequestedInActiveQuery"

*Defined in [helpers/isDataRequestedInActiveQuery.ts:16](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/client/src/helpers/isDataRequestedInActiveQuery.ts#L16)*

## Functions

### `Const` filterDataAndCacheMetadata

▸ **filterDataAndCacheMetadata**(`pendingFieldNode`: FieldNode, `activeFieldNode`: FieldNode, `activeResponseData`: MaybeResponseData, `__namedParameters`: object, `fragmentDefinitions`: object, `keyAndPathOptions`: object, `contexts`: object): *void*

*Defined in [helpers/filterResponseData.ts:24](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/client/src/helpers/filterResponseData.ts#L24)*

**Parameters:**

▪ **pendingFieldNode**: *FieldNode*

▪ **activeFieldNode**: *FieldNode*

▪ **activeResponseData**: *MaybeResponseData*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`filteredCacheMetadata` | Map‹string, Cacheability‹›› |
`filteredData` | PlainObjectMap‹any› |

▪ **fragmentDefinitions**: *object*

Name | Type |
------ | ------ |
`active?` | FragmentDefinitionNodeMap |
`pending?` | FragmentDefinitionNodeMap |

▪ **keyAndPathOptions**: *object*

Name | Type |
------ | ------ |
`active` | KeysAndPathsOptions |
`pending` | KeysAndPathsOptions |

▪ **contexts**: *object*

Name | Type |
------ | ------ |
`active` | RequestContext |
`pending` | RequestContext |

**Returns:** *void*

___

###  logPendingQuery

▸ **logPendingQuery**(): *(Anonymous function)*

*Defined in [debug/log-pending-query/index.ts:4](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/client/src/debug/log-pending-query/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

###  logRequest

▸ **logRequest**(): *(Anonymous function)*

*Defined in [debug/log-request/index.ts:4](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/client/src/debug/log-request/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

###  logSubscription

▸ **logSubscription**(): *(Anonymous function)*

*Defined in [debug/log-subscription/index.ts:4](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/client/src/debug/log-subscription/index.ts#L4)*

**Returns:** *(Anonymous function)*

___

### `Const` newNodeFieldsPartOfActiveNode

▸ **newNodeFieldsPartOfActiveNode**(`activeNode`: ParentNode, `newNode`: ParentNode, `fragmentDefinitions`: object, `keyAndPathOptions`: object, `contexts`: object): *boolean*

*Defined in [helpers/isDataRequestedInActiveQuery.ts:58](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/client/src/helpers/isDataRequestedInActiveQuery.ts#L58)*

**Parameters:**

▪ **activeNode**: *ParentNode*

▪ **newNode**: *ParentNode*

▪ **fragmentDefinitions**: *object*

Name | Type |
------ | ------ |
`active?` | FragmentDefinitionNodeMap |
`new?` | FragmentDefinitionNodeMap |

▪ **keyAndPathOptions**: *object*

Name | Type |
------ | ------ |
`active` | KeysAndPathsOptions |
`new` | KeysAndPathsOptions |

▪ **contexts**: *object*

Name | Type |
------ | ------ |
`active` | RequestContext |
`new` | RequestContext |

**Returns:** *boolean*

___

### `Const` parentNodeIncludes

▸ **parentNodeIncludes**(`activeNode`: ParentNode, `newNode`: ParentNode, `fragmentDefinitions`: object, `contexts`: object): *boolean*

*Defined in [helpers/isDataRequestedInActiveQuery.ts:18](https://github.com/badbatch/graphql-box/blob/1f1b3ae4/packages/client/src/helpers/isDataRequestedInActiveQuery.ts#L18)*

**Parameters:**

▪ **activeNode**: *ParentNode*

▪ **newNode**: *ParentNode*

▪ **fragmentDefinitions**: *object*

Name | Type |
------ | ------ |
`control?` | FragmentDefinitionNodeMap |
`value?` | FragmentDefinitionNodeMap |

▪ **contexts**: *object*

Name | Type |
------ | ------ |
`active` | RequestContext |
`new` | RequestContext |

**Returns:** *boolean*

[Documentation](../README.md) › [EventAsyncIterator](eventasynciterator.md)

# Class: EventAsyncIterator

## Hierarchy

* **EventAsyncIterator**

## Index

### Constructors

* [constructor](eventasynciterator.md#constructor)

### Methods

* [getIterator](eventasynciterator.md#getiterator)

## Constructors

###  constructor

\+ **new EventAsyncIterator**(`eventEmitter`: EventEmitter, `eventName`: string): *[EventAsyncIterator](eventasynciterator.md)*

*Defined in [packages/helpers/src/event-async-iterator/index.ts:10](https://github.com/badbatch/graphql-box/blob/7171508/packages/helpers/src/event-async-iterator/index.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`eventEmitter` | EventEmitter |
`eventName` | string |

**Returns:** *[EventAsyncIterator](eventasynciterator.md)*

## Methods

###  getIterator

▸ **getIterator**(): *AsyncIterableIterator‹MaybeRequestResult | undefined›*

*Defined in [packages/helpers/src/event-async-iterator/index.ts:19](https://github.com/badbatch/graphql-box/blob/7171508/packages/helpers/src/event-async-iterator/index.ts#L19)*

**Returns:** *AsyncIterableIterator‹MaybeRequestResult | undefined›*

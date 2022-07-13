[Documentation](../README.md) › [EventAsyncIterator](eventasynciterator.md)

# Class: EventAsyncIterator ‹**RequestResult**›

## Type parameters

▪ **RequestResult**

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

*Defined in [packages/helpers/src/event-async-iterator/index.ts:9](https://github.com/badbatch/graphql-box/blob/4b3e24f/packages/helpers/src/event-async-iterator/index.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`eventEmitter` | EventEmitter |
`eventName` | string |

**Returns:** *[EventAsyncIterator](eventasynciterator.md)*

## Methods

###  getIterator

▸ **getIterator**(): *AsyncIterableIterator‹RequestResult | undefined›*

*Defined in [packages/helpers/src/event-async-iterator/index.ts:18](https://github.com/badbatch/graphql-box/blob/4b3e24f/packages/helpers/src/event-async-iterator/index.ts#L18)*

**Returns:** *AsyncIterableIterator‹RequestResult | undefined›*

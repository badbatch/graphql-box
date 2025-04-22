import { type PlainObject } from '@graphql-box/core';
import { type GraphQLResolveInfo } from 'graphql';
import crypto from 'node:crypto';
import { isCursorSupplied } from '../helpers/isCursorSupplied.ts';
import { requestAndCachePages } from '../helpers/requestAndCachePages.ts';
import { resolveConnection } from '../helpers/resolveConnection.ts';
import { validateCursor } from '../helpers/validateCursor.ts';
import {
  type Connection,
  type ConnectionInputOptions,
  type ConnectionResolverUserOptions,
  type Context,
  type Node,
} from '../types.ts';

export const makeConnectionResolver =
  <
    Source extends PlainObject | undefined,
    Args extends PlainObject,
    Ctx extends Context,
    Resource extends PlainObject,
    ResourceNode extends Node,
  >({
    createMakeCursors,
    createResourceResolver,
    cursorCache,
    getters,
    resolver = result => result,
    resultsPerPage,
  }: ConnectionResolverUserOptions<Source, Args, Ctx, Resource, ResourceNode>) =>
  async (
    source: Source,
    args: Args & ConnectionInputOptions,
    context: Ctx,
    info: GraphQLResolveInfo,
  ): Promise<Connection> => {
    const { makeGroupCursor, makeIDCursor } = createMakeCursors(source, args, context, info);
    const groupCursor = makeGroupCursor();
    const { logger, setCacheMetadata } = context;
    const { fieldName: fieldPath } = info;

    const newCtx = {
      ...context,
      data: {
        ...context.data,
        args,
        fieldPath,
        groupCursor,
        resolverRequestId: crypto.randomUUID(),
        resolverType: 'Connection',
      },
    };

    const resourceResolver = createResourceResolver(source, args, newCtx, info);
    const childLogger = logger?.child(newCtx.data);
    childLogger?.info(`Resolving ${fieldPath}`, { logEntryName: 'RESOLVER_START' });

    if (isCursorSupplied(args)) {
      const cursorError = await validateCursor(args, info, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      if (cursorError) {
        childLogger?.error(`Failed to resolve ${fieldPath}, validation cursor error`, {
          errors: JSON.stringify([cursorError]),
          logEntryName: 'RESOLVER_FAILED',
        });

        return resolver({
          edges: [],
          errors: [cursorError],
          nodes: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
          totalCount: 0,
        });
      }

      return resolver(
        await resolveConnection(args, {
          cursorCache,
          fieldPath,
          getters,
          groupCursor,
          makeIDCursor,
          resourceResolver,
          resultsPerPage,
          setCacheMetadata,
        }),
      );
    }

    if (await cursorCache.has(`${groupCursor}-metadata`)) {
      return resolver(
        await resolveConnection(args, {
          cursorCache,
          fieldPath,
          getters,
          groupCursor,
          makeIDCursor,
          resourceResolver,
          resultsPerPage,
          setCacheMetadata,
        }),
      );
    }

    await requestAndCachePages<Resource, ResourceNode>([1], {
      cursorCache,
      fieldPath,
      getters,
      groupCursor,
      makeIDCursor,
      resourceResolver,
      setCacheMetadata,
    });

    return resolver(
      await resolveConnection(args, {
        cursorCache,
        fieldPath,
        getters,
        groupCursor,
        makeIDCursor,
        resourceResolver,
        resultsPerPage,
        setCacheMetadata,
      }),
    );
  };

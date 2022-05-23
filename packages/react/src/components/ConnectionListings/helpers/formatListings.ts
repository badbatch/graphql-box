import { PlainObjectMap } from "@graphql-box/core";
import { get } from "lodash";
import { ConnectionResponse } from "../types";

export default <Item extends PlainObjectMap>(listings: Map<string, ConnectionResponse<Item>>, requestPath: string) =>
  Array.from(listings).reduce((acc: Item[], [, data]) => {
    const { edges } = get(data, requestPath);

    if (!edges || !edges.length) {
      return acc;
    }

    return [...acc, ...edges.map(edge => edge.node)];
  }, []);

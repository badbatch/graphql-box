import { PlainObjectMap } from "@graphql-box/core";
import { ConnectionResponse } from "../types";

export default <Item extends PlainObjectMap>(listings: Map<string, ConnectionResponse<Item>>) =>
  Array.from(listings).reduce((acc: Item[], [, data]) => {
    const { edges } = data.search;

    if (!edges || !edges.length) {
      return acc;
    }

    return [...acc, ...edges.map(edge => edge.node)];
  }, []);

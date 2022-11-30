import {
  IncrementalRequestManagerResult,
  PlainObjectMap,
  RequestManagerResult,
  SubscriptionsManagerResult,
} from "@graphql-box/core";
import { set } from "lodash";
import cleanIncrementalResult from "./cleanIncrementalResult";

export default (result: RequestManagerResult | IncrementalRequestManagerResult | SubscriptionsManagerResult) => {
  if ("data" in result) {
    return result.data;
  }

  if ("incremental" in result) {
    return (
      result.incremental?.reduce((acc: PlainObjectMap, entry) => {
        if (entry.path) {
          if ("data" in entry && entry.data) {
            set(acc, entry.path, cleanIncrementalResult(entry.data));
          } else if ("items" in entry && entry.items) {
            set(acc, entry.path, cleanIncrementalResult(entry.items));
          }
        }

        return acc;
      }, {}) ?? {}
    );
  }

  return {};
};

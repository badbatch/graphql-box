import { IncrementalRequestManagerResult, RequestManagerResult, SubscriptionsManagerResult } from "@graphql-box/core";

export default (
  result: RequestManagerResult | IncrementalRequestManagerResult | SubscriptionsManagerResult,
): result is IncrementalRequestManagerResult => "hasNext" in result;

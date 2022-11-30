import { IncrementalRequestManagerResult } from "@graphql-box/core";

export default (result: IncrementalRequestManagerResult) => !!result.hasNext;

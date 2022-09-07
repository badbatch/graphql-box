import { BatchRequestData, RequestData } from "../defs";

export default (body: RequestData | BatchRequestData): body is BatchRequestData => body.batched;

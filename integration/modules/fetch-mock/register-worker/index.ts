import fetchMock from "fetch-mock";
import { isPlainObject } from "lodash";
import { FETCH_MOCK, MESSAGE } from "../consts";
import { FetchMockMessageRequest } from "../defs";
import { dehydrateFetchMock } from "../helpers";

export default function registerFetchMockWorker(): void {
  const { addEventListener, postMessage } = (self as unknown) as DedicatedWorkerGlobalScope;

  function onMessage({ data }: MessageEvent): void {
    if (!isPlainObject(data)) return;

    const { messageID, method, options = {}, type } = data as FetchMockMessageRequest;
    if (type !== FETCH_MOCK) return;

    const result = fetchMock[method]();
    const returnValue = options.returnValue ? dehydrateFetchMock(result) : undefined;
    postMessage({ messageID, result: returnValue, type });
  }

  addEventListener(MESSAGE, onMessage);
}

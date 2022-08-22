import { RequestData } from "@graphql-box/core";
import { ActiveQueryData } from "../defs";

export default (activeRequestsList: ActiveQueryData[], requestData: RequestData) =>
  activeRequestsList.find(({ requestData: activeRequestData }) => activeRequestData.hash === requestData.hash);

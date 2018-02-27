import { FieldNode } from "graphql";
import { ObjectMap, RequestContext } from "../types";

export interface MapFieldToTypeArgs {
  ancestors: any[];
  context: RequestContext;
  fieldNode: FieldNode;
  isEntity: boolean;
  resourceKey: string;
  typeName: string;
  variables?: ObjectMap;
}

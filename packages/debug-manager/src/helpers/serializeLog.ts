import { PlainObjectMap } from "@graphql-box/core";
import { cloneDeep, get, has, set } from "lodash";

const defaultPropNames = ["labels.result", "labels.variables", "labels.value"];

export default (logData: PlainObjectMap, propNames: string[] = defaultPropNames) => {
  return propNames.reduce((data: PlainObjectMap, propName) => {
    if (has(logData, propName)) {
      set(data, propName, JSON.stringify(get(logData, propName)));
    }

    return data;
  }, cloneDeep(logData));
};

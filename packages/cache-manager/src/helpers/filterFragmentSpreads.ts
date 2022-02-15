import { deleteFragmentSpreads } from "@graphql-box/helpers";
import { FieldNode, FragmentDefinitionNode } from "graphql";
import { isEmpty, keys } from "lodash";
import { FragmentSpreadFieldCounter } from "../defs";
import { FragmentSpreadCheckist } from "./createFragmentSpreadChecklist";

export default (
  field: FieldNode | FragmentDefinitionNode,
  fragmentSpreadFieldCounter: FragmentSpreadFieldCounter,
  fragmentSpreadChecklist: FragmentSpreadCheckist,
  ancestorRequestFieldPath: string,
) => {
  if (isEmpty(fragmentSpreadFieldCounter)) {
    return;
  }

  keys(fragmentSpreadFieldCounter).forEach(key => {
    fragmentSpreadChecklist[key].total += 1;
    fragmentSpreadChecklist[key].paths.push(ancestorRequestFieldPath);

    const { hasData, total } = fragmentSpreadFieldCounter[key];

    if (hasData === total) {
      deleteFragmentSpreads(field, key);
      fragmentSpreadChecklist[key].deleted += 1;
    }
  });
};

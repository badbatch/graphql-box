import { TYPE_NAME_KEY } from "@graphql-box/core";
import { FRAGMENT_SPREAD, deleteChildFields, getChildFields, getName, hasChildFields } from "@graphql-box/helpers";
import { FieldNode, FragmentDefinitionNode, OperationDefinitionNode } from "graphql";
import { CacheManagerContext, FieldPathChecklist, FragmentSpreadFieldCounter } from "../defs";
import { buildFieldKeysAndPaths } from "./buildKeysAndPaths";
import checkFieldPathChecklist from "./checkFieldPathChecklist";
import { FragmentSpreadCheckist } from "./createFragmentSpreadChecklist";
import filterFragmentSpreads from "./filterFragmentSpreads";
import filterIDsAndTypeNames from "./filterIDsAndTypeNames";
import filterInlineFragments from "./filterInlineFragments";

const filterField = (
  field: FieldNode | FragmentDefinitionNode | OperationDefinitionNode,
  fieldPathChecklist: FieldPathChecklist,
  fragmentSpreadChecklist: FragmentSpreadCheckist,
  ancestorRequestFieldPath: string,
  context: CacheManagerContext,
): boolean => {
  const { fragmentDefinitions, typeIDKey } = context;
  const fieldsAndTypeNames = getChildFields(field, { fragmentDefinitions });

  if (!fieldsAndTypeNames) {
    return false;
  }

  const fragmentSpreadFieldCounter: FragmentSpreadFieldCounter = {};

  for (let i = fieldsAndTypeNames.length - 1; i >= 0; i -= 1) {
    const { fieldNode: childField, fragmentKind, fragmentName, typeName: childTypeName } = fieldsAndTypeNames[i];

    if (fragmentKind === FRAGMENT_SPREAD && fragmentName && !fragmentSpreadFieldCounter[fragmentName]) {
      fragmentSpreadFieldCounter[fragmentName] = {
        hasData: 0,
        total: fragmentDefinitions?.[fragmentName]
          ? getChildFields(fragmentDefinitions?.[fragmentName], { fragmentDefinitions })?.length ?? 0
          : 0,
      };
    }

    const childFieldName = getName(childField);

    if (childFieldName === typeIDKey || childFieldName === TYPE_NAME_KEY) {
      continue;
    }

    const { requestFieldPath } = buildFieldKeysAndPaths(
      childField,
      {
        requestFieldPath: ancestorRequestFieldPath,
      },
      context,
    );

    const { hasData, typeUnused } = checkFieldPathChecklist(fieldPathChecklist.get(requestFieldPath), childTypeName);

    if (hasData || typeUnused) {
      if (fragmentKind === FRAGMENT_SPREAD) {
        fragmentSpreadFieldCounter[fragmentName as string].hasData += 1;
      } else if (!hasChildFields(childField, { fragmentDefinitions })) {
        deleteChildFields(field, childField);
      } else if (filterField(childField, fieldPathChecklist, fragmentSpreadChecklist, requestFieldPath, context)) {
        deleteChildFields(field, childField);
      }
    }
  }

  filterFragmentSpreads(field, fragmentSpreadFieldCounter, fragmentSpreadChecklist, ancestorRequestFieldPath);
  filterInlineFragments(field, context);
  filterIDsAndTypeNames(field, context);
  return !hasChildFields(field, { fragmentDefinitions });
};

export default filterField;

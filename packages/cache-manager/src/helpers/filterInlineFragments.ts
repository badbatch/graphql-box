import { deleteInlineFragments, getChildFields, getInlineFragments, getName } from "@graphql-box/helpers";
import { FieldNode, FragmentDefinitionNode } from "graphql";
import { CacheManagerContext } from "..";

export default (field: FieldNode | FragmentDefinitionNode, { fragmentDefinitions, typeIDKey }: CacheManagerContext) => {
  const inlineFragments = getInlineFragments(field);
  let filtered = false;

  inlineFragments.forEach(fragment => {
    const fieldsAndTypeNames = getChildFields(fragment, { fragmentDefinitions });

    if (!fieldsAndTypeNames || !fieldsAndTypeNames.length) {
      deleteInlineFragments(field, fragment);
      filtered = true;
      return;
    }

    if (fieldsAndTypeNames.length === 1) {
      const { fieldNode } = fieldsAndTypeNames[0];

      if (getName(fieldNode) === typeIDKey) {
        deleteInlineFragments(field, fragment);
        filtered = true;
      }
    }
  });

  return filtered;
};

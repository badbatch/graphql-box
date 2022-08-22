import { FieldNode } from "graphql";
import { getAlias } from "../alias";
import { getName } from "../name";

export const getAliasOrName = (field: FieldNode) => getAlias(field) || (getName(field) as FieldNode["name"]["value"]);

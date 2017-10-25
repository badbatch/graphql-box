import { isArray, isNumber, isString } from 'lodash';

/**
 *
 * @param {string} key
 * @param {any} path
 * @return {string}
 */
const buildPath = function buildPath(key, path) {
  const _path = isString(path) ? [path] : [];
  _path.push(key);
  return _path.join('.');
};

/**
 *
 * @param {string} name
 * @param {number} index
 * @param {Object} args
 * @param {any} cachePath
 * @return {string}
 */
export const buildCacheKey = function buildCacheKey(name, index, args, cachePath) {
  let key = `${isNumber(index) ? index : name}`;
  if (args) key = `${key}(${JSON.stringify(args)})`;
  return buildPath(key, cachePath);
};

/**
 *
 * @param {string} name
 * @param {any} dataPath
 * @return {string}
 */
export const buildDataKey = function buildDataKey(name, dataPath) {
  return buildPath(name, dataPath);
};

/**
 *
 * @param {string} name
 * @param {any} queryPath
 * @return {string}
 */
export const buildQueryKey = function buildQueryKey(name, queryPath) {
  return buildPath(name, queryPath);
};

/**
 *
 * @param {Object} opDef
 * @return {void}
 */
export const deleteVariableDefinitions = function deleteVariableDefinitions(opDef) {
  opDef.variableDefinitions = null;
};

/**
 *
 * @param {Object} node
 * @return {Array<Object>}
 */
export const getChildFields = function getChildFields({ selectionSet }) {
  return selectionSet ? selectionSet.selections : [];
};

/**
 *
 * @param {Object} node
 * @return {string}
 */
export const getFieldAlias = function getFieldAlias({ alias }) {
  if (!alias) return null;
  return alias.value;
};

/**
 *
 * @param {Object} node
 * @return {string}
 */
export const getKind = function getKind({ kind }) {
  return kind;
};

/**
 *
 * @param {Object} node
 * @return {string}
 */
export const getName = function getName({ name }) {
  return name.value;
};

/**
 *
 * @param {Document} doc
 * @return {string}
 */
export const getOperationName = function getOperationName({ definitions }) {
  // TODO: This hardcodes the first element in the array.
  return definitions[0].operation;
};

/**
 *
 * @param {Document} doc
 * @return {Array<Object>}
 */
export const getOperations = function getOperations({ definitions }) {
  const operations = [];

  definitions.forEach((definition) => {
    if (getKind(definition) !== 'OperationDefinition') return;
    operations.push(definition);
  });

  return operations;
};

/**
 *
 * @param {Document} doc
 * @return {Object}
 */
export const getQuery = function getQuery({ definitions }) {
  return definitions.find(({ operation }) => operation === 'query');
};

/**
 *
 * @param {Object} fieldDef
 * @return {Object}
 */
export const getType = function getType({ type }) {
  return type.ofType || type;
};

/**
 *
 * @param {Object} node
 * @return {string}
 */
export const getValue = function getValue({ value }) {
  return value.value;
};

/**
 *
 * @param {Object} opDef
 * @return {Array<Object>}
 */
export const getVariableDefinitions = function getVariableDefinitions({ variableDefinitions }) {
  return variableDefinitions;
};

/**
 *
 * @param {Object} obj
 * @param {string} key
 * @return {boolean}
 */
export const hasFieldData = function hasFieldData(obj, key) {
  return obj[key] !== undefined;
};

/**
 *
 * @param {Object} node
 * @return {boolean}
 */
export const isField = function isField({ kind }) {
  return kind === 'Field';
};

/**
 *
 * @param {Object} node
 * @return {boolean}
 */
export const isParentField = function isParentField({ selectionSet }) {
  return selectionSet !== null && selectionSet.selections.length;
};

/**
 *
 * @param {Map} map
 * @return {Object}
 */
export const mapToObject = function mapToObject(map) {
  const obj = {};

  map.forEach((cacheability, key) => {
    obj[key] = cacheability.metadata;
  });

  return obj;
};

/**
 *
 * @param {Object} node
 * @param {Object} field
 * @return {void}
 */
export const addChildField = function addChildField(node, field) {
  const childFields = getChildFields(node);
  childFields.push(field);
};

/**
 *
 * @param {Array<Object>} fieldNodes
 * @return {Array<Object>}
 */
export const passthroughInlineFragments = function passthroughInlineFragments(fieldNodes) {
  if (fieldNodes.length > 1) return fieldNodes;
  if (getKind(fieldNodes[0]) !== 'InlineFragment') return fieldNodes;
  return getChildFields(fieldNodes[0]);
};

/**
 *
 * @param {Object} parent
 * @param {Object} child
 * @return {void}
 */
export const deleteChildField = function deleteChildField(parent, child) {
  const childFields = passthroughInlineFragments(getChildFields(parent));

  for (let i = childFields.length - 1; i >= 0; i -= 1) {
    if (childFields[i] === child) {
      childFields.splice(i, 1);
    }
  }
};

/**
 *
 * @param {Object} document
 * @return {void}
 */
export const deleteFragmentDefinitions = function deleteFragmentDefinitions({ definitions }) {
  for (let i = definitions.length - 1; i >= 0; i -= 1) {
    if (getKind(definitions[i]) === 'FragmentDefinition') {
      definitions.splice(i, 1);
    }
  }
};

/**
 *
 * @param {Array<Object>} fieldNodes
 * @return {Array<Object>}
 */
export const unwrapInlineFragments = function unwrapInlineFragments(fieldNodes) {
  let unwrapped = [];

  for (let i = 0; i < fieldNodes.length; i += 1) {
    const kind = getKind(fieldNodes[i]);

    if (kind === 'Field') {
      unwrapped.push(fieldNodes[i]);
    } else if (kind === 'InlineFragment') {
      unwrapped = unwrapped.concat(unwrapInlineFragments(getChildFields(fieldNodes[i])));
    }
  }

  return unwrapped;
};

/**
 *
 * @param {Object} node
 * @param {string} name
 * @return {Object}
 */
export const getChildField = function getChildField(node, name) {
  const fields = unwrapInlineFragments(getChildFields(node));
  let field = null;

  for (let i = 0; i < fields.length; i += 1) {
    if (getName(fields[i]) === name) {
      field = fields[i];
      break;
    }
  }

  return field;
};

/**
 *
 * @param {Object} node
 * @return {Array<Object>|null}
 */
export const getFieldArguments = function getFieldArguments(node) {
  return node.arguments;
};

/**
 *
 * @param {Object} valueNode
 * @return {any}
 */
export const parseArgumentValueTypes = function parseArgumentValueTypes(valueNode) {
  let output;

  if (valueNode.value) {
    output = valueNode.value;
  } else if (valueNode.kind === 'ObjectValue') {
    output = {};

    valueNode.fields.forEach(({ name, value }) => {
      output[name.value] = parseArgumentValueTypes(value);
    });
  } else if (valueNode.kind === 'ListValue') {
    output = [];

    valueNode.values.forEach((value) => {
      output.push(parseArgumentValueTypes(value));
    });
  } else {
    output = null;
  }

  return output;
};

/**
 *
 * @param {Array<Object>} argumentNodes
 * @return {Object}
 */
export const parseFieldArguments = function parseFieldArguments(argumentNodes) {
  if (!argumentNodes.length) return null;
  const args = {};

  argumentNodes.forEach(({ name, value }) => {
    args[name.value] = parseArgumentValueTypes(value);
  });

  return args;
};

/**
 *
 * @param {Object} document
 * @return {Object}
 */
export const getFragmentDefinitions = function getFragmentDefinitions({ definitions }) {
  const fragmentDefinitions = {};

  definitions.forEach((value) => {
    if (getKind(value) === 'FragmentDefinition') {
      fragmentDefinitions[getName(value)] = value;
    }
  });

  return fragmentDefinitions;
};

/**
 *
 * @param {Object} type
 * @return {string}
 */
export const getNamedType = function getNamedType(type) {
  /**
   *
   * @param {Objecct} node
   * @return {string}
   */
  const get = function get(node) {
    if (getKind(node) !== 'NamedType') return get(node.type);
    return getName(node);
  };

  return get(type);
};

/**
 *
 * @param {Document} ast
 * @param {Function} [callback]
 * @return {Array<Object>}
 */
export const getRootFields = function getRootFields(ast, callback) {
  const rootFields = unwrapInlineFragments(getChildFields(getQuery(ast)));

  if (callback) {
    rootFields.forEach((field) => {
      callback(field);
    });
  }

  return rootFields;
};

/**
 *
 * @param {Document} ast
 * @param {string} name
 * @return {Object}
 */
export const getRootField = function getRootField(ast, name) {
  const fields = getRootFields(ast);
  let field = null;

  for (let i = 0; i < fields.length; i += 1) {
    if (getName(fields[i]) === name) {
      field = fields[i];
      break;
    }
  }

  return field;
};

/**
 *
 * @param {Object} inlineFragmentNode
 * @return {Object}
 */
export const getTypeCondition = function getTypeCondition({ typeCondition }) {
  return typeCondition;
};

/**
 *
 * @param {Array<Object>} definitions
 * @param {string} name
 * @return {string}
 */
export const getVariableDefinitionType = function getVariableDefinitionType(definitions, name) {
  const { type } = definitions.find(({ variable }) => getName(variable) === name);
  return getNamedType(type);
};

/**
 *
 * @param {Object} node
 * @param {string} name
 * @return {boolean}
 */
export const hasChildField = function hasChildField(node, name) {
  const childFields = unwrapInlineFragments(getChildFields(node));

  for (let i = 0; i < childFields.length; i += 1) {
    if (getName(childFields[i]) === name || getKind(childFields[i]) === name) return true;
  }

  return false;
};

/**
 *
 * @param {Object} document
 * @return {boolean}
 */
export const hasFragmentDefinitions = function hasFragmentDefinitions({ definitions }) {
  return !!definitions.filter(value => getKind(value) === 'FragmentDefinition').length;
};

/**
 *
 * @param {Object} node
 * @return {boolean}
 */
export const hasFragmentSpread = function hasFragmentSpread({ selectionSet }) {
  if (!selectionSet) return false;
  const { selections } = selectionSet;
  return !!selections.filter(value => getKind(value) === 'FragmentSpread').length;
};

/**
 *
 * @param {Object} opDef
 * @return {boolean}
 */
export const hasVariableDefinitions = function hasVariableDefinitions(opDef) {
  const variableDefinitions = getVariableDefinitions(opDef);
  return isArray(variableDefinitions) && variableDefinitions.length;
};

/**
 *
 * @param {Object} fragmentDefinitions
 * @param {Object} node
 * @param {Object} node.selectionSet
 * @param {Array<Object>} node.selectionSet.selections
 * @return {void}
 */
export const setFragments = function setFragments(
  fragmentDefinitions, { selectionSet: { selections } },
) {
  for (let i = selections.length - 1; i >= 0; i -= 1) {
    if (getKind(selections[i]) === 'FragmentSpread') {
      const { selectionSet } = fragmentDefinitions[getName(selections[i])];
      selections.splice(i, 1, ...selectionSet.selections);
    }
  }
};

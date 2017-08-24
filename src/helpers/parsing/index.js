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
 * @return {Array<Object>}
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
  // Need to look at how to handle multiple operations
  // in the same request.
  return definitions[0].operation;
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
 * @param {Object} parent
 * @param {Object} child
 * @return {void}
 */
export const deleteChildField = function deleteChildField(parent, child) {
  const childFields = getChildFields(parent);

  for (let i = childFields.length - 1; i >= 0; i -= 1) {
    if (childFields[i] === child) {
      childFields.splice(i, 1);
    }
  }
};

/**
 *
 * @param {Object} node
 * @param {string} name
 * @return {Object}
 */
export const getChildField = function getChildField(node, name) {
  const fields = getChildFields(node);
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
 * @return {string}
 */
export const getFieldAlias = function getFieldAlias({ alias }) {
  if (!alias) return null;
  return alias.value;
};

/**
 *
 * @param {Object} node
 * @return {Object|null}
 */
export const getFieldArguments = function getFieldArguments(node) {
  if (!node.arguments.length) return null;
  const args = {};

  node.arguments.forEach((arg) => {
    args[getName(arg)] = getValue(arg);
  });

  return args;
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
  const rootFields = getChildFields(getQuery(ast));

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
  const childFields = getChildFields(node);
  let hasField = false;

  for (let i = 0; i < childFields.length; i += 1) {
    if (getName(childFields[i]) === name) {
      hasField = true;
      break;
    }
  }

  return hasField;
};

/**
 *
 * @param {Object} opDef
 * @return {Array<Object>}
 */
export const hasVariableDefinitions = function hasVariableDefinitions(opDef) {
  const variableDefinitions = getVariableDefinitions(opDef);
  return isArray(variableDefinitions) && variableDefinitions.length;
};

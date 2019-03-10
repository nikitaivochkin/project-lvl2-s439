import _ from 'lodash';

const getIndent = (level) => {
  const deepIndent = 4;
  return ' '.repeat(level * deepIndent);
};

const stringify = (value, depth) => {
  if (!(value instanceof Object)) {
    return value;
  }
  const valueKeys = Object.keys(value);
  const values = valueKeys.map(el => ` ${el}: ${stringify(value[el], depth)}`);
  return `{\n  ${getIndent(depth + 1)} ${_.flatten(values).join('\n')}\n${getIndent(depth + 1)}}`;
};

const renderChangedNode = (depth, key, value, newValue) => {
  const deletedStr = ` ${getIndent(depth)} ${'-'} ${key}: ${stringify(value, depth)}`;
  const addedStr = ` ${getIndent(depth)} ${'+'} ${key}: ${stringify(newValue, depth)}`;
  return [deletedStr, addedStr];
};

const actions = {
  parent: (depth, key, _value, _newValue, children, f) => `${getIndent(depth + 1)}${key}: {\n${f(children, depth + 1)}\n${getIndent(depth + 1)}}`,
  unchanged: (depth, key, value) => ` ${getIndent(depth)} ${' '} ${key}: ${stringify(value, depth)}`,
  changed: (depth, key, value, newValue) => _.flatten(renderChangedNode(depth, key, value, newValue)).join('\n'),
  added: (depth, key, value) => ` ${getIndent(depth)} ${'+'} ${key}: ${stringify(value, depth)}`,
  deleted: (depth, key, value) => ` ${getIndent(depth)} ${'-'} ${key}: ${stringify(value, depth)}`,
};

const renderNode = (node, depth, renderAst) => {
  const {
    type, key, value, newValue, children,
  } = node;
  return actions[type](depth, key, value, newValue, children, renderAst);
};

export default (data) => {
  const renderAst = (ast, depth = 0) => _.flatten(ast.map(obj => renderNode(obj, depth, renderAst))).join('\n');
  return `{\n${renderAst(data)}\n}`;
};

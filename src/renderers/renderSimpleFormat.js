import _ from 'lodash';

const getIndent = (level) => {
  const deepIndent = 4;
  return ' '.repeat(level * deepIndent);
};

const stringify = (value, level) => {
  const valueKeys = Object.keys(value);
  if (!(value instanceof Object)) {
    return value;
  }
  const values = valueKeys.map(el => ` ${el}: ${stringify(value[el], level)}`);
  return `{\n  ${getIndent(level + 1)} ${_.flatten(values).join('\n')}\n${getIndent(level + 1)}}`;
};

const actions = {
  parent: (key, _value, children, indentLevel, f) => `   ${getIndent(indentLevel)} ${key}: {\n${f(children, indentLevel + 1)}\n    ${getIndent(indentLevel)}}`,
  unchanged: (key, value, _children, indentLevel) => ` ${getIndent(indentLevel)} ${' '} ${key}: ${stringify(value, indentLevel)}`,
  changed: (key, value, _children, indentLevel) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(value.keyBefore, indentLevel)}\n ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(value.keyAfter, indentLevel)}`,
  added: (key, value, _children, indentLevel) => ` ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(value, indentLevel)}`,
  deleted: (key, value, _children, indentLevel) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(value, indentLevel)}`,
};

const renderNode = (node, indentLevel, renderAst) => {
  const {
    type, key, value, children,
  } = node;
  return actions[type](key, value, children, indentLevel, renderAst);
};

export default (data) => {
  const renderAst = (ast, indent = 0) => _.flatten(ast.map(obj => renderNode(obj, indent, renderAst))).join('\n');
  return `{\n${renderAst(data)}\n}`;
};

import _ from 'lodash';

const getIndent = (level) => {
  const deepIndent = 4;
  return ' '.repeat(level * deepIndent);
};

const stringify = (value, level) => {
  if (!(value instanceof Object)) {
    return value;
  }
  const valueKeys = Object.keys(value);
  const values = valueKeys.map(el => ` ${el}: ${stringify(value[el], level)}`);
  return `{\n  ${getIndent(level + 1)} ${_.flatten(values).join('\n')}\n${getIndent(level + 1)}}`;
};

const actions = {
  parent: (indentLevel, key, _value, _valueOld, _valueNew, children, f) => `${getIndent(indentLevel + 1)}${key}: {\n${f(children, indentLevel + 1)}\n${getIndent(indentLevel + 1)}}`,
  unchanged: (indentLevel, key, value) => ` ${getIndent(indentLevel)} ${' '} ${key}: ${stringify(value, indentLevel)}`,
  changed: (indentLevel, key, _value, valueOld, valueNew) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(valueOld, indentLevel)}\n ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(valueNew, indentLevel)}`,
  added: (indentLevel, key, value) => ` ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(value, indentLevel)}`,
  deleted: (indentLevel, key, value) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(value, indentLevel)}`,
};

const renderNode = (node, indentLevel, renderAst) => {
  const {
    type, key, value, valueOld, valueNew, children,
  } = node;
  return actions[type](indentLevel, key, value, valueOld, valueNew, children, renderAst);
};

export default (data) => {
  const renderAst = (ast, indent = 0) => _.flatten(ast.map(obj => renderNode(obj, indent, renderAst))).join('\n');
  return `{\n${renderAst(data)}\n}`;
};

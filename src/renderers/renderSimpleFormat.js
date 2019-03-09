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
  parent: (key, _value, _valueOld, _valueNew, children, indentLevel, f) => `${getIndent(indentLevel + 1)}${key}: {\n${f(children, indentLevel + 1)}\n${getIndent(indentLevel + 1)}}`,
  unchanged: (key, value, _valueOld, _valueNew, _children, indentLevel) => ` ${getIndent(indentLevel)} ${' '} ${key}: ${stringify(value, indentLevel)}`,
  changed: (key, _value, valueOld, valueNew, _children, indentLevel) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(valueOld, indentLevel)}\n ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(valueNew, indentLevel)}`,
  added: (key, value, _valueOld, _valueNew, _children, indentLevel) => ` ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(value, indentLevel)}`,
  deleted: (key, value, _valueOld, _valueNew, _children, indentLevel) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(value, indentLevel)}`,
};

const renderNode = (node, indentLevel, renderAst) => {
  const {
    type, key, value, valueOld, valueNew, children,
  } = node;
  return actions[type](key, value, valueOld, valueNew, children, indentLevel, renderAst);
};

export default (data) => {
  const renderAst = (ast, indent = 0) => _.flatten(ast.map(obj => renderNode(obj, indent, renderAst))).join('\n');
  return `{\n${renderAst(data)}\n}`;
};

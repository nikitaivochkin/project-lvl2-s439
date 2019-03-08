import _ from 'lodash';
import { car, cdr } from 'hexlet-pairs';

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

const actions = [
  {
    typeNode: 'parent',
    action: (key, value, indentLevel, f) => `   ${getIndent(indentLevel)} ${key}: {\n${f(value, indentLevel + 1)}\n    ${getIndent(indentLevel)}}`,
  },
  {
    typeNode: 'unchanged',
    action: (key, value, indentLevel) => ` ${getIndent(indentLevel)} ${' '} ${key}: ${stringify(value, indentLevel)}`,
  },
  {
    typeNode: 'changed',
    action: (key, value, indentLevel) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(car(value), indentLevel)}\n ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(cdr(value), indentLevel)}`,
  },
  {
    typeNode: 'added',
    action: (key, value, indentLevel) => ` ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(value, indentLevel)}`,
  },
  {
    typeNode: 'deleted',
    action: (key, value, indentLevel) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(value, indentLevel)}`,
  },
];

const renderNode = (node, indentLevel, renderAst) => {
  const { type, key, value } = node;
  const { action } = actions.find(({ typeNode }) => typeNode === type);
  return action(key, value, indentLevel, renderAst);
};

export default (data) => {
  const renderAst = (ast, indent = 0) => _.flatten(ast.map(obj => renderNode(obj, indent, renderAst))).join('\n');
  return `{\n${renderAst(data)}\n}`;
};

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

const actions = [
  {
    typeNode: 'unchanged',
    action: (key, value, indentLevel) => ` ${getIndent(indentLevel)} ${' '} ${key}: ${stringify(value, indentLevel)}`,
  },
  {
    typeNode: 'changed',
    action: (key, value, indentLevel) => ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(value[0], indentLevel)}\n ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(value[1], indentLevel)}`,
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

const renderNode = (node, indentLevel) => {
  const { type, key, value } = node;
  const { action } = actions.find(({ typeNode }) => typeNode === type);
  return action(key, value, indentLevel);
};

export default (data) => {
  const renderAst = (ast, indent = 0) => _.flatten(ast.map((obj) => {
    const { type, key, value } = obj;
    if (type === 'parent') {
      return `   ${getIndent(indent)} ${key}: {\n${renderAst(value, indent + 1)}\n    ${getIndent(indent)}}`;
    }
    return renderNode(obj, indent);
  })).join('\n');
  return `{\n${renderAst(data)}\n}`;
};

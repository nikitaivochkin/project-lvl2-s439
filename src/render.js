import _ from 'lodash';

const getIndent = level => ' '.repeat(level * 4);

const stringify = (value, level) => {
  const valueKeys = Object.keys(value);
  if (!_.isPlainObject(value)) {
    return value;
  }
  const values = valueKeys.map(el => ` ${el}: ${stringify(value[el], level)}`);
  const resultetValue = _.flatten(values).join('\n');

  return `{\n  ${getIndent(level + 1)} ${resultetValue}\n${getIndent(level + 1)}}`;
};

const renderNode = (node, indentLevel) => {
  const { type, key, value } = node;
  if (type === 'unchanged') {
    return ` ${getIndent(indentLevel)} ${' '} ${key}: ${stringify(value, indentLevel)}`;
  } if (type === 'changed') {
    return ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(value[0], indentLevel)}\n ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(value[1], indentLevel)}`;
  } if (type === 'added') {
    return ` ${getIndent(indentLevel)} ${'+'} ${key}: ${stringify(value, indentLevel)}`;
  } return ` ${getIndent(indentLevel)} ${'-'} ${key}: ${stringify(value, indentLevel)}`;
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

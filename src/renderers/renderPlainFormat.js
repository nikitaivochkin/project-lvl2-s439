import _ from 'lodash';

const renderValue = (value) => {
  if (value instanceof Object) {
    return '[complex value]';
  } if (typeof value === 'string') {
    return `'${value}'`;
  } return value;
};

const iter = (el, ancestry, acc, str) => {
  const newAncestry = [...ancestry, el.key];
  const childrenValues = Object.values({ ...el.children });
  const newAcc = childrenValues.reduce((nAcc, nn) => iter(nn, newAncestry, nAcc, str), acc);
  return [...newAcc, newAncestry].filter(e => e.includes(str));
};

const buildPath = (ast, str) => ast.map(obj => iter(obj, '', [], str));

const actions = {
  parent: (_data, key, _value, _newValue, children, f) => f(children, key),
  unchanged: () => null,
  changed: (data, key, value, newValue) => `Property '${_.flattenDeep(buildPath(data, key)).join('.')}' was updated. From ${renderValue(value)} to ${renderValue(newValue)}`,
  added: (data, key, value) => `Property '${_.flattenDeep(buildPath(data, key)).join('.')}' was added with value: ${renderValue(value)}`,
  deleted: (data, key) => `Property '${_.flattenDeep(buildPath(data, key)).join('.')}' was removed`,
};

const renderNode = (data, node, renderAst) => {
  const {
    type, key, value, newValue, children,
  } = node;
  return actions[type](data, key, value, newValue, children, renderAst);
};

export default (data) => {
  const renderAst = ast => _.flatten(ast.map(obj => renderNode(data, obj, renderAst)));
  return renderAst(data).filter(el => el !== null).join('\n');
};

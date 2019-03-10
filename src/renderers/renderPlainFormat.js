import _ from 'lodash';

const renderValue = (value) => {
  if (value instanceof Object) {
    return '[complex value]';
  } if (typeof value === 'string') {
    return `'${value}'`;
  } return value;
};

const buildPath = (ast, str) => _.flattenDeep(ast.map((obj) => {
  const iter = (node, ancestry, acc) => {
    const newAncestry = [...ancestry, node.key];
    const newAcc = Object.values({ ...node.children })
      .reduce((nAcc, nn) => iter(nn, newAncestry, nAcc), acc);
    return node.key === str ? [...newAcc, newAncestry] : newAcc;
  };
  return iter(obj, '', []);
})).join('.');

const actions = {
  parent: (_data, key, _value, _newValue, children, f) => f(children, key),
  unchanged: () => null,
  changed: (data, key, value, newValue) => `Property '${buildPath(data, key)}' was updated. From ${renderValue(value)} to ${renderValue(newValue)}`,
  added: (data, key, value) => `Property '${buildPath(data, key)}' was added with value: ${renderValue(value)}`,
  deleted: (data, key) => `Property '${buildPath(data, key)}' was removed`,
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

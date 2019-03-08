import _ from 'lodash';

const renderValue = (value) => {
  if (value instanceof Object) {
    return '[complex value]';
  } return typeof value === 'string' ? `'${value}'` : value;
};

const iter = (el, ancestry, acc, str) => {
  const newAncestry = [...ancestry, el.key];
  if (el.type === 'parent') {
    return el.children.reduce((nAcc, nn) => iter(nn, newAncestry, nAcc, str), acc);
  }
  return el.key.includes(str) ? [...acc, newAncestry] : acc;
};

const buildPath = (ast, str) => ast.map(obj => iter(obj, '', [], str));

const actions = {
  parent: (_data, key, _value, children, f) => f(children, key),
  unchanged: () => null,
  changed: (data, key, value) => `Property '${_.flattenDeep(buildPath(data, key)).join('.')}' was updated. From ${renderValue(value.keyBefore)} to ${renderValue(value.keyAfter)}`,
  added: (data, key, value) => `Property '${_.flattenDeep(buildPath(data, key)).join('.')}' was added with value: ${renderValue(value)}`,
  deleted: (data, key) => `Property '${_.flattenDeep(buildPath(data, key)).join('.')}' was removed`,
};

const renderNode = (data, node, renderAst) => {
  const {
    type, key, value, children,
  } = node;
  return actions[type](data, key, value, children, renderAst);
};

export default (data) => {
  const renderAst = ast => _.flatten(ast.map(obj => renderNode(data, obj, renderAst)));
  return renderAst(data).filter(el => el !== null).join('\n');
};

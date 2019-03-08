import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import findParser from './parsers';
import renderAst from './renderers';

const actions = [
  {
    type: 'parent',
    check: (objBefore, objAfter, cKey) => objBefore[cKey] instanceof Object
      && objAfter[cKey] instanceof Object,
    action: (valueBefore, valueAfter, func) => func(valueBefore, valueAfter),
  },
  {
    type: 'added',
    check: (objBefore, ObjAfter, cKey) => !_.has(objBefore, cKey) && _.has(ObjAfter, cKey),
    action: (_valueBefore, valueAfter) => valueAfter,
  },
  {
    type: 'deleted',
    check: (objBefore, ObjAfter, cKey) => _.has(objBefore, cKey) && !_.has(ObjAfter, cKey),
    action: _.identity,
  },
  {
    type: 'unchanged',
    check: (objBefore, objAfter, cKey) => (objBefore[cKey] === objAfter[cKey]),
    action: _.identity,
  },
  {
    type: 'changed',
    check: (objBefore, objAfter, cKey) => (objBefore[cKey] !== objAfter[cKey]),
    action: (valueBefore, valueAfter) => ({ keyBefore: valueBefore, keyAfter: valueAfter }),
  },
];

export default (pathFileBefore, pathFileAfter, format = 'simple') => {
  const objBefore = findParser(path.extname(pathFileBefore))(fs.readFileSync(pathFileBefore, 'utf8'));
  const objAfter = findParser(path.extname(pathFileBefore))(fs.readFileSync(pathFileAfter, 'utf8'));

  const builderAst = (dataBefore, dataAfter) => {
    const keysBefore = Object.keys(dataBefore);
    const keysAfter = Object.keys(dataAfter);
    const unionKeys = _.union(keysBefore, keysAfter);
    const ast = unionKeys.reduce((acc, key) => {
      const { type, action } = actions.find(({ check }) => check(dataBefore, dataAfter, key));
      const root = {
        type,
        key,
        value: type === 'parent' ? [] : action(dataBefore[key], dataAfter[key]),
        children: type === 'parent' ? action(dataBefore[key], dataAfter[key], builderAst) : [],
      };
      return [...acc, root];
    }, []);
    return ast;
  };
  return renderAst(builderAst(objBefore, objAfter), format);
};

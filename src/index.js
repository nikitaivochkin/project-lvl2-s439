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
    action: (valueBefore, valueAfter, func) => ({ children: func(valueBefore, valueAfter) }),
  },
  {
    type: 'added',
    check: (objBefore, ObjAfter, cKey) => !_.has(objBefore, cKey) && _.has(ObjAfter, cKey),
    action: (_valueBefore, valueAfter) => ({ value: valueAfter }),
  },
  {
    type: 'deleted',
    check: (objBefore, ObjAfter, cKey) => _.has(objBefore, cKey) && !_.has(ObjAfter, cKey),
    action: valueBefore => ({ value: valueBefore }),
  },
  {
    type: 'unchanged',
    check: (objBefore, objAfter, cKey) => (objBefore[cKey] === objAfter[cKey]),
    action: (_valueBefore, valueAfter) => ({ value: valueAfter }),
  },
  {
    type: 'changed',
    check: (objBefore, objAfter, cKey) => (objBefore[cKey] !== objAfter[cKey]),
    action: (valueBefore, valueAfter) => ({ value: valueBefore, valueNew: valueAfter }),
  },
];

export default (pathFileBefore, pathFileAfter, format = 'simple') => {
  const objBefore = findParser(path.extname(pathFileBefore))(fs.readFileSync(pathFileBefore, 'utf8'));
  const objAfter = findParser(path.extname(pathFileBefore))(fs.readFileSync(pathFileAfter, 'utf8'));

  const builderAst = (dataBefore, dataAfter) => {
    const keysBefore = Object.keys(dataBefore);
    const keysAfter = Object.keys(dataAfter);
    const unionKeys = _.union(keysBefore, keysAfter);
    const ast = unionKeys.map((key) => {
      const { type, action } = actions.find(({ check }) => check(dataBefore, dataAfter, key));
      return { type, key, ...action(dataBefore[key], dataAfter[key], builderAst) };
    });
    return ast;
  };
  return renderAst(builderAst(objBefore, objAfter), format);
};

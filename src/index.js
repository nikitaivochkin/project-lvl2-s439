import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import findParser from './parsers';
import renderAst from './render';


const actions = [
  {
    type: 'parent',
    check: (objBefore, objAfter, cKey) => objBefore[cKey] instanceof Object
      && objAfter[cKey] instanceof Object,
    action: (valueBefore, valueAfter, func) => func(valueBefore, valueAfter),
  },
  {
    type: 'unchanged',
    check: (objBefore, objAfter, cKey) => (_.has(objBefore, cKey) && _.has(objAfter, cKey))
      && (objBefore[cKey] === objAfter[cKey]),
    action: _.identity,
  },
  {
    type: 'changed',
    check: (objBefore, objAfter, cKey) => (_.has(objBefore, cKey) && _.has(objAfter, cKey))
      && (objBefore[cKey] !== objAfter[cKey]),
    action: (valueBefore, valueAfter) => [valueBefore, valueAfter],
  },
  {
    type: 'added',
    check: (objBefore, ObjAfter, cKey) => !_.has(objBefore, cKey) && _.has(ObjAfter, cKey),
    action: (valueBefore, valueAfter) => valueAfter,
  },
  {
    type: 'deleted',
    check: (objBefore, ObjAfter, cKey) => _.has(objBefore, cKey) && !_.has(ObjAfter, cKey),
    action: valueBefore => valueBefore,
  },
];

export default (pathFileBefore, pathFileAfter) => {
  const objFileBefore = findParser(path.extname(pathFileBefore))(fs.readFileSync(pathFileBefore, 'utf8'));
  const objFileAfter = findParser(path.extname(pathFileBefore))(fs.readFileSync(pathFileAfter, 'utf8'));

  const builderAst = (objBefore, objAfter) => {
    const keysBefore = Object.keys(objBefore);
    const keysAfter = Object.keys(objAfter);
    const unionKeys = _.union(keysBefore, keysAfter);
    const ast = unionKeys.reduce((acc, key) => {
      const { type, action } = actions.find(({ check }) => check(objBefore, objAfter, key));
      const root = {
        type,
        key,
        value: action(objBefore[key], objAfter[key], builderAst),
      };
      return [...acc, root];
    }, []);
    return ast;
  };
  return renderAst(builderAst(objFileBefore, objFileAfter));
};

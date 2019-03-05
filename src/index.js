import fs from 'fs';
import _ from 'lodash';

const conditions = [
  {
    check: (keysBefore, keysAfter, cKey) => (_.has(keysBefore, cKey) && _.has(keysAfter, cKey)),
    action: (keysBefore, keysAfter, cKey) => {
      if (keysBefore[cKey] === keysAfter[cKey]) {
        return [{ flag: ' ', cKey, value: keysBefore[cKey] }];
      } return [{ flag: '-', cKey, value: keysBefore[cKey] },
        { flag: '+', cKey, value: keysAfter[cKey] }];
    },
  },
  {
    check: (keysBefore, keysAfter, cKey) => (_.has(keysBefore, cKey) && !_.has(keysAfter, cKey)),
    action: (keysBefore, keysAfter, cKey) => ([{ flag: '-', cKey, value: keysBefore[cKey] }]),
  },
  {
    check: (keysBefore, keysAfter, cKey) => (!_.has(keysBefore, cKey) && _.has(keysAfter, cKey)),
    action: (keysBefore, keysAfter, cKey) => ([{ flag: '+', cKey, value: keysAfter[cKey] }]),
  },
];

export default (pathFileBefore, pathFileAfter) => {
  const objFileBefore = JSON.parse(fs.readFileSync(pathFileBefore, 'utf8'));
  const objFileAfter = JSON.parse(fs.readFileSync(pathFileAfter, 'utf8'));
  const keysBefore = Object.keys(objFileBefore);
  const keysAfter = Object.keys(objFileAfter);
  const unionKeys = _.union(keysBefore, keysAfter);

  const mapped = unionKeys.map((key) => {
    const { action } = conditions.find(({ check }) => check(objFileBefore, objFileAfter, key));
    return action(objFileBefore, objFileAfter, key);
  });
  const getResult = ast => ast.map(el => el.map(obj => `  ${obj.flag} ${obj.cKey}: ${obj.value}`).join('\n'));

  return `{\n${getResult(mapped).join('\n')}\n}`;
};

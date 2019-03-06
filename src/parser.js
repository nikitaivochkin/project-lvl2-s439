import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parsersActions = [
  {
    check: pathToFile => (path.extname(pathToFile) === '.json'),
    action: pathToFile => (JSON.parse(fs.readFileSync(pathToFile, 'utf8'))),
  },
  {
    check: pathToFile => (path.extname(pathToFile) === '.yaml'),
    action: pathToFile => (yaml.safeLoad(fs.readFileSync(pathToFile, 'utf8'))),
  },
];
export default pathToFile => parsersActions.find(({ check }) => check(pathToFile));

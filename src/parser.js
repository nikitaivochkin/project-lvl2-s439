import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsersAction = [
  {
    check: pathToFile => (path.extname(pathToFile) === '.json'),
    action: pathToFile => (JSON.parse(fs.readFileSync(pathToFile, 'utf8'))),
  },
  {
    check: pathToFile => (path.extname(pathToFile) === '.yaml'),
    action: pathToFile => (yaml.safeLoad(fs.readFileSync(pathToFile, 'utf8'))),
  },
  {
    check: pathToFile => (path.extname(pathToFile) === '.ini'),
    action: pathToFile => (ini.parse(fs.readFileSync(pathToFile, 'utf8'))),
  },
];
export default pathToFile => parsersAction.find(({ check }) => check(pathToFile));

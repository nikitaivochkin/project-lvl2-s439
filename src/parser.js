import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsersAction = [
  {
    check: pathToFile => (path.extname(pathToFile) === '.json'),
    parser: JSON.parse,
  },
  {
    check: pathToFile => (path.extname(pathToFile) === '.yaml'),
    parser: yaml.safeLoad,
  },
  {
    check: pathToFile => (path.extname(pathToFile) === '.ini'),
    parser: ini.parse,
  },
];
export default pathToFile => parsersAction.find(({ check }) => check(pathToFile)).parser;

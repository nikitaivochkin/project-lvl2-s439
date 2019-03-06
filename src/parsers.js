import yaml from 'js-yaml';
import ini from 'ini';

const parsersAction = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default dataType => parsersAction[dataType];

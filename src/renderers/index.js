import renderSimpleFormat from './renderSimpleFormat';
import renderPlainFormat from './renderPlainFormat';
import renderJsonFormat from './renderJsonFormat';

const renderFormats = {
  simple: renderSimpleFormat,
  plain: renderPlainFormat,
  json: renderJsonFormat,
};

export default (ast, format) => renderFormats[format](ast);

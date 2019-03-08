import renderSimpleFormat from './renderSimpleFormat';
import renderPlainFormat from './renderPlainFormat';

const renderFormats = {
  simple: renderSimpleFormat,
  plain: renderPlainFormat,
};

export default (ast, format) => renderFormats[format](ast);

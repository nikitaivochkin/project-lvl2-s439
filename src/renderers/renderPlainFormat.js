// import _ from 'lodash';
// import { car, cdr } from 'hexlet-pairs';

// const actions = [
//   {
//     typeNode: 'parent',
//     action: (key, value, f) => 
//   },
//   {
//     typeNode: 'unchanged',
//     action: (key, value) => 
//   },
//   {
//     typeNode: 'changed',
//     action: (key, value) => `Prorerty '${key}' was updated. From ${car(value)} to ${cdr(value)}`
//   },
//   {
//     typeNode: 'added',
//     action: (key, value) => `Prorerty '${key}' was added`
//   },
//   {
//     typeNode: 'deleted',
//     action: (key, value) => ,
//   },
// ];

// const renderNode = (node, renderAst) => {
//   const { type, key, value } = node;
//   const { action } = actions.find(({ typeNode }) => typeNode === type);
//   return action(key, value, renderAst);
// };

// export default (data) => {
//   const renderAst = ast => _.flatten(ast.map(obj => renderNode(obj)).join('\n'));
//   return renderAst(data);
// };

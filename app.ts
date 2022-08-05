import * as babel from "@babel/core";
import { CreateASTFromSourceCode } from "./transfiler/ast/BuildAST";

// const code = `
// var x: string | string;

// x = 'zxcv';

// function foo(a: string, b: string): number {

// }
// `;

// // console.log(
// //   (CreateASTFromSourceCode(code)![0] as babel.types.FunctionDeclaration)
// //     .params[0].typeAnnotation
// // );

// console.log(
//   (CreateASTFromSourceCode(code)![0] as babel.types.VariableDeclaration)
//     .declarations
// );

const sourceCode = `const {a, b, c} = {a: "4", b: 4, c: b()};`;
const ast = CreateASTFromSourceCode(sourceCode)!;

console.log((ast[0] as babel.types.VariableDeclaration).declarations[0]);

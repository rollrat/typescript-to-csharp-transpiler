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

const sourceCode = `const {a, b, c, ... r} = {a: "4", b: 4, c: b()};`;
// const sourceCode = `const s: number = 0`;
const ast = CreateASTFromSourceCode(sourceCode)!;

console.log(
  (
    (ast.program.body[0] as babel.types.VariableDeclaration).declarations[0]
      .id as babel.types.ObjectPattern
  ).properties[3]
);

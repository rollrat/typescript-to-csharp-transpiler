import { CreateASTFromSourceCode } from "../ast/BuildAST";
import { Traverse } from "../ast/Traverse";
import { CSFunctionDeclaration } from "./FunctionDeclaration";

function fdTest(sourceCode: string): string[] {
  const ast = CreateASTFromSourceCode(sourceCode)!;

  Traverse(ast);

  return (ast.program.body[0].extra!["ts-cs"]! as CSFunctionDeclaration)
    .emitStr()
    .trim()
    .split("\n");
}

test("Function Declaration: Simple", () => {
  const sourceCode = "function foo() { }";
  const result = fdTest(sourceCode);

  expect(result[0]).toBe("void foo() { }");
});

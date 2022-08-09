import { CreateASTFromSourceCode } from "./BuildAST";

test("CreateASTFromSourceCode", () => {
  const sourceCode = "const s: number = 0";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  expect(ast.program.body[0].type).toBe("VariableDeclaration");
});

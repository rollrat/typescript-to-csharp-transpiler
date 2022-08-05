import { CreateASTFromSourceCode } from ".";

test("CreateASTFromSourceCode", () => {
  const sourceCode = "const s: number = 0";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  expect(ast[0].type).toBe("VariableDeclaration");
});

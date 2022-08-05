import { CreateASTFromSourceCode } from ".";
import { EmitVariableDeclaration } from "./emitter/VariableDeclarationEmitter";

test("CreateASTFromSourceCode", () => {
  const sourceCode = "const s: number = 0";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  expect(ast[0].type).toBe("VariableDeclaration");
});

test("Emit Variable Declaration", () => {
  const sourceCode = "const s: number = 0";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );

  expect(result).toBe("const int s = 0;");
});

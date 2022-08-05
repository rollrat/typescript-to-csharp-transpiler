import { CreateASTFromSourceCode } from "../ast/BuildAST";
import { EmitVariableDeclaration } from "./VariableDeclarationEmitter";

test("Variable Declaration: Simple", () => {
  const sourceCode = "const s: number = 0";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );

  expect(result[0]).toBe("const int s = 0;");
});

test("Variable Declaration: Multi Variable", () => {
  const sourceCode = "const s,b,d: number = 0";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );

  expect(result[0]).toBe(`const var s;`);
  expect(result[1]).toBe(`const var b;`);
  expect(result[2]).toBe(`const int d = 0;`);
});

test("Variable Declaration: Infer Type", () => {
  const sourceCode = "const s = 'A,B'.split(',')";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );

  expect(result[0]).toBe(`const String[] s = "A,B".Split(",");`);
});

test("Variable Declaration: Infer Type Enable Var", () => {
  const sourceCode = "const s = 'A,B'.split(',')";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );

  expect(result[0]).toBe(`const var s = "A,B".Split(",");`);
});

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
  const sourceCode = "const a = 'asdf', d: number = 0";
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );

  expect(result[0]).toBe(`const String a = "asdf";`);
  expect(result[1]).toBe(`const int d = 0;`);
});

test("Variable Declaration: Map Expression 1", () => {
  const sourceCode = `const {a, b, c} = {a: "4", b: 4, c: b()};`;
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );

  expect(result[0]).toBe(`const String a = "4";`);
  expect(result[1]).toBe(`const int b = 4;`);
  expect(result[2]).toBe(`const var c = b();`);
});

test("Variable Declaration: Map Expression 2", () => {
  const sourceCode = `const {a, b, c} = foo()`;
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );
});

test("Variable Declaration: Map Expression 3", () => {
  const sourceCode = `const {a, b, c} = { a: "a", ...foo() }`;
  const ast = CreateASTFromSourceCode(sourceCode)!;

  const result = EmitVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );
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

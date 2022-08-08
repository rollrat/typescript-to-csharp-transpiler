import { CreateASTFromSourceCode } from "../ast/BuildAST";
import CSVariableDeclaration from "./VariableDeclaration";

function vdTest(sourceCode: string): string[] {
  const ast = CreateASTFromSourceCode(sourceCode)!;
  const result = new CSVariableDeclaration(
    ast[0] as babel.types.VariableDeclaration
  );

  return result.emitStr().trim().split("\n");
}

/* Success */
test("Variable Declaration: Simple", () => {
  const sourceCode = "const s: number = 0";
  const result = vdTest(sourceCode);

  expect(result[0]).toBe("const int s = 0;");
});

/* Success */
test("Variable Declaration: Multi Variable", () => {
  const sourceCode = "const a = 'asdf', d: number = 0";
  const result = vdTest(sourceCode);

  expect(result[0]).toBe(`const String a = "asdf";`);
  expect(result[1]).toBe(`const int d = 0;`);
});

/* Success */
test("Variable Declaration: Map Expression 1", () => {
  const sourceCode = `const {a, b, c} = {a: "4", b: 4, c: b()};`;
  const result = vdTest(sourceCode);

  expect(result[0]).toBe(`const String a = "4";`);
  expect(result[1]).toBe(`const int b = 4;`);
  expect(result[2]).toBe(`const var c = b();`);
});

/* Success */
test("Variable Declaration: Map Expression 2", () => {
  const sourceCode = `const {a, b, c} = foo`;
  const result = vdTest(sourceCode);

  expect(result[0]).toBe(`const var a = foo.a;`);
  expect(result[1]).toBe(`const var b = foo.b;`);
  expect(result[2]).toBe(`const var c = foo.c;`);
});

/* Success */
test("Variable Declaration: Map Expression 3", () => {
  const sourceCode = `const {a, b, c} = foo()`;
  const result = vdTest(sourceCode);

  expect(result[0]).toMatch(/const var \w+ = foo\(\);/);
  expect(result[1]).toMatch(/const var a = \w+.a;/);
  expect(result[2]).toMatch(/const var b = \w+.b;/);
  expect(result[3]).toMatch(/const var c = \w+.c;/);
});

test("Variable Declaration: Map Expression 4", () => {
  const sourceCode = `const {a, b, c} = { a: "a", ...foo() }`;
  const result = vdTest(sourceCode);
});

test("Variable Declaration: Infer Type", () => {
  const sourceCode = "const s = 'A,B'.split(',')";
  const result = vdTest(sourceCode);

  expect(result[0]).toBe(`const String[] s = "A,B".Split(",");`);
});

test("Variable Declaration: Infer Type Enable Var", () => {
  const sourceCode = "const s = 'A,B'.split(',')";
  const result = vdTest(sourceCode);

  expect(result[0]).toBe(`const var s = "A,B".Split(",");`);
});

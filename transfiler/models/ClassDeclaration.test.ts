import { CreateASTFromSourceCode } from "../ast/BuildAST";
import { Traverse } from "../ast/Traverse";
import CSClassDeclaration from "./ClassDeclaration";

function cdTest(sourceCode: string): string[] {
  const ast = CreateASTFromSourceCode(sourceCode)!;

  Traverse(ast);

  return (ast.program.body[0].extra!["ts-cs"]! as CSClassDeclaration)
    .emitStr()
    .trim()
    .split("\n");
}

test("Class Declaration: Simple", () => {
  const sourceCode = "class foo { }";
  const result = cdTest(sourceCode);

  expect(result[0]).toBe("class foo { }");
});

test("Class Declaration: Inherit Interface", () => {
  const sourceCode = "class foo implements foo2 { }";
  const result = cdTest(sourceCode);

  expect(result[0]).toBe("class foo : foo2 { }");
});

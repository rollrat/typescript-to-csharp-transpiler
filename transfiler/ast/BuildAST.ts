import * as babel from "@babel/core";

export function CreateASTFromSourceCode(
  sourceCode: string
): babel.types.File | null | undefined {
  const parsedAst = babel.parseSync(sourceCode, {
    parserOpts: {
      allowReturnOutsideFunction: true,
      plugins: ["typescript"],
    },
  });

  const options = { ast: true } as babel.TransformOptions;

  const { code, map, ast } = babel.transformFromAstSync(
    parsedAst!,
    sourceCode,
    options!
  )!;

  return ast;
}

export function EmitLiteral() {}

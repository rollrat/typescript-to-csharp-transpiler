import * as babel from "@babel/core";

export function CreateASTFromSourceCode(
  sourceCode: string
): babel.types.Statement[] | undefined {
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

  return ast?.program.body;
}

export function EmitLiteral() {}

class CSModule {
  usings: string[] = [];

  // Push External Module like
  // System.Threading
  addExternalModule(modName: string) {
    this.usings.push(modName);
  }
}

class CSContext {}

export default class CSTransfiler {}

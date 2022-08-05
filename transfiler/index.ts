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

/*
This transfiler follow this step

1. Build Typescript AST
  using bable typescript plugin

2. Sementic Analysis
  process adding necessary modules and type inference, type lowering
  finds a type or syntax that cannot be transpiled.
  these are later split into override functions or return an error to the user.

3. Static Analysis
  find expensive methods or loops.

4. Code Transform for Optimizing
  remove unnecessary code and optimize code
  like loop unroll etc...

5. Emit to CSharp Code
*/
export default class CSTransfiler {}

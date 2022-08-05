import * as babel from "@babel/core";

const s: number = 0;

const sourceCode = "const s: number = 0";
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

console.log(ast);

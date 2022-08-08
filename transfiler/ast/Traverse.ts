import { traverse } from "@babel/core";

// https://babeljs.io/docs/en/babel-traverse
export function Traverse(ast: babel.types.File) {
  traverse(ast, {
    enter(path) {
      if (path.isIdentifier({ name: "n" })) {
        path.node.name = "x";
      }
    },
    VariableDeclaration: function (path) {
      // path.node.extra["ts-cs"] = "";
    },
  });
}

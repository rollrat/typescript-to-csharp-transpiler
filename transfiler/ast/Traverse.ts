import { traverse } from "@babel/core";
import CSVariableDeclaration from "../models/VariableDeclaration";

// https://babeljs.io/docs/en/babel-traverse
export function Traverse(ast: babel.types.File) {
  traverse(ast, {
    enter(path) {
      if (path.isIdentifier({ name: "n" })) {
        path.node.name = "x";
      }
    },
    VariableDeclaration: function (path) {
      if (path.node.extra === undefined) path.node.extra = {};
      path.node.extra["ts-cs"] = new CSVariableDeclaration(path);
    },
  });
}

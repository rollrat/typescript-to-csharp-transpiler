import { emit } from "process";
import CSExpression from "./Expression";
import { CSFunction } from "./Function";
import { CSModule } from "./Module";

export default class CSVariableDeclaration {
  constructor(
    func: CSFunction,
    private variableDeclaration: babel.types.VariableDeclaration
  ) {
    this.variableDeclaration.declarations.forEach((x) =>
      this._visitVariableDeclarator(this.variableDeclaration.kind, x)
    );
  }

  private decls: CSVariableDeclarator[] = [];

  emit() {}

  _visitVariableDeclarator(
    kind: "var" | "let" | "const",
    vd: babel.types.VariableDeclarator
  ) {
    switch (vd.id.type) {
      case "Identifier":
        const id = vd.id as babel.types.Identifier;
        const name = id.name;
        let etype = "var";
        let expression: CSExpression | undefined;

        if (vd.init !== null) {
          const type = vd.init!.type;

          if (type !== null) {
            switch (type) {
              case "NumericLiteral":
                etype = "int";
                break;

              case "StringLiteral":
                etype = "String";
                break;
            }
          }
        } else {
          /* infer type if possible */
        }

        this.decls.push(
          new CSVariableDeclarator(kind, name, etype, expression)
        );
        break;
    }
  }
}

/* Unlike js, it has only one variable. */
class CSVariableDeclarator {
  constructor(
    public kind: any,
    public name: any,
    public type: any,
    public init?: CSExpression
  ) {}

  emit() {
    /* First, check expression must emitting */
    /* Second, emit this */
  }
}

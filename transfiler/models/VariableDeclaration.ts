import { emit } from "process";
import CSEmitter from "../emitter/Emitter";
import CSExpression from "./Expression";
import { CSFunction } from "./Function";
import IEmitterable from "./IEmitterable";
import { CSModule } from "./Module";

export default class CSVariableDeclaration implements IEmitterable {
  constructor(
    // func: CSFunction,
    private variableDeclaration: babel.types.VariableDeclaration
  ) {
    this.variableDeclaration.declarations.forEach((x) =>
      this.visitVariableDeclarator(this.variableDeclaration.kind, x)
    );
  }

  private decls: CSVariableDeclarator[] = [];

  emit(emitter: CSEmitter) {
    this.decls.forEach((e) => e.emit(emitter));
  }

  emitStr(): string {
    let p = "";
    this.decls.forEach((e) => (p += `${e.emitStr()}\n`));
    return p;
  }

  private visitVariableDeclarator(
    kind: "var" | "let" | "const",
    vd: babel.types.VariableDeclarator
  ) {
    switch (vd.id.type) {
      case "Identifier":
        // ex: var str: string = 'ASDF';
        this.visitIdentifier(kind, vd);
        break;

      case "MemberExpression":
        break;

      case "ObjectPattern":
        // ex: const {a, b, c} = {b: 4, a: "4", c: b()};
        break;

      case "ArrayPattern":
        // ex: const [a] = 'ASDF';
        break;
    }
  }

  private visitIdentifier(
    kind: "var" | "let" | "const",
    vd: babel.types.VariableDeclarator
  ) {
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

      expression = new CSExpression(vd.init!);
    } else {
      /* infer type if possible */
    }

    this.decls.push(new CSVariableDeclarator(kind, name, etype, expression));
  }
}

/* Unlike js, it has only one variable. */
class CSVariableDeclarator implements IEmitterable {
  constructor(
    public kind: any,
    public name: any,
    public type: any,
    public init?: CSExpression
  ) {}

  emit(emitter: CSEmitter) {
    emitter.println(this.emitStr());
  }

  emitStr(): string {
    let p = "";
    if (this.kind === "const") p += this.kind + " ";
    p += this.type + " ";
    p += this.name + " ";

    if (this.init !== undefined) {
      p += `= ${this.init.emitStr()}`;
    }
    p += ";";

    return p;
  }
}

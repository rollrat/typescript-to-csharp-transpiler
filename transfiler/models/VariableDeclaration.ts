import { randomInt } from "crypto";
import { emit } from "process";
import CSEmitter from "../emitter/Emitter";
import {
  ComplementStringArray,
  EqualStringArraySet,
  IntersectStringArray,
} from "../utils/ArrayUtil";
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
        // ex: const {a, b, c} = foo();
        // ex: const {a, b, c} = {b, ...foo()};
        // ex: const {a, ...rest} = {b, ...foo()};
        this.visitObjectPattern(kind, vd);
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
      etype = this.extractRawTypeFromExpression(vd.init!);
      expression = new CSExpression(vd.init!);
    } else {
      /* infer type if possible */
    }

    this.decls.push(new CSVariableDeclarator(kind, name, etype, expression));
  }

  private visitObjectPattern(
    kind: "var" | "let" | "const",
    vd: babel.types.VariableDeclarator
  ) {
    const op = vd.id as babel.types.ObjectPattern;
    const propertyCount = op.properties.length;

    const includeRest = op.properties.some((p) => p.type === "RestElement");

    const leftIds = op.properties
      .filter((p) => p.type === "ObjectProperty")
      .map((p) => p as babel.types.ObjectProperty)
      .filter((p) => p.key.type === "Identifier")
      .map((p) => p.key as babel.types.Identifier);

    if (vd.init !== null) {
      switch (vd.init!.type) {
        // ex: const {a, b, c} = {a: "4", b: 4, c: b()};
        case "ObjectExpression":
          const oe = vd.init as babel.types.ObjectExpression;
          const rights = oe.properties
            .filter((p) => p.type === "ObjectProperty")
            .map((p) => p as babel.types.ObjectProperty)
            .filter((p) => p.key.type === "Identifier");
          const rightIds = rights.map((p) => p.key as babel.types.Identifier);
          const rightValues = rights.map((p) => p.value);

          const intersect = IntersectStringArray(
            leftIds.map((e) => e.name),
            rightIds.map((e) => e.name)
          );

          if (intersect.length > 0) {
            intersect.forEach((p) => {
              const l = leftIds[p.a];

              let expression: CSExpression | undefined;
              let etype = "var";

              if (rightValues[p.b].type === "RestElement")
                throw new Error("Semantic Error!");
              else {
                const re = rightValues[p.b] as babel.types.Expression;
                etype = this.extractRawTypeFromExpression(re);
                expression = new CSExpression(re);
              }

              this.decls.push(
                new CSVariableDeclarator(kind, l.name, etype, expression)
              );
            });
          }

          const complement = ComplementStringArray(
            leftIds.map((e) => e.name),
            rightIds.map((e) => e.name)
          );

          if (complement.length > 0) {
            // these will be from rests...
          }

          break;

        // ex: const {a, b, c, ...rest} = foo;
        case "Identifier":
          const id = vd.init! as babel.types.Identifier;

          leftIds.forEach((e) => {
            this.decls.push(
              new CSVariableDeclarator(
                kind,
                e.name,
                "var",
                `${id.name}.${e.name}`
              )
            );
          });

          if (includeRest) {
            // how to handle this?
          }

          break;

        // ex: const {a, b, c, ...rest} = foo();
        case "CallExpression":
          const ce = vd.init! as babel.types.CallExpression;
          const init = new CSExpression(ce);
          const tname = "tmp" + randomInt(10000, 100000).toString();

          this.decls.push(new CSVariableDeclarator(kind, tname, "var", init));

          leftIds.forEach((e) => {
            this.decls.push(
              new CSVariableDeclarator(
                kind,
                e.name,
                "var",
                `${tname}.${e.name}`
              )
            );
          });

          break;
      }
    }
  }

  private extractRawTypeFromExpression(expr: babel.types.Expression) {
    switch (expr.type) {
      case "NumericLiteral":
        return "int";

      case "StringLiteral":
        return "String";
    }

    return "var";
  }
}

/* Unlike js, it has only one variable. */
class CSVariableDeclarator implements IEmitterable {
  constructor(
    public kind: any,
    public name: any,
    public type: any,
    public init?: CSExpression | string
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
      if (typeof this.init === "string") p += `= ${this.init}`;
      else p += `= ${this.init.emitStr()}`;
    }
    p += ";";

    return p;
  }
}

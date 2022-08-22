import { NodePath } from "@babel/traverse";
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
    private variableDeclaration: NodePath<babel.types.VariableDeclaration>
  ) {
    this.variableDeclaration.traverse({
      VariableDeclarator: (path) =>
        this.visitVariableDeclarator(this.variableDeclaration.node.kind, path),
    });
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
    vd: NodePath<babel.types.VariableDeclarator>
  ) {
    switch (vd.node.id.type) {
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
    vd: NodePath<babel.types.VariableDeclarator>
  ) {
    const id = vd.node.id as babel.types.Identifier;
    const name = id.name;
    let etype = "var";
    let expression: CSExpression | undefined;

    if (vd.node.init !== null) {
      etype = this.extractRawTypeFromExpression(vd.node.init!);
      expression = new CSExpression(vd.node.init!);
    } else {
      /* infer type if possible */
    }

    this.decls.push(new CSVariableDeclarator(kind, name, etype, expression));
  }

  private visitObjectPattern(
    kind: "var" | "let" | "const",
    vd: NodePath<babel.types.VariableDeclarator>
  ) {
    const op = vd.node.id as babel.types.ObjectPattern;
    const propertyCount = op.properties.length;

    const includeRest = op.properties.some((p) => p.type === "RestElement");

    const leftIds = op.properties
      .filter((p) => p.type === "ObjectProperty")
      .map((p) => p as babel.types.ObjectProperty)
      .filter((p) => p.key.type === "Identifier")
      .map((p) => p.key as babel.types.Identifier);

    if (vd.node.init !== null) {
      switch (vd.node.init!.type) {
        // ex: const {a, b, c} = {a: "4", b: 4, c: b()};
        case "ObjectExpression":
          this.visitObjectPatternObjectExpression(
            kind,
            vd.node.init as babel.types.ObjectExpression,
            leftIds
          );
          break;

        // ex: const {a, b, c, ...rest} = foo;
        case "Identifier":
          this.visitObjectPatternIdentifier(
            kind,
            op,
            vd.node.init! as babel.types.Identifier,
            leftIds,
            includeRest
          );
          break;

        // ex: const {a, b, c, ...rest} = foo();
        case "CallExpression":
          this.visitObjectPatternCallExpression(
            kind,
            op,
            vd.node.init! as babel.types.CallExpression,
            leftIds,
            includeRest
          );
          break;
      }
    }
  }

  /**
   * Terminal Processor
   * ex) const {a, b, c} = {a: "4", b: 4, c: b()};
   * @desc
   * @param kind
   * @param oe
   * @param leftIds
   */
  private visitObjectPatternObjectExpression(
    kind: "var" | "let" | "const",
    oe: babel.types.ObjectExpression,
    leftIds: babel.types.Identifier[]
  ) {
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
  }

  /**
   * Terminal Processor
   * ex) const {a, b, c, ...rest} = foo;
   * @param kind
   * @param op
   * @param id
   * @param leftIds
   * @param includeRest
   */
  private visitObjectPatternIdentifier(
    kind: "var" | "let" | "const",
    op: babel.types.ObjectPattern,
    id: babel.types.Identifier,
    leftIds: babel.types.Identifier[],
    includeRest: boolean
  ) {
    leftIds.forEach((e) => {
      this.decls.push(
        new CSVariableDeclarator(kind, e.name, "var", `${id.name}.${e.name}`)
      );
    });

    if (includeRest) {
      // how to handle this?
      const rest = op.properties.filter(
        (p) => p.type === "RestElement"
      )[0] as babel.types.RestElement;
      const name = (rest.argument as babel.types.Identifier).name;
      this.decls.push(
        new CSVariableDeclarator(kind, name, "var", `${id.name}`)
      );
    }
  }

  /**
   * Terminal Processor
   * ex) const {a, b, c, ...rest} = foo();
   * @param kind
   * @param op
   * @param callExpr
   * @param leftIds
   * @param includeRest
   */
  private visitObjectPatternCallExpression(
    kind: "var" | "let" | "const",
    op: babel.types.ObjectPattern,
    callExpr: babel.types.CallExpression,
    leftIds: babel.types.Identifier[],
    includeRest: boolean
  ) {
    const init = new CSExpression(callExpr);
    const tname = "tmp" + randomInt(10000, 100000).toString();

    this.decls.push(new CSVariableDeclarator(kind, tname, "var", init));

    leftIds.forEach((e) => {
      this.decls.push(
        new CSVariableDeclarator(kind, e.name, "var", `${tname}.${e.name}`)
      );
    });

    if (includeRest) {
      // how to handle this?
      const rest = op.properties.filter(
        (p) => p.type === "RestElement"
      )[0] as babel.types.RestElement;
      const name = (rest.argument as babel.types.Identifier).name;
      this.decls.push(new CSVariableDeclarator(kind, name, "var", tname));
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

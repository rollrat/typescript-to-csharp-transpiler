import Emitter from "../emitter/Emitter";
import IEmitterable from "./IEmitterable";

export default class CSExpression implements IEmitterable {
  constructor(private expression: babel.types.Expression) {}

  // infer type based on Hindley–Milner type system
  inferType(): string {
    // this value must not used generallaly.
    return "object";
  }

  emit(emitter: Emitter): void {
    throw new Error("Expression cannot be emitted by itself.");
  }

  emitStr(): string {
    switch (this.expression.type) {
      case "Identifier":
        return this.expression.name;
      case "NumericLiteral":
        return this.expression.value.toString();
      case "StringLiteral":
        return `"${this.expression.value}"`;
      case "NullLiteral":
        return "null";
      case "CallExpression":
        return this.visitCallExpression(this.expression);
    }

    throw new Error("Method not implemented.");
  }

  private visitCallExpression(expr: babel.types.CallExpression): string {
    let callee = "";

    switch (expr.callee.type) {
      case "Identifier":
        callee = expr.callee.name;
        break;
      default:
        throw new Error("Method not implemented.");
    }

    let args = "()";

    if (expr.arguments.length > 0) {
    }

    return callee + args;
  }
}

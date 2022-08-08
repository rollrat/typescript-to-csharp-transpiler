import Emitter from "../emitter/Emitter";
import IEmitterable from "./IEmitterable";

export default class CSExpression implements IEmitterable {
  constructor(private expression: babel.types.Expression) {}

  emit(emitter: Emitter): void {
    throw new Error("You must use emitStr instead of this!");
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
    }

    throw new Error("Method not implemented.");
  }
}

import { NodePath } from "@babel/traverse";
import Emitter from "../emitter/Emitter";
import IEmitterable from "./IEmitterable";

export class CSFunctionDeclaration implements IEmitterable {
  constructor(
    private functionDeclaration: NodePath<babel.types.FunctionDeclaration>
  ) {
    this.throwIfNotTransable();
    this.visitFunctionDeclaration(functionDeclaration.node);
  }

  emit(emitter: Emitter): void {
    throw new Error("Method not implemented.");
  }

  emitStr(): string {
    throw new Error("Method not implemented.");
  }

  /**
   * C# not supported inner method declaration
   */
  private throwIfNotTransable() {
    const transable = !this.functionDeclaration.node.body.body.some(
      (e) => e.type === "FunctionDeclaration"
    );

    if (transable) throw new Error("Cannot transpile!");
  }

  private visitFunctionDeclaration(fd: babel.types.FunctionDeclaration) {}
}

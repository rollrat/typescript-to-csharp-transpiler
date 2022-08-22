import { NodePath } from "@babel/traverse";
import Emitter from "../emitter/Emitter";
import IEmitterable from "./IEmitterable";

export class CSFunctionDeclaration implements IEmitterable {
  constructor(
    private functionDeclaration: NodePath<babel.types.FunctionDeclaration>
  ) {}

  emit(emitter: Emitter): void {
    throw new Error("Method not implemented.");
  }

  emitStr(): string {
    throw new Error("Method not implemented.");
  }
}

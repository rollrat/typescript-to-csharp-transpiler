import { NodePath } from "@babel/traverse";
import Emitter from "../emitter/Emitter";
import IEmitterable from "./IEmitterable";

export default class CSClassDeclaration implements IEmitterable {
  constructor(
    private classDeclaration: NodePath<babel.types.ClassDeclaration>
  ) {}

  emit(emitter: Emitter): void {
    throw new Error("Method not implemented.");
  }

  emitStr(): string {
    throw new Error("Method not implemented.");
  }
}

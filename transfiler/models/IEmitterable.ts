import CSEmitter from "../emitter/Emitter";

export default interface IEmitterable {
  emit(emitter: CSEmitter): void;
  emitStr(): string;
}

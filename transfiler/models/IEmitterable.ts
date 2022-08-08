import CSEmitter from "../emitter/Emitter";

// Some emitters generate code in the construction process,
// and some emit code in the emit process. User should know this.
export default interface IEmitterable {
  emit(emitter: CSEmitter): void;
  emitStr(): string;
}

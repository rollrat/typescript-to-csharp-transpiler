import babel from "@babel/core";
import { CSFunction } from "../model/Function";
import { CSModule } from "../model/Module";

export function AnalyzeFunction(
  module: CSModule,
  func: babel.types.Function
): CSFunction {
  if (func.type === "FunctionDeclaration") {
  }
  return new CSFunction(func);
}

function AnalyzeFunctionDeclaration() {}

function InferParameterType(func: babel.types.Function): string {
  return "undefined";
}

function InferReturnType(func: babel.types.Function): string {
  return "undefined";
}

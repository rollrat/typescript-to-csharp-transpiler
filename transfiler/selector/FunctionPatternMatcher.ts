/**
 *
 * @param methodCallChainStr ex) console.log
 */
export function FunctionPatternMatcher(methodCallChainStr: string): string {
  switch (methodCallChainStr) {
    case "console.log":
      return "System.Console.WriteLine";
  }

  return methodCallChainStr;
}

/**
 * Function pattern matching with type data
 * @param type
 * @param methodName split, length etc ...
 * @returns
 */
export function FunctionTypePatternMatcher(
  type:
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function"
    | "null"
    | "array",
  methodName: string
): string {
  switch (type) {
    case "string":
      return FunctionTypePatternMatcherString(methodName);
  }
  return methodName;
}

function FunctionTypePatternMatcherString(methodName: string): string {
  switch (methodName) {
    case "split":
      return "Split";
    case "replace":
      return "Replace";
    case "trim":
      return "Trim";
  }

  return methodName;
}

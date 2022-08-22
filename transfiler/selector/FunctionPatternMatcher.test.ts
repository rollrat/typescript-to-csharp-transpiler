import { FunctionPatternMatcher } from "./FunctionPatternMatcher";

/* Success */
test("Function Pattern Matcher: Call Chain", () => {
  const target = "console.log";
  const result = FunctionPatternMatcher(target);

  expect(result).toBe("System.Console.WriteLine");
});

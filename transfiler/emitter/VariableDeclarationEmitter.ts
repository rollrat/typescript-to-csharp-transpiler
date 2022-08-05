import * as babel from "@babel/core";

export function EmitVariableDeclaration(
  stmt: babel.types.VariableDeclaration
): string[] {
  /*
    ts=> const s: number = 0
    cs=> const int s = 0;

    ts=> const a,b = 'zxcv',c,d: number = 0;
    cs=> const var a;
         const string b = "zxcv"
         const var c;
         const int d = 0;
  */

  let kind = stmt.kind;
  let names = stmt.declarations;

  return names.map((x) => EmitVariableDeclarator(kind, x));
}

function EmitVariableDeclarator(
  kind: "var" | "let" | "const",
  vd: babel.types.VariableDeclarator
): string {
  /* 
      ArrayExpression | 
      AssignmentExpression | 
      BinaryExpression | 
      CallExpression | 
      ConditionalExpression | 
      FunctionExpression | 
      Identifier | 
      StringLiteral | 
      NumericLiteral | 
      NullLiteral | 
      BooleanLiteral | 
      RegExpLiteral | 
      LogicalExpression | 
      MemberExpression | 
      NewExpression | 
      ObjectExpression | 
      SequenceExpression | 
      ParenthesizedExpression | 
      ThisExpression | 
      UnaryExpression | 
      UpdateExpression | 
      ArrowFunctionExpression | 
      ClassExpression | 
      MetaProperty | 
      Super | 
      TaggedTemplateExpression | 
      TemplateLiteral | 
      YieldExpression | 
      AwaitExpression | 
      Import | 
      BigIntLiteral | 
      OptionalMemberExpression | 
      OptionalCallExpression | 
      TypeCastExpression | 
      JSXElement | 
      JSXFragment | 
      BindExpression | 
      DoExpression | 
      RecordExpression | 
      TupleExpression | 
      DecimalLiteral | 
      ModuleExpression | 
      TopicReference | 
      PipelineTopicExpression | 
      PipelineBareFunction | 
      PipelinePrimaryTopicReference | 
      TSInstantiationExpression | 
      TSAsExpression | 
      TSTypeAssertion | 
      TSNonNullExpression
    */
  const name = (vd.id as babel.types.Identifier).name;
  const type = vd.init?.type;
  let etype = "var";

  console.log(vd);

  if (type !== null) {
    switch (type) {
      case "NumericLiteral":
        etype = "int";
        break;

      case "StringLiteral":
        etype = "String";
        break;
    }
  }

  let ekind = "";

  if (kind === "const") ekind = "const ";

  return `${ekind}${etype} ${name}`;
}

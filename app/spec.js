
module.exports = `
interface Program <: Node {
  type: "Program";
  body: [ Statement ];
}

interface EmptyStatement <: Statement {
  type: "EmptyStatement";
}

interface BlockStatement <: Statement {
  type: "BlockStatement";
  body: [ Statement ];
}

interface ExpressionStatement <: Statement {
  type: "ExpressionStatement";
  expression: Expression;
}

interface IfStatement <: Statement {
  if (<test>) {<consequent>} else {<alternate>}
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

interface LabeledStatement <: Statement {
  <label>: <body>
  type: "LabeledStatement";
  label: Identifier;
  body: Statement;
}

interface BreakStatement <: Statement {
  break <label>
  type: "BreakStatement";
  label: Identifier | null;
}

interface ContinueStatement <: Statement {
  continue <label>
  type: "ContinueStatement";
  label: Identifier | null;
}

interface WithStatement <: Statement {
  with (<object>) {<body>}
  type: "WithStatement";
  object: Expression;
  body: Statement;
}

interface SwitchStatement <: Statement {
  switch (<descriminant>) {<cases>}
  type: "SwitchStatement";
  discriminant: Expression;
  cases: [ SwitchCase ];
  lexical: boolean;
}

interface ReturnStatement <: Statement {
  return <argument>
  type: "ReturnStatement";
  argument: Expression | null;
}

interface ThrowStatement <: Statement {
  throw <argument>
  type: "ThrowStatement";
  argument: Expression;
}

interface TryStatement <: Statement {
  try {<block>} <handler> <finalizer>
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause | null;
  // guardedHandlers: [ CatchClause ];
  finalizer: BlockStatement | null;
}

interface WhileStatement <: Statement {
  while (<test>) {<body>}
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

interface DoWhileStatement <: Statement {
  do {<body>} while (<test>)
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}

interface ForStatement <: Statement {
  for (<init>; <test>; <update>) {<body>}
  type: "ForStatement";
  init: VariableDeclaration | Expression | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}

interface ForInStatement <: Statement {
  for (<left> in <right>) <body>
  type: "ForInStatement";
  left: VariableDeclaration |  Expression;
  right: Expression;
  body: Statement;
  // each: boolean;
}

interface ForOfStatement <: Statement {
  for (<left> of <right>) <body>
  type: "ForOfStatement";
  left: VariableDeclaration |  Expression;
  right: Expression;
  body: Statement;
}

interface DebuggerStatement <: Statement {
  debugger
  type: "DebuggerStatement";
}

interface Declaration <: Statement { }

interface FunctionDeclaration <: Function, Declaration {
  function <id>(<params,> <rest>) <body>
  type: "FunctionDeclaration";
  id: Identifier;
  params: [ Pattern ];
  defaults: [ Expression ];
  rest: Identifier | null;
  body: BlockStatement | Expression;
  generator: boolean;
  expression: boolean;
}

interface VariableDeclaration <: Declaration {
  <kind> <declaration>
  type: "VariableDeclaration";
  declarations: [ VariableDeclarator ];
  kind: "var" | "let" | "const";
}

interface VariableDeclarator <: Node {
  <id> = <init>
  type: "VariableDeclarator";
  id: Pattern;
  init: Expression | null;
}

interface Expression <: Node, Pattern { }

interface ThisExpression <: Expression {
  this
  type: "ThisExpression";
}

interface ArrayExpression <: Expression {
  [<elements,>]
  type: "ArrayExpression";
  elements: [ Expression | null ];
}

interface ObjectExpression <: Expression {
  {<properties,>}
  type: "ObjectExpression";
  properties: [ Property ];
}

interface Property <: Node {
  <kind> <key>: <value>
  type: "Property";
  key: Literal | Identifier;
  value: Expression;
  kind: "init" | "get" | "set";
}

interface FunctionExpression <: Function, Expression {
  function <id>(<params,> <rest>) <body>
  type: "FunctionExpression";
  id: Identifier | null;
  params: [ Pattern ];
  defaults: [ Expression ];
  rest: Identifier | null;
  body: BlockStatement | Expression;
  generator: boolean;
  expression: boolean;
}

interface ArrowExpression <: Function, Expression {
  (<params,>) => <body>
  type: "ArrowExpression";
  params: [ Pattern ];
  defaults: [ Expression ];
  rest: Identifier | null;
  body: BlockStatement | Expression;
  generator: boolean;
  expression: boolean;
}

interface SequenceExpression <: Expression {
  (<expression,>)
  type: "SequenceExpression";
  expressions: [ Expression ];
}

interface UnaryExpression <: Expression {
  ?prefix <operator> <argument>
  <argument> <operator>
  type: "UnaryExpression";
  operator: UnaryOperator;
  prefix: boolean;
  argument: Expression;
}

interface BinaryExpression <: Expression {
  <left> <operator> <right>
  type: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

interface AssignmentExpression <: Expression {
  <left> <operator> <right>
  type: "AssignmentExpression";
  operator: AssignmentOperator;
  left: Pattern;
  right: Expression;
}

interface UpdateExpression <: Expression {
  ?prefix <operator> <argument>
  <argument> <operator>
  type: "UpdateExpression";
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

interface LogicalExpression <: Expression {
  <left> <operator> <right>
  type: "LogicalExpression";
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

interface ConditionalExpression <: Expression {
  <test> ? <consequent> : <alternate>
  type: "ConditionalExpression";
  test: Expression;
  alternate: Expression;
  consequent: Expression;
}

interface NewExpression <: Expression {
  new <callee>(<arguments,>)
  type: "NewExpression";
  callee: Expression;
  arguments: [ Expression ];
}

interface CallExpression <: Expression {
  <callee>(<arguments,>)
  type: "CallExpression";
  callee: Expression;
  arguments: [ Expression ];
}

interface MemberExpression <: Expression {
  ?computed <object>[<property>]
  <object>.<property>
  type: "MemberExpression";
  object: Expression;
  property: Identifier | Expression;
  computed: boolean;
}

interface YieldExpression <: Expression {
  yield <argument>
  type: "YieldExpression";
  argument: Expression | null;
}

/*
   interface ComprehensionExpression <: Expression {
type: "ComprehensionExpression";
body: Expression;
blocks: [ ComprehensionBlock | ComprehensionIf ];
filter: Expression | null;
}

interface GeneratorExpression <: Expression {
type: "GeneratorExpression";
body: Expression;
blocks: [ ComprehensionBlock | ComprehensionIf ];
filter: Expression | null;
}
*/

interface Pattern <: Node { }

interface ObjectPattern <: Pattern {
  {<properties,>}
  type: "ObjectPattern";
  properties: [ { key: Literal | Identifier, value: Pattern } ];
}

interface ArrayPattern <: Pattern {
  [<elements,>]
  type: "ArrayPattern";
  elements: [ Pattern | null ];
}

interface SwitchCase <: Node {
  case <test>: <consequent>
  type: "SwitchCase";
  test: Expression | null;
  consequent: [ Statement ];
}

interface CatchClause <: Node {
  catch (<param>) <body>
  type: "CatchClause";
  param: Pattern;
  // guard: Expression | null;
  body: BlockStatement;
}

interface Identifier <: Node, Expression, Pattern {
  type: "Identifier";
  name: string;
}

interface Literal <: Node, Expression {
  type: "Literal";
  value: string | boolean | null | number | RegExp;
}

enum UnaryOperator {
  "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"
}

enum BinaryOperator {
  "==" | "!=" | "===" | "!=="
    | "<" | "<=" | ">" | ">="
      | "<<" | ">>" | ">>>"
        | "+" | "-" | "*" | "/" | "%"
          | "|" | "^" | "&" | "in"
            | "instanceof"// | ".."
}

enum LogicalOperator {
  "||" | "&&"
}

enum AssignmentOperator {
  "=" | "+=" | "-=" | "*=" | "/=" | "%="
    | "<<=" | ">>=" | ">>>="
      | "|=" | "^=" | "&="
}

enum UpdateOperator {
  "++" | "--"
}

`


import Input from './input'
import React from 'react'
import css from 'rcssplus'

export default function handle(node, key) {
  if (handlers[node.type]) {
    return handlers[node.type](node, key)
  }
  return <div key={key}>Unknown type {node.type}</div>
}

const handlers = {
  Program(node, key) {
    return <div key={key} className={styles.program}>
      {node.body.map((item, i) => handle(item, i))}
    </div>
  },

  Identifier(node, key) {
    return <Input className={styles.ident} value={node.name} key={key}/>
  },

  VariableDeclaration(node, key) {
    return <div className={styles.variable} key={key}>
      {node.kind}
      {node.declarations.map((node, i) => handle(node, i))}
    </div>
  },

  VariableDeclarator(node, key) {
    return <span className={styles.vardec} key={key}>
      {handle(node.id, 'id')}
      {node.init ? '=' : null}
      {node.init ? handle(node.init, 'init') : null}
    </span>
  },

  Literal(node, key) {
    if ('number' === typeof node.value) {
      return <Input type='number' value={node.raw} className={styles.literal} key={key}/>
    }
    if ('string' === typeof node.value) {
      return <span>"<Input type='text' value={node.value} className={styles.literal} key={key}/>"</span>
    }
    return <Input value={node.raw} className={styles.literal} key={key}/>
  },

  BlockStatement(node, key) {
    return <div className={styles.block} key={key}>
      {node.body.map((item, i) => handle(item, i))}
    </div>
  },

  ReturnStatement(node, key) {
    return <div className={styles['return']} key={key}>return {handle(node.argument, 'return')}</div>
  },

  BinaryExpression(node, key) {
    return <span className={styles.bin} key={key}>
      {handle(node.left, 'left')} {node.operator} {handle(node.right, 'right')}
    </span>
  },

  FunctionDeclaration(node, key) {
    return <div key={key} className={styles.functiondecl}>
      function
      {handle(node.id, 'id')}
      ({node.params.map((param, i) => handle(param, i))}) {'{'}
      {handle(node.body, 'body')}
      {'}'}
    </div>
  }

}

const {styles, decs} = css`
body {
  padding-left: 10px
}
program {
  @body
  border: 1px solid #aaa
  white-space: pre
}
input {
  border: none;
  padding: 0 4px;
  box-sizing: content-box;
  :focus {
  outline: none
  }
}
block {
  @body
}
ident {
  @input
  color: green
}
literal {
  @input
  color: red
}
`


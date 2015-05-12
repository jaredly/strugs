
import React from 'react'
import css from 'rcssplus'

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
}
raw {
  background-color: #f0f0f0
  padding: 10px 20px
  border-radius: 5px
  white-space: pre-wrap
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

export default class Strugs extends React.Component {
  render() {
    return <div>
      Strugs
      {handle(this.props.ast)}
      <pre className={styles.raw}>{JSON.stringify(this.props.ast, null, 2)}</pre>
    </div>
  }
}

function handle(node, key) {
  if (handlers[node.type]) {
    return handlers[node.type](node, key)
  }
  return <div key={key}>Unknown type {node.type}</div>
}

class Input extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    this.resize()
  }

  componentDidMount() {
    this.resize()
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  resize() {
    const shadow = React.findDOMNode(this.shadow)
    const input = React.findDOMNode(this.input)
    const style = window.getComputedStyle(shadow)
    let width = style.width
    if (this.props.type === 'number') {
      width = parseInt(width, 10) + 20 + 'px'
    }
    input.style.width = width
  }

  render() {
    return <span style={{position: 'relative'}}>
      <input style={{
      }} ref={i => this.input = i} {...this.props}/>
      <span ref={i => this.shadow = i} style={{
        visibility: 'hidden',
        top: 0,
        left: 0,
        whiteSpace: 'nowrap',
        position: 'absolute',
      }}>{this.props.value}</span>
    </span>
  }
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


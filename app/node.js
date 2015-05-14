
import React from 'react'
import css from 'rcssplus'

import {fluxify} from 'flammable/react'

import SmartInput from './smart-input'

const PT = React.PropTypes

@fluxify({
  data: props => ({
    nodes: {
      nodes: {
        [props.id]: 'node',
      }
    },
  }),
  actions: props => ({
    onChange: ['nodes.changeNode', props.id],
    onFocus: ['selection.set', props.id],
  })
})
export default class Node extends React.Component {
  static contextTypes = {
    focused: PT.array,
  }

  static handle(id) {
    return <Node id={id}/>
  }

  onChange(update) {
    return this.props.onChange(update)
  }

  render() {
    if (!this.props.node) return <span>Unknowd</span>
    const type = this.props.node.type
    const cls = styles.node + (this.props.node.$focused ? ' ' + styles.selected : '')
    const child = handlers[type](this.props.node, this.onChange.bind(this), this.props.onFocus)
    if (child.type === 'div') {
      return <div className={cls}>
        {child}
      </div>
    }
    return <span className={cls}>
      {child}
    </span>
  }
}

/*
const spec = {
  Program: {
    render: {
      attr: 'body',
      type: ListOf(Statement),
    },
    block: true,
  },
  Identifier: {
    render: '|name',
  },
  VariableDeclaration: {
    render: ['.kind', 
  },
}
*/

const handlers = {
  Program(node) {
    return <div className={styles.program}>
      {node.body.map((item, i) => <Node id={item} key={item}/>)}
    </div>
  },

  Identifier(node, change, onFocus) {
    return <SmartInput
      className={styles.ident}
      focused={node.$focused}
      onChange={val => change({name: {$set: val}})}
      onFocus={onFocus}
      value={node.name}/>
  },

  VariableDeclaration(node) {
    return <div className={styles.variable}>
      {node.kind}
      {node.declarations.map((node, i) => <Node id={node} key={node}/>)}
    </div>
  },

  VariableDeclarator(node) {
    return <span className={styles.vardec}>
      <Node id={node.id} key={node.id}/>
      {node.init ? '=' : null}
      {node.init ? <Node id={node.init} key={node.init}/> : null}
    </span>
  },

  Literal(node, change, onFocus) {
    if ('number' === typeof node.value) {
      return <SmartInput type='number'
        onFocus={onFocus}
        focused={node.$focused}
        onChange={val => change({value: {$set: parseInt(val, 10)}, raw: {$set: val}})}
        value={node.raw} className={styles.literal}/>
    }
    if ('string' === typeof node.value) {
      return <span>"
        <SmartInput type='text'
          onFocus={onFocus}
          focused={node.$focused}
          onChange={val => change({value: {$set: val}})}
          value={node.value} className={styles.literal}/>
      "</span>
    }
    return <SmartInput
      onFocus={onFocus}
      value={node.raw}
      focused={node.$focused}
      className={styles.literal}/>
  },

  BlockStatement(node) {
    return <div className={styles.block}>
      {node.body.map((item, i) => <Node id={item} key={item}/>)}
    </div>
  },

  ReturnStatement(node) {
    return <div className={styles['return']}>return <Node id={node.argument} key={node.argument}/>
    </div>
  },

  BinaryExpression(node) {
    return <span className={styles.bin}>
      <Node id={node.left} key={node.left}/>
      {node.operator}
      <Node id={node.right} key={node.right}/>
    </span>
  },

  FunctionDeclaration(node) {
    const params = []
    node.params.forEach((param, i) => {
      params.push(<Node id={param} key={param}/>)
      params.push(<span>, </span>)
    })
    return <div className={styles.functiondecl}>
      function
      <Node id={node.id} key={node.id}/>
      ({params.slice(0, -1)})
      {'{'}
      <Node id={node.body} key={node.body}/>
      {'}'}
    </div>
  }

}

const {styles, decs} = css`
selected {
  background-color: #ddf
}
body {
  padding-left: 10px
}
program {
  @body
  border: 1px solid #aaa
  white-space: pre
  font-family: sans-serif
  font-size: 14px
  padding: 20px
}
input {
  border: none;
  padding: 0 4px;
  box-sizing: content-box;

  background-color: transparent
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
node {
}
`



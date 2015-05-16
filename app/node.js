
import React from 'react'
import css from 'rcssplus'

import {fluxify} from 'flammable/react'

import SmartInput from './smart-input'

const PT = React.PropTypes

@fluxify({
  events: (props, events) => [events.nodeView(props.id)],
  sample: props => ({
    selection: 'selection',
  }),
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

  static propTypes = {
    id: PT.string,

    // supplied by flux
    node: PT.object,
    onChange: PT.func,
    onFocus: PT.func,
  }

  static handle(id) {
    return <Node id={id}/>
  }

  onChange(update) {
    return this.props.onChange(update)
  }

  render() {
    if (!this.props.node) return <span>Unknode {JSON.stringify(this.props.id || 'not found')}</span>
    const type = this.props.node.type
    const cls = styles.node + (this.props.node.$focused ? ' ' + styles.selected : '')

    if (type === 'Identifier') {
      return <SmartInput
        onFocus={this.props.onFocus}
        focused={this.props.node.$focused}
        onChange={val => this.onChange({name: {$set: val}})}
        className={cls + ' ' + styles.input}
        value={this.props.node.name}/>
    }
    if (type === 'Literal') {
      return <SmartInput
        onFocus={this.props.onFocus}
        focused={this.props.node.$focused}
        onChange={val => this.onChange({value: {$set: val}, raw: {$set: val}})}
        className={cls + ' ' + styles.input}
        value={this.props.node.value}/>
    }

    const child = render(type, this.props.node, this.onChange.bind(this), this.props.onFocus)
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

import spec from './spec'
const nodeTypes = spec['interface']
const enums = spec['enum']

function render(type, node, onChange, onFocus) {
  if (!nodeTypes[node.type]) {
    return <span>Unknown node type {node.type}</span>
  }

  const spec = nodeTypes[node.type]
  if (!spec.renders.length) {
    let items = []
    Object.keys(spec.attrs).forEach(name => {
      if (name === 'type') return
      if (Array.isArray(node[name])) {
        items = items.concat(node[name].map(id => <Node id={id}/>))
      } else {
        items.push(<Node id={node[name]}/>)
      }
    })
    return <span children={items}/>
  }

  let format
  for (let i=0; i<spec.renders.length; i++) {
    if (spec.renders[i].cond === 'default' || !!node[spec[i].renders.cond]) {
      format = spec.renders[i].render
      break
    }
  }

  let parts = []
  format.forEach(part => {
    if ('string' === typeof part) return parts.push(part)
    const val = node[part.attr]
    // if (!val) debugger
    if ('object' !== typeof val && (!val.length || val.length < 20)) {
      return parts.push(val)
    }
    // if ('string' === typeof val) return parts.push(val)
    if (!Array.isArray(val)) {
      return parts.push(<Node id={val}/>)
    }
    parts = parts.concat(val.map(child => <Node id={child}/>))
  })

  if (spec.inherits.indexOf('Statement') !== -1 ||
     spec.inherits.indexOf('Declaration') !== -1) {
    parts.push(<br/>)
  }

  return <span children={parts}/>
}

const {styles, decs} = css`
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
selected {
  background-color: #ddf
}
`



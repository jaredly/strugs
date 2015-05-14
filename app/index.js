
import React from 'react'
import RCSS from 'rcss'
import css from 'rcssplus'

// import * as babel from 'babel-core'
import {Flux, fluxify} from 'flammable/react'

import Node from './node'

const babel = window.babel

const PT = React.PropTypes

let ex = `const a = 23
let b = a + 23 * 2
let c = "aweom"
`

/*
const ex = `
function ex(a, b, c) {
  const awesome = 23
  var something = "more things"
  return 42 + awesome
}
`
*/

const {styles, decs} = css`
top {
  display: flex
}
raw {
  background-color: #f0f0f0
  padding: 10px 20px
  border-radius: 5px
  white-space: pre-wrap
}
text {
  flex: 1
  margin: 0 20px
}
`

function treeToNodes(tree) {
  const nodes = {}
  walkTree(tree, nodes, null)
  return nodes
}

const uuid = () => Math.random().toString(0x0f).slice(10, 30)

const ast = {
  Program: {
    body: 2, //[],
  },
  VariableDeclaration: {
    declarations: 2, //[],
  },
  VariableDeclarator: {
    id: 1,
    init: 0,
  },
  BlockStatement: {
    body: 2, //[],
  },
  BinaryExpression: {
    left: 1,
    right: 1,
  },
  FunctionDeclaration: {
    id: 1,
    params: 2, //[],
    body: 1,
  },
  ReturnStatement: {
    argument: 0,
  },
}

function walkTree(node, nodes, parent) {
  if (!node) return
  const id = node.$id = uuid()
  nodes[id] = node
  const dec = ast[node.type]
  if (dec) Object.keys(dec).forEach(name => {
    const val = dec[name]
    if (val === 1) {
      node[name] = walkTree(node[name], nodes, id)
    } else if (val === 0) {
      if (node[name]) {
        node[name] = walkTree(node[name], nodes, id)
      }
    } else if (val === 2) {
      node[name] = node[name].map(child => walkTree(child, nodes, id))
    }
  })
  return id
}

const flux = new Flux()
/*
flux.addStore('text', {
  text: {
    changed(text, update) {
      update({$set: text})
    }
  },
})
*/

function init(text) {
  const tree = babel.parse(text, {ecmaVersion: 6})
  tree.$focused = true
  const nodes = treeToNodes(tree)
  nodes[tree.$id].$focused = true
  return {
    root: tree.$id,
    nodes,
    focus: tree.$id
  }
}

flux.addStore('nodes', init(ex), {
  text: {
    changed(text, update) {
      // reset everything
      try {
      update({$set: init(text)})
      } catch (e) {}
    },
  },

  nodes: {
    changeNode(data, update) {
      update({
        nodes: {
          [data.id]: data.update
        }
      })
    }
  },

  selection: {
    set(id, update, state) {
      update({
        nodes: {
          [state.focus]: {$focused: {$set: false}},
          [id]: {$focused: {$set: true}},
        },
        focus: {$set: id}
      })
    }
  },
})

flux.addActions('selection', {
  set: true,
})

flux.addActions('text', {
  changed: true,
})

flux.addActions('nodes', {
  changeNode(id, update) {
    return {id, update}
  },
})

@fluxify({
  actions: {
    onTextChanged: 'text.changed',
  },
})
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {text: ex + '', parsed: babel.parse(ex + '', {ecmaVersion: 6})}
  }

  onChange(e) {
    // let val = this.state.parsed
    this.props.onTextChanged(e.target.value)
    let val = this.state.parsed
    try {
      val = babel.parse(e.target.value, {ecmaVersion: 6})
    } catch (e) {
      console.log(e.target.value)
      console.log(e)
    }
    this.setState({
      parsed: val,
      text: e.target.value
    })
  }

  render() {
    return <div>
      <div className={styles.top}>
        <Strugs/>
        <textarea className={styles.text} value={this.state.text} onChange={this.onChange.bind(this)}/>
      </div>
      <pre className={styles.raw}>{JSON.stringify(this.state.parsed, null, 2)}</pre>
    </div>
  }
}

@fluxify({
  data: {
    nodes: {
      root: 'root',
    },
  }
})
class Strugs extends React.Component {
  render() {
    return <div>
      Strugs
      <Node id={this.props.root}/>
    </div>
  }
}

React.render(flux.wrap(<App/>), document.getElementById('root'))

RCSS.injectAll()


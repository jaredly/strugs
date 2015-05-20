
import {Flux} from 'flammable/react'

const babel = window.babel

const nodesListeners = {
  text: {
    changed(store, text) {
      // reset everything
      try {
      store.update({$set: init(text)})
      } catch (e) {}
    },
  },

  nodes: {
    changeNode(store, {id, update}) {
      store.update({
        nodes: {
          [id]: update
        }
      })
    }
  },

  selection: {
    set(store, id) {
      store.update({
        focus: {$set: id}
      }, [
        store.events('nodes', 'view', store.state.focus),
        store.events('nodes', 'view', id)
      ])
    },
    key(key, update, state) {
      if (key === 'up') {
        // TODODOOO
      }
    }
  },
}

export default function makeFlux(initialText) {
  const flux = new Flux()

  const keyMap = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    72: 'h',
    74: 'j',
    75: 'k',
    76: 'l',
  }

  window.addEventListener('keydown', e => {
    const key = keyMap[e.keyCode]
    if (!key) return
    e.preventDefault()
    flux.sendAction('selection.key', key)
  })

  flux.addStore('nodes', init(initialText), nodesListeners)

  flux.addActions('selection', {
    set: true,
    key: true,
  })

  flux.addActions('text', {
    changed: true,
  })

  flux.addActions('nodes', {
    changeNode(id, update) {
      return {id, update}
    },
  })

  flux.addEvents('nodes', {
    view: id => 'view:' + id,
  })

  return flux
}

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

import spec from './spec'
const nodeTypes = spec['interface']
const enums = spec['enum']

function walkTree(node, nodes, parent) {
  if (!node) return
  const id = node.$id = uuid()
  nodes[id] = node
  node.parent = parent
  const dec = ast[node.type]
  if (dec) Object.keys(dec).forEach(name => {
    const val = dec[name]
    if (val === 1) {
      node[name] = walkTree(node[name], nodes, [id, name])
    } else if (val === 0) {
      if (node[name]) {
        node[name] = walkTree(node[name], nodes, [id, name])
      }
    } else if (val === 2) {
      node[name] = node[name].map((child, i) => walkTree(child, nodes, [id, name, i]))
    }
  })
  return id
}

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


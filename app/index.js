
import React from 'react'
import RCSS from 'rcss'
import css from 'rcssplus'

import * as acorn from 'acorn'

import Strugs from './strugs'

window.acorn = acorn

const ex = `
function ex(a, b, c) {
  var awesome = 23
  var something = "more things"
  return 42 + awesome
}
`

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {text: ex + '', parsed: acorn.parse(ex + '')}
  }
  onChange(e) {
    let val = this.state.parsed
    try {
      val = acorn.parse(e.target.value)
    } catch (e) {}
    this.setState({
      parsed: val,
      text: e.target.value
    })
  }
  render() {
    return <div>
      Hello
      <textarea value={this.state.text} onChange={this.onChange.bind(this)}/>
      <Strugs ast={this.state.parsed}/>
    </div>
  }
}

React.render(<App/>, document.getElementById('root'))

RCSS.injectAll()


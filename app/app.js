
import React from 'react'
import css from 'rcssplus'
import {fluxify} from 'flammable/react'
import Node from './node'

const babel = window.babel

const {styles, decs} = css`
top {
}
raw {
  background-color: #f0f0f0
  padding: 10px 20px
  border-radius: 5px
  white-space: pre-wrap
}
text {
  width: 100%
  height: 200px
  box-sizing: border-box
  margin: 0
  padding: 20px
}
strugs {
  width: 300px;
  margin: 50px auto
}
`

@fluxify({
  actions: {
    onTextChanged: 'text.changed',
  },
})
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {text: props.initial + '', parsed: babel.parse(props.initial + '', {ecmaVersion: 6})}
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
    return <div className={styles.strugs}>
      <h1>Strugs</h1>
      <Node id={this.props.root}/>
    </div>
  }
}


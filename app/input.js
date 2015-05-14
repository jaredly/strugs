
import React from 'react'

export default class Input extends React.Component {
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
    if (!shadow) return console.warn('shadow not found')
    const style = window.getComputedStyle(shadow)
    let width = style.width
    if (this.props.type === 'number') {
      width = parseInt(width, 10) + 20 + 'px'
    }
    input.style.width = width
  }

  focus() {
    React.findDOMNode(this.input).focus()
  }

  blur() {
    React.findDOMNode(this.input).blur()
  }

  render() {
    return <span style={{position: 'relative'}}>
      <input style={{
        fontFamily: 'sans-serif',
        fontSize: '14px',
      }} ref={i => this.input = i} {...this.props}/>
      <span ref={i => this.shadow = i} style={{
        fontFamily: 'sans-serif',
        fontSize: '14px',
        visibility: 'hidden',
        top: 0,
        left: 0,
        whiteSpace: 'pre',
        position: 'absolute',
      }}>{this.props.value}</span>
    </span>
  }
}


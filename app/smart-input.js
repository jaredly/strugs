
import React from 'react'
import Input from './input'

export default class SmartInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {text: props.value}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.text) {
      console.log('diff', nextProps.value, this.state.text)
      this.setState({text: nextProps.value})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value || this.state.text !== nextState.text || nextProps.focused !== this.props.focused
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.focused && this.props.focused) {
      this.input.focus()
    } else if (prevProps.focused && !this.props.focused) {
      this.input.blur()
    }
  }

  onChange(val) {
    if (!this.props.onChange) return
    this.setState({text: val})
    this.props.onChange(val)
  }

  render() {
    return <Input className={this.props.className}
      value={this.state.text}
      ref={i => this.input = i}
      onFocus={this.props.onFocus}
      onChange={e => this.onChange(e.target.value)}/>
  }
}


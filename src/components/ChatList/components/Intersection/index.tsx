import React, {  Component } from 'react'

interface IProps {
  onObserve?: () => void 
}

export default class Observer extends Component<IProps> {

  public state: {
    observer?: IntersectionObserver
  } = {
    observer: undefined
  }

  componentDidMount = () => {
    this.initObserver()
  }

  componentWillUnmount = () => {
    this.state.observer?.disconnect()
  }

  initObserver = () => {
    const { onObserve } = this.props
    const io = new IntersectionObserver(entries => {
      onObserve?.()
    }, {
      root: document.querySelector('#chat-list-wrapper'),
    })
    this.setState({ observer: io })
    const target = document.querySelector('#intersection-observer')
    target && io.observe(target)
  }

  render() {

    return (
      <div id="intersection-observer" style={{height: 12}}></div>
    )

  }

}
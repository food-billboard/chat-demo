import React, {  Component } from 'react'
import { uniqueId } from 'lodash'

interface IProps {
  onObserve?: (target: IntersectionObserverEntry) => void
  root: string 
  id?: string 
}

export default class Observer extends Component<IProps> {

  public state: {
    observer?: IntersectionObserver
  } = {
    observer: undefined
  }

  readonly id = this.props.id || uniqueId("intersection-observer")

  componentDidMount = () => {
    this.initObserver()
  }

  componentWillUnmount = () => {
    this.state.observer?.disconnect()
  }

  initObserver = () => {
    const { onObserve, root } = this.props
    const io = new IntersectionObserver(entries => {
      onObserve?.(entries[0])
    }, {
      root: document.querySelector(`#${root}`),
    })
    this.setState({ observer: io })
    const target = document.querySelector(`#${this.id}`)
    target && io.observe(target)
  }

  render() {

    return (
      <div id={this.id} style={{height: 12}}></div>
    )

  }

}
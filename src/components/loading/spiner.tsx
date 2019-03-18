import React, { Component } from 'react'

interface SpinerProps {
  text?: string | React.ReactNode
}

export default class Spiner extends Component<SpinerProps> {
  render() {
    const me = this;
    const {
      text,
    } = me.props;
    return (
      <div className="biz-loading_spiner">
          {text}
      </div>
    )
  }
}

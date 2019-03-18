import React, { Component } from 'react';
import classNames from 'classnames';

interface SpinerProps {
  text?: string | React.ReactNode,
  size?: string
}

export default class Spiner extends Component<SpinerProps> {
  render() {
    const me = this;
    const {
      text,
      size = ''
    } = me.props;
    let cls = classNames({
      'biz-spin': true,
      'biz-spin-sm': size === 'small',
      'biz-spin-lg': size === 'large',
    })
    return (
      <div className={cls}>
        <i className="indicator"></i>
        <span className="text">
          {text}
        </span>
      </div>
    )
  }
}

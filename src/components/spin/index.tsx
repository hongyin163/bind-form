import classNames from 'classnames';
import React, { Component } from 'react';

interface SpinerProps {
  type?: string;
  tip?: string | React.ReactNode;
  size?: string;
}

export default class Spiner extends Component<SpinerProps> {
  public render() {
    const me = this;
    const {
      tip,
      size = '',
    } = me.props;
    const cls = classNames({
      'biz-spin': true,
      'biz-spin-sm': size === 'small',
      'biz-spin-lg': size === 'large',
    })
    return (
      <div className={cls}>
        <i className="indicator"></i>
        <span className="text">
          {tip}
        </span>
      </div>
    )
  }
}

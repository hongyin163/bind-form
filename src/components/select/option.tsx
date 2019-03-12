import React, { Component } from 'react';
import { OptionProps } from './interface';
import classnames from 'classnames';

export default class Option extends Component<OptionProps> {
	render() {
		let { children } = this.props;
		return <div className="biz-select-option">{children}</div>;
	}
}

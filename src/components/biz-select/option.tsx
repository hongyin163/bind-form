import React, { Component } from 'react';
import classnames from 'classnames';

interface OptionProp {
    value:String;
    onSelect?:Function,
    className?:String,
    id?:string
}

export default class Option extends Component<OptionProp,{}> {
	render() {
        let { 
            children,
            onSelect,
            className,
            id
        } = this.props;
		return (
            <div id={id} className={classnames('biz-select-option',className)} onClick={onSelect.bind(this,this.props)}>
                {children}
            </div>
        );
	}
}

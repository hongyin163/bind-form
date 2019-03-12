import React, { Component } from 'react';

interface OptionProp {
    value:string;
    onSelect?:Function
}

export default class Option extends Component<OptionProp,{}> {
	render() {
        let { 
            children,
            onSelect
        } = this.props;
		return (
            <div className="biz-select-option" onClick={onSelect.bind(this,this.props)}>
                {children}
            </div>
        );
	}
}

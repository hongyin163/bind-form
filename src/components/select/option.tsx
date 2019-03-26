import classnames from 'classnames';
import React, { Component } from 'react';

interface OptionProp {
    value: String;
    onSelect?: Function,
    className?: String,
    id?: string
}

export default class Option extends Component<OptionProp, {}> {
    public onSelect = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
        const {
            onSelect,
        } = this.props;
        onSelect(this.props);
    }
    public render() {
        const {
            children,
            className,
            id,
        } = this.props;
        return (
            <div id={id} className={classnames('biz-select-option', className)} onClick={this.onSelect}>
                {children}
            </div>
        );
    }
}

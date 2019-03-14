import React, { Component } from 'react';
export class RadioGroup extends Component {
    state = {};
    render() {
        let me = this;
        let { children } = me.props;
        return (
            <div className="radio-group">
                {children}
            </div>
        );
    }
}

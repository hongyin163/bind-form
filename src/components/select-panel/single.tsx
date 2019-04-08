import React, { PureComponent } from 'react'

export default class Single extends PureComponent<any> {
    public render() {
        const me = this;
        const {
            value,
            text,
        } = me.props
        return (
            <div data-value={value}>
                {text}
            </div>
        )
    }
}

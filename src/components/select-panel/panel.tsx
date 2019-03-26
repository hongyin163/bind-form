import React, { Component } from 'react'

export default class Panel extends Component<any> {
    public componentWillMount() {
        document.addEventListener('click', this.close);
    }
    public componentWillUnmount() {
        document.removeEventListener('click', this.close);
    }
    public close = (e) => {
        const me = this;
        const {
            onClose = () => null,
        } = me.props;
        onClose(e);
    }
    public render() {
        return this.props.children;
    }
}

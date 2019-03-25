import React, { Component } from 'react'


class Dialog extends Component<any> {
    componentWillMount() {
        document.addEventListener('click', this.close);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.close);
    }
    close = (e) => {
        const me = this;
        const {
            onClose = () => null,
        } = me.props;
        onClose(e);
    }
    render() {
        return this.props.children;
    }
}

export default Dialog;

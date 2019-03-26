import { Component } from 'react';
class TagWarpper extends Component<any> {
    componentWillMount() {
        console.log('addEventListener click')
        document.addEventListener('click', this.close);
    }
    componentWillUnmount() {
        console.log('removeEventListener click')
        document.removeEventListener('click', this.close);
    }
    close = (e) => {
        const me = this;
        const { onClose = () => null, } = me.props;
        onClose(e);
    };
    render() {
        return this.props.children;
    }
}

export default TagWarpper;

import React, { Component } from 'react';
import { Icon, Modal } from 'antd';
import TextEditor from '../text-editor';

import './index.less';

class HTMLEditor extends Component {
    constructor(props) {
        super(props);
        let me = this;
        me.state = {
            visible: true,
            value: props.value
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        });
    }
    onValueChange = (value) => {
        let me = this;
        me.setState({
            value
        });
    }
    close = () => {
        let me = this;
        me.setState({
            visible: false
        }, () => {
            me.props.onClose();
        });
    }
    onChange = (value) => {
        this.props.onChange(value);
    }
    onSave = () => {
        let me = this;
        me.onChange(me.state.value);
        me.close();
    }
    render() {
        let me = this;
        let {
            getWosSign
        } = me.props;
        let {
            visible,
            value,
        } = me.state;
        return (
            <Modal visible={visible}
                title="编辑"
                style={{ top: 10 }}
                width={1200}
                onCancel={me.close}
                onOk={me.onSave}
                maskClosable={false}
            >
                <TextEditor getWosSign={getWosSign} value={value} onChange={me.onValueChange} />
            </Modal>
        );
    }
}

class TextInput extends Component {
    constructor(props, context) {
        super(props, context);
    }
    shouldComponentUpdate() {
        return false;
    }
    setValue = (value) => {
        let me = this;
        me.refs.text.innerHTML = value;
    }
    onChange = (value) => {
        let me = this;
        let {
            onChange = () => null
        } = me.props;
        onChange(value);
    }
    onInput = (e) => {
        let me = this;
        let value = e.target.innerHTML;
        me.onChange(value);
    }
    render() {
        let me = this;
        let {
            height,
            defaultValue
        } = me.props;
        return (
            <div ref="text" className="text-area__text" contentEditable={true}
                style={{
                    height
                }}
                onInput={me.onInput}
                dangerouslySetInnerHTML={{
                    __html: defaultValue
                }}
            >
            </div >
        );
    }
}

class TextArea extends Component {
    constructor(props, context) {
        super(props, context);
        let me = this;
        me.state = {
            visible: false,
            value: props.value
        };
        me.value = props.value;
    }
    componentWillReceiveProps(nextProps){
        let me=this;
        me.setState({
            value:nextProps.value
        });
        me.value = nextProps.value;
    }
    onInput = (e) => {
        let me = this;
        let value = e.target.innerHTML;
        // me.onChange(value);
        me.setState({
            value
        });
    }
    onChange = (value) => {
        let me = this;
        let {
            onChange = () => null
        } = me.props;
        onChange(value);
    }
    onValueChange = (value) => {
        let me = this;
        me.setState({
            value
        }, () => {
            me.onChange(value);
        });
    }
    onEditValueChange = (value) => {
        let me = this;
        me.setState({
            value
        }, () => {
            me.refs.text.setValue(value);
            me.onChange(value);
        });
    }
    setEditVisible = (visible) => {
        let me = this;
        me.setState({
            visible
        });
    }
    render() {
        let me = this;
        let {
            className,
            height = 50,
            width = 150,
            getWosSign
        } = me.props;

        let {
            value,
            visible
        } = me.state;

        return (
            <div className={`text-area ${className}`} style={{ width }}>
                <TextInput ref="text"  defaultValue={value} height={height} onChange={me.onValueChange} ></TextInput>
                {
                    visible && (
                        <HTMLEditor
                            value={value}
                            getWosSign={getWosSign}
                            onClose={() => me.setEditVisible(false)}
                            onChange={me.onEditValueChange}
                        />
                    )
                }
                <Icon title="打开编辑器" className="edit" type="edit" onClick={() => me.setEditVisible(true)} />
            </div>
        );
    }
}

export default TextArea;
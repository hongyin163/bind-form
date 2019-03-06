import React, { Component } from 'react';
import { Icon, Modal } from 'antd';
import CodeEditor from '../code-editor';

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
    componentWillReceiveProps(nextProps){
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
            mode
        } = me.props;

        let {
            visible,
            value,
        } = me.state;
        return (
            <Modal visible={visible}
                title="编辑"
                style={{ top: 10, }}
                width={1200}
                onCancel={me.close}
                onOk={me.onSave}
                maskClosable={false}
            >
                <CodeEditor mode={mode} value={value} onChange={me.onValueChange} />
            </Modal>
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
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value
        });
    }
    onChange = () => {
        let me = this;
        let {
            onChange = () => null
        } = me.props;
        onChange(me.state.value);
    }
    onValueChange = (value) => {
        let me = this;
        me.setState({
            value
        }, () => {
            me.onChange();
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
            height = 250,
            width = '100%',
            mode
        } = me.props;
        let {
            value,
            visible
        } = me.state;
        return (
            <div className={`code-area ${className}`} style={{ width }}>
                <textarea
                    ref="text" className="code-area__text"
                    style={{
                        height
                    }}
                    onChange={(e) => me.onValueChange(e.target.value)}
                    value={value}
                >

                </textarea>
                {
                    visible && <HTMLEditor mode={mode} value={value} onClose={() => me.setEditVisible(false)} onChange={me.onValueChange} />
                }
                <Icon title="打开编辑器" className="edit" type="edit" onClick={() => me.setEditVisible(true)} />
            </div>
        );
    }
}

export default TextArea;
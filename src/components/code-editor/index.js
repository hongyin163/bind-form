import React, { Component } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';

import './index.less';
const LANMODE={
    'java':'text/x-java',
    'c++':'text/x-c++src',
    'python':'text/x-python',
    'c':'text/x-csrc',
    'javascript':'text/javascript'
};
class CodeEditor extends Component {
    constructor(props, context) {
        super(props, context);
        let me = this;
        me.state = {
            value: props.value || ''
        };
    }
    onChange() {
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
    render() {
        let me = this;
        let {
            mode = 'javascript'
        } = me.props;
        let {
            value,
        } = me.state;
        return (
            <div className="code-editor">
                <CodeMirror
                    value={value}

                    options={{
                        mode: LANMODE[mode]||'',
                        theme: 'material',
                        smartIndent: true,
                        lineNumbers: true,
                        autoCloseBrackets:true,
                        extraKeys: {'Shift-Space': 'autocomplete'}
                    }}
                    onBeforeChange={(editor, data, value) => {
                        me.onValueChange(value);
                    }}
                    onChange={() => {
                        // me.updateValue('script', value);
                    }}
                />
            </div>
        );
    }
}

export default CodeEditor;
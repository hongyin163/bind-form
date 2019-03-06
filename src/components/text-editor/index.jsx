import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import { uploadFile } from '@/common/service/wos';

// import 'braft-editor/dist/braft.css';
import 'braft-editor/dist/index.css';
import './index.less';
import http from '../../library/http';

/**
 * 非受控编辑器
 */
class Editor extends Component {
    constructor(props, context) {
        super(props, context);
        let me = this;
        me.state = {
            contentId: props.contentId,
            editorState: BraftEditor.createEditorState(props.defaultValue || props.value)
        };

    }
    componentWillReceiveProps(props) {
        let me = this;
        let {
            contentId
        } = me.state;
        if (contentId != props.contentId) {
            me.setState({
                contentId: props.contentId,
                editorState: BraftEditor.createEditorState(props.defaultValue || props.value)
            });
        }
    }
    handleEditorChange = (editorState) => {
        let me = this;
        let {
            onChange
        } = me.props;
        this.setState({ editorState }, () => {
            onChange(editorState.toHTML());
        });
    }
    isEmpty() {
        let me = this;
        let {
            editorState
        } = me.state;
        return editorState.isEmpty();
    }
    insertHTML(html) {
        let me = this;
        let {
            editorState
        } = me.state;
        me.setState({
            editorState: ContentUtils.insertHTML(editorState, html)
        });
    }
    getEditor = () => {
        return this.editorInstance;

    }
    getWosSign = (fileName) => {
        return http.get(`/api/file/token?fileName=${fileName}`)
            .then((res) => {
                if (res.code == 1) {
                    return res.data;
                } else {
                    throw new Error(res.message);
                }
            });
    }
    render() {
        let me = this;
        let {
            // contentId,
            // value = '',
            // defaultValue,
            height = 350,
            extendControls,
            getWosSign,
        } = me.props;

        const {
            editorState
        } = me.state;
        const editorProps = {
            height,
            value: editorState,
            onChange: this.handleEditorChange,
            extendControls,
            media: {
                uploadFn({ file, progress, success, error }) {
                    uploadFile(file, {
                        getWosSign(fileName) {
                            if (!getWosSign) {
                                return me.getWosSign(fileName);
                            }
                            return getWosSign(fileName);
                        },
                        onSuccess({url}) {
                            success({url});
                        },
                        onProgress: progress,
                        onError: error
                    });
                },
                accepts: {
                    image: 'image/png,image/jpeg,image/gif',
                    video: false,
                    audio: false
                }
            }
        };
        return (
            <div className="text-editor">
                <BraftEditor ref={(instance) => this.editorInstance = instance} {...editorProps} />
            </div>
        );
    }
}

export default Editor;
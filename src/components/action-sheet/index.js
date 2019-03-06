
import React, { Component } from 'react';
import { createPortal } from 'react-dom';

const ACTION_SHEET_ID = 'action-sheet-warpper';

import './index.less';
class ActionSheet extends Component {
    state = {
        visible: false,
        disable: true
    }
    componentWillReceiveProps(nextProps) {
        let me = this;
        let {
            visible
        } = me.state;

        if (visible == nextProps.visible) {
            return;
        }

        if (nextProps.visible) {
            me.setState({
                disable: false,
            }, () => {

                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    me.setState({
                        visible: true
                    });
                }, 100);
            });
        } else {
            me.setState({
                visible: false,
                disable: false
            }, () => {
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    me.setState({
                        disable: true
                    });
                }, 600);
            });
        }
    }
    close = () => {
        let me = this;
        let {
            onClose = () => null
        } = me.props;

        onClose();
    }
    hideMask = () => {
        this.close();
    }
    getDom() {
        let node = document.getElementById(ACTION_SHEET_ID);
        if (!node) {
            node = document.createElement('div');
            node.id = ACTION_SHEET_ID;
            document.body.appendChild(node);
        }
        return node;
    }
    renderPanel() {
        let me = this;
        let {
            children,
            height = 300,
        } = me.props;

        let {
            visible,
            disable
        } = me.state;

        if (disable) {
            return null;
        }

        return (
            <div className="action-sheet" >
                <div className={`action-sheet__mask ${visible ? 'show' : 'hide'}`} onClick={me.hideMask}></div>
                <div className={`action-sheet__panel ${visible ? 'show' : 'hide'}`} style={{ height }}>
                    {children}
                </div>
            </div>
        );
    }
    render() {
        return createPortal(this.renderPanel(), this.getDom());
    }
}

export default ActionSheet;
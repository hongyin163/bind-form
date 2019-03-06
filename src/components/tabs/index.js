import React, { Component } from 'react';

import './index.less';
class Tabs extends Component {
    constructor(props, context) {
        super(props, context);
        let me = this;
        me.state = {
            activeKey: props.defaultActiveKey
        };

    }
    componentWillReceiveProps(props) {
        let me = this;
        let {
            onChange = () => null
        } = me.props;
        if (props.activeKey) {
            if (me.state.activeKey != props.activeKey) {
                me.setState({
                    activeKey: props.activeKey
                }, () => {
                    onChange(me.state.activeKey);
                });
            }
        }
    }
    onTabClick = (e) => {
        let me = this;
        let {
            onChange = () => null
        } = me.props;

        let { target } = e;
        let role = target.getAttribute('role');
        if (role == 'tab') {
            let activeKey = target.getAttribute('tabKey');
            me.setState({
                activeKey
            }, () => {
                onChange(activeKey);
            });
        }
    }
    render() {
        let me = this;
        let {
            children
        } = me.props;
        let {
            activeKey
        } = me.state;
        let tabs = [];
        let tabPanels = [];
        React.Children.forEach(children, (child, i) => {
            if (i == 0 && !activeKey) {
                activeKey = child.key;
            }
            let props = child.props || {};

            tabs.push(
                <div role="tab" tabKey={child.key} className={`tabs__tab ${activeKey == child.key ? 'active' : ''}`} key={child.key}>
                    {props.tab}
                </div>
            );

            tabPanels.push(
                <div className="tabs__content" key={child.key} style={{
                    display: activeKey == child.key ? 'block' : 'none'
                }}>
                    {props.children}
                </div>
            );
        });


        return (
            <div className="tabs">
                <div className="tabs__nav" onClick={me.onTabClick}>
                    {tabs}
                </div>
                <div className="tabs__body">
                    {tabPanels}
                </div>
            </div>
        );
    }
}

class TabPane extends Component {
    state = {}
    render() {
        return (
            <div className="tabs__panel">

            </div>
        );
    }
}

Tabs.TabPane = TabPane;

export default Tabs;
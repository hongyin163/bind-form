import React, { Component } from 'react';
import { TabsProps, TabPaneProps } from './types';

class Tabs extends Component<TabsProps, any> {
    static TabPane: typeof TabPane;
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {
            activeKey: props.defaultActiveKey,
        };

    }
    componentWillReceiveProps(props) {
        const me = this;
        const {
            onChange = () => null,
        } = me.props;
        if (props.activeKey) {
            if (me.state.activeKey !== props.activeKey) {
                me.setState({
                    activeKey: props.activeKey,
                }, () => {
                    onChange(me.state.activeKey);
                });
            }
        }
    }
    onTabClick = (activeKey) => {
        const me = this;
        const {
            onChange = () => null,
        } = me.props;
        me.setState({
            activeKey,
        }, () => {
            onChange(activeKey);
        });
    }
    render() {
        const me = this;
        const {
            children,
            className = '',
        } = me.props;
        let {
            activeKey,
        } = me.state;
        const tabs = [];
        const tabPanels = [];
        React.Children.forEach(children, (child: React.ReactElement) => {
            if (!child || !child.key) {
                return;
            }
            if (!activeKey) {
                activeKey = child.key;
            }
            
            const props = child.props || {};

            tabs.push(
                <div role="tab"
                    onClick={me.onTabClick.bind(me, child.key)}
                    className={`biz-tabs_tab ${activeKey === child.key ? 'active' : ''}`}
                    key={child.key}
                >
                    <span dangerouslySetInnerHTML={{
                        __html: props.tab,
                    }}></span>
                    <div className="line"></div>
                </div>,
            );

            tabPanels.push(
                <div className="biz-tabs_content" key={child.key} style={{
                    display: activeKey === child.key ? 'block' : 'none',
                }}>
                    {props.children}
                </div>,
            );
        });

        return (
            <div className={`biz-tabs ${className}`}>
                <div className="biz-tabs_nav" >
                    {tabs}
                </div>
                <div className="biz-tabs_body">
                    {tabPanels}
                </div>
            </div>
        );
    }
}

class TabPane extends Component<TabPaneProps, any> {
    state = {}
    render() {
        return (
            <div className="biz-tabs_panel">

            </div>
        );
    }
}

Tabs.TabPane = TabPane;

export default Tabs;

import React, { Component } from 'react';
import { Layout } from 'antd';
import MainLayout from '../layout';

const { Content, Sider } = Layout;

import './index.less';

class LayoutSide extends Component {
    state = {}
    render() {
        let me = this;
        let {
            children,
            sideWidth = 150,
            renderSide = () => (null),
            renderHeader = () => (null),
            renderBreadCrumb = () => (null),
            footerVisible,
            className
        } = me.props;

        return (
            <MainLayout
                className={className}
                renderHeader={renderHeader}
                renderBreadCrumb={renderBreadCrumb}
                footerVisible={footerVisible}
            >
                <Layout>
                    <Sider className="layout-side__left" width={sideWidth} >
                        {renderSide()}
                    </Sider>
                    <Content className="layout-side__content" >
                        {children}
                    </Content>
                </Layout>
            </MainLayout>
        );
    }
}

export default LayoutSide;
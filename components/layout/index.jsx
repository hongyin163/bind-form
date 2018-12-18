import React, { Component } from 'react';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;
import './index.less';

class MainLayout extends Component {
    state = {}
    render() {
        let me = this;
        let {
            children,
            className,
            renderHeader = () => null,
            renderBreadCrumb = () => null,
            footerVisible = true
        } = me.props;
        return (
            <Layout className={`layout ${className}`}>
                <Header>
                    {renderHeader()}
                </Header>
                <Content className="layout__content">
                    {renderBreadCrumb()}
                    {children}
                </Content>
                <Footer style={{ textAlign: 'center',display:footerVisible?'block':'none' }}>
                    Copyright © 五八同城信息技术有限公司 版权所有
                </Footer>
            </Layout>
        );
    }
}

export default MainLayout;
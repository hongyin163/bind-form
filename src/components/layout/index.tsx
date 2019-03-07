import * as React from 'react';
import { Component } from 'react';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;
import './index.less';

const initialState = {count:0};
type State = Readonly<typeof initialState>;

class AtsLayout extends Component<any,State> {
    readonly state:State = initialState;
    
    render() {
        let me = this;
        console.log(this.state.count);
        let {
            children,
            className,
            renderHeader,
            renderBreadCrumb,
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


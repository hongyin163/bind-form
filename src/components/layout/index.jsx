import React, { Component } from 'react';

function generator({ prefixCls }) {
    return class Basic extends Component {
        render() {
            let {
                className,
                children,
                ...rest
            } = this.props;
            return (
                <div className={`${className} ${prefixCls}`} {...rest}>
                    {children}
                </div>
            );
        }
    };
}

const Header = generator({
    prefixCls: 'biz-layout_header'
});

const Footer = generator({
    prefixCls: 'biz-layout_footer'
});

const Content = generator({
    prefixCls: 'biz-layout_content'
});

const Side = generator({
    prefixCls: 'biz-layout_side'
});


const Layout = generator({
    prefixCls: 'biz-layout'
});

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;
Layout.Side = Side;

export default Layout;
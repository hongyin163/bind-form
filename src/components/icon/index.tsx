
import classNames from 'classnames';
import React, { Component } from 'react';
export interface IconProps {
    type?: string;
    className?: string;
    title?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    spin?: boolean;
    style?: React.CSSProperties;
    prefixCls?: string;
}

class Icon extends Component<IconProps, any> {
    public state = {}
    public render() {
        const {
            prefixCls = 'biz-icon',
            className,
            type,
            ...rest
        } = this.props;
        const cls = classNames(prefixCls, ` biz-icon-${type}`, className);
        return (
            <i className={cls} {...rest}></i>
        );
    }
}

export default Icon;

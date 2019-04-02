import classNames from 'classnames';
import React, { Component } from 'react';

// import './index.less';
/**
 * type ['primary','minor','danger']
 */
const ButtonTypes = ['primary', 'minor', 'danger'];

// export type ButtonType = (typeof ButtonTypes)[number];

export interface BaseButtonProps {
    size?: 'small' | 'large' | 'default',
    type?: 'primary' | 'minor' | 'danger';
    className?: string;
    children?: React.ReactNode;
    onClick?: (e) => any,
    disabled?: boolean,
    cStyle?: {}
}

class Button extends Component<BaseButtonProps, any>{
    public handleClick = (e) => {
        const {
            onClick,
        } = this.props;
        if (onClick) {
            onClick(e);
        }
    }
    public render() {
        const {
            cStyle,
            children,
            type = '',
            className = '',
            disabled = false,
            size = 'default',
            ...rest
        } = this.props;

        const cls = classNames('biz-button', { [`biz-button_${type}`]: type }, `biz-button_${size}`, className)
        return (
            <button
                disabled={disabled}
                className={cls}
                style={cStyle}
                onClick={this.handleClick}
                {...rest}
            >
                {children}
            </button>
        );
    }
}

export default Button;

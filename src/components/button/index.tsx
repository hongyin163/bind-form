import classNames from 'classnames';
import React, { Component } from 'react';

// import './index.less';
/**
 * type ['primary','minor','danger']
 */
const ButtonTypes = ['primary', 'minor', 'danger'];

export type ButtonType = (typeof ButtonTypes)[number];

export interface BaseButtonProps {
    type?: ButtonType;
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
            ...rest
        } = this.props;
        return (
            <button
                disabled={disabled}
                className={classNames('ats-btn', { [`ats-btn__${type}`]: type }, className)}
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

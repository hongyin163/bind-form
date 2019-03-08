import React, { Component } from 'react';
import { Omit } from '../_util/type';

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    prefixCls?: string;
    size?: 'large' | 'default' | 'small';
    onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}


class Input extends Component<InputProps, any> {
    state = {}

    render() {
        let me = this;
        let {
            type,
            value,
            prefixCls,
            size,
            onPressEnter,
            addonBefore,
            addonAfter,
            prefix,
            suffix,
            className,
            ...rest
        } = me.props;
        return (
            <input 
                className={`biz-input ${className}`}
                ref="input"                
                value={value}
                type={type}
                {...rest}
            />
        );
    }
}

export default Input;
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
    public static defaultProps = {
        onPressEnter: (e) => void 0,
    }
    public state = {}
    public focus() {
        const input = this.refs.input as HTMLInputElement;
        input.focus();
    }
    public blur(){
        const input = this.refs.input as HTMLInputElement;
        input.blur();
    }
    public render() {
        const me = this;
        const {
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
                onKeyDown={me.onKeyPress}
                {...rest}
            />
        );
    }
    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const me = this;
        const {
            onPressEnter,
        } = me.props;
        if (e.keyCode === 13) {
            onPressEnter(e);
        }
    }
}

export default Input;

import classNames from 'classnames';
import React, { Component } from 'react'
import Animate from 'rc-animate';
import Icon from '../icon'
import Input, { InputProps } from '../input';
import TagWarpper from './TagWarpper';

type valueType = any[];

interface IInputTagProps {
    value: valueType;
    onChange: (value: valueType) => any,
    valueField: string,
    textField: string,
    onInputChange: (input: string) => any,
    onPressEnter?: (input: string) => object,

    onFocus?: () => any,
    onBlur?: () => any,
}

interface IInputTagState {
    value: any[];
    input?: string;
    isWarp: boolean;
}



export default class InputTag extends Component<IInputTagProps, IInputTagState> {
    public static defaultProps = {
        value: [],
        valueField: 'value',
        textField: 'text',
        onInputChange: (value) => value,
        onChange: (value) => void 0,
        onFocus: () => void 0,
        onBlur: () => void 0,
    }
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {
            value: me.formAtVale(props.value),
            input: '',
            isWarp: false,
        }
    }
    public componentWillReceiveProps(nextProps) {
        if (this.props.value.length !== nextProps.value.length) {
            this.setState({
                value: this.formAtVale(nextProps.value),
            })
        }
    }
    public render() {
        const me = this;
        const {
            input,
            isWarp,
        } = me.state;
        const cls = classNames('biz-input', 'biz-input-tag', isWarp ? 'wrap' : '')
        return (
            <div className={cls} onClick={me.onWarperClick}>
                {
                    isWarp ? (
                        <TagWarpper onClose={me.onBlur}>
                            {me.renderList()}
                        </TagWarpper>
                    ) : me.renderList()
                }
                <Input
                    ref='input'
                    value={input}
                    className="noborder"
                    style={{ width: 80 }}
                    onFocus={me.onFocus}
                    onChange={me.onInputChange}
                    onPressEnter={me.onPressEnter}
                />
                <div className="biz-input-tag_arrow-warpper">
                    <Animate
                        component=''
                        showProp={'data-visible'}
                        transitionName="rotate"
                    >
                        <Icon key="1"  className="biz-input-tag_arrow" data-visible={isWarp} type="arrow-down" style={{
                            transform: `rotate(${isWarp ? '180deg' : '0'})`,
                        }} />
                    </Animate>
                </div>
                ,
            </div>
        )
    }
    private addTag(value, text) {
        const me = this;
        const {
            valueField,
            textField,
        } = me.props;
        return new Promise((resolve) => {
            me.setState((state) => {
                const tag = {
                    [valueField]: value,
                    [textField]: text,
                }
                const val = state.value;
                val.push(tag);
                return state;
            }, resolve)
        })
    }
    private removeTag(value) {
        const me = this;
        const {
            valueField,
        } = me.props;
        return new Promise((resolve) => {
            me.setState((state) => {
                const vals = state.value;
                const index = vals.findIndex(p => p[valueField] === value);
                vals.splice(index, 1);
                return state;
            }, resolve)
        })
    }
    private setInput(input) {
        return new Promise((resolve) => {
            this.setState({
                input,
            }, resolve)
        })
    }
    private setIsWarp(isWarp) {
        return new Promise((resolve) => {
            this.setState({
                isWarp,
            }, resolve)
        })
    }
    private onWarperClick = (e: React.MouseEvent) => {
        const me = this;
        const {
            isWarp,
        } = me.state;
        console.log('isWarp', isWarp)
        if (isWarp) {
            e.nativeEvent.stopImmediatePropagation();
            const input = me.refs.input as HTMLInputElement;
            input.focus();
        } else {
            me.setIsWarp(true).then(() => {
                const input = me.refs.input as HTMLInputElement;
                input.focus();
            })
        }
        e.stopPropagation();


    }
    private onInputChange = (e) => {
        const me = this;
        const {
            onInputChange,
        } = me.props;
        this.setState({
            input: e.target.value,
        }, () => {
            onInputChange(me.state.input);
        })
    }
    private onPressEnter = (e) => {
        const me = this;
        const {
            input,
        } = me.state;
        if (!input) {
            return false;
        }
        const {
            onPressEnter,
            onChange,
        } = me.props;
        if (onPressEnter) {
            onPressEnter(input);
            return;
        }
        me.addTag(input, input)
            .then(() => {
                onChange(me.state.value);
            });
        me.setInput('')
        // me.setInput('').then(() => {
        //     const x = me.refs.input as HTMLInputElement;
        //     x.blur();
        // })
    }
    private renderList() {
        const me = this;
        const {
            value,
        } = me.state;
        const {
            valueField, textField,
        } = me.props

        return value.map((item) => {
            const val = item[valueField];
            const txt = item[textField];
            return (
                <span className="biz-input-tag_item"  >
                    <span data-value={val}>{txt}</span>
                    <Icon type="close" title="删除" onClick={me.onRemove.bind(me, val)} />
                </span>
            )
        })
    }
    private onRemove = (value, e: React.MouseEvent<any>) => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
        const me = this;
        const {
            onChange,
        } = me.props;

        me.removeTag(value)
            .then(() => {
                onChange(me.state.value);
            });
    }
    private formAtVale(value = []) {
        const me = this;
        const {
            valueField,
            textField,
        } = me.props;
        return value.map((item) => {
            if (typeof item === 'object') {
                return item;
            }
            return {
                [valueField]: item,
                [textField]: item,
            }
        })
    }
    private onFocus = () => {
        const me = this;
        const {
            onFocus,
        } = me.props;
        console.log('onFocus');
        me.setIsWarp(true).then(() => {
            onFocus();
        })
    }
    private onBlur = (e) => {
        const me = this;
        const {
            onBlur,
        } = me.props;
        console.log('onBlur');
        me.setIsWarp(false).then(() => {
            onBlur();
        })
    }
}

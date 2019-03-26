import classNames from 'classnames';
import Animate from 'rc-animate';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Icon from "../icon";
import Panel from './panel';
// import Input from '../input';
type valueType = string | number | undefined | any[];

export interface ISelectPanelProps {
    mode?: 'default' | 'multiple' | 'tags' | 'combobox' | string;
    defaultValue?: valueType;
    value?: valueType;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
    readonly?: boolean;
    visible: boolean;
    style?: object;
    className?: string,
    renderValue?: (value: valueType) => React.ReactElement,
    renderInput?: (value: valueType) => React.ReactElement,
    placeholder?: string | React.ReactNode;
}

interface ISelectPanelState {
    value?: valueType;
    visible: boolean;
}

class SelectPanel extends Component<ISelectPanelProps, ISelectPanelState>{
    public static defaultProps = {
        value: '',
        onChange: () => null,
        renderValue: (value) => value,
        visible: false,
    }
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {
            visible: false,
        }
    }
    componentWillReceiveProps(props) {
        const me = this;
        me.setState({
            value: props.value,
            visible: props.visible,
        })
    }
    public render() {
        const me = this;
        const {
            style = {},
            className,
        } = me.props;
        const cls = classNames("biz-select-panel", className);
        return (
            <div className={cls} style={style}>
                {
                    me.renderInput()
                }
                {
                    me.renderPanel()
                }
            </div>
        )
    }
    private renderInput = () => {
        const me = this;
        const {
            value,
            renderValue,
            placeholder,
            renderInput,
        } = me.props;
        const {
            visible,
        } = me.state;
        return (
            <div className="biz-select-panel_input" ref="input" onClick={me.onClickInput}>
                {
                    !renderInput && (
                        [<div className="biz-input biz-select-panel_render ">
                            {
                                value ? renderValue(value) : <span className="placeholder">{placeholder}</span>
                            }
                        </div>,
                        <Animate
                            component=''
                            showProp={'data-visible'}
                            transitionName="rotate"
                        >
                            <Icon key="1" className="biz-select-panel_arrow" data-visible={visible} type="arrow-down" style={{
                                transform: `rotate(${visible ? '180deg' : '0'})`,
                            }} />
                        </Animate>,
                        ]
                    )
                }
                {
                    renderInput && renderInput(value)
                }

            </div>
        )
    }
    private onClickInput = (e) => {
        const me = this;
        me.setVisible(true);
    }
    private setVisible = (visible) => {
        const me = this;
        return new Promise((resolve) => {
            me.setState({
                visible,
            }, resolve)
        })
    }
    private onClose = () => {
        this.setVisible(false);
    }
    private onClickPanel = (e: React.MouseEvent<any>) => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
    }
    private getPanelStyle = () => {
        const me = this;
        const node = ReactDOM.findDOMNode(me.refs.input) as HTMLElement;
        const {
            top, left, right, height, bottom, width,
        } = node.getBoundingClientRect();
        return {
            top: bottom,
            left,
            width,
        }
    }
    private renderPanel = () => {
        const me = this;
        const {
            visible,
        } = me.state;
        const {
            children,
        } = me.props;
        return (
            ReactDOM.createPortal(
                <Animate
                    transitionName="slide-up"
                >
                    {
                        visible && (
                            <div
                                className="biz-select-panel_content"
                                onClick={me.onClickPanel}
                                style={{
                                    ...me.getPanelStyle(),
                                }}
                            >
                                <Panel onClose={me.onClose}>
                                    {children}
                                </Panel>
                            </div>
                        )
                    }
                </Animate>, document.body)
        )
    }
}

export default SelectPanel;

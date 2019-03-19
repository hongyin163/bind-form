import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';
import { SelectProps } from './interface';
import Option from './option';
import './style/index.less';

export interface SelectPropsCustom extends SelectProps {
    label?: string;
    className?: string;
    onClick?: () => void;
    children?: React.ReactElement[];
}

export default class Select extends Component<SelectPropsCustom, {}>{
    public static Option: typeof Option;
    public dropdownContainer: HTMLDivElement;

    public state = {
        selected: false,
        value: '',
        checkedLabel: '',
    };
    public componentDidMount() {
        this.setDefaultValue();
    }
    public setDefaultValue = () => {
        const me = this;
        const {
            children,
            defaultValue,
        } = this.props;
        if (defaultValue) {
            React.Children.map(children, (child: React.ReactElement, i) => {
                if (defaultValue == child.props.value) {
                    me.setState({
                        value: child.props.value,
                        checkedLabel: child.props.children,
                    });
                }
            })
        } else {
            me.setState({
                value: children[0].props.value,
                checkedLabel: children[0].props.children,
            });
        }
    }
    // 点击选择
    public handleSelected = e => {
        this.renderSelectMenu();
        const {
            onClick,
        } = this.props;
        onClick && onClick();
    };
    public onOptionSelect = (val) => {
        const {
            onChange,
        } = this.props;
        console.log(val);
        this.setState({
            value: val.value,
            checkedLabel: val.children,
        });
        onChange(val.value, val.children);
    }
    // 获取option节点
    public getChildOptions = () => {
        const {
            children,
        } = this.props;
        return React.Children.map(children, (child: React.ReactElement, i) => {
            return React.cloneElement(child, {
                id: i,
                onSelect: this.onOptionSelect,
                className: '',
            })
        })
    }
    // 渲染option
    public renderOption = (left: number, top: number, width: number) => {
        const me = this;
        const {
            selected,
        } = this.state;
        const childs = this.getChildOptions();
        return (
            <div className="curtain" onClick={this.handleCloseSelect} style={{ display: selected ? 'none' : 'block' }}>
                <div
                    className='biz-select-dropdown'
                    style={{ width, top, left }}
                >
                    {childs}
                </div>
            </div>
        );
    };
    // 渲染下拉列表
    public renderSelectMenu = () => {
        this.setState({
            selected: !this.state.selected,
        });
        if (!this.dropdownContainer) {
            this.dropdownContainer = document.createElement('div');
        }

        const dom: any = ReactDOM.findDOMNode(this);
        const { left, top, width, height } = dom.getBoundingClientRect();

        document.body.appendChild(this.dropdownContainer);
        ReactDOM.render(
            this.renderOption(left, top + height + 3, width),
            this.dropdownContainer,
        );
    };
    // 关闭下拉列表
    public handleCloseSelect = () => {
        this.setState({
            selected: true,
        });
        this.renderSelectMenu();
    };
    public render() {
        const {
            className,
            label = '',
            style = {},
        } = this.props;
        const { selected, checkedLabel } = this.state;
        return (
            <div className={classnames('biz-select', className, { 'biz-selected': selected })}
                ref="bizSelect"
                style={style}
            >
                {
                    label ? (
                        <div className="biz-select-label">{label}</div>
                    ) : ''
                }
                <div
                    className={classnames('biz-select-selection')}
                    onClick={this.handleSelected.bind(this, event)}
                >
                    <div className="biz-select-selection_rendered">
                        <div className={classnames('biz-select-selection-selected-value')}>
                            {checkedLabel}
                        </div>
                        <span unselectable="on" className="biz-select-arrow">
                            <i className="biz-select-arrow-icon" />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
Select.Option = Option;

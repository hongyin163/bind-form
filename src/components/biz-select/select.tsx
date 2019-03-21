import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'biz-ui';
import classnames from 'classnames';
import { SelectProps } from './interface';
import Option from './option';
import './style/index.less';

export interface SelectPropsCustom extends SelectProps {
    label?: string;
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

export default class BizSelect extends Component<SelectPropsCustom, {}>{
    public static Option: typeof Option;
    public dropdownContainer: HTMLDivElement;

    public state = {
        selected: false,
        value: '',
        checkedLabel: '',
    };
    
    // 点击选择
    public handleSelected = (e) => {
        console.log(e.target);
        this.renderSelectMenu(e.target);
        const {
            onClick,
        } = this.props;
        onClick && onClick();
    };
    public onOptionSelect = (val) => {
        const {
            onChange,
        } = this.props;
        this.setState({
            value: val.value,
            checkedLabel: val.children,
        });
        onChange && onChange(val.value, val.children);
    }
    // 渲染option
    public renderOption = (left: number, top: number, width: number) => {
        const me = this;
        const {
            selected,
        } = this.state;
        return (
            <div className="curtain" onClick={this.handleCloseSelect} style={{ display: selected ? 'none' : 'block' }}>
                <div
                    className='biz-select-dropdown'
                    style={{ width, top, left }}
                >
                12123123
                </div>
            </div>
        );
    };
    // 渲染下拉列表
    public renderSelectMenu = (target) => {
        this.setState({
            selected: !this.state.selected,
        });
        if (!this.dropdownContainer) {
            this.dropdownContainer = document.createElement('div');
        }
        // const dom: any = ReactDOM.findDOMNode(this);

        const { left, top, width, height } = target.getBoundingClientRect();

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
    };
    public render() {
        const {
            className,
            label = '',
            style = {},
        } = this.props;
        const { selected, checkedLabel } = this.state;
        return (
            <div 
                className={classnames('biz-select', className, { 'biz-selected': selected })}
                ref="bizSelect"
                style={style}
                onClick={this.handleSelected.bind(this)}
            >
                {
                    label ? (
                        <div className="biz-select-label">{label}</div>
                    ) : ''
                }
                <div
                    className={classnames('biz-select-selection')}
                    
                >
                    <div className="biz-select-selection_rendered">
                        <div className={classnames('biz-select-selection-selected-value')}>
                            {checkedLabel}
                        </div>
                        <span unselectable="on" className="biz-select-arrow">
                            {/* <i className="biz-select-arrow-icon" /> */}
                            <Icon type='arrow-down'/>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
BizSelect.Option = Option;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {SelectProps } from './interface';
import classnames from 'classnames';
import Option from './option';
import './style/index.less';
import { Props } from '../../../../../src/cv/components/demo.bak';

export interface SelectPropsCustom extends  SelectProps{
    label?:string;
    className?: string;
}

export default class Select extends Component< SelectPropsCustom, {}>{
    static Option: typeof Option;
    public dropdownContainer: HTMLDivElement;

    state = {
        selected: false,
        value:'',
        checkedLabel:''
    };
    componentDidMount(){
        this.setDefaultValue();
    }
    setDefaultValue = ()=>{
        let me = this;
        let {
            children,
            defaultValue
        } = this.props;
        if(defaultValue){
            React.Children.map(children,(child:React.ReactElement,i)=>{
                if(defaultValue == child.props.value){
                    me.setState({
                        value:child.props.value,
                        checkedLabel:child.props.children
                    });
                }
            })
        }else{
            me.setState({
                value:children[0].props.value,
                checkedLabel:children[0].props.children
            });
        }
    }
    // 点击选择
    handleSelected = e => {
        this.renderSelectMenu();
    };
    onOptionSelect=(value)=>{
        this.setState({
            value:value.value,
            checkedLabel:value.children
        });
    }
    // 获取option节点
    getChildOptions = ()=>{
        let {
            children
        } = this.props;
        return React.Children.map(children,(child:React.ReactElement,i)=>{
            return React.cloneElement(child,{
                onSelect:this.onOptionSelect
            })
        })
    }
    // 渲染option
    renderOption = (left: number, top: number, width: number) => {
        let me=this;
        let {
            selected
        } = this.state;
        let childs = this.getChildOptions();
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
    renderSelectMenu = () => {
        this.setState({
            selected: !this.state.selected,
        });
        if (!this.dropdownContainer) {
            this.dropdownContainer = document.createElement('div');
        }

        let dom: any = ReactDOM.findDOMNode(this);
        let { left, top, width, height } = dom.getBoundingClientRect();

        document.body.appendChild(this.dropdownContainer);
        ReactDOM.render(
            this.renderOption(left, top + height + 3, width),
            this.dropdownContainer
        );
    };
    // 关闭下拉列表
    handleCloseSelect = () => {
        this.renderSelectMenu();
    };
    render() {
        let { 
            className,
            label = ''
        } = this.props;
        let { selected,checkedLabel } = this.state;
        return (
            <div className={classnames('biz-select', className, { 'biz-selected': selected })} ref="bizSelect">
                {
                    label?(
                        <div className="biz-select-label">{label}</div>
                    ):''
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

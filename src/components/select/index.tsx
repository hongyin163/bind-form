import React, { Component } from 'react'
import { SelectValue,SelectProps } from './interface';
import classnames from 'classnames';

import './style/index.less';

export default class Select<T = SelectValue> extends Component<SelectProps<T>,any>{
    state = {
        selected:false
    }
    handleSelected = ()=>{
        this.setState({
            selected:!this.state.selected
        });
    }
    render(){
        let {
            className
        } = this.props;
        let {
            selected
        } = this.state;
        return (
            <div className={classnames('biz-select',className)}>
                <div className={classnames('biz-select-selection',{'biz-selected':selected})} onClick={this.handleSelected}>
                    <div className='biz-select-selection_rendered'>
                        <div className={classnames('biz-select-selection-selected-value')}> 
                            李佳阳asdasdasdasdasdasdasdasdasdasdasd
                        </div>
                        <span unselectable="on" className='biz-select-arrow'>
                            <i className='biz-select-arrow-icon'></i>
                        </span>
                    </div>

                </div>
            </div>
        );
    }
};

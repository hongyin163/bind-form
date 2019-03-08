import React, { Component } from 'react';
import './index.less';
import classNames from 'classnames';

/**
 * type ['primary','minor','danger']
 */
class atsButton extends Component{
    handleClick = ()=>{
        let {
            success
        } = this.props;
        if(success){
            success();
        }
    }
    render(){
        let {
            cStyle,
            children,
            type = '',
            className = '',
            disabled = false
        } = this.props;
        return (
            <button 
                disabled={disabled} 
                className={classNames('ats-btn',type?`ats-btn__${type}`:'',className)}  
                style={cStyle} 
                onClick={this.handleClick}
            >
                {children}
            </button>
        );
    }
}

export default atsButton;

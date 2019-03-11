import React, { Component } from 'react';
import classnames from 'classnames';

interface CheckboxProps {
    checked?: boolean,
    onChange?: Function,
    disabled?: boolean,
    className?: string
}

class Checkbox extends Component<CheckboxProps, any> {
    onCheck = () => {
        let me = this;
        let {
            checked,
            onChange = () => null
        } = me.props;

        onChange(!checked);
    }
    render() {
        let me = this;
        let {
            checked,
            disabled,
            className,
            ...rest
        } = this.props;
        let cls = classnames({
            'biz-checkbox': true,
            'checked': checked,
            'disabled': disabled,
            [className]: !!className
        })
        return (
            <div className={cls} onClick={me.onCheck}>
                
            </div >
        );
    }
}

export default Checkbox;
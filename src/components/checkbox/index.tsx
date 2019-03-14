import classnames from 'classnames';
import React, { Component } from 'react';
import Icon from '../icon'

interface CheckboxProps {
    checked?: boolean,
    onChange?: Function,
    disabled?: boolean,
    className?: string
}

class Checkbox extends Component<CheckboxProps, any> {
    public onCheck = () => {
        const me = this;
        const {
            checked,
            onChange = () => null,
        } = me.props;

        onChange(!checked);
    }
    public render() {
        const me = this;
        const {
            checked,
            disabled,
            className,
            ...rest
        } = this.props;
        const cls = classnames({
            'biz-checkbox': true,
            'checked': checked,
            'disabled': disabled,
            [className]: !!className,
        })
        const type = checked ? 'checked1' : 'unchecked1';
        return (
            <div className={cls} onClick={me.onCheck}>
                <Icon type={type} />
            </div >
        );
    }
}

export default Checkbox;

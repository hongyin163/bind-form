import React, { Component } from 'react';
import classnames from 'classnames';

interface CheckboxProps {
    checked?: boolean,
    onChange: Function,
    disabled?: boolean,
    className: string
}

class Radio extends Component<CheckboxProps, any> {
    onCheck = () => {
        let me = this;
        let {
            checked,
            onChange = () => null
        } = me.props;

        onChange(!checked);
    }
    static RadioGroup: typeof RadioGroup;
    render() {
        let me = this;
        let {
            checked,
            disabled,
            className,
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

class RadioGroup extends Component {
    state = {}
    render() {
        let me = this;
        let {
            children
        } = me.props;
        return (
            <div className="radio-group">
                {children}
            </div>
        );
    }
}

Radio.RadioGroup = RadioGroup;

export default Radio;
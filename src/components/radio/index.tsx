import classnames from 'classnames';
import React, { Component } from 'react';
import Icon from '../icon'
import { RadioGroup } from './RadioGroup';

interface RadioProps {
    checked?: boolean,
    onChange?: (e) => void;
    disabled?: boolean,
    className?: string,
    defaultChecked?: boolean;
}

class Radio extends Component<RadioProps, any> {
    public static RadioGroup: typeof RadioGroup;
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
            className='',
        } = this.props;
        const cls = classnames({
            'biz-radio': true,
            'checked': checked,
            'disabled': disabled,
            [className]: !!className,
        })
        const type = checked ? 'checked2' : 'unchecked2';
        return (
            <div className={cls} onClick={me.onCheck}>
                <Icon type={type} />
            </div >
        );
    }
}

Radio.RadioGroup = RadioGroup;

export default Radio;

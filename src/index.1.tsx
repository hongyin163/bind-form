import React, { Component } from 'react';
import classnames from 'classnames';
import { FormProps } from './types';

class Form extends Component<FormProps, any> {
    formData: {};
    cache = {}
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.formData = {};
    }
    componentWillReceiveProps(props) {
        const me = this;
        const {
            value,
        } = props;
        me.setState(value);
    }
    onFieldChange(name, e) {
        const me = this;
        const {
            onChange = () => void 0,
        } = me.props;
        me.formData = Object.assign(me.formData, {
            [name]: e.target.value,
        });
        // e.target.name = name;
        // let x=new Event('',);
        // React.
        onChange(e);
    }
    bindEvent(value, childs) {
        const me = this;
        if (!childs || React.Children.count(childs) == 0) {
            return;
        }
        // debugger;
        React.Children.forEach(childs, (child) => {
            if (!child.props) {
                return;
            }

            const { bind, children, onChange } = child.props;

            if (bind) {
                child.props.value = value[bind];
                if (!onChange) {
                    // console.log('bind event');
                    if (me.cache[bind]) {
                        // console.log('bind event cache');
                        child.props.onChange = me.cache[bind];
                    } else {
                        // console.log('bind event init');
                        me.cache[bind] = me.onFieldChange.bind(me, bind);
                        child.props.onChange = me.cache[bind];
                    }
                }
            }

            me.bindEvent(value, children);
        });
    }
    render() {
        const me = this;
        const {
            value,
            className,
            children,
            ...rest
        } = me.props;
        const cls = classnames("form", className);
        me.bindEvent(value, children);
        return (
            <form className={cls} {...rest}>
                {children}
            </form>
        );
    }
}

export default Form;

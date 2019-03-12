import React, { Component } from 'react';
import classnames from 'classnames';
import FormContext from './Context';
import { FormItemProps } from './types';

class FormItem extends Component<FormItemProps, any> {
    constructor(props, context) {
        super(props, context);
    }
    static contextType = FormContext;
    static displayName = "FormItem"
    state = {}
    getSizeCls({ span = 0, order = 0, offset = 0, push = 0, pull = 0 }) {
        const prefixCls = "biz-col";
        const classes = classnames(
            {
                [`${prefixCls}-${span}`]: span !== undefined,
                [`${prefixCls}-order-${order}`]: order,
                [`${prefixCls}-offset-${offset}`]: offset,
                [`${prefixCls}-push-${push}`]: push,
                [`${prefixCls}-pull-${pull}`]: pull,
            }
        );
        return classes;
    }
    getControls(children: React.ReactNode, recursively: boolean) {
        let controls: React.ReactElement<any>[] = [];
        const childrenArray = React.Children.toArray(children);
        for (let i = 0; i < childrenArray.length; i++) {
            if (!recursively && controls.length > 0) {
                break;
            }

            const child = childrenArray[i] as React.ReactElement<any>;
            if (
                child.type &&
                ((child.type as any) === FormItem || (child.type as any).displayName === 'FormItem')
            ) {
                continue;
            }
            if (!child.props) {
                continue;
            }
            if ('data-bind' in child.props) {
                // And means FIELD_DATA_PROP in child.props, too.
                controls.push(child);
            } else if (child.props.children) {
                controls = controls.concat(this.getControls(child.props.children, recursively));
            }
        }
        return controls;
    }
    getOnlyControl() {
        const child = this.getControls(this.props.children, false)[0];
        return child !== undefined ? child : null;
    }
    getFieldName = () => {
        let me = this;
        let child = me.getOnlyControl() as React.ReactElement<any>;
        // debugger;
        if (!child || !child.props) {
            return '';
        }
        const bind = child.props['data-bind'];
        return bind;
    }
    getHelpMessage = (context) => {
        if (!context) {
            return null;
        }

        let me = this;
        // console.log(me);
        let {
            help
        } = me.props;
        let fieldName = me.getFieldName();
        if (!fieldName) {
            return '';
        }

        let {
            validate: {
                errors = {}
            } = {}
        } = context;

        let errs = (errors[fieldName] || []) as Array<React.ReactNode>;
        if (help) {
            errs.unshift(help);
        }

        return errs.length > 0 && (
            <div className="biz-form_explain">
                {errs}
            </div>
        )
    }
    renderLabel() {
        let me = this;
        let {
            label,
            labelCol,
            wrapperCol,
            style,
            validateStatus,
            help
        } = me.props;

        if (!label) {
            return null;
        }

        const labelCls = classnames('biz-form_label', me.getSizeCls({ span: labelCol }));
        return (
            <div className={labelCls}>
                <label>{label}</label>
            </div>
        )

    }
    render() {
        let me = this;
        let {
            label,
            labelCol,
            wrapperCol,
            style,
            validateStatus,
            help
        } = me.props;
        const wrapperCls = classnames('biz-form_content', me.getSizeCls({ span: wrapperCol }));
        return (
            <FormContext.Consumer>
                {(context) => {
                    console.log(context);
                    return (<div className='biz-form_item'>
                        {me.renderLabel()}
                        <div className={wrapperCls}>
                            <div className="biz-form_control">
                                {this.props.children}
                            </div>
                            {me.getHelpMessage(context)}
                        </div>
                    </div>)
                }}
            </FormContext.Consumer>
        );
    }
}
export default FormItem;

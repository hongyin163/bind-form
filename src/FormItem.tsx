import classnames from 'classnames';
import React, { Component } from 'react';
import FormContext from './Context';
import { FormItemProps } from './types';

class FormItem extends Component<FormItemProps, any> {
    public static contextType = FormContext;
    public static displayName = "FormItem"
    public state = {}
    constructor(props, context) {
        super(props, context);
    }
    public getSizeCls({ span = 0, order = 0, offset = 0, push = 0, pull = 0 }) {
        const prefixCls = "biz-col";
        const classes = classnames(
            {
                [`${prefixCls}-${span}`]: span !== undefined,
                [`${prefixCls}-order-${order}`]: order,
                [`${prefixCls}-offset-${offset}`]: offset,
                [`${prefixCls}-push-${push}`]: push,
                [`${prefixCls}-pull-${pull}`]: pull,
            },
        );
        return classes;
    }
    public getControls(children: React.ReactNode, recursively: boolean) {
        let controls: Array<React.ReactElement<any>> = [];
        const childrenArray = React.Children.toArray(children) as Array<React.ReactElement<any>>;
        for (const child of childrenArray) {
            if (!recursively && controls.length > 0) {
                break;
            }
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
    public getOnlyControl() {
        const child = this.getControls(this.props.children, false)[0];
        return child !== undefined ? child : null;
    }
    public getFieldName = () => {
        const me = this;
        const child = me.getOnlyControl() as React.ReactElement<any>;
        // debugger;
        if (!child || !child.props) {
            return '';
        }
        const bind = child.props['data-bind'];
        return bind;
    }
    public getHelpMessage = (context) => {
        if (!context) {
            return null;
        }

        const me = this;
        // console.log(me);
        const {
            help,
        } = me.props;
        const fieldName = me.getFieldName();
        if (!fieldName) {
            return '';
        }

        const {
            validate: {
                errors = {},
            } = {},
        } = context;

        const errs = (errors[fieldName] || []) as React.ReactNode[];
        if (help) {
            errs.unshift(help);
        }

        return errs.length > 0 && (
            <div className="biz-form_explain">
                {errs}
            </div>
        )
    }
    public renderLabel() {
        const me = this;
        const {
            label,
            labelCol,
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
    public render() {
        const me = this;
        const {
            wrapperCol,
            style,
            className,
        } = me.props;
        const wrapperCls = classnames('biz-form_content', me.getSizeCls({ span: wrapperCol }));
        return (
            <FormContext.Consumer>
                {(context) => {
                    return (
                        <div className={classnames('biz-form_item', className ? className : '')} style={style} >
                            {me.renderLabel()}
                            <div className={wrapperCls}>
                                <div className="biz-form_control">
                                    {this.props.children}
                                </div>
                                {me.getHelpMessage(context)}
                            </div>
                        </div>
                    )
                }}
            </FormContext.Consumer>
        );
    }
}
export default FormItem;

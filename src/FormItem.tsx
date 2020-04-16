import classnames from 'classnames';
import React, { Component } from 'react';
import FormContext from './Context';
import { FormItemProps } from './types';
import { getFeildRules, getFieldName } from './util';

class FormItem extends Component<FormItemProps, any> {
    public static contextType = FormContext;
    public static displayName = 'FormItem'
    public state = {}
    constructor(props, context) {
        super(props, context);
    }
    public getSizeCls({ span = 0, order = 0, offset = 0, push = 0, pull = 0 }) {
        const prefixCls = 'biz-col';
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
        // debugger;
        let controls: Array<React.ReactElement<any>> = [];
        const childrenArray = React.Children.toArray(children) as Array<React.ReactElement<any>>;
        for (const child of childrenArray) {
            if (!recursively && controls.length > 0) {
                break;
            }
            if (child.type && ((child.type as any) === FormItem || (child.type as any).displayName === 'FormItem')
            ) {
                continue;
            }
            if (!child.props) {
                continue;
            }
            // debugger;

            const name = getFieldName(child);
            if (name) {
                const rules = getFeildRules(child);
                if (!rules) {
                    continue;
                }
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
        const name = getFieldName(child);
        return name;
    }
    public getErrors(context): any[] {
        const me = this;
        const {
            children,
        } = me.props;
        const {
            validate: {
                errors = {},
            } = {},
        } = context;
        // console.log(errors)
        const childs = me.getControls(children, true) || [];
        // console.log(childs)
        const errorList = childs.filter((child) => {
            const name = getFieldName(child);
            return !!errors[name];
        }).map((child) => {
            const name = getFieldName(child);
            return {
                name,
                error: errors[name],
            }
        });
        // console.log(errorList)
        return errorList;
    }
    public getHelpMessage = (errors: any[] = []) => {
        const me = this;
        // console.log(me);
        const {
            help = '',
        } = me.props;

        if (help === false) {
            return '';
        }

        if (!errors || errors.length <= 0) {
            if (help) {
                return (
                    <div className={'biz-form_explain'}>
                        {help}
                    </div>
                )
            }
            return '';
        }

        return (
            <div className={'biz-form_explain error'}>
                {errors.map(e => e.error).join(' ; ')}
            </div>
        )
    }
    public renderLabel() {
        const me = this;
        const {
            label,
            labelCol,
            required,
        } = me.props;

        if (!label) {
            return null;
        }

        const labelCls = classnames('biz-form_label', me.getSizeCls({ span: labelCol }));
        return (
            <div className={labelCls}>
                <label className={required ? 'required' : ''}>
                    {label}
                </label>
            </div>
        )

    }
    public render() {
        const me = this;
        const {
            wrapperCol,
            style,
            className,
            children,
        } = me.props;
        const wrapperCls = classnames('biz-form_content', me.getSizeCls({ span: wrapperCol }));
        return (
            <FormContext.Consumer>
                {(context) => {
                    const errors = me.getErrors(context);
                    return (
                        <div
                            className={classnames('biz-form_item', className, {
                                ['biz-form_item-error']: errors.length > 0,
                            })}
                            style={style as any}
                        >
                            {me.renderLabel()}
                            <div className={wrapperCls}>
                                <div className="biz-form_control">
                                    {children}
                                </div>
                                {me.getHelpMessage(errors)}
                            </div>
                        </div>
                    )
                }}
            </FormContext.Consumer>
        );
    }
}
export default FormItem;

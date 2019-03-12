import AsyncValidator from 'async-validator';
// import { findDomNode } from 'react-dom';
import classnames from 'classnames';
import React, { Component } from 'react';
import FormContext from './Context';
import FormItem from './FormItem';
import { FormProps } from './types';

const VALUE_PROP_NAME = {
    'input': {
        'text': 'value',
        'checkbox': 'checked',
        'radio': 'checked',
    },
    'select': 'value',
}
interface BizForm {
    validateFields?: (cb?: any) => void,
    validateFieldsAndScroll?: (cb?: any) => void,
}

class Form extends Component<FormProps, any> implements BizForm {
    public static Item: typeof FormItem;
    public cache = {}
    public rules = {}
    constructor(props, context) {
        super(props, context);
        const me = this;
        const {
            value = {},
        } = props;

        me.state = {
            formData: {
                validate: {
                    isValidate: false,
                    errors: {},
                },
                value,
            },
        }
    }
    public validateFields = (cb?) => {
        const me = this;
        const {
            formData: {
                value,
            },
        } = me.state;

        const allRules = this.rules;
        const validator = new AsyncValidator(allRules);
        validator.validate(value, (errors) => {
            // console.log(errors);
            me.updateValidate(errors, () => {
                cb && cb(errors, value);
            });
        });
    }
    public updateValidate(errors: any[] = [], cb?) {
        return this.setState((state) => {

            const formData = state.formData;
            let isValidate = false;
            let nextError;
            if (!errors || errors.length == 0) {
                isValidate = true;
                nextError = {};
            } else {
                nextError = errors.reduce((pre, item) => {
                    return Object.assign(pre, {
                        [item.field]: item.message,
                    })
                }, {});
            }
            state.formData = Object.assign({}, formData, {
                validate: {
                    isValidate,
                    errors: nextError,
                },
            })
            return state;
        }, cb);
    }
    public validateFieldsAndScroll(cb?) {
        const me = this;
        me.validateFields((errors, values) => {
            if (errors) {
                cb && cb(errors, values);
            }
        })
    }
    public updateValue(name, value, cb) {
        return this.setState((state) => {
            const formData = state.formData;
            const val = formData.value;
            val[name] = value;
            state.formData = Object.assign({}, formData, {
                value: val,
            })
            return state;
        }, cb);
    }

    public componentWillReceiveProps(props) {
        const me = this;
        const {
            value,
        } = props;
        // 
        me.setState((state) => {
            state.formData.value = value;
            return state;
        })
    }
    public updateValidateByNme = (name, errors: any[]) => {

        return this.setState((state) => {
            const validate = state.formData.validate;
            const isValidate = validate.isValidate;
            const preError = validate.errors;
            let errMsg = '';
            if (!errors || errors.length == 0) {
                errMsg = '';
            } else {
                errMsg = errors.filter(p => p.field == name).map(p => p.message).join('');
            }
            const nextError = Object.assign(preError, {
                [name]: errMsg,
            });
            // console.log(nextError);
            state.formData = Object.assign({}, state.formData, {
                validate: {
                    isValidate,
                    errors: nextError,
                },
            })
            return state;
        });
    }
    public validateFieldByName = (name, value, cb?) => {
        const me = this;
        const allRules = this.rules;
        let rule = allRules;
        if (name) {
            rule = {
                [name]: allRules[name],
            }
        }
        const vals = {
            [name]: value,
        }
        const validator = new AsyncValidator(rule);
        validator.validate(vals, { first: true }, (errors) => {
            me.updateValidateByNme(name, errors);
            cb && cb(errors);
        });
    }
    public onFieldChange(fieldName, valuePropName, e) {
        const me = this;
        const {
            onFormChange = () => null,
            onFieldChange = () => null,
        } = me.props;
        let value;
        if (e.target) {
            value = e.target[valuePropName];
        } else {
            value = e;
        }
        me.updateValue(fieldName, value, () => {
            onFieldChange(e);
            const allValues = me.state.formData.value;
            onFormChange(allValues);
            me.validateFieldByName(fieldName, allValues[fieldName])
        })
    }
    public getValuePropName(control) {
        let {
            valuePropName = 'value',
        } = control.props;
        if (typeof control.type == 'string') {
            const ctrlTypes = VALUE_PROP_NAME[control.type];
            if (ctrlTypes) {
                if (typeof ctrlTypes == "object") {
                    if (control.props.type) {
                        valuePropName = ctrlTypes[control.props.type] || 'value';
                    } else {
                        valuePropName = 'value';
                    }
                } else {
                    valuePropName = ctrlTypes;
                }
            }
        }
        return valuePropName;
    }
    public bindEvent(value, childs) {
        const me = this;
        if (!childs || React.Children.count(childs) == 0) {
            return;
        }
        // 
        React.Children.forEach(childs, (child) => {
            if (!child.props) {
                return;
            }

            const { children, onChange } = child.props;
            const bind = child.props['data-bind'];
            const rules = child.props['data-rules'];
            const valuePropName = me.getValuePropName(child);
            if (bind) {
                child.props[valuePropName] = value[bind];
                if (!onChange) {
                    if (me.cache[bind]) {
                        child.props.onChange = me.cache[bind];
                    } else {
                        me.cache[bind] = me.onFieldChange.bind(me, bind, valuePropName);
                        child.props.onChange = me.cache[bind];
                    }
                }
                me.rules[bind] = rules || [];
            }

            me.bindEvent(value, children);
        });
    }
    public render() {
        const me = this;
        const state = me.state;
        const {
            formData,
        } = state;
        const {
            className,
            children,
            ...rest
        } = me.props;
        const cls = classnames("biz-form", className);
        me.bindEvent(formData.value, children);
        return (
            <FormContext.Provider value={formData}>
                <form className={cls} {...rest}>
                    {children}
                </form>
            </FormContext.Provider>
        );
    }
}

Form.Item = FormItem;

export default Form;

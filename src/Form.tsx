import AsyncValidator from 'async-validator';
// import { findDomNode } from 'react-dom';
import classnames from 'classnames';
import React, { Component } from 'react';
import FormContext from './Context';
import FormItem from './FormItem';
import FormGroup from './FormGroup';
import { FormProps } from './types';

const TimeCount = {
    from: 0,
    start() {
        this.from = Date.now();
    },
    end() {
        const len = Date.now() - this.from;
        // console.log(len);
    },
}

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
    public static Group: typeof FormGroup;
    public static defaultProps = {
        fieldNameProp: 'name',
        rulesProp: 'rules',
    }
    public static displayName = 'Form';
    // public static getDerivedStateFromProps(props, state) {
    //     // 受控
    //     if (props.hasOwnProperty('value')) {
    //         state.formData.value = props.value || {};
    //         return state;
    //     } else {
    //         return state;
    //     }
    // }
    public cache = {}
    public rules = {}
    private domCache: React.ReactNode;
    private fieldMap: {};
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

        me.domCache = null;
        me.fieldMap = {};
    }
    public shouldComponentUpdate(nextProps) {

        console.log(this.props.name,this.props.value,nextProps.vlaue);
        if (this.props.value === nextProps.vlaue) {
            return false;
        }
        return true;
    }
    public componentWillReceiveProps(props) {
        const me = this;
        const {
            value,
        } = props;
        me.setState((state) => {
            // state.formData.value = value;
            state.formData = Object.assign({}, state.formData, {
                value,
            })
            return state;
        })
    }
    public componentDidUpdate() {
        TimeCount.end();
    }
    public validateFields = (cb) => {
        const me = this;
        const {
            formData: {
                value,
            },
        } = me.state;

        const allRules = this.rules;
        const validator = new AsyncValidator(allRules);
        validator.validate(value, (errors) => {
            me.updateValidate(errors, () => {
                if (cb) {
                    cb(errors, value);
                }
            });
        });
    }
    public updateValidate(errors: any[] = [], cb?) {
        return this.setState((state) => {

            const formData = state.formData;
            let isValidate = false;
            let nextError;
            if (!errors || errors.length === 0) {
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
    public validateFieldsAndScroll(cb) {
        const me = this;
        me.validateFields((errors, values) => {
            if (errors) {
                if (cb) {
                    cb(errors, values);
                }
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

    public updateValidateByNme = (name, errors: any[]) => {

        return this.setState((state) => {
            const validate = state.formData.validate;
            const isValidate = validate.isValidate;
            const preError = validate.errors;
            let errMsg = '';
            if (!errors || errors.length === 0) {
                errMsg = '';
            } else {
                errMsg = errors.filter(p => p.field === name).map(p => p.message).join('');
            }
            const nextError = Object.assign(preError, {
                [name]: errMsg,
            });
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
            if (cb) {
                cb(errors);
            }
        });
    }
    public onFieldChange(fieldName, valuePropName, e) {
        const me = this;
        TimeCount.start();
        const {
            onChange = () => null,
            onFieldChange = () => null,
        } = me.props;
        let value;
        if (e.target) {
            value = e.target[valuePropName];
        } else {
            value = e;
        }
        me.fieldMap[fieldName].props[valuePropName] = value;
        me.updateValue(fieldName, value, () => {
            onFieldChange(e);
            const allValues = me.state.formData.value;
            debugger;
            onChange(allValues);
            me.validateFieldByName(fieldName, allValues[fieldName])
        })
    }
    public getValuePropName(control) {
        let {
            valuePropName = 'value',
        } = control.props;
        if (typeof control.type === 'string') {
            const ctrlTypes = VALUE_PROP_NAME[control.type];
            if (ctrlTypes) {
                if (typeof ctrlTypes === "object") {
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
    public getDisplayName(node: React.ReactElement) {
        if (typeof node.type === 'function') {
            const type = node.type as React.ComponentClass;
            return type.displayName || type.name;
        }
        return node.type;
    }
    public bindEvent(value, childList) {
        const me = this;
        const {
            fieldNameProp = 'name',
            rulesProp = 'rules',
        } = me.props;
        if (!childList || React.Children.count(childList) === 0) {
            return;
        }
        React.Children.forEach(childList, (child) => {
            if (!child.props) {
                return;
            }

            const { children, onChange } = child.props;
            const name = child.props[fieldNameProp] || child.props[`data-${fieldNameProp}`];
            const rules = child.props[rulesProp] || child.props[`data-${rulesProp}`];
            const valuePropName = me.getValuePropName(child);
            if (name) {
                me.fieldMap[name] = child;
                child.props[valuePropName] = value[name];
                if (!onChange) {
                    if (me.cache[name]) {
                        child.props.onChange = me.cache[name];
                    } else {
                        me.cache[name] = me.onFieldChange.bind(me, name, valuePropName);
                        child.props.onChange = me.cache[name];
                    }
                }
                me.rules[name] = rules || [];
            }
            const displayName = me.getDisplayName(child);
            if (displayName === 'Form') {
                return;
            }
            me.bindEvent(value, children);
        });
    }
    public isEnableDomCache() {
        const me = this;
        const {
            enableDomCache = false,
        } = me.props;
        const {
            formData: {
                value,
            },
        } = me.state;

        if (typeof enableDomCache === 'function') {
            return enableDomCache(value) || false;
        }
        return enableDomCache;
    }
    public onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const me = this;
        const {
            onSubmit = () => void 0,
        } = me.props;
        onSubmit(e);
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
            layout = 'inline',
            enableDomCache = false,
            onSubmit,
            onChange,
            ...rest
        } = me.props;
        console.log(me.props.name, 'render');
        const cls = classnames("biz-form", layout, className);
        let childDren;
        if (me.isEnableDomCache()) {
            if (!me.domCache) {
                me.bindEvent(formData.value, children);
                me.domCache = children;
                // console.log('no cache');
            }
            childDren = me.domCache;
        } else {
            me.bindEvent(formData.value, children);
            me.domCache = null;
            childDren = children;
            // console.log('cache')
        }
        return (
            <FormContext.Provider value={formData}>
                <form className={cls} onSubmit={me.onFormSubmit} {...rest} >
                    {childDren}
                </form>
            </FormContext.Provider>
        );

        // me.bindEvent(formData.value, children);

        // return (
        //     <FormContext.Provider value={formData}>
        //         <form className={cls} {...rest}>
        //             {children}
        //         </form>
        //     </FormContext.Provider>
        // );
    }
}

Form.Item = FormItem;
Form.Group = FormGroup;
export default Form;

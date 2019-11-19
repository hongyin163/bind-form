import AsyncValidator from 'async-validator';
import classnames from 'classnames';
import React, { Component } from 'react';
import FormContext from './Context';
import FormGroup from './FormGroup';
import FormItem from './FormItem';
import { FormProps, FormState } from './types';
import { getFeildRules, getFieldName } from './util';
import { VALUE_PROP_NAME } from './value-prop'

const TimeCount = {
    from: 0,
    start() {
        // console.timeEnd('update');
        // console.('update');
        this.from = Date.now();
    },
    end() {
        // const len = Date.now() - this.from;
        // console.log(len+'ms');
        // console.timeLog('update');
    },
}

interface BizForm {
    validateFields?: (cb?: any) => void,
    validateFieldsAndScroll?: (cb?: any) => void,
}

/**
 * @visibleName Form 表单
 */
class Form extends Component<FormProps, any> implements BizForm {
    public static Item: typeof FormItem;
    public static Group: typeof FormGroup;
    public static displayName = 'Form';
    // public static getDerivedStateFromProps(props, state) {
    //     // 受控
    //     if (props.hasOwnProperty('value')) {
    //         state.value = props.value || {};
    //         return state;
    //     } else {
    //         return state;
    //     }
    // }
    public cache = {}
    public rules = {}
    public rulesEnable = {}
    public state: FormState;
    private domCache: React.ReactNode;
    private fieldMap: {};
    constructor(props, context) {
        super(props, context);
        const me = this;
        const {
            value = {},
        } = props;

        me.state = {
            validate: {
                isValidate: false,
                errors: {},
            },
            value,
        }

        me.domCache = null;
        me.fieldMap = {};
    }

    // public shouldComponentUpdate(nextProps) {

    //     // // console.log(this.props.name,this.props.value,nextProps.vlaue);
    //     if (this.props.value === nextProps.vlaue) {
    //         // console.log('shouldComponentUpdate', false);
    //         return false;
    //     }
    //     // console.log('shouldComponentUpdate', true);
    //     return true;
    // }
    // public componentWillReceiveProps(props) {
    //     const me = this;
    //     const {
    //         value,
    //     } = props;
    //     me.setState((state) => {
    //         state.value = value;
    //         return state;
    //     })
    // }
    public componentDidUpdate() {
        TimeCount.end();
    }
    public isControl = () => {
        return this.props.hasOwnProperty('value');
    }
    public setValue(value) {
        const me = this;
        const {
            onChange = () => void 0,
        } = me.props;
        return new Promise((resolve) => {
            const {
                validate,
            } = me.state;
            if (me.isControl()) {
                if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        value = value.map(p => p);
                    } else {
                        value = Object.assign({}, value);
                    }
                }
                onChange(value, validate);
                resolve();
            } else {
                me.setState((state) => {
                    state.value = value;
                    return state;
                }, () => {
                    onChange(value, validate);
                    resolve();
                })
            }
        })
    }
    public getValue() {
        const me = this;
        const {
            value,
            defaultValue = {},
        } = me.props;
        if (me.isControl()) {
            return value || defaultValue;
        } else {
            return me.state.value || defaultValue;
        }
    }
    public addToFieldMap(name, node) {
        const me = this;
        if (!me.fieldMap[name]) {
            me.fieldMap[name] = []
        }
        me.fieldMap[name].push(node);
    }
    public updateFieldMap(name, value, valuePropName) {
        const me = this;
        const list = me.fieldMap[name];
        if (!list) {
            return;
        }
        list.forEach(node => {
            node.props = Object.assign({}, node.props, {
                [valuePropName]: value,
            });
        });
    }
    public validateFields = (cb) => {
        const me = this;
        const value = me.getValue();
        const rules = me.rules;
        const rulesEnable = me.rulesEnable;
        // console.log(rulesEnable)
        const allRules = Object.keys(rulesEnable)
            .reduce((pre, key) => {
                return Object.assign(pre, {
                    [key]: rules[key],
                })
            }, {});
        const validator = new AsyncValidator(allRules);
        validator.validate(value, async (errors) => {
            await me.updateValidate(errors);
            if (cb) {
                cb(errors, value);
            }
        });
    }
    public updateValidate(errors: any[] = []) {
        const me = this;
        return new Promise((resolve) => {
            return me.setState((state) => {
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
                state.validate = Object.assign({}, {
                    isValidate,
                    errors: nextError,
                })
                return state;
            }, resolve);
        })
    }
    public validateFieldsAndScroll(cb) {
        const me = this;
        me.validateFields((errors, values) => {
            if (errors) {
                const fields = document.getElementsByClassName('bind-form_item-error');
                if (fields.length > 0) {
                    fields[0].scrollIntoView();
                }
            }
            if (cb) {
                cb(errors, values);
            }
        })
    }
    public updateValue(name, value) {
        const me = this;
        const val = me.getValue();
        const nextValue = Object.assign({}, val, {
            [name]: value,
        });
        me.setValue(nextValue);
        return nextValue;
    }

    public updateValidateByNme = (name, errors: any[]) => {
        const me = this;
        return new Promise((resolve) => {
            return me.setState((state) => {
                const validate = state.validate;
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
                state.validate = Object.assign({}, {
                    isValidate,
                    errors: nextError,
                })
                return state;
            }, resolve);
        })
    }
    public validateFieldByName = (name, value, cb?) => {
        const me = this;
        const allRules = me.rules;

        let rule = allRules;
        if (name && allRules[name]) {
            rule = {
                [name]: allRules[name],
            }
        }
        const vals = {
            [name]: value,
        }
        const validator = new AsyncValidator(rule);
        validator.validate(vals, { first: true }, async (errors) => {
            // console.log(errors)
            await me.updateValidateByNme(name, errors);
            if (cb) {
                cb(errors);
            }
        });
    }
    public onFieldChange(fieldName, valuePropName, e) {
        const me = this;
        TimeCount.start();
        const {
            onFieldChange = () => null,
        } = me.props;
        let fieldValue;
        if (e && e.target) {
            fieldValue = e.target[valuePropName];
        } else {
            fieldValue = e;
        }
        if (me.isEnableDomCache()) {
            me.updateFieldMap(fieldName, fieldValue, valuePropName);
            me.forceUpdate();
        } else {
            me.updateValue(fieldName, fieldValue)
            onFieldChange(fieldName, fieldValue, e);
        }
        me.validateFieldByName(fieldName, fieldValue)

    }
    public getValuePropName(control) {
        let {
            valuePropName = 'value',
        } = control.props;
        const type = typeof control.type;
        if (type === 'string') {
            const ctrlTypes = VALUE_PROP_NAME[control.type];
            if (ctrlTypes) {
                if (typeof ctrlTypes === 'object') {
                    if (control.props.type) {
                        valuePropName = ctrlTypes[control.props.type] || 'value';
                    } else {
                        valuePropName = 'value';
                    }
                } else {
                    valuePropName = ctrlTypes;
                }
            }
        } else if (type === 'function') {
            const ctrlTypes = VALUE_PROP_NAME[control.type.displayName];
            if (ctrlTypes) {
                valuePropName = ctrlTypes;
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
    public eachChild(children, visit) {
        const me = this;
        if (!children || React.Children.count(children) === 0) {
            return;
        }
        React.Children.forEach(children, (child) => {
            if (!child || !child.props) {
                return;
            }
            const displayName = me.getDisplayName(child);
            if (displayName === 'Form') {
                return;
            }
            visit(child as any);
            me.eachChild(child.props.children, visit);
        });
    }
    public bindEvent(value, children) {
        const me = this;
        me.eachChild(children, (child: any) => {
            const name = getFieldName(child);
            if (!name) {
                return;
            }

            const { onChange } = child.props;
            if (me.isEnableDomCache()) {
                me.addToFieldMap(name, child);
            }
            const rules = getFeildRules(child);
            const valuePropName = me.getValuePropName(child);
            child.props[valuePropName] = value[name];
            if (!onChange) {
                if (me.cache[name]) {
                    child.props.onChange = me.cache[name];
                } else {
                    me.cache[name] = me.onFieldChange.bind(me, name, valuePropName);
                    child.props.onChange = me.cache[name];
                }
            }

            if (rules) {
                me.rules[name] = rules;
                me.rulesEnable[name] = true;
            }
        })
    }
    public isEnableDomCache() {
        const me = this;
        const {
            enableDomCache = false,
        } = me.props;
        const value = me.getValue();
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
        // const {
        //     value,
        // } = state;
        const value = me.getValue();
        const {
            className,
            children,
            layout = 'inline',
            enableDomCache = false,
            onSubmit,
            onChange,
            onFieldChange,
            hideRequiredMark,
            ...rest
        } = me.props;
        const cls = classnames('bind-form', layout, className);
        let childDren;
        if (me.isEnableDomCache()) {
            if (!me.domCache) {
                const childs = typeof children === 'function' ? children() : children;
                me.rulesEnable = {};
                me.bindEvent(value, childs);
                me.domCache = childs;
            }
            childDren = me.domCache;
        } else {
            me.rulesEnable = {};
            me.bindEvent(value, children);
            me.domCache = null;
            me.fieldMap = {};
            childDren = children;
        }
        return (
            <FormContext.Provider value={state}>
                <form className={cls} onSubmit={me.onFormSubmit} {...rest} >
                    {childDren}
                </form>
            </FormContext.Provider>
        );
    }
}

Form.Item = FormItem;
Form.Group = FormGroup;
export default Form;

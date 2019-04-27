import React from 'react';

export type FormLayout = 'horizontal' | 'inline' | 'vertical';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    layout?: FormLayout;
    style?: React.CSSProperties;
    className?: string;
    hideRequiredMark?: boolean;
    value?: object;
    fieldNameProp?: string;
    rulesProp?: string;
    onSubmit?: React.FormEventHandler<any>;
    onChange?: (value) => void;
    onFieldChange?: React.ChangeEventHandler<any>;
    enableDomCache?: boolean | ((value) => boolean);
}

export interface FormItemProps {
    prefixCls?: string;
    className?: string;
    id?: string;
    label?: React.ReactNode;
    labelCol?: number;
    wrapperCol?: number;
    help?: React.ReactNode;
    extra?: React.ReactNode;
    validateStatus?: 'success' | 'warning' | 'error' | 'validating';
    hasFeedback?: boolean;
    required?: boolean;
    style?: React.CSSProperties;
    colon?: boolean;
}

export interface ValidationRule {
    /** validation error message */
    message?: React.ReactNode;
    /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
    type?: string;
    /** indicates whether field is required */
    required?: boolean;
    /** treat required fields that only contain whitespace as errors */
    whitespace?: boolean;
    /** validate the exact length of a field */
    len?: number;
    /** validate the min length of a field */
    min?: number;
    /** validate the max length of a field */
    max?: number;
    /** validate the value from a list of possible values */
    enum?: string | string[];
    /** validate from a regular expression */
    pattern?: RegExp;
    /** transform a value before validation */
    transform?: (value: any) => any;
    /** custom validate function (Note: callback must be called) */
    validator?: (rule: any, value: any, callback: any, source?: any, options?: any) => any;
}


export interface IFormGroupProps extends React.FormHTMLAttributes<HTMLFormElement> {
    value?: object;
    defaultValue?: any;
    onSubmit?: React.FormEventHandler<any>;
    onChange?: (value) => void;
    onFieldChange?: React.ChangeEventHandler<any>;
}
import React, { Component } from 'react';

export type FormLayout = 'horizontal' | 'inline' | 'vertical';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    layout?: FormLayout;
    //   form?: WrappedFormUtils;
    onSubmit?: React.FormEventHandler<any>;
    style?: React.CSSProperties;
    className?: string;
    prefixCls?: string;
    hideRequiredMark?: boolean;

    value?: object;
    onFormChange?: Function;
    onFieldChange?: React.ChangeEventHandler<any>;
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


export type ValidationRule = {
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
  };
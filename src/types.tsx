import React from 'react';
import { Omit } from '../_util/type';

export type FormLayout = 'horizontal' | 'inline' | 'vertical';

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onChange'> {
    /**
     * 表单布局方式，包括 'horizontal' | 'inline' | 'vertical';
     */
    layout?: FormLayout;
    /**
     * 表单的扩展 style 样式
     */
    style?: React.CSSProperties;
    /**
     * 为表单添加扩展的 CSS Class
     */
    className?: string;
    /**
     * 隐藏必选的 * 形图标
     */
    hideRequiredMark?: boolean;
    /**
     * 表单的默认值，非受控组件
     */
    defaultValue?: any;
    /**
     * 表单的值，受控组件
     */
    value?: any;
    /**
    * 是否启用虚拟DOM缓存，默认 false 
    * 开启后对性能有益处
    * 如果表单字段是动态的，有联动的字段，可以设置为 function ，对前值和当前值判断，返回是否启用缓存。
    */
    enableDomCache?: boolean | ((value) => boolean);
    /**
     * 表单提交事件，内部有 html type = submit 的 button 触发
     */
    onSubmit?: React.FormEventHandler<any>;
    /**
     * 表单数据发生变化时触发
     */
    onChange?: (value, validate) => void;
    /**
     * 表单字段改变时触发
     */
    onFieldChange?: (name: string, value: any, event: React.ChangeEvent) => void;
}

export interface FormState {
    validate: {
        isValidate: boolean,
        errors: any,
    };
    value: any;
}

export interface FormItemProps {
    /**
     * 为 Form Item 添加扩展的 CSS Class
     */
    className?: string;
    id?: string;
    /**
     * 表单项的标题文字
     */
    label?: React.ReactNode;
    /**
     * 表单项说明文字的宽度
     */
    labelCol?: number;
    /**
     * 表单项组件的宽度
     */
    wrapperCol?: number;
    /**
     * 表单项的附加说明，
     * 如果有表单验证，显示表单验证信息
     * 设置为 false ,不显示任何信息
     */
    help?: React.ReactNode;
    extra?: React.ReactNode;
    /**
     * 表单的验证状态
     */
    validateStatus?: 'success' | 'warning' | 'error' | 'validating';
    hasFeedback?: boolean;
    /**
     * 是否必选
     */
    required?: boolean;
    /**
     * 表单项的 style 设置
     */
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
    /**
     * 表单的值
     */
    value?: object;
    /**
     * 表单的默认值
     */
    defaultValue?: any;
    /**
     * 表单提交事件
     */
    onSubmit?: React.FormEventHandler<any>;
    /**
     * 表单的值发生改变时触发
     */
    onChange?: (value) => void;
    /**
     * 表单的字段值改变时触发
     */
    onFieldChange?: (name: string, value: any, event: React.ChangeEvent) => void;
}

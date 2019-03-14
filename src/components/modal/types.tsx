import { ButtonType, BaseButtonProps, } from '../button'


export interface ModalFuncProps {
    prefixCls?: string;
    className?: string;
    visible?: boolean;
    title?: React.ReactNode;
    content?: React.ReactNode;
    onOk?: (...args: any[]) => any | PromiseLike<any>;
    onCancel?: (...args: any[]) => any | PromiseLike<any>;
    okButtonProps?: BaseButtonProps;// NativeButtonProps;
    cancelButtonProps?: BaseButtonProps;// NativeButtonProps;
    centered?: boolean;
    width?: string | number;
    iconClassName?: string;
    okText?: string;
    okType?: ButtonType;
    cancelText?: string;
    iconType?: string;
    maskClosable?: boolean;
    zIndex?: number;
    okCancel?: boolean;
    style?: React.CSSProperties;
    maskStyle?: React.CSSProperties;
    type?: string;
    keyboard?: boolean;
    getContainer?: (instance: React.ReactInstance) => HTMLElement;
    autoFocusButton?: null | 'ok' | 'cancel';
}
export type ModalFunc = (
    props: ModalFuncProps,
) => {
    destroy: () => void;
    update: (newConfig: ModalFuncProps) => void;
};

export interface ModalProps {
    /** 对话框是否可见*/
    visible?: boolean;
    /** 确定按钮 loading*/
    confirmLoading?: boolean;
    /** 标题*/
    title?: React.ReactNode | string;
    /** 是否显示右上角的关闭按钮*/
    closable?: boolean;
    /** 点击确定回调*/
    onOk?: (e: React.MouseEvent<any>) => void;
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
    onCancel?: (e: React.MouseEvent<any>) => void;
    afterClose?: () => void;
    /** 垂直居中 */
    centered?: boolean;
    /** 宽度*/
    width?: string | number;
    /** 底部内容*/
    footer?: React.ReactNode;
    /** 确认按钮文字*/
    okText?: string;
    /** 确认按钮类型*/
    okType?: ButtonType;
    /** 取消按钮文字*/
    cancelText?: string;
    /** 点击蒙层是否允许关闭*/
    maskClosable?: boolean;
    okButtonProps?: BaseButtonProps;// NativeButtonProps;
    cancelButtonProps?: BaseButtonProps;// NativeButtonProps;
    destroyOnClose?: boolean;
    style?: React.CSSProperties;
    wrapClassName?: string;
    maskTransitionName?: string;
    transitionName?: string;
    className?: string;
    getContainer?: (instance: React.ReactInstance) => HTMLElement;
    zIndex?: number;
    bodyStyle?: React.CSSProperties;
    maskStyle?: React.CSSProperties;
    mask?: boolean;
    keyboard?: boolean;
    wrapProps?: any;
    prefixCls?: string;
}

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Button, { ButtonType } from '../button';
import Icon from '../icon';
import { ModalProps } from './types';

export default class Modal extends Component<ModalProps, any> {
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {
            visible: false,
        }
    }
    public componentWillReceiveProps(props) {
        const me = this;
        const {
            visible,
        } = props;
        me.setVisible(visible);
    }
    public render() {
        const me = this;
        const {
            visible,
        } = me.state;

        const {
            centered = true,
            className,
        } = me.props;

        if (!visible) {
            return null;
        }

        const cls = classNames("biz-modal", className);
        return createPortal(
            <div className={cls}>
                {
                    centered ? me.renderCentered() : me.renderDialog()
                }
                {me.renderMask()}
            </div>, document.body,
        );
    }

    public setVisible = (visible) => {
        const me = this;
        const {
            afterClose = () => null,
        } = me.props;
        
        me.setState({
            visible,
        }, () => {
            if (!me.state.visible) {
                afterClose();
            }
        });
    }
    public onClose = () => {
        this.setVisible(false);
    }
    public renderDialog() {
        const me = this;
        const {
            style,
            width = 500,
        } = me.props;
        return (
            <div className="biz-modal_dialog" style={{
                width,
                ...style,
            }}>
                {me.renderHeader()}
                {me.renderBody()}
                {me.renderFooter()}
            </div>
        )
    }
    public renderCentered() {
        const me = this;
        const {
            style,
            width = 500,
        } = me.props;
        return (
            <div className="biz-modal_warpper">
                <div className="biz-modal_dialog centered" style={{
                    width,
                    ...style,
                }}>
                    {me.renderHeader()}
                    {me.renderBody()}
                    {me.renderFooter()}
                </div>
            </div>
        )
    }
    public renderMask(): React.ReactNode {
        const me = this;
        const {
            maskClosable,
            maskTransitionName,
            maskStyle = {},
            mask,
        } = me.props;

        if (!mask) {
            return null;
        }

        const maskProps: React.HTMLAttributes<any> = {};
        if (maskClosable) {
            maskProps.onClick = me.onClose;
        }
        return (
            <div className="biz-modal_mask" style={maskStyle} {...maskProps}></div>
        )
    }
    public renderHeader(): React.ReactNode {
        const me = this;
        const {
            title,
            closable,
        } = me.props;
        if (!title && !closable) {
            return null;
        }
        return (
            <div className="biz-modal_header">
                {
                    title && (<span className="biz-modal_title">{title}</span>)
                }
                {
                    closable && (<span className="biz-modal_close"><Icon type="close" onClick={me.onClose} /></span>)
                }
            </div>
        )
    }
    public renderBody(): React.ReactNode {
        const me = this;
        const {
            children,
            bodyStyle,
        } = me.props;
        return (
            <div className="biz-modal_body" style={bodyStyle}>
                {children}
            </div>
        )
    }
    public renderFooter(): React.ReactNode {
        const me = this;
        const {
            children,
            footer,
            cancelText = '取消',
            okText = '确定',
            okType,
            onOk,
            onCancel,
            okButtonProps,
            cancelButtonProps,
        } = me.props;
        if (footer) {
            return (
                <div className="biz-modal_footer">
                    {footer}
                </div>
            )
        }
        const okBtnType: ButtonType = okType || 'primary';
        const okButton = onOk ? <Button type={okBtnType} onClick={onOk} {...okButtonProps}>{okText}</Button> : null;
        const cancelButton = onCancel ? <Button onClick={onCancel} {...cancelButtonProps} >{cancelText}</Button> : null;
        return (
            <div className="biz-modal_footer">
                <div className="biz-modal_buttons">
                    {okButton}
                    {cancelButton}
                </div>
            </div>
        )
    }

}

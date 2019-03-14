import PropTypes from 'prop-types'
import React, { Component } from 'react'
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
        return (
            <div className="biz-modal">
                <div className="biz-modal_dialog">
                    {me.renderHeader()}
                    {me.renderBody()}
                    {me.renderFooter()}
                </div>
                {me.renderMask()}
            </div>
        )
    }

    public setVisible = (visible) => {
        const me = this;
        me.setState({
            visible,
        });
    }
    public onClose = () => {
        this.setVisible(false);
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
        } = me.props;
        return (
            <div className="biz-modal_body">
                {children}
            </div>
        )
    }
    public renderFooter(): React.ReactNode {
        const me = this;
        const {
            footer,
            cancelText,
            okText,
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
        const okButton = onOk ? <Button type={okBtnType} onClick={onOk} {...okButtonProps} /> : null;
        const cancelButton = onCancel ? <Button onClick={onCancel} {...cancelButtonProps} /> : null;
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

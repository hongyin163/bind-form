import React, { Component } from 'react'
import SelectPanel, { ISelectPanelProps } from '../select-panel'

interface ISelectListProps extends ISelectPanelProps {

}

interface ISelectListState {
    value?: string | number | undefined
}
export default class SelectList extends Component<ISelectListProps, ISelectListState> {
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {
            value: '',
        }
    }
    public componentWillReceiveProps(nextProps) {
        const me = this;
        if (me.props.value !== nextProps.value) {
            me.setState({
                value: nextProps.value,
            })
        }
    }
    public render() {
        const me = this;
        const {
            value,
        } = me.state;
        const {
            mode = 'default',
        } = me.props
        return (
            <SelectPanel
                value={value}
                renderValue={me.renderText}
            >
                <div className="biz-select-list">
                    {mode === 'multiple' ? me.renderMuiltiOpt() : me.renderSingleOpt()}
                </div>
            </SelectPanel>
        )
    }
    // 根据值显示对应的文本
    private renderText(value) {
        return value;
    }
    // 单选列表
    private renderSingleOpt() {

        return null;
    }
    // 多选列表
    private renderMuiltiOpt() {

        return null;
    }
}

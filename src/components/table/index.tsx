import { Checkbox } from 'biz-ui';
import classNames from 'classnames';
import React, { Component } from 'react';
import Icon from '../icon';
import { ColumnProps, TableProps } from './interface';

class Table<T> extends Component<TableProps<T>, any> {
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {
            selectedRowKeys: {},
            hoverRowIndex: -1,
        }
    }
    public getSelectKeys(records = []) {
        const me = this;
        return records
            .map((p, i) => me.getRowKey(p, i));
    }
    public getSelectedRecord() {
        const me = this;
        const {
            dataSource,
        } = me.props
        const {
            selectedRowKeys,
        } = me.state;

        return dataSource
            .filter((p, i) => selectedRowKeys[me.getRowKey(p, i)] === true)
    }
    public setRowSelected(key, selected) {
        const me = this;
        return new Promise((resolve, reject) => {
            me.setState((state) => {
                const selectedRowKeys = state.selectedRowKeys;
                if (!selected) {
                    delete selectedRowKeys[key];
                } else {
                    state.selectedRowKeys[key] = selected;
                }
                state.selectedRowKeys = selectedRowKeys;
                return state;
            }, () => {
                resolve();
            })
        })
    }
    public setAllRowSelected(allSelected: boolean) {
        const me = this;
        const {
            dataSource,
        } = me.props

        return new Promise((resolve, reject) => {
            me.setState((state) => {
                if (allSelected) {
                    state.selectedRowKeys = dataSource
                        .reduce((pre, p, i) => {
                            return Object.assign(pre, {
                                [me.getRowKey(p, i)]: true,
                            })
                        }, {})
                } else {
                    state.selectedRowKeys = {};
                }
                return state;
            }, () => {
                resolve();
            })
        })
    }
    public renderSortTitle = (col: ColumnProps<T>) => {
        let type = '';
        if (col.sortOrder === 'ascend') {
            type = 'arrow-up';
        } else if (col.sortOrder === 'descend') {
            type = 'arrow-down';
        }
        return (
            <span>
                {this.renderTitle(col)}
                {
                    col.sortOrder && (
                        <Icon type={type} />
                    )
                }
            </span>
        )
    }
    public renderTitle = (col: ColumnProps<T>) => {
        let title;
        if (typeof col.title === 'function') {
            title = col.title({ sortOrder: col.sortOrder });
        } else {
            title = col.title;
        }
        return (
            <span>
                {title}
            </span>
        )
    }
    public renderHeader = (columns: Array<ColumnProps<T>>) => {
        const me = this;
        return columns.map((col) => {
            const thProps: React.ThHTMLAttributes<any> = {};
            if (col.sorter) {
                thProps.className = classNames({ sort: col.sorter });
            }
            if (col.onHeaderCell) {
                thProps.onClick = () => {
                    col.onHeaderCell(col)
                }
            }
            return (
                <th key={col.key}
                    align={col.align || 'center'}
                    colSpan={col.colSpan || 1}
                    style={{
                        width: col.width || (col.fixed ? 100 : 'auto'),
                    }}
                    {...thProps}
                >
                    {
                        col.sorter ? me.renderSortTitle(col) : me.renderTitle(col)
                    }
                </th>
            )
        })
    }
    public renderBody = (columns: Array<ColumnProps<T>>, dataSource: T[]) => {
        const {
            hoverRowIndex,
        } = this.state;
        return dataSource.map((item, i) => {
            const tds = columns.map((col, j) => {
                let value;
                if (col.render) {
                    value = col.render('', item, i);
                } else if (col.dataIndex) {
                    const val = item[col.dataIndex];
                    value = typeof val === 'object' ? JSON.stringify(val) : val;
                }
                return (
                    <td key={col.dataIndex}>
                        {value}
                    </td>
                )
            })
            return (
                <tr
                    key={i}
                    data-index={i}
                    className={`${hoverRowIndex === i ? 'biz-table_row-hover' : ''}`}
                >
                    {tds}
                </tr>
            )
        })
    }
    public isFixed() {
        const me = this;
        const {
            columns,
        } = me.props;
        return columns.some((col) => col.fixed === true);
    }
    public isRowSelection() {
        const me = this;
        const {
            rowSelection,
        } = me.props;
        if (!rowSelection) {
            return false;
        }
        return true;
    }
    public isAllChecked() {
        const me = this;
        const {
            selectedRowKeys = {},
        } = me.state;
        const {
            dataSource,
            rowKey,
            rowSelection,
        } = me.props;

        if (!rowKey || !rowSelection) {
            console.warn('未设置rowKey或rowSelection')
            return false;
        }
        if (Object.keys(selectedRowKeys).length < dataSource.length) {
            return false;
        }
        return dataSource.every((p, i) => selectedRowKeys[me.getRowKey(p, i)])
    }
    public onCheckAll = (e) => {
        const me = this;
        const {
            rowSelection: {
                onChange,
            },
        } = me.props;
        const checked = e.target ? e.target.checked : e;
        me.setAllRowSelected(checked)
            .then(() => {
                const records = me.getSelectedRecord();
                const keys = me.getSelectKeys(records);
                onChange(keys, records);
            });
    }
    public onCheckRow = (key, e) => {
        const me = this;
        const {
            rowSelection: {
                onChange,
            },
        } = me.props;
        const checked = e.target ? e.target.checked : e;
        me.setRowSelected(key, checked)
            .then(() => {
                const records = me.getSelectedRecord();
                const keys = me.getSelectKeys(records);
                onChange(keys, records);
            });
    }
    public getRowKey = (record, i) => {
        const me = this;
        const {
            rowSelection,
            rowKey,
        } = me.props;
        if (typeof rowKey === "function") {
            return rowKey(record, i);
        }
        return record[rowKey];
    }
    public appendSelectionCol(columns) {
        const me = this;
        const {

            selectedRowKeys = {},
        } = me.state;

        const {
            rowSelection,
        } = me.props;
        if (me.isRowSelection()) {
            const {
                columnWidth,
                columnTitle,
                fixed,
            } = rowSelection;
            const selectAll = me.isAllChecked();
            return [{
                fixed: fixed || 'left',
                title() {
                    return (
                        <span>
                            {columnTitle} <Checkbox checked={selectAll} onChange={me.onCheckAll} />
                        </span>
                    )
                },
                width: columnWidth || 40,
                render(text, record, i) {
                    const key = me.getRowKey(record, i);

                    return (
                        <span>
                            {columnTitle}
                            <Checkbox
                                key={key}
                                checked={selectedRowKeys[key]}
                                onChange={me.onCheckRow.bind(me, key)}
                            />
                        </span>
                    )
                },
            }].concat(columns)
        }
        return columns;
    }
    public renderFixedTable(fixed) {
        const me = this;
        const {
            columns,
            dataSource,
            rowSelection,
        } = me.props;
        let cols = columns.filter(p => p.fixed === fixed);
        if (cols.length === 0) {
            return null;
        }
        cols = me.appendSelectionCol(cols);

        return (
            <table>
                <thead>
                    <tr>
                        {me.renderHeader(cols)}
                    </tr>
                </thead>
                <tbody >
                    {me.renderBody(cols, dataSource)}
                </tbody>
            </table>
        )
    }
    public getRowTr(cell: HTMLElement, currentTarget) {
        if (cell === currentTarget) {
            return;
        }
        if (cell.tagName.toLowerCase() === 'tr') {
            return cell;
        }
        let parent = cell.parentNode as HTMLElement;
        while (parent.tagName.toLowerCase() !== 'tr') {
            // console.log(parent.tagName.toLowerCase());
            if (parent === currentTarget) {
                return null;
            }
            parent = parent.parentNode as HTMLElement;
        }
        return parent;
    }
    public onMouseOverRow = (e) => {
        const me = this;
        const tr = me.getRowTr(e.target, e.currentTarget);
        if (!tr) {
            return;
        }
        const hoverRowIndex = Number(tr.dataset.index);
        me.setState({
            hoverRowIndex,
        })
        // console.log(tr.dataset.index);
    }
    public onMouseOutRow = (e) => {
        // console.log('onMouseOutRow');
        this.setState({
            hoverRowIndex: -1,
        })
    }
    public renderTable() {
        const me = this;
        const {
            columns,
            dataSource,
        } = me.props;
        const cols = me.appendSelectionCol(columns);
        return (
            <table>
                <thead>
                    <tr>
                        {me.renderHeader(cols)}
                    </tr>
                </thead>
                <tbody  >
                    {me.renderBody(cols, dataSource)}
                </tbody>
            </table>
        )
    }
    public getScrollStyle() {
        const me = this;
        const {
            scroll: { x = 'auto', y = 'auto' } = {},
        } = me.props;
        const scrollStyle: React.CSSProperties = {};
        if (x === true) {
            scrollStyle.overflowX = 'scroll';
        } else if (x === false) {
            scrollStyle.overflowX = 'hidden';
        } else {
            scrollStyle.width = x;
        }
        if (y === true) {
            scrollStyle.overflowY = 'scroll';
        } else if (y === false) {
            scrollStyle.overflowY = 'hidden';
        } else {
            scrollStyle.height = y;
        }
        return scrollStyle;
    }
    public render() {
        const me = this;
        const scrollStyle = me.getScrollStyle();

        return (
            <div className="biz-table">
                <div className="biz-table_content" onMouseOver={me.onMouseOverRow} onMouseOut={me.onMouseOutRow}>
                    <div className="biz-table_scroll" style={{
                        ...scrollStyle,
                    }}>
                        {me.renderTable()}
                    </div>
                    <div className="biz-table_fixed-left">
                        {me.renderFixedTable('left')}
                    </div>
                    <div className="biz-table_fixed-right">
                        {me.renderFixedTable('right')}
                    </div>
                </div>
            </div>
        );
    }
}

export default Table;

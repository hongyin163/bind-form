import { Checkbox } from 'biz-ui';
import classNames from 'classnames';
import React, { Component } from 'react';
import { ColumnProps, TableProps } from './interface';

class Table<T> extends Component<TableProps<T>, any> {
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {
            selectAll: false,
            selectedRowKeys: {},
        }
    }
    getSelectKeys(records = []) {
        const me = this;
        return records
            .map((p, i) => me.getRowKey(p, i));
    }
    getSelectedRecord() {
        const me = this;
        const {
            dataSource
        } = me.props
        const {
            selectAll,
            selectedRowKeys,
        } = me.state;
        if (selectAll) {
            return dataSource;
        }
        return dataSource
            .filter((p, i) => selectedRowKeys[me.getRowKey(p, i)] === true)
    }
    public setSelectAll(selectAll, cb?) {
        const me = this;
        return new Promise((resolve, reject) => {
            me.setState((state) => {
                state.selectAll = selectAll;
                // state.selectedRowKeys = {};
                return state;
            }, () => {
                resolve();
                // tslint:disable-next-line: no-unused-expression
                cb && cb();
            });
        })
    }
    public setRowSelected(key, selected, cb?) {
        const me = this;
        return new Promise((resolve, reject) => {
            me.setState((state) => {
                state.selectedRowKeys[key] = selected;
                return state;
            }, () => {
                resolve();
                // tslint:disable-next-line: no-unused-expression
                cb && cb();
            })
        })
    }
    public renderSortTitle = (col: ColumnProps<T>) => {
        return (
            <span>
                {this.renderTitle(col)}<i className={`biz-icon ${col.sortOrder}`}>{col.sortOrder}</i>
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
                <tr>{tds}</tr>
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
    isAllChecked() {
        const me = this;
        const {
            selectAll,
            selectedRowKeys = {}
        } = me.state;
        const {
            columns,
            dataSource,
            rowKey,
            rowSelection,
        } = me.props;

        if (!rowKey || !rowSelection) {
            return false;
        }
        return dataSource.every((p, i) => selectedRowKeys[me.getRowKey(p, i)])
    }
    onCheckAll = (e) => {
        const me = this;
        const {
            rowSelection: {
                onChange,
            },
        } = me.props;
        const checked = e.target ? e.target.checked : e;
        me.setSelectAll(checked, () => {
            const records = me.getSelectedRecord();
            const keys = me.getSelectKeys(records);
            onChange(keys, records);
        });
    }
    onCheckRow = (key,e) => {
        const me = this;
        const {
            rowSelection: {
                onChange,
            },
        } = me.props;
        const checked = e.target ? e.target.checked : e;
        if (!checked) {
            me.setRowSelected(key, checked)
                .then(() => {
                    return me.setSelectAll(false)
                }).then(() => {
                    const records = me.getSelectedRecord();
                    const keys = me.getSelectKeys(records);
                    onChange(keys, records);
                });
        } else {
            me.setRowSelected(key, checked).then(() => {
                if (me.isAllChecked()) {
                    return me.setSelectAll(true);
                }
                return '';
            }).then(() => {
                const records = me.getSelectedRecord();
                const keys = me.getSelectKeys(records);
                onChange(keys, records);
            })
        }
    }
    getRowKey = (record, i) => {
        const me = this;
        const {
            rowSelection,
            rowKey
        } = me.props;
        if (typeof rowKey === "function") {
            return rowKey(record, i);
        }
        return record[rowKey];
    }
    appendSelectionCol(columns) {
        const me = this;
        const {
            selectAll,
            selectedRowKeys = {}
        } = me.state;
        debugger;
        const {
            rowSelection,
        } = me.props;
        if (me.isRowSelection()) {
            const {
                columnWidth,
                columnTitle,
                fixed,
            } = rowSelection;
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
                    debugger;
                    return (
                        <span>
                            {columnTitle}
                            <Checkbox
                                key={key}
                                checked={selectAll || selectedRowKeys[key]}
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
                <tbody>
                    {me.renderBody(cols, dataSource)}
                </tbody>
            </table>
        )
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
                <tbody>
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
        console.log(me.state);
        const scrollStyle = me.getScrollStyle();

        return (
            <div className="biz-table">
                <div className="biz-table_content">
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

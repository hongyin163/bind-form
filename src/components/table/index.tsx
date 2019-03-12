import React, { Component } from 'react';
import { TableProps, ColumnProps } from './interface';

class Table<T> extends Component<TableProps<T>, any> {
    state = {}
    renderSortTitle = (col: ColumnProps<T>) => {
        if (typeof col.sortOrder === 'undefined') {
            return ''
        }
        return (
            <span>
                <i className={`biz-icon ${col.sortOrder}`}>{col.sortOrder}</i>
            </span>
        )
    }
    renderHeader = (columns: Array<ColumnProps<T>>) => {
        return columns.map((col) => {
            return (
                <th key={col.key}
                    align={col.align || 'center'}
                    colSpan={col.colSpan || 1}
                >
                    <span>
                        {col.title}
                    </span>
                    {this.renderSortTitle(col)}
                </th>
            )
        })
    }
    renderBody = (columns: Array<ColumnProps<T>>, dataSource: Array<T>) => {
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
    renderFixedTable() { }
    renderTable() { }
    render() {
        const me = this;
        const {
            columns,
            dataSource,
        } = me.props;
        return (
            <div className="biz-table">
                <div className="biz-table_content">
                    <div className="biz-table_scroll">
                        <table>
                            <thead>
                                <tr>
                                    {me.renderHeader(columns)}
                                </tr>
                            </thead>
                            <tbody>
                                {me.renderBody(columns, dataSource)}
                            </tbody>
                        </table>
                    </div>
                    <div className="biz-table_fixed-left"></div>
                    <div className="biz-table_fixed-right"></div>
                </div>
            </div>
        );
    }
}

export default Table;

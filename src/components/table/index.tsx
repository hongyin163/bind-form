import React, { Component } from 'react';
import { TableProps, ColumnProps } from './interface';

class Table<T> extends Component<TableProps<T>, any> {
    state = {}
    renderHeader = (columns: Array<ColumnProps<T>>) => {
        return columns.map((col) => {
            return (
                <th key={col.key} align={col.align || 'center'} colSpan={col.colSpan || 1}>
                    {col.title}
                </th>
            )
        })
    }
    renderBody = (columns: Array<ColumnProps<T>>, dataSource: Array<T>) => {
        return dataSource.map((item, i) => {
            let tds = columns.map((col, j) => {
                return (
                    <td key={col.dataIndex}>
                        {col.dataIndex && item[col.dataIndex]}
                        {col.render && col.render('', item, i)}
                    </td>
                )
            })
            return (
                <tr>{tds}</tr>
            )
        })
    }
    renderFixedTable(){}
    renderTable(){}
    render() {
        let me = this;
        let {
            columns,
            dataSource
        } = me.props;
        return (
            <div className="biz-table">
                <div className="biz-table_content">
                    <div className="biz-table_scroll"></div>
                    <div className="biz-table_fixed-left"></div>
                    <div className="biz-table_fixed-right"></div>
                </div>
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
        );
    }
}

export default Table;
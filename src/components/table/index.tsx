import React, { Component } from 'react';
import { TableProps, ColumnProps } from './interface';

class Table<T> extends Component<TableProps<T>, any> {
    constructor(props, context) {
        super(props, context);
        const me = this;
        me.state = {}
    }
    renderSortTitle = (col: ColumnProps<T>) => {
        return (
            <span>
                {this.renderTitle(col)}<i className={`biz-icon ${col.sortOrder}`}>{col.sortOrder}</i>
            </span>
        )
    }
    renderTitle = (col: ColumnProps<T>) => {
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
    renderHeader = (columns: Array<ColumnProps<T>>) => {
        const me = this;
        return columns.map((col) => {
            let thProps: React.ThHTMLAttributes<any> = {

            };
            if (col.onHeaderCell) {
                thProps = {
                    className: 'sort',
                    onClick: () => {
                        col.onHeaderCell(col)
                    },
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
    isFixed() {
        const me = this;
        const {
            columns,
        } = me.props;
        return columns.some((col) => col.fixed === true);
    }
    renderFixedTable(fixed) {
        const me = this;
        const {
            columns,
            dataSource,
        } = me.props;
        const cols = columns.filter(p => p.fixed === fixed);
        if (cols.length === 0) {
            return null;
        }
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
    renderTable() {
        const me = this;
        const {
            columns,
            dataSource,
        } = me.props;
        return (
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
        )
    }
    getScrollStyle() {
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
    render() {
        const me = this;

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

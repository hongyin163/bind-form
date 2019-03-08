import React, { Component } from 'react';

interface ColumnProps<T> {
    title?:
    | React.ReactNode;
    key?: React.Key;
    dataIndex?: string;
    render?: (text: any, record: T, index: number) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    filterMultiple?: boolean;
    filterDropdown?: React.ReactNode | ((props: Object) => React.ReactNode);
    filterDropdownVisible?: boolean;
    onFilterDropdownVisibleChange?: (visible: boolean) => void;
    colSpan?: number;
    width?: string | number;
    className?: string;
    fixed?: boolean | ('left' | 'right');
    filterIcon?: React.ReactNode | ((filtered: boolean) => React.ReactNode);
    filteredValue?: any[];
    children?: ColumnProps<T>[];
    onCellClick?: (record: T, event: any) => void;
    onCell?: (record: T, rowIndex: number) => any;
    onHeaderCell?: (props: ColumnProps<T>) => any;
}

export interface TableProps<T> {
    prefixCls?: string;
    dropdownPrefixCls?: string;
    dataSource?: T[];
    columns?: ColumnProps<T>[];
    rowKey?: string | ((record: T, index: number) => string);
    rowClassName?: (record: T, index: number) => string;
    expandedRowRender?: (
        record: T,
        index: number,
        indent: number,
        expanded: boolean,
    ) => React.ReactNode;
    defaultExpandAllRows?: boolean;
    defaultExpandedRowKeys?: string[] | number[];
    expandedRowKeys?: string[] | number[];
    expandIconAsCell?: boolean;
    expandIconColumnIndex?: number;
    expandRowByClick?: boolean;
    onExpandedRowsChange?: (expandedRowKeys: string[] | number[]) => void;
    onExpand?: (expanded: boolean, record: T) => void;
    locale?: Object;
    indentSize?: number;
    onRowClick?: (record: T, index: number, event: Event) => void;
    onRow?: (record: T, index: number) => any;
    onHeaderRow?: (columns: ColumnProps<T>[], index: number) => any;
    useFixedHeader?: boolean;
    bordered?: boolean;
    showHeader?: boolean;
    footer?: (currentPageData: Object[]) => React.ReactNode;
    title?: (currentPageData: Object[]) => React.ReactNode;
    scroll?: { x?: boolean | number | string; y?: boolean | number | string };
    childrenColumnName?: string;
    bodyStyle?: React.CSSProperties;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

class Table<T> extends Component<TableProps<T>, any> {
    state = {}
    renderHeader = () => {
        return '';
    }
    renderBody = () => {
        return '';
    }
    render() {
        let me = this;
        let {
            columns,
            dataSource
        } = me.props;
        return (
            <div className="biz-table">
                <table>
                    <thead>
                        {me.renderHeader()}
                    </thead>
                    <tbody>
                        {me.renderBody()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table;
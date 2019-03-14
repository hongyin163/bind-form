import React from 'react';

export interface TableStateFilters {
  [key: string]: string[];
}

export type SortOrder = 'descend' | 'ascend';
export type CompareFn<T> = ((a: T, b: T, sortOrder?: SortOrder) => number);
export type ColumnFilterItem = { text: string; value: string; children?: ColumnFilterItem[] };

export interface ColumnProps<T> {
  title?:
  | React.ReactNode
  | ((
    options: {
      filters?: TableStateFilters;
      sortOrder?: SortOrder;
    },
  ) => React.ReactNode);
  key?: React.Key;
  dataIndex?: string;
  render?: (text: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  filters?: ColumnFilterItem[];
  onFilter?: (value: any, record: T) => boolean;
  filterMultiple?: boolean;
  filterDropdown?: React.ReactNode | ((props: Object) => React.ReactNode);
  filterDropdownVisible?: boolean;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  sorter?: boolean | CompareFn<T>;
  defaultSortOrder?: SortOrder;
  colSpan?: number;
  width?: string | number;
  className?: string;
  fixed?: boolean | ('left' | 'right');
  filterIcon?: React.ReactNode | ((filtered: boolean) => React.ReactNode);
  filteredValue?: any[];
  sortOrder?: SortOrder;
  children?: ColumnProps<T>[];
  onCellClick?: (record: T, event: any) => void;
  onCell?: (record: T, rowIndex: number) => any;
  onHeaderCell?: (props: ColumnProps<T>) => any;
}

export type RowSelectionType = 'checkbox' | 'radio';
export type SelectionSelectFn<T> = (
  record: T,
  selected: boolean,
  selectedRows: Object[],
  nativeEvent: Event,
) => any;

export interface TableRowSelection<T> {
  type?: RowSelectionType;
  selectedRowKeys?: string[] | number[];
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: Object[]) => void;
  getCheckboxProps?: (record: T) => Object;
  onSelect?: SelectionSelectFn<T>;
  // onSelectMultiple?: (selected: boolean, selectedRows: Object[], changeRows: Object[]) => void;
  onSelectAll?: (selected: boolean, selectedRows: Object[], changeRows: Object[]) => void;
  // onSelectInvert?: (selectedRows: Object[]) => void;
  // selections?: SelectionItem[] | boolean;
  hideDefaultSelections?: boolean;
  fixed?: boolean;
  columnWidth?: string | number;
  // selectWay?: TableSelectWay;
  columnTitle?: string | React.ReactNode;
}
export interface TableProps<T> {
  prefixCls?: string;
  dropdownPrefixCls?: string;
  rowSelection?: TableRowSelection<T>;
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
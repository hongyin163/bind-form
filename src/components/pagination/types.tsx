import React, { Component } from 'react'

export interface PaginationProps {
    total?: number;
    defaultCurrent?: number;
    current?: number;
    defaultPageSize?: number;
    pageSize?: number;
    onChange?: (page: number, pageSize?: number) => void;
    hideOnSinglePage?: boolean;
    showSizeChanger?: boolean;
    pageSizeOptions?: string[];
    onShowSizeChange?: (current: number, size: number) => void;
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
    size?: string;
    simple?: boolean;
    style?: React.CSSProperties;
    locale?: Object;
    className?: string;
    prefixCls?: string;
    selectPrefixCls?: string;
    itemRender?: (
        page: number,
        type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
        originalElement: HTMLElement,
    ) => React.ReactNode;
    role?: string;
}

export interface PaginationConfig extends PaginationProps {
    position?: 'top' | 'bottom' | 'both';
}
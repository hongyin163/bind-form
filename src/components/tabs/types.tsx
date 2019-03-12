
export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TabsProps {
    activeKey?: string;
    defaultActiveKey?: string;
    hideAdd?: boolean;
    onChange?: (activeKey: string) => void;
    onTabClick?: Function;
    onPrevClick?: React.MouseEventHandler<any>;
    onNextClick?: React.MouseEventHandler<any>;
    tabBarExtraContent?: React.ReactNode | null;
    tabBarStyle?: React.CSSProperties;
    type?: TabsType;
    tabPosition?: TabsPosition;
    onEdit?: (targetKey: string | React.MouseEvent<HTMLElement>, action: any) => void;
    size?: 'large' | 'default' | 'small';
    style?: React.CSSProperties;
    prefixCls?: string;
    className?: string;
    animated?: boolean | { inkBar: boolean; tabPane: boolean };
    tabBarGutter?: number;
    renderTabBar?: (props: TabsProps, DefaultTabBar: React.ReactNode) => React.ReactElement<any>;
}

// Tabs
export interface TabPaneProps {
    /** 选项卡头显示文字 */
    tab?: React.ReactNode | string;
    style?: React.CSSProperties;
    closable?: boolean;
    className?: string;
    disabled?: boolean;
    forceRender?: boolean;
    key?: string;
}

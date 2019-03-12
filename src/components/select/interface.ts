
const SelectSizes = ['default', 'large', 'small'];

export interface LabeledValue {
    key: string;
    label: React.ReactNode;
}

export type SelectValue = string | string[] | number | number[] | LabeledValue | LabeledValue[];

export interface OptionProps {
    disabled?: boolean;
    value?: string | number;
    title?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface AbstractSelectProps {
    prefixCls?: string;
    className?: string;
    showAction?: string | string[];
    size?: (typeof SelectSizes)[number];
    notFoundContent?: React.ReactNode | null;
    transitionName?: string;
    choiceTransitionName?: string;
    showSearch?: boolean;
    allowClear?: boolean;
    disabled?: boolean;
    showArrow?: boolean;
    style?: React.CSSProperties;
    tabIndex?: number;
    placeholder?: string | React.ReactNode;
    defaultActiveFirstOption?: boolean;
    dropdownClassName?: string;
    dropdownStyle?: React.CSSProperties;
    dropdownMenuStyle?: React.CSSProperties;
    dropdownMatchSelectWidth?: boolean;
    onSearch?: (value: string) => any;
    getPopupContainer?: (triggerNode?: Element) => HTMLElement;
    filterOption?: boolean | ((inputValue: string, option: React.ReactElement<OptionProps>) => any);
    id?: string;
    defaultOpen?: boolean;
    open?: boolean;
    onDropdownVisibleChange?: (open: boolean) => void;
    autoClearSearchValue?: boolean;
    dropdownRender?: (menu?: React.ReactNode, props?: SelectProps) => React.ReactNode;
    loading?: boolean;
};

export interface SelectProps<T = SelectValue> extends AbstractSelectProps {
    value?: T;
    defaultValue?: T;
    mode?: 'default' | 'multiple' | 'tags' | 'combobox' | string;
    optionLabelProp?: string;
    firstActiveValue?: string | string[];
    onChange?: (value: T, option: React.ReactElement<any> | React.ReactElement<any>[]) => void;
    onSelect?: (value: T, option: React.ReactElement<any>) => any;
    onDeselect?: (value: T) => any;
    onBlur?: (value: T) => void;
    onFocus?: () => void;
    onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
    onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => any;
    onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => any;
    maxTagCount?: number;
    maxTagPlaceholder?: React.ReactNode | ((omittedValues: T[]) => React.ReactNode);
    optionFilterProp?: string;
    labelInValue?: boolean;
    tokenSeparators?: string[];
    getInputElement?: () => React.ReactElement<any>;
    autoFocus?: boolean;
    suffixIcon?: React.ReactNode;
    removeIcon?: React.ReactNode;
    clearIcon?: React.ReactNode;
    menuItemSelectedIcon?: React.ReactNode;
};

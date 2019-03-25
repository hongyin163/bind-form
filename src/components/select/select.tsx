import classnames from 'classnames';
import Animate from 'rc-animate';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SelectProps } from './interface';
import Option from './option';
import './style/index.less';

export interface SelectPropsCustom extends SelectProps {
    label?: string;
    className?: string;
    onClick?: () => void;
    children?: React.ReactElement[];
}



class List extends Component<any> {
    componentWillMount() {
        document.addEventListener('click', this.close);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.close);
    }
    close = (e) => {
        const me = this;
        const {
            onClose = () => null,
        } = me.props;
        onClose(e);
    }
    render() {
        return this.props.children;
    }
}



// tslint:disable-next-line: max-classes-per-file
export default class Select extends Component<SelectPropsCustom, {}>{
    public static Option: typeof Option;
    public dropdownContainer: HTMLDivElement;

    public state = {
        selected: false,
        value: '',
        checkedLabel: '',
    };
    public componentDidMount() {
        this.setDefaultValue(this.props);
    }
    public componentWillReceiveProps(nextProps) {
        this.setDefaultValue(nextProps);
    }
    public setDefaultValue = (props) => {
        const me = this;
        const {
            children,
            value,
            defaultValue,
        } = props;
        const currentValue = value || defaultValue;
        if (currentValue) {
            React.Children.map(children, (child: React.ReactElement, i) => {
                if (currentValue == child.props.value) {
                    me.setState({
                        value: child.props.value,
                        checkedLabel: child.props.children,
                    });
                }
            })
        } else {
            me.setState({
                value: children[0].props.value,
                checkedLabel: children[0].props.children,
            });
        }
    }
    // 点击选择
    public handleSelected = (e) => {
        const me = this;
        const {
            onClick = () => null,
        } = this.props;

        me.setState({
            selected: true,
        }, () => {
            onClick();
        })
    };
    public onOptionSelect = (val) => {
        const {
            onChange = () => null,
        } = this.props;

        this.setState({
            selected: false,
            value: val.value,
            checkedLabel: val.children,
        }, () => {
            onChange(val.value, val.children);
        });
    }
    // 获取option节点
    public getChildOptions = () => {
        const {
            children,
        } = this.props;
        return React.Children.map(children, (child: React.ReactElement, i) => {
            return React.cloneElement(child, {
                id: i,
                onSelect: this.onOptionSelect,
                className: '',
            })
        })
    }
    // 渲染option
    public renderOption = () => {
        const me = this;

        const {
            selected,
        } = me.state;
        // tslint:disable-next-line: one-variable-per-declaration
        let top = 0, left = 0, width = 0, height = 0;
        if (selected) {
            const dom: any = ReactDOM.findDOMNode(this);
            if (!dom) {
                return null;
            }
            const node = dom.getBoundingClientRect();
            left = node.left;
            top = node.top;
            height = node.height;
            width = node.width;
            top = top + height + 3;
        }
        const childs = this.getChildOptions();
        return (
            <Animate
                transitionName="slide-up"
            >
                {
                    selected && (
                        <List onClose={me.handleCloseSelect}>
                            <div
                                className='biz-select-dropdown'
                                style={{ width, top, left }}
                            >
                                {childs}
                            </div>
                        </List>
                    )
                }
            </Animate>
        );
    };
    // 渲染下拉列表
    public renderSelectMenu = () => {
        const me = this;
        const id = 'biz-select';
        if (!this.dropdownContainer) {
            const root = document.createElement('div');
            root.id = id;
            this.dropdownContainer = root;
            document.body.appendChild(this.dropdownContainer);
        }
        return ReactDOM.createPortal(
            me.renderOption(),
            this.dropdownContainer)
    };
    // 关闭下拉列表
    public handleCloseSelect = () => {
        this.setState({
            selected: false,
        });
    };
    public render() {
        const {
            className,
            label = '',
            style = {},
        } = this.props;
        const { selected, checkedLabel } = this.state;

        return (
            <div className={classnames('biz-select', className, { 'biz-selected': selected })}
                ref="bizSelect"
                style={style}
            >
                <div
                    className={classnames('biz-select-selection')}
                    onClickCapture={this.handleSelected}
                >
                    <div className="biz-select-selection_rendered">
                        <div className={classnames('biz-select-selection-selected-value')}>
                            {checkedLabel}
                        </div>
                        <span unselectable="on" className="biz-select-arrow">
                            <i className="biz-select-arrow-icon" />
                        </span>
                    </div>
                </div>
                {this.renderSelectMenu()}
            </div>
        );
    }
}
Select.Option = Option;

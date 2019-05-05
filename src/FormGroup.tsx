import React, { Component } from 'react';
import { fieldPropName, rulesPropName } from './constants';
// import { util } from 'biz-lib';
import { getFeildRules, getFieldName } from './util';

import { IFormGroupProps } from './types';

function FormWraper(Ele, id, value, onChange) {
    // debugger;
    Ele.props.value = value || {};
    Ele.props.onChange = (val) => {
        onChange(id, val);
    }
    return Ele;
}

export default class FormGroup extends Component<IFormGroupProps, any> {
    public nodeArch: any;
    public parent: string;
    public root: any;
    public firstNode: any;
    constructor(props, context) {
        super(props, context);
        const me = this;

        me.state = {
            value: {},
        };

        me.nodeArch = {
            'root': {
                id: 'root',
                name: 'root',
                parent: null,
            },
        };
        me.parent = 'root';

    }
    public shouldComponentUpdate() {
        if (!this.isControl()) {
            return false;
        }
        return true;
    }
    public isControl = () => {
        return this.props.hasOwnProperty('value');
    }
    public getValue() {
        const me = this;
        const {
            value,
        } = me.props;
        if (me.isControl()) {
            return value || {};
        } else {

            return me.state.value;
        }
    }
    public getDisplayName(node: React.ReactElement) {
        if (typeof node.type === 'function') {
            const type = node.type as React.ComponentClass;
            return type.displayName || type.name;
        }
        return node.type;
    }
    public addNode(parent, name, node) {
        const me = this;
        const id = `${parent}_${name}`;
        me.nodeArch[id] = {
            id,
            name,
            parent,
        };
        return id;
    }
    public setValueBy = (id: string, value: any) => {
        const me = this;
        // console.log('setValue');
        // console.log(id, value);
        me.setState((state) => {
            state.value[id] = value;
            return state;
        }, () => {
            me.onFormChange();
        });
    }
    public getChildren = (parentId) => {
        const me = this;
        const nodeArch = me.nodeArch;

        return Object.keys(nodeArch)
            .filter(key => nodeArch[key].parent === parentId)
            .map((key) => nodeArch[key]);
    }
    public getDefaultValue = (id) => {
        const me = this;
        const {
            defaultValue = {},
        } = me.props;
        const nodeArch = me.nodeArch;
        const parent = id;
        const names: any[] = [];
        let node = nodeArch[parent];
        // debugger;
        while (node.parent !== 'root') {
            names.unshift(node.name)
            node = nodeArch[node.parent];
        }
        let value = defaultValue;
        for (const name of names) {
            if (value[name]) {
                value = value[name];
            } else {
                value = {};
                break;
            }
        }
        return value;
    }
    public buildNode = (parentNode, parentData) => {
        const me = this;
        const {
            value,
        } = me.state;

        const { id } = parentNode;
        const children = me.getChildren(id);

        children.forEach((child) => {
            parentData[child.name] = value[child.id] || me.getDefaultValue(child.id);
            me.buildNode(child, parentData[child.name]);
        })
    }
    public onFormChange = () => {
        const me = this;
        const {
            onChange = () => void 0,
        } = me.props;
        const root = {
            id: 'root',
            name: 'root',
            parent: null,
        }
        const data = {};
        me.buildNode(root, data);
        onChange(data[me.firstNode]);
    }
    public renderSubForm = (value, childs: React.ReactElement[] = []) => {
        const me = this;
        React.Children.forEach(childs, (child: React.ReactElement, i) => {
            // debugger;
            if (!child.props) {
                return;
            }

            if (me.getDisplayName(child) === 'Form') {
                const {
                    children,
                } = child.props;
                const name = getFieldName(child);
                const id = me.addNode(me.parent, name, child);
                const val = value[id] || me.getDefaultValue(id);
                childs[i] = FormWraper(child, id, val, (childId, childValue) => {
                    // console.log('FormWraper', childValue);
                    me.setValueBy(childId, childValue);
                });

                if (children) {
                    const lastParent = me.parent;
                    me.parent = id;
                    me.renderSubForm(value, children);
                    me.parent = lastParent;
                }
            } else {
                const {
                    children,
                } = child.props;

                if (children) {
                    me.renderSubForm(value, children);
                }
            }
        });
    }
    public setFirstFormValue = (value, childs: React.ReactElement[] = []) => {
        const me = this;

        if (!childs || childs.length === 0) {
            return;
        }
        if (childs.length !== 1) {
            console.warn('FormGroup 只允许有一个 Form 根组件');
        }
        if (!childs[0].props) {
            childs[0].props = {}
        }
        const {
            onChange = () => void 0,
        } = me.props;
        childs[0].props.value = value;
        childs[0].props.onChange = onChange;
    }
    /**
     * 检查根节点第一个form是否设置name或者data-name，如果没有设置
     * 需要设置name属性
     */
    public setFirstFormName = (childs: React.ReactElement[] = []) => {
        const me = this;

        if (!childs || childs.length === 0) {
            return;
        }
        if (childs.length !== 1) {
            console.warn('FormGroup 只允许有一个 Form 根组件');
        }
        if (!childs[0].props) {
            childs[0].props = {}
        }
        const props = childs[0].props;
        const fieldName = `data-${fieldPropName}`;
        childs[0].props[fieldName] = props[fieldName] || props[fieldPropName] || 'firstNode';
        me.firstNode = childs[0].props[fieldName];
    }
    public render() {
        const me = this;
        const value = me.getValue();
        // console.log('FormGroup', value);
        const {
            children = [],
        } = me.props;

        const childs = React.Children.toArray(children);
        if (me.isControl()) {
            me.setFirstFormValue(value, childs as React.ReactElement[]);
            return childs;
        } else {
            me.setFirstFormName(childs as React.ReactElement[]);
            me.renderSubForm(value, childs as React.ReactElement[])
            return childs;
        }
    }
}

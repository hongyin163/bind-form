import React, { Component } from 'react';
// import { util } from 'biz-lib';
import { IFormGroupProps } from './types';

function FormWraper(Ele, id, value, onChange) {
    debugger;
    Ele.props.value = value || {};
    Ele.props.onChange = function (val) {
        onChange(id, val);
    }
    return Ele;
}


export default class FormGroup extends Component<IFormGroupProps, any> {
    nodeArch: any;
    parent: string;
    root: any;
    firstNode: any;
    constructor(props, context) {
        super(props, context);
        const me = this;
        // const state = {};
        // me.initState(props.value || {}, 'root', state);
        // debugger;
        me.state = {
            value: {},
        };

        me.nodeArch = {
            'root': {
                id: 'root',
                name: 'root',
                parent: null,
            }
        };
        me.parent = 'root';

    }
    shouldComponentUpdate() {
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
    initState(value, parent, state = {}) {
        const me = this;

        let children = me.getChildren(parent);
        children.forEach((child) => {
            state[child.id] = value[child.name];
            me.initState(value, child.id, state);
        })
    }
    public getDisplayName(node: React.ReactElement) {
        if (typeof node.type === 'function') {
            const type = node.type as React.ComponentClass;
            return type.displayName || type.name;
        }
        return node.type;
    }
    addNode(parent, name, node) {
        const me = this;
        const id = `${parent}_${name}`;
        me.nodeArch[id] = {
            id,
            name,
            parent
        };
        return id;
    }
    setValueBy = (id: string, value: any) => {
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
    getChildren = (parentId) => {
        const me = this;
        const nodeArch = me.nodeArch;

        return Object.keys(nodeArch)
            .filter(key => nodeArch[key].parent === parentId)
            .map((key) => nodeArch[key]);
    }
    getDefaultValue = (id) => {
        const me = this;
        const {
            defaultValue = {}
        } = me.props;
        const nodeArch = me.nodeArch;
        let parent = id;
        let names: any[] = [];
        let node = nodeArch[parent];
        debugger;
        while (node.parent !== 'root') {
            names.unshift(node.name)
            node = nodeArch[node.parent];
        }
        let value = defaultValue;
        for (let i = 0; i < names.length; i++) {
            let name = names[i];
            if (value[name]) {
                value = value[name];
            } else {
                value = undefined;
            }

        }
        return value;
    }
    buildNode = (parentNode, parentData) => {
        const me = this;
        const {
            value,
        } = me.state;

        let { id } = parentNode;
        let children = me.getChildren(id);

        children.forEach((child) => {
            parentData[child.name] = value[child.id] || me.getDefaultValue(child.id);
            me.buildNode(child, parentData[child.name]);
        })
    }
    onFormChange = () => {
        const me = this;
        const {
            onChange = () => void 0,
        } = me.props;
        let root = {
            id: 'root',
            name: 'root',
            parent: null,
        }
        let data = {};
        me.buildNode(root, data);
        onChange(data[me.firstNode]);
    }
    renderSubForm = (value, childs: React.ReactElement[] = []) => {
        const me = this;
        React.Children.forEach(childs, (child: React.ReactElement, i) => {
            // debugger;
            if (!child.props) {
                return;
            }

            if (me.getDisplayName(child) === 'Form') {
                let {
                    name,
                    children
                } = child.props;

                let id = me.addNode(me.parent, name, child);
                let val = value[id] || me.getDefaultValue(id);
                childs[i] = FormWraper(child, id, val, (id, value) => {
                    console.log('FormWraper', value);
                    me.setValueBy(id, value);
                });

                if (children) {
                    let lastParent = me.parent;
                    me.parent = id;
                    me.renderSubForm(value, children);
                    me.parent = lastParent;
                }
            } else {
                let {
                    children
                } = child.props;

                if (children) {
                    me.renderSubForm(value, children);
                }
            }
        });
    }
    setFirstFormValue = (value, childs: React.ReactElement[] = []) => {
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
    setFirstFormName = (childs: React.ReactElement[] = []) => {
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
        childs[0].props.name = childs[0].props.name || 'firstNode';
        me.firstNode = childs[0].props.name;
    }
    render() {
        const me = this;
        const value = me.getValue();
        console.log('FormGroup', value);
        const {
            children = []
        } = me.props;

        let childs = React.Children.toArray(children);
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

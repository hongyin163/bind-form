import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PaginationProps } from './types';

class Pagination extends Component<PaginationProps, any> {
    static propTypes = {
        current: PropTypes.number,
        pageSize: PropTypes.number,
        total: PropTypes.number,
    }
    constructor(props, context) {
        super(props, context);
    }
    onSelect(e) {
        const me = this;
        const current = me.props.current;
        const target = e.target;

        let currentNode = null;
        const focus = document.getElementsByClassName('biz-pagination_item current');

        if (focus.length > 0) {
            currentNode = focus[0];
            currentNode.className = 'biz-pagination_item'
        }

        const inText = target.innerText;
        if (!isNaN(target.innerText)) {
            target.parentNode.className = 'biz-pagination_item current';
        } else if (inText === '>') {
            currentNode.nextSibling.className = 'biz-pagination_item current';
        } else if (inText === '<') {
            currentNode.previousSibling.className = 'biz-pagination_item current';
        }
    }
    onChange(page) {
        const {
            onChange = () => null,
        } = this.props;
        onChange(page);
    }
    getLinks() {
        const me = this;
        const {
            current = 1, total = 0, pageSize = 20,
        } = me.props;
        const totalPage = Math.ceil(total / pageSize);
        const links = [];

        //页数小于5,
        if (totalPage <= 5) {
            for (let i = 1; i <= totalPage; i++) {
                links.push(
                    <li key={i} className={"biz-pagination_item " + (i === current ? 'current' : '')}>
                        <a key={i} onClick={me.onChange.bind(me, i)}>{i}</a>
                    </li>,
                )
            }
            return (
                <ul className="pager" onClick={me.onSelect.bind(me)}>
                    {links}
                </ul>
            )
        }

        //页数大于5
        let start = current - 2;
        let end = current + 2;
        if (start < 1) {
            end = end + (1 - start);
            start = 1;
        }
        if (end > totalPage) {
            start = start - (end - totalPage)
            end = totalPage;
        }

        for (let i = start; i <= end; i++) {
            links.push(
                <li key={i} className={"biz-pagination_item " + (i === current ? 'current' : '')}>
                    <a onClick={me.onChange.bind(me, i)} >{i}</a>
                </li>,
            )
        }

        //前面的导航按钮展示逻辑
        const pre = [];
        if (current > 3) {
            pre.push(
                <li key={'<<'} className="biz-pagination_item first">
                    <a onClick={me.onChange.bind(me, 1)} >{'<<'}</a>
                </li>,
            )
        }

        if (current >= 1) {
            pre.push(
                <li key={'<' + (current - 1)} className="biz-pagination_item pre">
                    <a onClick={me.onChange.bind(me, current - 1)} >{'<'}</a>
                </li>,
            )
        }

        //后面的导航按钮展示逻辑
        const next = [];
        if (current < totalPage) {
            next.push(
                <li key={'>' + (current + 1)} className="biz-pagination_item next">
                    <a onClick={me.onChange.bind(me, current + 1)}>{'>'}</a>
                </li>,
            )
        }
        if (current < totalPage - 3) {
            next.push(
                <li key={'>>'} className="biz-pagination_item last">
                    <a onClick={me.onChange.bind(me, totalPage)}>{'>>'}</a>
                </li>,
            )
        }
        return (
            <ul className="pager" onClick={me.onSelect.bind(me)}>
                {pre}
                {links}
                {next}
            </ul>
        )
    }
    render() {
        return this.getLinks();
    }
}

export default Pagination;

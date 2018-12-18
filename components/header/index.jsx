import React, { Component } from 'react';

import {
    withRouter,
    matchPath
} from 'react-router-dom';
import './index.less';

/**
 [
{
    key: 'project',
    title: '项目管理',
    link: '/admin/projects',
    includeRoutes: [
        '/admin/pro-add',
        '/admin/pro-edit/:id',
        '/admin/pro-info/:id*',
        '/admin/question-select/:id',
        '/admin/account/:id',
        '/admin/report/:id',
        '/admin/exam-progress/:id',
        '/admin/exam-assign/:id'
    ]
},
{
    key: 'exam',
    title: '笔试试卷库',
    link: '/exam/admin/paper',
    includeRoutes: [
        '/exam/admin/subject/:pid',
        '/exam/admin/question/:pid/:gid/:pageSize/:pageNumber?'
    ]
}
]
 */

class Header extends Component {
    constructor(props, context) {
        super(props, context);
        let me = this;
        me.state = {
            items: props.menus || []
        };
    }

    isActive = ({ link, includeRoutes = [] }) => {
        let me = this;
        let {
            match: {
                path
            }
        } = me.props;
        includeRoutes.unshift(link);
        return includeRoutes.some((route) => {
            let result = matchPath(route, path);
            return result && result.isExact;
        });
    }
    renderMenu = () => {
        let me = this;
        let {
            items
        } = me.state;
        return items.map((item) => {
            return (
                <div className={`header__menu-item ${me.isActive(item) && 'header__menu-item--active'}`} key={item.key}>
                    <a href={item.link}>  {item.title}</a>
                </div>
            );
        });
    }
    render() {
        let me = this;
        let {
            renderUser = () => null
        } = me.props;
        return (
            <div className="header">
                <div className="header__user">
                    {renderUser()}
                </div>
                <div className="header__menu">
                    {me.renderMenu()}
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
import React, { Component } from 'react';
import { Avatar } from 'antd';
// import { getUserInfo } from './user';
import './index.less';

// const CACHE = {};

class UserAvatar extends Component {
    logout = () => {
        let me = this;
        let {
            onLogout = () => null
        } = me.props;
        onLogout();
    }
    render() {
        let me = this;
        let {
            userName
        } = me.props;
        return (
            <div className="user-avatar">
                <Avatar icon="user" />
                <span className="user-avatar__name" >
                    {userName}
                </span>
                <span className="user-avatar__menu" onClick={me.logout}>
                    退出
                </span>
            </div>
        );
    }
}

export default UserAvatar;          
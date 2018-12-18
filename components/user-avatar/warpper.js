import React, { Component } from 'react';

const CACHE = {};
export default function warpper(Ele, { getUserInfo, onLogout }) {

    return class Warpper extends Component {
        constructor(props, context) {
            super(props, context);
            let me = this;
            me.state = {
                userName: ''
            };
        }
        async  componentDidMount() {
            if (CACHE['userName']) {
                this.setState({
                    userName: CACHE['userName']
                });
                return;
            }
            let userName = await getUserInfo();
            CACHE['userName'] = userName;
            this.setState({
                userName
            });
        }
        render() {
            let me = this;
            let {
                userName
            } = me.state;
            return <Ele userName={userName} onLogout={onLogout} />;
        }
    };
}
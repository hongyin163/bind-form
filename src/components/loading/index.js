import React from 'react';
import { Spin, Icon } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default function Loading({ error, pastDelay }) {
    if (error) {
        return <div>Error!1111</div>;
    } else if (pastDelay) {
        return <Spin indicator={antIcon} />;
    } else {
        return <Spin indicator={antIcon} />;
    }
}

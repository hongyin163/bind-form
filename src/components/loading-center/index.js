import React from 'react';
import { Spin } from 'antd';
import './index.less';

export default function Loading() {
    return (
        <div className="loading-center">
            <Spin />
        </div>
    );
}


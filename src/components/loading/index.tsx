import React from 'react';
import ReactDOM from 'react-dom';
import Spin from '../spin';

let DISABLE = false;
// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

interface LoadingProps {
    error?: string;
    tip?: string;
    pastDelay?: number;
}

export default function Loading({ error, tip = '加载中', pastDelay }: LoadingProps = {}) {
    if (error) {
        return <div>Error</div>;
    } else if (pastDelay) {
        return <Spin tip={tip} />;
    } else {
        return <Spin tip={tip} />;
    }
}

function gerRoot(id) {
    let root = document.getElementById(id);
    if (!root) {
        root = document.createElement('div');
        root.id = id;
        document.body.appendChild(root);
    }
    return root;
}

let isShow = false;

export const show = (tip) => {
    if (DISABLE) {
        return;
    }
    if (isShow) {
        return true;
    }
    isShow = true;
    const root = gerRoot('biz-loading');
    return ReactDOM.render((
        <div className="biz-loading">
            <Spin tip={tip} />
        </div>
    ), root);
};

export const hide = () => {
    if (DISABLE) {
        return;
    }
    if (!isShow) {
        return;
    }
    const root = gerRoot('biz-loading');
    ReactDOM.unmountComponentAtNode(root);
    isShow = false;
    return;
};

export const setDisalbe = (disable) => {
    DISABLE = disable;
    return;
};

Loading.show = show;
Loading.hide = hide;
Loading.setDisalbe = setDisalbe;

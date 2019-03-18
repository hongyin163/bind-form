import React from 'react';
import ReactDOM from 'react-dom';
import Spin from '../spin';

// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default function Loading({ error, text = '加载中', pastDelay }) {
    if (error) {
        return <div>Error</div>;
    } else if (pastDelay) {
        return <Spin text={text} />;
    } else {
        return <Spin text={text} />;
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
    if (isShow) {
        return true;
    }
    isShow = true;
    let root = gerRoot('biz-loading');
    return ReactDOM.render((
        <div className="biz-loading">
            <Spin tip={tip} />
        </div>
    ), root);
};


export const hide = () => {
    if(!isShow){
        return;
    }
    let root = gerRoot('biz-loading');
    ReactDOM.unmountComponentAtNode(root);
    isShow = false;
    return;
};

Loading.show = show;
Loading.hide = hide;
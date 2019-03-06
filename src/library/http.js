import axios from 'axios';
import RAP from '../config/rap';

const FORMAT = {
    'form': 'application/x-www-form-urlencoded',
    'json': 'application/json',
    'form-data': 'multipart/form-data'
};

function addRandom(url) {
    //加随机数，避免缓存
    let v = (Math.random() * 1000000).toFixed(0);
    if (url.indexOf('?') > 0) {
        url += `&_v=${v}`;
    } else {
        url += `?_v=${v}`;
    }
    return url;
}

function getValueByFormat(data, format) {
    if (format == 'json') {
        return JSON.stringify(data);
    } else if (format == 'form') {
        let dataStr = '';
        for (const key in data) {
            if (dataStr.length == 0) {
                dataStr = `${key}=${data[key]}`;
            } else {
                dataStr += `&${key}=${encodeURIComponent(data[key])}`;
            }
        }
        return dataStr;
    } else if (format == 'form-data') {
        const formData = new FormData();
        if (data) {
            Object.keys(data).map(key => {
                formData.append(key, data[key]);
            });
        }
        return formData;
    }
    return '';
}

let http = {
    get(url, params) {
        return axios.get(addRandom(url), {
            params
        }).then((res) => res.data);
    },
    post(url, params, format = 'json') {
        return axios({
            method: 'post',
            url: addRandom(url),
            data: getValueByFormat(params, format),
            headers: {
                'Accept': 'application/json',
                'Content-Type': FORMAT[format]
            },
            // withCredentials: true
        }).then((res) => res.data);
    },
    jsonp(url) {
        return axios.get(addRandom(url))
            .then((res) => res.data);
    }
};

if (process.env.NODE_ENV == 'development') {
    http = {
        get(url, params={}) {
            console.log(`GET请求:${url},参数:${JSON.stringify(params)}`);
            return axios.get(`${RAP.host}/mockjsdata/${RAP.projectId}${url}`).then((res) => res.data);
        },
        post(url,params) {
            console.log(`POST请求:${url},参数:${JSON.stringify(params)}`);
            return this.get(url);
        },
        jsonp(url) {
            return this.get(url);
        }
    };
}

export default http;
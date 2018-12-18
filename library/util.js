export default {
    hashCode(str) {
        let hash = 0;
        if (str.length == 0) return hash;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },

    // 设置cookie
    setCookie: function (name, value, expires, path, domain, secure) {
        let curCookie = `${name}=${escape(value)}${(expires) ? `; expires=${expires.toUTCString()}` : ''}${(path) ? `; path=${path}` : '; path=/'}${(domain) ? `; domain=${domain}` : ''}${(secure) ? '; secure' : ''}`;
        document.cookie = curCookie;
    },
    //获取cookie
    getCookie: function (name) {
        let reg = new RegExp(`${name}=([^;]+)`, 'i');
        let matchCookie = document.cookie.match(reg);
        return matchCookie ? decodeURIComponent(matchCookie[1]) : '';
    },
    getBase64Image(img, width, height, crossOrigin) {
        let canvas = document.createElement('canvas');
        width = width || img.width;
        height = height || img.height;
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        if (crossOrigin)
            img.setAttribute('crossOrigin', 'anonymous');
        ctx.drawImage(img, 0, 0, width, height);
        let dataURL = canvas.toDataURL('image/png');
        return dataURL;

    },
    getBase64ByImageUrl(imgUrl, width, height) {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas'),//获取canvas
                ctx = canvas.getContext('2d'), //对应的CanvasRenderingContext2D对象(画笔)
                img = new Image(),//创建新的图片对象
                base64 = '';//base64 
            img.onload = function () {//图片加载完，再draw 和 toDataURL
                try {
                    width = width || img.width;
                    height = height || img.height;
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    base64 = canvas.toDataURL('image/png');
                    resolve(base64);
                } catch (err) {
                    reject(err.message);
                }
            };
            img.onerror = function (err) {
                reject(err.message);
            };
            if (/^http/.test(imgUrl)) {
                img.setAttribute('crossOrigin', 'anonymous');
            }
            img.src = imgUrl;
        });
    },
    getBase64ByImageSize(imgUrl, srcX = 0, srcY = 0, srcW, srcH, dstX = 0, dstY = 0, dstW, dstH) {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas'),//获取canvas
                ctx = canvas.getContext('2d'), //对应的CanvasRenderingContext2D对象(画笔)
                img = new Image(),//创建新的图片对象
                base64 = '';//base64 
            img.onload = function () {//图片加载完，再draw 和 toDataURL
                try {
                    dstW = dstW || img.width;
                    dstH = dstH || img.height;
                    canvas.width = dstW;
                    canvas.height = dstH;
                    ctx.drawImage(img, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
                    base64 = canvas.toDataURL('image/png');
                    resolve(base64);
                } catch (err) {
                    reject(err.message);
                }
            };
            img.onerror = function (err) {
                reject(err.message);
            };
            if (/^http/.test(imgUrl)) {
                img.setAttribute('crossOrigin', 'anonymous');
            }
            img.src = imgUrl;
        });
    },
    isIE() {
        let {
            userAgent
        } = window.navigator;
        if (userAgent.indexOf('MSIE') >= 1 || userAgent.indexOf('Trident') >= 1)
            return true;
        else
            return false;
    },
    isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    },
    toFixed(number, pos = 1, isFloor = true) {
        if (typeof number == 'string') {
            number = Number(number);
        }
        let x = Math.pow(10, pos);
        let num = number * x;
        let temp = isFloor ? Math.floor(num) : Math.ceil(num);
        return temp / x;
    }
};
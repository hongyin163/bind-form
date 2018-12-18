
let jsSHA = require('jssha/src/sha1');


const SLICE_SIZE_512K = 524288,
    SLICE_SIZE_1M = 1048576,
    // SLICE_SIZE_2M = 2097152,
    // SLICE_SIZE_3M = 3145728,
    MAX_UNSLICE_FILE_SIZE = 4194304;


class Uploader {
    constructor(options) {
        let me = this;
        let def = {
            id: 'wos_uploader',
            appid: '',// APPID 必填参数
            bucket: '',//bucketName 必填参数
            wosurl: '',//wos的url 必填参数
            sliceSize: SLICE_SIZE_512K,
            getWosSign() {//获取签名 必填参数
                return Promise.resolve('');
            },
            getFileName(filename) {
                return filename;
            }
        };

        me._options = Object.assign({}, def, options);
        me.events = {};
        me.slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

    }
    showFileDialog() {
        let me = this;
        me.createFileInput();
        me.triggerClick();
    }
    createFileInput() {
        let me = this;
        let id = me._options.id;
        let doc = document;
        let input = doc.getElementById(id);
        if (input) {
            input.parentNode.removeChild(input);
        }
        input = doc.createElement('input');
        input.id = id;
        input.type = 'file';
        input.style.display = 'none';
        input.onchange = me.onFileInput.bind(me);
        me._input = input;
        doc.body.appendChild(input);
    }
    createXhr() {
        let xmlhttp = null;
        if (window.XMLHttpRequest) {// code for all new browsers
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {// code for IE5 and IE6
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        return xmlhttp;
    }
    getSliceSHA1({ file, sliceSize }) {
        let me = this;
        let { size } = file;
        let offset = 0;
        let reader = new FileReader();
        let slices = [];
        return new Promise((resolve, reject) => {

            if (size > MAX_UNSLICE_FILE_SIZE) {
                reader.readAsBinaryString(file.slice(offset, offset + sliceSize));
                // reader.readAsText(file.slice(offset, offset + sliceSize));
                reader.onload = function (e) {
                    let sha = me.getSHA1(e.target.result);
                    let len = sliceSize;
                    if (offset + len >= size) {
                        len = size - offset;
                    }

                    slices.push({
                        offset: offset,
                        datalen: len,
                        datasha: sha
                    });

                    offset += sliceSize;

                    if (offset < size) {
                        let nextlen = offset + sliceSize;
                        if (nextlen > size) {
                            nextlen = size;
                        }
                        reader.readAsBinaryString(file.slice(offset, nextlen));
                        // reader.readAsText(file.slice(offset, nextlen));
                    } else {
                        //结束
                        resolve(slices);
                    }
                };
                reader.onerror = function (err) {
                    reject(err);
                };
            } else {
                reader.readAsBinaryString(file.slice(offset, size));
                // reader.readAsText(file.slice(offset, size));
                reader.onload = function (e) {
                    let sha = me.getSHA1(e.target.result);
                    slices.push({
                        offset: 0,
                        datalen: size,
                        datasha: sha
                    });
                    resolve(slices);
                };
            }
        });
    }
    getSHA1(arrayBuffer) {
        let sha = new jsSHA('SHA-1', 'BYTES');
        // var sha = shajs('sha1').update(arrayBuffer).digest('hex')
        sha.update(arrayBuffer);
        let result = sha.getHash('HEX');

        return result;
    }
    getSliceSize(e) {
        if (e <= SLICE_SIZE_512K) {
            return SLICE_SIZE_512K;
        } else if (e <= SLICE_SIZE_1M) {
            return SLICE_SIZE_1M;
        }
        return SLICE_SIZE_1M;
    }
    getCgiUrl(filename) {
        let me = this;
        let {
            appid,// APPID 必填参数
            bucket,//bucketName 必填参数
            wosurl,//wos的url 必填参数
        } = me._options;
        return `${wosurl}/${appid}/${bucket}/${filename}`;
    }
    post(url, token, formData, onprogress) {
        let me = this;
        // let { getWosSign } = me._options;
        return new Promise((resolve, reject) => {
            let xhr = me.createXhr();
            xhr.open('POST', url, true);
            // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            if (token) {
                xhr.setRequestHeader('Authorization', token);
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {// 4 = "loaded"
                    if (xhr.status == 200) {// 200 = OK
                        let result = eval(`(${xhr.responseText})`);

                        resolve(result);
                    }
                    else {
                        reject(xhr.status);
                    }
                }
            };
            let fd = new FormData();
            for (let key in formData) {
                fd.append(key, formData[key]);
            }
            xhr.upload.onprogress = onprogress;
            xhr.send(fd);
        });
    }
    triggerClick() {
        if (this._input)
            this._input.click();
    }
    onFileInput(e) {
        let files = e.target.files;
        let file = files[0];
        this.uploadFile(file);
    }
    uploadFile(file) {
        let me = this;
        let {
            size
        } = file;

        if (size > MAX_UNSLICE_FILE_SIZE) {
            me.sliceUploadFile(file);
        } else {
            me.singleUploadFile(file);
        }
    }
    singleUploadFile(file) {
        let me = this;
        let {
            // appid,// APPID 必填参数
            // bucket,//bucketName 必填参数
            // wosurl,//wos的url 必填参数
            getWosSign,
            getFileName
        } = me._options;

        // let {
        //     name, size, type
        // } = file;

        let sliceSize = MAX_UNSLICE_FILE_SIZE;
        let filename = getFileName(file.name);
        return getWosSign(filename).then((token) => {
            return me.getSliceSHA1({ file, sliceSize }).then((slices) => {
                let sha = slices[slices.length - 1].datasha;
                let url = me.getCgiUrl(filename);
                return me.post(url, token, {
                    op: 'upload',
                    filecontent: file,
                    sha,
                    insertOnly: 1
                }).then((res) => {
                    me.success(res);
                });
            });
        }).catch((err) => {
            // console.error(err);
            me.error(err);
        });
    }

    sliceUpload({ filename, file, url, offset, session, sliceSize, uploadparts }) {
        let me = this;
        let {
            // appid,// APPID 必填参数
            // bucket,//bucketName 必填参数
            // wosurl,//wos的url 必填参数
            // sliceSize,
            getWosSign,
            // getFileName
        } = me._options;

        let slice_size = sliceSize,
            totalSize = file.size,
            targetOffset = offset + slice_size;

        let index = offset / slice_size,
            len = uploadparts.length;
        if (index < len) {
            // let sha = uploadparts[index].datasha;
        }
        let filecontent = me.slice.call(file, offset, targetOffset);

        let onprogress = (e) => {
            let t = (offset + e.loaded) / file.size;
            t > 1 && (t = 1);
            me.progress(t);
        };
        return getWosSign(filename).then((token) => {
            return me.post(url, token, {
                op: 'upload_slice_data',
                session,
                offset,
                filecontent
            }, onprogress).then((rest) => {

                if (0 == rest.code) {
                    let nextOffset = parseInt(rest.data.offset) + slice_size;
                    if (nextOffset < totalSize) {
                        return me.sliceUpload({
                            filename, file, url, offset: nextOffset, session, sliceSize, uploadparts
                        });
                    } else {
                        me.progress(1);
                    }
                } else {
                    throw new Error(`upload_slice_data error:${rest.message}`);
                }
            });
        });
    }
    sliceFinish({ filename, file, url, session }) {
        let me = this;
        let {
            getWosSign
        } = me._options;
        return getWosSign(filename).then((token) => {
            return me.post(url, token, {
                op: 'upload_slice_finish',
                filesize: file.size,
                session
            }).then((rest) => {
                if (0 == rest.code) {
                    return rest;
                } else {
                    throw new Error(`upload_slice_finish error:${rest.message}`);
                }
            });
        });
    }
    sliceInit({ filename, file, url, sliceSize, token, uploadparts }) {
        let me = this;
        return me.post(url, token, {
            op: 'upload_slice_init',
            filesize: file.size,
            slice_size: sliceSize
        }).then((rest) => {
            if (0 == rest.code) {
                let session = rest.data.session;
                return me.sliceUpload({
                    filename,
                    file,
                    url,
                    offset: 0,
                    session,
                    sliceSize: parseInt(rest.data.slice_size),
                    uploadparts
                }).then((res) => {
                    // defer.resolve(e)
                    return {
                        res,
                        session
                    };
                });
            } else {
                throw new Error(`upload_slice_init error:${rest.message}`);
            }
        });
    }
    sliceUploadFile(file) {
        let me = this;
        let {
            // appid,// APPID 必填参数
            // bucket,//bucketName 必填参数
            // wosurl,//wos的url 必填参数
            sliceSize,
            getWosSign,
            getFileName
        } = me._options;

        // let {
        //     name, size, type
        // } = file;
        sliceSize = me.getSliceSize(sliceSize);
        let filename = getFileName(file.name);

        return getWosSign(filename).then((token) => {

            let url = me.getCgiUrl(filename);
            return me.getSliceSHA1({
                file,
                sliceSize
            }).then((uploadparts) => {

                return me.sliceInit({
                    filename,
                    file,
                    url,
                    sliceSize,
                    token,
                    uploadparts
                }).then(({ session }) => {
                    return me.sliceFinish({
                        filename, file, url, session
                    }).then((res) => {

                        me.progress('finish');
                        me.success(res);
                    });
                });
            });
        });
    }
    on(event, callback) {
        let me = this;
        if (!me.events[event]) {
            me.events[event] = [];
        }
        me.events[event].push(callback);
    }
    trigger(event, result) {
        let me = this;
        let calls = me.events[event];
        if (!calls || calls.length == 0) {
            return;
        }
        calls.map((cb) => {
            cb.call(null, result);
        });
    }
    success(result) {
        this.trigger('success', result);
    }
    error(result) {
        this.trigger('error', result);
    }
    progress(result) {
        this.trigger('progress', result);
    }
    onSuccess(callback) {
        this.on('success', callback);
    }
    onError(callback) {
        this.on('error', callback);
    }
    onProgress(callback) {
        this.on('progress', callback);
    }

}

export default Uploader;
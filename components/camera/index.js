import React, { Component } from 'react';
import { message } from 'antd';
import camera2 from './img/camera3.png';

class Camera extends Component {
    state = {
        isTake: false
    }
    take = (cb) => {
        let me = this;
        let {
            photoWidth
        } = me.props;
        let video = me.video;
        let canvas = me.canvas;
        let ctx = canvas.getContext('2d');
        let width = photoWidth || video.offsetWidth, height = video.offsetHeight;
        if (video.offsetWidth > 0) height = video.offsetHeight / (video.offsetWidth / width);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);
        // var a=new HTMLCanvasElement();
        let base64 = canvas.toDataURL('image/png');
        canvas.toBlob((blob) => {
            cb & cb(base64, blob);
        });
    }
    stopMedia() {
        let me = this;
        if (me.videoTrack) {
            me.videoTrack.stop && me.videoTrack.stop();
        }
    }
    setMideaSource(video, stream) {
        let me = this;
        if (video.srcObject !== undefined) {
            video.srcObject = stream;
        }
        else {
            video.src = window.URL && window.URL.createObjectURL(stream) || stream;
        }
        video.onloadedmetadata = function () {
            let videoTracks = stream.getVideoTracks();
            if (videoTracks.length > 0) {
                me.videoTrack = videoTracks[0];
            }
            video.play();
        };
    }
    videoTrack = null
    startByDeviceService(cb) {
        let me = this;
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then((stream) => {
            let video = me.video;
            me.setMideaSource(video, stream);
            cb && cb();
        }).catch((e) => {
            console.log('开启摄像头失败!', e.message);
            if (e.name.toLowerCase() == 'notallowederror') {
                message.error(`开启摄像头失败:${e.message},请开启摄像头权限。`);
            } else {
                message.error(`开启摄像头失败:${e.message}`);
            }
            cb && cb(e);
        });
    }
    startMedia(cb) {
        let me = this;
        if (navigator.mediaDevices) {
            return void me.startByDeviceService(cb);
        }
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        getUserMedia.call(navigator, {
            video: true,
            audio: false
        }, (stream) => {
            let video = me.video;
            me.setMideaSource(video, stream);
            cb && cb();
        }, (e) => {
            console.log('开启摄像头失败!', e);
            if (e.name.toLowerCase() == 'notallowederror') {
                message.error(`开启摄像头失败:${e.message},请开启摄像头权限。`);
            } else {
                message.error(`开启摄像头失败:${e.message}`);
            }
            cb && cb(e);
        });
    }
    start = (cb) => {
        let me = this;
        me.startMedia(cb);
    }
    stop = () => {
        let me = this;
        me.stopMedia();
    }
    screenshot() {
        let me = this;
        return new Promise((resolve) => {
            me.take((base64, blob) => {
                resolve({ base64, blob });
            });
        });
    }
    render() {
        let me = this;
        let {
            poster = camera2,
            videoWidth,
            videoHeight,
        } = me.props;
        let styl = {};
        if (!isNaN(videoWidth)) {
            styl['width'] = videoWidth;
        } else if (videoHeight) {
            styl['height'] = videoHeight;
        }
        return (
            <div className="camera">
                <video ref={(p) => me.video = p} id="video"
                    poster={poster}
                    style={styl} >
                </video>
                <canvas ref={(p) => me.canvas = p} id="canvasCemara" style={{ display: 'none' }}></canvas>
            </div>
        );
    }
}

export default Camera;
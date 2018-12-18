import React, { Component } from 'react';
import EvalIcon from '../eval-icon';

import './index.less';

class Timer extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = this.initState(props);
        this.running = false;
    }
    static defaultProps = {
        name: '',
        seconds: 0,
        visible: false,
        start: false,
        onStop: () => { }
    }
    componentWillReceiveProps(props) {
        let me = this;
        if (props.start) {
            if (me.running) {
                return;
            }
            me.setState(me.initState(props), () => {
                me.start();
            });
        } else {
            me.stop();
        }
    }
    initState(props) {
        let seconds = props.seconds;
        return {
            time: this.convertSeconds(seconds),
            seconds
        };
    }
    loop(cb) {
        let me = this;

        if (!me.running) return;

        let timer = setTimeout(() => {
            clearTimeout(timer);
            cb && cb();
            me.loop(cb);
        }, 1000);
    }
    start() {
        let me = this;
        if (me.running) {
            return;
        } else {
            me.running = true;
        }
        me.loop(() => {
            me.down();
        });

    }
    stop() {
        this.running = false;
        this.setState({

        });
    }
    down() {
        let me = this;
        me.setState((state) => {
            if (state.seconds > 0) {
                let seconds = state.seconds - 1;
                let time = me.convertSeconds(seconds);
                state.seconds = seconds;
                state.time = time;
                return state;
            } else {
                me.stop();
                me.props.onStop();
            }
        });
    }
    convertSeconds(seconds) {
        let minutes = parseInt(seconds / 60);
        let hour = parseInt(minutes / 60);
        let sec = parseInt(seconds % 60);
        let min = parseInt(minutes % 60);
        hour = hour < 10 ? `0${hour}` : hour;
        min = min < 10 ? `0${min}` : min;
        sec = sec < 10 ? `0${sec}` : sec;
        return `${hour}.${min}.${sec}`;
    }
    render() {
        let me = this;
        let { time } = me.state;

        let { name, visible } = me.props;

        if (!visible) {
            return null;
        }

        return (
            <div className="exam-timer">
                <EvalIcon type="clock" />
                <div className="exam-timer__title">
                    <div className="exam-timer__name">
                        {name}
                    </div>
                    <div className="exam-timer__time">
                        {time}
                    </div>
                </div>
            </div>
        );
    }
}

export default Timer;
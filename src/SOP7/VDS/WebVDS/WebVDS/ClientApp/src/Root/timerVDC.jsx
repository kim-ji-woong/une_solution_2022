import React, { Component } from 'react';
import newStyles from '../Common/css/newStyle.module.css';

class TimerVDC extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datetime: ""
        }

        this.addHours = 0;
        this.nationCode = this.getNationCode();
    }

    componentDidMount() {
        this.checkTime();
    }

    componentDidUpdate() {
        this.checkTime();
    }

    getNationCode() {
        const nation = this.props.dataCenter?.nation;

        if (nation) {
            this.addHours = this.props.dataCenter.utc;
            return nation.tag2;
        }

        return "";
    }

    checkTime() {
        const _date = new Date();
        const current = new Date(_date.getUTCFullYear(), _date.getUTCMonth(), _date.getUTCDate(), _date.getUTCHours(), _date.getUTCMinutes(), _date.getUTCSeconds());

        const addHours = parseInt(this.addHours);
        const addMinutes = parseInt((this.addHours - addHours) * 60 + 0.1);
        let addDays = 0;

        if ((addHours === 12 && addMinutes > 0) || addHours > 12) {
            // 12시간을 초과할 경우 하루를 늦춰준다.
            addDays = -1;
        }

        const addTimes = addDays * 24 * 3600 * 1000 + addHours * 3600 * 1000 + addMinutes * 60 * 1000;
        current.setTime(current.getTime() + addTimes);

        const date = current.getFullYear() + "." + this.getDoubleString(current.getMonth() + 1) + "." + this.getDoubleString(current.getDate());
        const time = " " + this.getDoubleString(current.getHours()) + " : " + this.getDoubleString(current.getMinutes());
        const datetime = date + time;

        const prev = this.state.datetime;

        if (prev !== datetime) {
            this.setState({ datetime });
        }
        else {
            setTimeout(() => this.checkTime(), 1000);
        }
    }

    getDoubleString(data) {
        if (data < 10) {
            data = "0" + data;
        }
        else {
            data = data.toString();
        }

        return data;
    }

    render() {
        return (
            <div className={newStyles.timeAreaVDC} style={{ position: 'absolute', left: '140px', top: '0px' }}>
                <div className={newStyles.timeTitleBoxVDC}>
                    <span className={newStyles.langTextTitleVDC}>VDC 현지 시간</span>
                    <span className={newStyles.langTextVDC}>{this.nationCode}</span>
                </div>
                <div className={newStyles.timeBoxVDC}>
                    <div className={newStyles.timeText1VDC}>{this.state.datetime}</div>
                </div>
            </div>
        );
    }
}

export default TimerVDC;
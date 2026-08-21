import React, { Component } from 'react';
import newStyles from '../Common/css/newStyle.module.css';

class TimerLocal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            datetime: ""
        }

        this.setNationCode();
    }

    componentDidMount() {
        this.checkTime();
    }

    componentDidUpdate() {
        this.checkTime();
    }

    setNationCode() {
        const lang = navigator.language;

        if (lang) {
            const index = lang.indexOf('-');

            if (index > 0) {
                this.nationCode = lang.substring(index + 1).trim().toUpperCase();
            }
            else {
                this.nationCode = lang.toUpperCase();

                if (this.nationCode === "KO") {
                    this.nationCode = "KR";
                }
                else if (this.nationCode.startsWith("ZH")) {
                    this.nationCode = "CN";
                }
                else if (this.nationCode === "VI") {
                    this.nationCode = "VN";
                }
                else if (this.nationCode === "EN") {
                    this.nationCode = "US";
                }
            }
        }
    }

    checkTime() {
        if (!this.nationCode) {
            this.setNationCode();
        }

        const current = new Date();

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
            <div className={newStyles.timeArea}>
                <div className={newStyles.timeTitleBox}>
                    <span className={newStyles.langTextTitle}>접속 현지 시간</span>
                    <span className={newStyles.langText}>{this.nationCode}</span>
                </div>
                <div className={newStyles.timeBox}>
                    <div className={newStyles.timeText1}>{this.state.datetime}</div>
                </div>
            </div>
        );
    }
}

export default TimerLocal;
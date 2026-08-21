import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';


class ChangeInfo extends Component {
    getWord(data) {
        if (!data) {
            return "";
        }

        if (data.length > 20) {
            return data.substring(0, 20) + "...";
        }

        return data;
    }

    getChangeDatas() {
        const elements = [];
        const changeDatas = [...this.props.changeDatas];

        const now = new Date();

        for (const changeData of changeDatas) {
            if (this.checkOneMonth(now, changeData.basicData.regTime) === false) {
                continue;
            }

            let data = this.getWord(changeData.basicData.title);
            const index = changeData.basicData.regTime.indexOf('T');

            if (index < 0) {
                continue;
            }

            const date = changeData.basicData.regTime.substring(0, index);
            data = date + " / " + data;

            elements.push(
                <span>{data}</span>
            );
        }

        if (elements.length === 0) {
            elements.push(
                <span>최근 1개월 내용 없음</span>
            );
        }

        return elements;
    }

    checkOneMonth(now, strDate) {
        const index = strDate.indexOf('T');

        if (index > 0) {
            strDate = strDate.substring(0, index).trim();
        }

        const year1 = now.getFullYear();
        const month1 = now.getMonth() + 1;
        const day1 = now.getDate();

        const year2 = parseInt(strDate.substring(0, 4));
        const month2 = parseInt(strDate.substring(5, 7));
        const day2 = parseInt(strDate.substring(8, 10));

        if (year2 === year1) {
            if (month2 === month1) {
                return true;
            }
            else if (month2 + 1 === month1) {
                if (day2 >= day1) {
                    return true;
                }
            }
        }
        else if (year2 + 1 === year1) {
            if (month1 === 11 && month2 === 0) {
                if (day2 >= day1) {
                    return true;
                }
            }
        }

        return false;
    }

    getFaultDatas() {
        const elements = [];
        const faultDatas = [...this.props.faultDatas];

        const now = new Date();

        for (const faultData of faultDatas) {
            if (this.checkOneMonth(now, faultData.basicData.eventTime) === false) {
                continue;
            }

            let data = this.getWord(faultData.basicData.title);
            const index = faultData.basicData.eventTime.indexOf('T');

            if (index < 0) {
                continue;
            }

            const date = faultData.basicData.eventTime.substring(0, index);
            data = date + " / " + data;

            elements.push(
                <span>{data}</span>
            );
        }

        if (elements.length === 0) {
            elements.push(
                <span>최근 1개월 내용 없음</span>
            );
        }

        return elements;
    }

    render() {
        return (
            <>
                <div className={dash.changeInfo}>
                    <span className={dash.changeInfoTitle}>변경/장애 요약정보</span>
                    <div className={dash.changeBox}>
                        <span className={dash.changeTitle}>변경</span>
                        {
                            this.getChangeDatas()
                        }
                    </div>
                    <div className={dash.errorBox}>
                        <span className={dash.errorTitle}>장애</span>
                        {
                            this.getFaultDatas()
                        }
                    </div>
                </div>
            </>
        )
    }

}
export default ChangeInfo;
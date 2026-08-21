import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import content from '../../../Common/css/content.module.css';
import SDMSResource from '../../resource/id';
import uis from '../../../Common/css/ui.module.css';

import { AtmosphereCityPopupComponent } from './../../sdmsStyled';


class AtmosphereCityPopup extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            airDatas: this.props.airDatas,
            airNodes: this.props.airNodes,
        }

        this.logDate = null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.airDatas !== this.props.airDatas) {
            this.setState({ airDatas: this.props.airDatas });
        }

        if (this.state.airNodes !== this.props.airNodes) {
            this.setState({ airNodes: this.props.airNodes });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName(content.atmosphereCityPopup)[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.atmosphereCityPopup;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }


    onClickCloseIcon = (type) => {
        this.props.onClickCloseDataPop(type);
    }

    getElements = () => {

        let elements = [];

        let airNodes = null;
        let airDatas = null;

        if (this.state.airNodes) {
            airNodes = this.state.airNodes;
        }

        if (this.state.airDatas) {
            airDatas = this.state.airDatas
        }

        if (!this.state.airNodes && !this.state.airDatas)
            return;

        for (let i = 0; i < airDatas.length; i++) {

            let airData = airDatas[i];

            let airNodeAddr = null;
            for (let j = 0; j < airNodes.length; j++) {
                if (airNodes[j].id === airData.id) {
                    airNodeAddr = (airNodes[j].addr).replace("전남 여수시 " , "");
                    break;
                }
            }

            let element = <tr className={'itemBoxTdLine'} key={airNodeAddr}>
                <td className={'itemBoxTd1'}>{airNodeAddr ? airNodeAddr : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.sO2 ? airData.sO2 : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.nO2 ? airData.nO2 : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.o3 ? airData.sO2 : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.co ? airData.co : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM10 ? airData.pM10 : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM25 ? airData.pM25 : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM10Daily ? airData.pM10Daily : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM25Daily ? airData.pM25Daily : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.khai ? airData.khai : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.sO2Grade ? airData.sO2Grade : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.nO2Grade ? airData.nO2Grade : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.o3Grade ? airData.o3Grade : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.coGrade ? airData.coGrade : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM10Grade ? airData.pM10Grade : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pm25Grade ? airData.pm25Grade : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM10Grade1h ? airData.pM10Grade1h : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM25Grade1h ? airData.pM25Grade1h : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.khaiGrade ? airData.khaiGrade : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.sO2Flag ? airData.sO2Flag : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.nO2Flag ? airData.nO2Flag : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.o3Flag ? airData.o3Flag : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.coFlag ? airData.coFlag : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM10Flag ? airData.pM10Flag : 'NULL'}</td>
                <td className={'itemBoxTd1'}>{airData.pM25Flag ? airData.pM25Flag : 'NULL'}</td>
            </tr>

            elements.push(element);
        }

        return elements;
    }

    getDateTime = () => {
        let dateTime = new Date();

        let year = dateTime.getFullYear();
        let month = dateTime.getMonth();
        let day = dateTime.getDate();
        let hour = dateTime.getHours();
        let minute = dateTime.getMinutes();

        let result = year + "-" + month + "-" + day + " " + hour + ":" + minute;

        return result;
    }

    getDateTimeOnNode = () => {

        // 측정 데이타 Null시 현재 시간 호출
        if (!this.state.airDatas) {
            return this.getDateTime();
        }

        const airDatas = this.state.airDatas;

        let node1 = airDatas[0];

        let logDate = node1.logDate;

        let year = logDate.substring(0, 4);
        let month = logDate.substring(4, 6);
        let day = logDate.substring(6, 8);
        let hours = logDate.substring(8, 10);
        let minutes = logDate.substring(10, 12);

        let result = year + "-" + month + "-" + day + " " + hours + ":" + minutes + " ";

        return result;
    }

    render() {

        const elements = this.getElements();
        //const dt = this.getDateTime(); // 현재시간 기준
        const dt = this.getDateTimeOnNode(); // 측정소 코드 10001기준
        return (
            <>
                 <div id={uis.ITpropertyPop}>
                    <div>
                    <div>
                        <AtmosphereCityPopupComponent id={this.props.popupType} className={content.atmosphereCityPopup + " " + SDMSResource.UISection}>
                            {/* <PopupDraggable*/}
                            {/*    id={this.props.popupType}*/}
                            {/*    popupMinWidth={373}*/}
                            {/*    popupMinHeight={427}*/}
                            {/*    topSize={35}*/}
                            {/*    popupState={this.props.popupState}*/}
                            {/*    setActiveDragPopup={this.props.setActiveDragPopup}*/}
                            {/*    setPopupState={this.props.setPopupState}*/}
                            {/*> */}

                            {/* <PopupDraggable
                                    id={this.props.popupType}
                                    popupMinWidth={373}
                                    popupMinHeight={427}
                                    topSize={35}
                                    popupState={this.props.popupState}
                                    setActiveDragPopup={this.props.setActiveDragPopup}
                                    setPopupState={this.props.setPopupState}
                                > */}

                            <div className={'atmosphereCityPopupTop'} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className={'sensorInfoDetailTitleA'}>
                                  <span className={'sensorCityTitle'}>도시대기측정망</span>
                                </div>
                                <div className={'sensorInfoTitleSecondA'}>
                                  <span className={'sensorCityTime'}>{dt}기준</span>
                                  <span className={'cityCloseIcon'} onClick={() => this.onClickCloseIcon(0)}></span>
                                </div>
                            </div>

                            <div className={'atmosphereCityTable'}>
                              <table /* style={{ minWidth: '120%' }} */>
                                <thead>
                                      <tr className={'itemBoxTrLine'} style={{ borderBottom: 'solid 1px #808080' }}>
                                        <th className={'itemBoxTh'} style={{ width: '90px' }}>측정소 이름</th>
                                        <th className={'itemBoxTh'} style={{ width: '30px' }}>아황산가스</th>
                                        <th className={'itemBoxTh'} style={{ width: '30px' }}>이산화질소</th>
                                        <th className={'itemBoxTh'} style={{ width: '30px' }}>오존</th>
                                        <th className={'itemBoxTh'} style={{ width: '30px' }}>일산화탄소</th>
                                        <th className={'itemBoxTh'} style={{ width: '40px' }}>미세먼지(PM10)</th>
                                        <th className={'itemBoxTh'} style={{ width: '40px' }}>초미세먼지(PM25)</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>미세먼지(PM10) 24시간 예측이동농도</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>초미세먼지(PM25) 24시간 예측이동농도</th>
                                        <th className={'itemBoxTh'} style={{ width: '40px' }}>통합대기환경수치</th>
                                        <th className={'itemBoxTh'} style={{ width: '40px' }}>아황산가스 지수</th>
                                        <th className={'itemBoxTh'} style={{ width: '40px' }}>이산화질소 지수</th>
                                        <th className={'itemBoxTh'} style={{ width: '40px' }}>오존 지수</th>
                                        <th className={'itemBoxTh'} style={{ width: '40px' }}>일산화탄소 지수</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>미세먼지(PM10) 24시간 등급자료</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>초미세먼지(PM25) 24시간 등급자료</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>미세먼지(PM10) 1시간 등급자료</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>초미세먼지(PM25) 1시간 등급자료</th>
                                        <th className={'itemBoxTh'} style={{ width: '60px' }}>통합대기환경지수</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>아황산가스 측정자료 상태정보</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>이산화질소 측정자료 상태정보</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>오존 측정자료 상태정보</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>일산화탄소 측정자료 상태정보</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>미세먼지(PM10) 측정자료 상태정보</th>
                                        <th className={'itemBoxTh'} style={{ width: '70px' }}>초미세먼지(PM25) 측정자료 상태정보</th>
                                   </tr>
                                </thead>
                                <tbody>
                                  {elements}
                                </tbody>
                              </table>
                            </div>
                          {/* </PopupDraggable> */}
                        </AtmosphereCityPopupComponent>
                    </div>
                    </div>
                </div> 
           </>
        )
    }
}

export default AtmosphereCityPopup;
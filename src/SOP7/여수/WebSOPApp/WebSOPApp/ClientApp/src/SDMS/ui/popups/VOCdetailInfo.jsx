import React, { Component, useState } from 'react';
import './../../css/popup.css';

import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';

import { VOCDetailInfoPopupComponent, WeatherMiniPopVOCComponent } from './../../sdmsStyled';
import WeatherMiniPop from "./weatherMiniPop";
import SdmsResource from '../../resource/id';
import StatusInfo from './statusInfo';
import el from 'date-fns/esm/locale/el/index';

class VOCDetailInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,

            searchText: "",

            selectedSensor: null,

            currentName: null,
            currentAddress: null,
        }

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    componentDidMount() {
        const selectedSensor = this.props.selectedSensor;

        this.setCurrentSensor(selectedSensor);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.selectedSensor !== prevProps.selectedSensor) {
            this.setCurrentSensor(this.props.selectedSensor);
        }
    }

    
    repositionPopup(popupState) {
        let data = popupState.vocDetailInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardMiniMap)[0];
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


    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        let sizeY = 0;

        switch (this.state.resizeType) {
            // 수직
            case 'v-b': // 바텀 수직
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    //그리드 사이즈를 부모(팝업) 사이즈 비율대로 조절
                    const grid = this.findElementByClassName(content.vocDetailInfo);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'v-t': //탑 수직
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.vocDetailInfo);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.vocDetailInfo);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.vocDetailInfo);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.vocDetailInfo);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lt': //왼쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.vocDetailInfo);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            default:
        }

    }

    popupResizeMousePress = (event, resizeType) => {
        const popup = document.getElementById(this.props.popupType);

        this.setState({
            maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
            maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
            resizeType: resizeType,
            originalMouseX: event.pageX,
            originalMouseY: event.pageY,
            originalWidth: document.getElementById(this.props.popupType).clientWidth,
            originalHeight: document.getElementById(this.props.popupType).clientHeight,
            originalX: document.getElementById(this.props.popupType).getBoundingClientRect().left,
            originalY: document.getElementById(this.props.popupType).getBoundingClientRect().top,
        });
    }

    popupResizeMouseUp = () => {
        this.setState({ resizeType: null });
    }

    showModal = e => {
        this.setState({
            show: !this.state.show
        });
    };

    setCurrentSensor = (selectedSensor) => {

        if (selectedSensor === null || selectedSensor === undefined)
            return;

        if (selectedSensor.sensorType !== StatusInfo.VocType)
            return;

        const curSensor = selectedSensor.sensor;

        this.setState({ selectedSensor: curSensor, currentName: curSensor.position, currentAddress: curSensor.address });

    }

    getDt = () => {
        const currentTimeStamp = new Date();

        const hours = currentTimeStamp.getHours().toString().padStart(2, '0');
        const minutes = currentTimeStamp.getMinutes().toString().padStart(2, '0');
        const seconds = currentTimeStamp.getSeconds().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}:${seconds}`;

        return formattedTime;
    }

    // 날씨 관련 값
    getWeatherProps = (sensors) => {
        let temp = null;
        let humi = null;
        let windDir = null;
        let strWindDir = "";
        let windSpeed = null;

        for (let i = 0; i < sensors.length; i++) {
            let sensor = sensors[i];

            let material = sensor.sensorType;

            if (material === SdmsResource.materialType.Temp) {
                temp = sensor.value;
            }

            if (material === SdmsResource.materialType.Humi) {
                humi = sensor.value;
            }

            if (material === SdmsResource.materialType.Wind_Dir) {
                windDir = sensor.value;
            }

            if (material === SdmsResource.materialType.Wind_Speed) {
                windSpeed = sensor.value;
            }
        }

        if (!temp) {
            temp = "NULL";
        }

        if (!humi) {
            humi = "NULL";
        }

        if (!windSpeed) {
            windSpeed = "NULL";
        }

        if (windDir === null) {
            strWindDir = "NULL";
        } else {
            strWindDir = this.getWindString(windDir);
        }

        return [temp, humi, strWindDir, windSpeed];
    }
    getWindString = (degrees) => {
        const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
        const index = Math.round((degrees % 360) / 45) % 8;
        return directions[index];
    }

    // 날씨 미니 팝업 위치 변환
    getWeatherInfo = () => {
        if (this.state.selectedSensor === null || this.state.selectedSensor === undefined)
            return;

        const sensors = this.state.selectedSensor.sensors;

        const [temp, humi, strWindDir, windSpeed] = this.getWeatherProps(sensors);

        let [left, isReverse] = this.getRectLeftPosition();;

        const weatherMiniPop =
            <>
                <WeatherMiniPopVOCComponent style={{ position: 'relative', top: '-580px', left: left, display: 'block' }}>
                    {isReverse ?
                        <span className={'weatherTri'} style={{ position: 'absolute', top: '28px', left: '206px', transform: 'scaleX(-1)' }}></span> :
                        <span className={'weatherTri'} style={{ position: 'absolute', top: '28px', left: '-36px' }}></span>
                    }
                    {/*<WeatherTri style={{ position: 'absolute', top: '28px', left: '-36px' }}></WeatherTri>*/}
                    <div className={'weatherInfoPop'}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                            <div className={'weatherMiniBox'}>
                                <p>풍향</p>
                                <span>{strWindDir}</span>
                            </div>
                            <div className={'weatherMiniBox'}>
                                <p>풍속</p>
                                <span>{windSpeed}m/s</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className={'weatherMiniBox'}>
                                <p>온도</p>
                                <span>{temp}℃</span>
                            </div>
                            <div className={'weatherMiniBox'}>
                                <p>습도</p>
                                <span>{humi} %</span>
                            </div>
                        </div>
                    </div>
                </WeatherMiniPopVOCComponent>
            </>

        return weatherMiniPop;

    }
    getRectLeftPosition = () => {
        const popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined) {
            return 0;
        }

        const parent = popup.parentElement;

        let left = 417 + 30; // 20은 화살표 때문에 더해줌

        if (parent) {
            if (this.state.show) {
                const miniPopWidth = 170;

                const rectParent = parent.getBoundingClientRect();
                const rect = popup.getBoundingClientRect();

                if (rect.right + miniPopWidth <= rectParent.width) {
                    left += 'px';
                    return [left, false];
                } else {
                    left = '-200px';
                    return [left, true];
                }
            }
        }
        return 0;
    }

    // 센서 값 표출하는 테이블 만듦
    getMaterialDatas = () => {

        if (this.state.selectedSensor === null || this.state.selectedSensor === undefined) {
            let nullElement = 
                <tr className={'contentTrLine'} key="SensorData Null">
                    <td>NULL</td>
                    <td>Sensor's Null</td>
                    <td>0</td>
                    <td>NULL</td>
                </tr>

            return nullElement;
        }

        let elements = [];

        const selectedSensor = this.state.selectedSensor;
        const sensors = selectedSensor.sensors;

        const materialLinks = this.props.materialLinks;
        const materials = this.props.materials ? this.props.materials[0] : [];

        if (materialLinks === null || materialLinks === undefined) {
            let nullElement =
                <tr className={'contentTrLine'} key="MaterialLinks Null">
                    <td>NULL</td>
                    <td>Threthold's Null</td>
                    <td>0</td>
                    <td>NULL</td>
                </tr>
            return nullElement;
        }

        if (materials.length === 0 || materials === null || materials === undefined) {
            let nullElement =
                <tr className={'contentTrLine'} key="Material Null">
                    <td>NULL</td>
                    <td>Material's Null</td>
                    <td>0</td>
                    <td>NULL</td>
                </tr>
            return nullElement;
        }

        let searchText = '';
        if (this.state.searchText !== '') {
            searchText = this.state.searchText;
        }

        for (let i = 0; i < sensors.length; i++) {

            const sensor = sensors[i];

            const sensorType = sensor.sensorType;

            let curMaterial = null;
            let curMaterialLink = null;

            if (sensorType === SdmsResource.materialType.Temp ||
                sensorType === SdmsResource.materialType.Humi ||
                sensorType === SdmsResource.materialType.Wind_Dir ||
                sensorType === SdmsResource.materialType.Wind_Speed)
                continue;

            for (let k = 0; k < materials.length; k++) {
                const material = materials[k];

                if (sensor.sensorType === material.id) {
                    curMaterial = material;
                }
            }

            for (let m = 0; m < materialLinks.length; m++) {
                const materialLink = materialLinks[m];

                if (sensor.sensorType === materialLink.materialID) {
                    curMaterialLink = materialLink;
                }
            }

            if (!this.caseInsensitiveSearch(searchText, curMaterial.materialName)) {
                continue;
            }

            let value = parseFloat(sensor.value).toFixed(2);
            if (isNaN(value)) {
                value = 'NULL';
            }

            const strThrethold = this.getThresholdString(value, curMaterialLink);

            const element =
                <tr className={'contentTrLine'} key={i + 1}>
                    <td>{i + 1}</td>
                    <td>{curMaterial.materialName}</td>
                    <td>{value}</td>
                    <td>{strThrethold}</td>
                </tr>

            elements.push(element);
        }

        return elements;
    }

    // 검색기능 소문자 대문자 무시
    caseInsensitiveSearch = (standardText, targetText) => {
        const lowerStandard = standardText.toString().toLowerCase();
        const lowerTarget = targetText.toString().toLowerCase();

        return lowerTarget.includes(lowerStandard);
    }

    // 위험도 판단
    getThresholdString = (value, materialLink) => {

        let strThreshold = '좋음'; // 1좋음, 2보통, 3주의, 4경고

        const min1 = materialLink.min1;
        const max1 = materialLink.max1;
        const min2 = materialLink.min2;
        const max2 = materialLink.max2;

        const direction = materialLink.direction; // 정방향, 역방향 여부

        if (direction === 1) {
            if (parseFloat(value) > max2) {
                return '심각';
            }

            if (parseFloat(value) > min2) {
                return '경계';
            }

            if (parseFloat(value) > max1) {
                return '주의';
            }
        } else if (direction === 0) {
            if (parseFloat(value) < min1) {
                return '심각';
            }

            if (parseFloat(value) < max1) {
                return '경계';
            }

            if (parseFloat(value) < min2) {
                return '주의';
            }
        }


        return strThreshold;
    }

    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value });
    }

    render() {

        const dt = this.getDt();

        return (   
            <>
                <VOCDetailInfoPopupComponent id={this.props.popupType} className={content.vocDetailInfo + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={417} /* 430 */
                        popupMinHeight={630}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                {/* <div className={'sensorInfoDetailBox'}> */}
                        <div className={'sensorInfoTitleBoxV'}>
                            <div className={'sensorInfoDetailTitleV'}>
                              <span className={'sensorTitleIcon'}></span>
                              <span className={'sensorDetailTitleVOC'}>센서 상세정보</span>
                            </div>
                            <div className={'sensorInfoTitleSecondV'}>
                              <span className={'measurementTime'}>{dt} 기준</span>
                              <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.vocDetailInfo, false)}></span>
                            </div>
                        </div>

                        <div className={'contentPaddingBoxVOC'}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', paddingTop: '20px' }}>
                                <span className={'triangleShape'}></span><span style={{ marginLeft: '10px', flex: '1 1', color: '#fff' }}>VOC</span>
                                <div className={'weatherInfoVOCBtn'}
                                    onMouseEnter={e => { this.showModal(e); }}
                                    onMouseLeave={e => { this.showModal(e); }}
                                  /* className={'weatherInfoBtn'} */>기상정보
                                </div>
                            </div>
                            <div className={'VOCLocation'}><span>{this.state.currentName} </span><span>[{this.state.currentAddress}]</span></div> 
                            <div className={'sensorSearchBoxVOC'}>
                                <span className={'searchIcon'}></span>
                                <input type="text" placeholder="검색어를 입력해주세요" /* onKeyPress={(event) => this.searchEnterKey(event)} */ onChange={(e) => this.onChangeSearchText(e)} />
                            </div>

                            <div className={'VOCTable'}>
                                <table>
                                    <thead>
                                    <tr className={'titleTrLine'}>
                                        <th style={{ width: '40px' }}>No</th>
                                        <th style={{ width: '130px' }}>측정항목</th>
                                        <th style={{ width: '72px' }}>수치(ppm)</th>
                                        <th style={{ width: '54px' }}>위험도</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.getMaterialDatas()
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                {/* </div> */}
                            {
                                this.state.show &&
                                    /* <WeatherMiniPop /> */
                                    this.getWeatherInfo()
                            }
                        </PopupDraggable>
                </VOCDetailInfoPopupComponent>
                </>
            )
        }
}
export default VOCDetailInfo;
import React, { Component } from 'react';
import styles from '../../css/sdms2D.module.css';
import style from '../../../Common/css/ui.module.css';
import { EditMenusComponent } from "../../styled/editMenusStyled";
import { Contents3DComponent } from '../../styled/contents3DStyled';
import contentModule from '../../../Common/css/content.module.css';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { SDMSController } from '../../services/sdmsController';

import SDMSMainMenu from '../sdmsMainMenu';
import ProjectResource from "../../../Root/resource/id";
import SdmsResource from "../../resource/id";
import SDMS from '../sdms';

import Contents3D from "../3D/contents3D";

export class Contents2D extends Component {

    static moveToFloor = 15;
    static moveToMain = 16;

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            disabledPanning: true,

            visibleSensorType: this.props.visibleSensorTypes,
            poiList: [],
            selectedPOI: [],
            sensorList: this.props.sensorList,

            loading: true,
            
            isEditMode: false,
            editElement: null,
            
            curCCTVList: null,
            curEtcSensorList: null,
            curPsmSensorList: null,
            curFireSensorList: null,
            curLaserSensorList: null,
            curDoorSensorList: null,
            
            alarm: Contents3D.NO_ALARM,
        };

        this.imgPath = null;

        this.cctvImgs = null;
        this.etcImgs = null;
        this.psmImgs = null;
        this.fireImgs = null;
        this.laserImgs = null;
        this.doorImgs = null;

        this.scaleRef = React.createRef();
        
        this.refQuickButton = React.createRef();

        this.getZone();
        
    }

    componentDidMount() {
        const editModeManager = this.props.editModeManager;
    }
    
    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.command !== prevProps.command) {
            if (this.props.command.menu === SDMSMainMenu.Menu_MoveTo_Floor || this.props.command.menu === SDMSMainMenu.Menu_Show_Outdoor) {
                this.setState({ selectedPOI: [], loading: true }, () => this.getZone());
            }
            // POI 위치로 화면 이동
            else if (this.props.command.menu === SDMSMainMenu.Menu_MoveTo_POI) {
                this.setState({ selectedPOI: this.props.selectedPOI, loading: true }, () => this.getZone());
            }
        }

        if (this.props.sensorAlarms !== prevProps.sensorAlarms) {
            this.loadPOI();
        }
        
        if (this.props.selectedPOI !== prevProps.selectedPOI) {
            if (this.props.selectedPOI?.length === 3) {
                this.setState({selectedPOI: this.props.selectedPOI}, () => this.loadPOI());
            }
        }
        
        // Status Info POI 표시 여부 토글
        if (this.props.visibleSensorTypes !== prevProps.visibleSensorTypes) {

            const _visibleSensorType = this.props.visibleSensorTypes;

            this.setState({ visibleSensorType: _visibleSensorType }, () => { this.loadPOI(); });

        }
    }
    
    // 우클릭만 Panning, 배경 좌클릭시 POI 선택 해제
    isPanning = (event) => {

        if (event.button == 2) {
            this.setState({ disabledPanning: false });
        } else if (event.button == 1) {
            this.setState({ disabledPanning: true });
        } else if (event.button == 0) {
            this.props.onSelectPOI(null, false, null);
            this.setState({ disabledPanning: true, selectedPOI: [] }, () => { this.loadPOI(); });
        }

    }
    
    dragPOI = (event) => {
        if (!this.state.isEditMode) {
            return;
        }
        
        if (this.state.editElement === null || this.state.editElement === undefined) {
            return;
        }
        
        if (event.button == 0) {

            const editElement = this.state.editElement;

            let element = document.getElementById(editElement.sensorType + "_" + editElement.sensorID);
            
            const preMousePosition = { x: event.clientX, y: event.clientY };

            document.addEventListener('mousemove', () => this.onMouseMove(event, element, preMousePosition));
            document.addEventListener('mouseup', this.onMouseUp);

        }
        
    }
    
    // Poi drag move
    onMouseMove = (event, element, preMousePosition) => {
        let mousePosition = { x: event.clientX, y: event.clientY };
        
        const offsetLeft = element.offsetLeft;
        const offsetTop = element.offsetTop;
        
        const maxScreenHeight = document.getElementsByTagName('body')[0].clientHeight;
        const maxScreenWidth = document.getElementsByTagName('body')[0].clientWidth;
        
        let width = element.clientWidth;
        let left = element.offsetLeft;
        
        let height = element.clientHeight;
        let top = element.offsetTop;
        
        let moveX = mousePosition.x + offsetLeft;
        let preMoveX = ((moveX / maxScreenWidth) * 100);
        
        let moveY = mousePosition.y + offsetTop;
        let preMoveY = ((moveY / maxScreenHeight) * 100);
        
        let imgRightPos = width + left; // 현재 위치에서 오른쪽 끝 절대 좌표
        let imgBottomPos = height + top; // 현재 위치에서 아래쪽 끝 절대 좌표

        // 팝업이 화면밖으로 안나가도록 처리
        // if (moveX > 0 && moveX + width < maxScreenWidth) {
        //     element.style.left = preMoveX + '%';
        // } else if (moveX + width > maxScreenWidth) {
        //     // 드래그 도중 이동할 마우스 포지션 지점부터 팝업 끝지점이 우측 화면 밖을 벗어나게 될 때
        //     if (imgRightPos < maxScreenWidth) {
        //         // 팝업을 우측 변에 고정
        //         let lim = ((maxScreenWidth - width) / maxScreenWidth) * 100;
        //         element.style.left = lim + '%';
        //     } else if (preMousePosition.x > mousePosition.x) {
        //         // 화면 오른쪽으로 팝업이 이미 벗어나 있을 때
        //         element.style.left = preMoveX + '%';
        //     }
        // } else if (moveX <= 0) {
        //     // 드래그 도중 팝업 시작점이 좌측 화면 밖을 벗어나게 될 때
        //     if (left > 0) {
        //         element.style.left = '0%';
        //     } else if (preMousePosition.x < mousePosition.x) {
        //         // 화면 왼쪽으로 팝업이 이미 벗어나 있을 때
        //         this.state.popup.style.left = preMoveX + '%';
        //     }
        // }
        //
        // if (moveY > 60 && moveY + height < maxScreenHeight) {
        //     element.style.top = preMoveY + '%';
        // } else if (moveY + height > maxScreenHeight) {
        //     // 드래그 도중 이동할 마우스 포지션 지점부터 팝업 하단 끝지점이 화면 밖을 벗어나게 될 때
        //     if (imgBottomPos < maxScreenHeight) {
        //         // 팝업을 아랫 변에 고정
        //         let lim = ((maxScreenHeight - height) / maxScreenHeight) * 100;
        //         element.style.top = lim + '%';
        //     } else if (preMousePosition.y > mousePosition.y) {
        //         // 화면 아래쪽으로 팝업이 이미 벗어나 있을 때
        //         element.style.top = preMoveY + '%';
        //     }
        // } else if (moveY <= 60) {
        //     // 드래그 도중 상단 끝지점이 화면 밖을 벗어나게 될 때
        //     if (top > 60) {
        //         // 팝업을 윗 변에 고정
        //         //상단 툴바는 항상 높이 60 고정이기 때문에 현재 화면 사이즈에서 60px의 비율을 계산한다.
        //         let lim = (60 / maxScreenHeight) * 100;
        //         element.style.top = lim + '%';
        //     } else if (preMousePosition.y < mousePosition.y) {
        //         //화면 위쪽으로 팝업이 이미 벗어나 있을 때
        //         element.style.top = preMoveY + '%';
        //     }
        // }
        
        //element.style.top = (top + (mousePosition.y - preMousePosition.y)) + 'px';
        //element.style.left = (left + (mousePosition.x - preMousePosition.x)) + 'px';
        element.style.left = mousePosition.x + 'px';
        element.style.top = mousePosition.y + 'px';
    }

    onMouseMove2 = (event) => {
        if (!this.state.isEditMode || !this.state.selectedPOI || this.state.selectedPOI.length === 0)
            return;
        
        const selectedPOI = this.state.selectedPOI;
        if (!selectedPOI || selectedPOI.length < 3)
            return;

        const element = document.getElementById(selectedPOI[0] + "_" + selectedPOI[1]);
        if (!element)
            return;

        let mousePosition = { x: event.clientX, y: event.clientY };

        element.style.left = mousePosition.x + 'px';
        element.style.top = mousePosition.y + 'px';
    }
    
    // POI 드래그 종료
    onMouseUp = (event) => {
        document.removeEventListener('mousemove', () => this.onMouseMove());
        document.removeEventListener('mouseup', () => this.onMouseUp());
    }

    // Zone 이동
    getZone = async () => {

        let zoneID = 0;
        const curZoneID = this.props.currentView.zoneID;
        const zoneInfo = this.props.command;

        if (curZoneID == null) {
            zoneID = 1;
        }

        if (zoneInfo.menu === Contents2D.moveToMain) {

            // 메인페이지 이동
            zoneID = 1;

        } else if (zoneInfo.menu === Contents2D.moveToFloor && zoneInfo.zoneID !== 0) {

            // zoneID가 0이 아니면 Zone 이미지
            zoneID = zoneInfo.zoneID;

        } else if (zoneInfo.menu === SDMSMainMenu.Menu_MoveTo_POI) {
            // Move To POI 
            zoneID = zoneInfo.menuParameter[0];
        }

        this.imgPath = await this.getImage(zoneID);

        // Zone 이동시 Scale 초기화
        const resetScale = this.scaleRef.current;

        if (resetScale) {
            resetScale.resetTransform();
        }
        

        // 해당 Zone POI 생성
        this.setPOI(zoneID);

        this.props.setCurrentView(this.props.command.zoneID);

        this.setState({ loading: false });

    }

    async getImage (zoneID) {

        const result = await SDMSController.requestImageFilePath(zoneID);

        if (result.success) {
            return result.filePath;
        } else {
            return alert(result.message);
        }
    }

    // 현재 Zone Sensor List
    setPOI(zoneID) {
        
        const cctvList = this.state.sensorList.cctvs;
        const etcSensors = this.state.sensorList.etcSensors;
        const psmSensors = this.state.sensorList.psmSensors;
        const fireSensors = this.state.sensorList.fireSensors;
        const laserSensors = this.state.sensorList.laserSensors;
        const doorSensors = this.state.sensorList.doorSensors;
        
        let curCCTVList = null;
        let curEtcSensorList = null;
        let curPsmSensorList = null;
        let curFireSensorList = null;
        let curLaserSensorList = null;
        let curDoorSensorList = null;
        
        if (zoneID != null) {
            if (cctvList) { curCCTVList = cctvList.filter(cctv => cctv.zoneID == zoneID); }
            if (etcSensors) { curEtcSensorList = etcSensors.filter(etc => etc.zoneID == zoneID); }
            if (psmSensors) { curPsmSensorList = psmSensors.filter(psm => psm.zoneID == zoneID); }
            if (fireSensors) { curFireSensorList = fireSensors.filter(fire => fire.zoneID == zoneID); }
            if (laserSensors) { curLaserSensorList = laserSensors.filter(laser => laser.zoneID == zoneID); }
            if (doorSensors) { curDoorSensorList = doorSensors.filter(door => door.zoneID == zoneID); }
        }
        
        this.setState({ curCCTVList, curEtcSensorList, curPsmSensorList, curFireSensorList, curLaserSensorList, curDoorSensorList }, () => this.loadPOI());

    }
    
    makePOIString = (originText, targetString) => {
        // `./resource/image/icon/sites/${ProjectResource.SiteID}/laser.png`;에서 laser를 targetStirng으로 변경
        const index = originText.lastIndexOf('/');
        const str = originText.substring(0, index + 1);
        const ext = originText.substring(originText.lastIndexOf('.'));
        const type = originText.substring(index + 1, originText.lastIndexOf('.'));
        return str + type + targetString + ext;
    }
    
    getEnabled = (sensorType, id) => {
        const sensorList = this.state.sensorList;
        
        if (sensorType === 'cctv') {
            for (let i = 0; i < sensorList.cctvs.length; i++) {
                if (sensorList.cctvs[i].id === id) {
                    return sensorList.cctvs[i].enabled;
                }
            }
        }
        
        if (sensorType === 'laser') {
            for (let i = 0; i < sensorList.laserSensors.length; i++) {
                if (sensorList.laserSensors[i].id === id) {
                    return sensorList.laserSensors[i].enabled;
                }
            }
        }
        
        if (sensorType === 'door') {
            for (let i = 0; i < sensorList.doorSensors.length; i++) {
                if (sensorList.doorSensors[i].id === id) {
                    return sensorList.doorSensors[i].enabled;
                }
            }
        }
    }
    
    getPOIImageURL = (sensorType, id, materialType, isEnabled) => {
        let imgURL = null;
        
        const cctvImg = `./resource/image/icon/sites/${ProjectResource.SiteID}/cctv.png`;
        const laserImg = `./resource/image/icon/sites/${ProjectResource.SiteID}/laser.png`;
        const doorImg = `./resource/image/icon/sites/${ProjectResource.SiteID}/door.png`;

        const strSelected = "_selected";
        const strAlarmed = "_alarmed";
        const strOff = "_off";
        
        const enabled = this.getEnabled(sensorType, id);
        
        const selectedPOI = this.state.selectedPOI;
        
        // 기본 이미지로 초기화
        if (sensorType === 'cctv') {
            imgURL = cctvImg;
            if (enabled === false) {
                imgURL = this.makePOIString(imgURL, strOff);
                return imgURL;
            }
        }
        
        if (sensorType === 'laser') {
            imgURL = laserImg;
            if (enabled === false) {
                imgURL = this.makePOIString(imgURL, strOff);
                return imgURL;
            }
        }
        
        if (sensorType === 'door') {
            imgURL = doorImg;
            if (enabled === false) {
                imgURL = this.makePOIString(imgURL, strOff);
                return imgURL;
            }
        }
        
        const sensorAlarms = this.props.sensorAlarms;

        if (sensorType !== 'cctv') {

            // 알람인 센서인 경우 선택여부와 상관없이 알람 POI 표출
            for (let i = 0; i < sensorAlarms.length; i++) {
                const alarm = sensorAlarms[i];
                const orgSensorID = alarm.orgSensorID;
                if (orgSensorID === id && alarm.isAlarm) {
                    imgURL = this.makePOIString(imgURL, strAlarmed);
                    return imgURL;
                }
            }
            
        }
        
        // 선택된 POI가 존재 할 때
        if (this.state.selectedPOI !== null && this.state.selectedPOI !== undefined) {
            const selectedPOI = this.state.selectedPOI;
            // selectedPOI가 있을 경우 선택된 POI와 비교하여 _selected 붙여야 함
            if (selectedPOI !== null && selectedPOI !== undefined && selectedPOI[0] === sensorType && selectedPOI[1] === id) {
                imgURL = this.makePOIString(imgURL, strSelected);
            }
        }
        
        return imgURL;
    }

    loadPOI() {

        // POI 이미지 경로
        // 선택 : _selected , 경보 : _alarmed , 꺼짐 : _off        

        let _poiList = [];
        // Client X Y 기준
        let coordinateX = null;
        let coordinateY = null;
        
        let imgURL = null;
        
        if (this.state.curCCTVList && this.state.visibleSensorType.cctv)
        {
            const sensorType = 'cctv';
            let poiClassName = null;
            
            this.cctvImgs = this.state.curCCTVList.map(cctv => (
                coordinateX = (cctv.x),
                coordinateY = Math.abs(cctv.z),
                imgURL = this.getPOIImageURL(sensorType, cctv.id, null, cctv.enabled),
                poiClassName = styles.poiImgs,
                poiClassName = this.getPoiClassNameFromSensorInfo(sensorType, cctv.id, poiClassName),
                [<img src={imgURL} id={'cctv_' + cctv.id} key={'cctv_' + cctv.id} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} className={poiClassName} draggable onClick={this.onClickPOI.bind(this, cctv.id, sensorType, cctv.zoneID)} /* onMouseDown={(e) => this.dragPOI(e, cctv.id, sensorType)} */ />,
                <div className={poiClassName + '_img'} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} onClick={this.onClickPOI.bind(this, cctv.id, sensorType, cctv.zoneID)} />]
            ))
            _poiList.push(this.cctvImgs);
        }
        if (this.state.curEtcSensorList && this.state.visibleSensorType.etc)
        {
            const sensorType = 'etc';
            let poiClassName = null;

            this.etcImgs = this.state.curEtcSensorList.map(etc => (
                coordinateX = (etc.x),
                coordinateY = Math.abs(etc.z),
                poiClassName = styles.poiImgs,
                imgURL = this.getPOIImageURL(sensorType, etc.id, etc.materialType, etc.enabled),    
                [<img src={imgURL} id={'etc_' + etc.id} key={'etc_' + etc.id} style={{left: coordinateX + 'px', top: coordinateY + 'px'}} className={poiClassName} draggable onClick={this.onClickPOI.bind(this, etc.id, sensorType, etc.zoneID)} /* onMouseDown={(e) => this.dragPOI(e, etc.id, sensorType)} */ />,
                <div className={poiClassName + '_img'} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} onClick={this.onClickPOI.bind(this, etc.id, sensorType, etc.zoneID)} />]
            ))
            _poiList.push(this.etcImgs);
        }
        
        if (this.state.curLaserSensorList && this.state.visibleSensorType.laser) {
            const sensorType = 'laser';
            let poiClassName = null;
            
            this.laserImgs = this.state.curLaserSensorList.map(laser => (
                coordinateX = (laser.x),
                coordinateY = Math.abs(laser.z),
                imgURL = this.getPOIImageURL(sensorType, laser.id, null, laser.enabled),
                poiClassName = styles.poiImgs,
                poiClassName = this.getPoiClassNameFromSensorInfo(sensorType, laser.id, poiClassName),    
                [<img src={imgURL} id={'laser_' + laser.id} key={'laser_' + laser.id} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} className={poiClassName} draggable onClick={this.onClickPOI.bind(this, laser.id, sensorType, laser.zoneID)} /* onMouseDown={(e) => this.dragPOI(e, laser.id, sensorType)} */ />,
                <div className={poiClassName + '_img'} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} onClick={this.onClickPOI.bind(this, laser.id, sensorType, laser.zoneID)} />]
            ))
            _poiList.push(this.laserImgs);
        }
        
        if (this.state.curDoorSensorList && this.state.visibleSensorType.door) {
            const sensorType = 'door';
            let poiClassName = null;
            
            this.doorImgs = this.state.curDoorSensorList.map(door => (
                coordinateX = (door.x),
                coordinateY = Math.abs(door.z),
                imgURL = this.getPOIImageURL(sensorType, door.id, null, door.enabled),
                poiClassName = styles.poiImgs,
                poiClassName = this.getPoiClassNameFromSensorInfo(sensorType, door.id, poiClassName),
                [<img src={imgURL} id={'door_' + door.id} key={'door_' + door.id} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} draggable className={poiClassName} onClick={this.onClickPOI.bind(this, door.id, sensorType, door.zoneID)} /* onMouseDown={(e) => this.dragPOI(e, door.id, sensorType)} */ />, 
                <div className={poiClassName + '_img'} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} onClick={this.onClickPOI.bind(this, door.id, sensorType, door.zoneID)} />]
            ))
            _poiList.push(this.doorImgs);
        }
        /****************************************** 천원궁은 CCTV, ETC만 사용 ******************************************/  
        
        // if (this.curPsmSensorList && this.state.visibleSensorType.psm)
        // {
        //     const sensorType = 'psm';
        //
        //     this.psmImgs = this.curPsmSensorList.map(psm => (
        //         coordinateX = (psm.x * 20),
        //         coordinateY = Math.abs(psm.z),
        //         <img src={Contents2D.psmImg} key={psm.id} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} className={styles.poiImgs} onClick={this.movePOI.bind(this, psm.id, sensorType, psm.zoneID)} />
        //     ))
        //     _poiList.push(this.psmImgs);
        // }
        // if (this.curFireSensorList && this.state.visibleSensorType.fire) {
        //
        //     const sensorType = 'fire';
        //
        //     this.fireImgs = this.curFireSensorList.map(fire => (
        //         coordinateX = (fire.x * 20),
        //         coordinateY = Math.abs(fire.z),
        //         <img src={Contents2D.fireSensorImg} key={fire.id} style={{ left: coordinateX + 'px', top: coordinateY + 'px' }} className={styles.poiImgs} onClick={this.movePOI.bind(this, fire.id, sensorType, fire.zoneID)} />
        //     ))
        //     _poiList.push(this.fireImgs);
        // }
        this.setState({ poiList: _poiList });
    }
    
    // POI 이벤트 처리
    onClickPOI(sensorID, sensorType, zoneID, event) {
        if (event !== null && event !== undefined) 
            event.stopPropagation();
        
        const updateDB = false;
        let poi = { object: { name: sensorType + "_" + zoneID + "_" + sensorID } }; // this.props.onSelectPOI Parameter 형식에 맞추기 위해
        let pickPOI = [sensorType, sensorID, zoneID];

        if (this.state.isEditMode) {
            this.props.onSelectPOI(poi, updateDB, null);
            
            if (this.state.selectedPOI?.length > 0) {
                // 선택된 POI가 있을 경우 선택 해제 및 X, Y값 저장 
                pickPOI = [];
                this.updateCoordinates(sensorType, sensorID);
            }
                
            
            this.setState({ selectedPOI: pickPOI, editElement: { sensorType : sensorType, zoneID : zoneID, sensorID : sensorID } }, () => this.loadPOI());
            return;
        }
        
        if (sensorType === 'cctv' && sensorID !== null) {
            this.props.onSelectCCTV(sensorID.toString(), zoneID, sensorType);
        }
        
        this.props.onSelectPOI(poi, updateDB, null);

        this.props.setCurrentView(zoneID);
        
        this.setState({ selectedPOI: pickPOI }, () => this.loadPOI());
    }
    
    getPoiClassNameFromSensorInfo = (sensorType, sensorID, orgClassName) => {
        
        let className = orgClassName;
        
        const selectedPOI = this.state.selectedPOI;
        
        if (selectedPOI?.length > 2) {
            if (selectedPOI[0] === sensorType && selectedPOI[1] === sensorID) {
                className = styles.selectedPoiImgs;
            }
        }
        
        const sensorAlarms = this.props.sensorAlarms;
        
        for (let i = 0; i < sensorAlarms.length; i++) {
            const alarm = sensorAlarms[i];
            const orgSensorID = alarm.orgSensorID;
            if (orgSensorID === sensorID && alarm.isAlarm) {
                className = 'alarmedPoiImgs';
                break;
            }
        }
        
        return className;
        
    }
    
    
    
    updateCoordinates = async (sensorType, sensorID) => {
        const element = document.getElementById(sensorType + "_" + sensorID);
        if (!element) {
            return;
        }
        
        let nSensorType = null;
        if (sensorType === 'cctv') {
            nSensorType = SdmsResource.facilityType.CCTV;
        }
        if (sensorType === 'laser') {
            nSensorType = SdmsResource.facilityType.Laser;
        }
        if (sensorType === 'door') {
            nSensorType = SdmsResource.facilityType.DOOR;
        }
        
        const left = element.offsetLeft;
        const top = element.offsetTop;
        
        const result = await SDMSController.requestUpdateCoordinatesFor2D(nSensorType, sensorID, left, top);
    }
    
    setVisiblePopups = (menu) => {
        this.props.setVisiblePopups(menu);
    }

    getQuickButtonClassName = (name) => {
        if (this.props.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }
    
    setEditMode = () => {
        let selectedPOI = this.state.selectedPOI;
        
        let editModeIconElement = document.getElementById('dsBot_' + SdmsResource.popupLayer.editModeStatusInfo);
        
        if (!this.state.isEditMode) {
            const scaleRef = this.scaleRef.current;
            scaleRef.resetTransform();
            
            this.props.onSelectPOI(null, false, null);
            selectedPOI = [];
            
            // dom 조작으로 클래스명 변경
            editModeIconElement.classList.remove('off');
            editModeIconElement.className = 'on' + ' ' + editModeIconElement.className;

            this.props.setVisiblePopups(SDMS.menu.changeSensorName, !this.state.isEditMode); // ChangeSensorName Popup 띄우기
        } else {
            editModeIconElement.classList.remove('on');
            editModeIconElement.className = 'off' + ' ' + editModeIconElement.className;
            
            this.props.setVisiblePopups(SDMS.menu.changeSensorName, !this.state.isEditMode); // ChangeSensorName Popup 닫기
        }
        
        this.setState({ isEditMode: !this.state.isEditMode, selectedPOI });
    }
    
    getSiteQuickButtons = () => {
        let siteQuickButtons = null;
        siteQuickButtons = (
            <ul ref={this.refQuickButton}>
                <li key={"liQuickKey_statusInfo"}><span
                    className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+1</span><a
                    id={"dsBot_" + SdmsResource.popupLayer.statusInfo}
                    className={this.getQuickButtonClassName(SDMS.menu.statusInfo) + " " + 'statusInfoIcon'}
                    onClick={() => this.setVisiblePopups(SDMS.menu.statusInfo)}><span><em>설비<br/>리스트</em></span></a>
                </li>
                <li key={"liQuickKey_allCCTV"}><span
                    className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+2</span><a
                    id={"dsBot_" + SdmsResource.popupLayer.cctvInfo}
                    className={this.getQuickButtonClassName(SDMS.menu.allCCTV) + " " + 'cctvInfoIcon'}
                    onClick={() => this.setVisiblePopups(SDMS.menu.allCCTV)}><span><em>CC<br/>TV</em></span></a></li>
                <li key={"liQuickKey_dashboard"}><span
                    className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+2</span><a
                    id={"dsBot_" + SdmsResource.popupLayer.dashboard}
                    className={this.getQuickButtonClassName(SDMS.menu.dashboard) + " " + 'dashboardIcon'}
                    onClick={() => this.setVisiblePopups(SDMS.menu.dashboard)}><span><em>대시<br/>보드</em></span></a></li>
                <li key={"liQuickKey_eventInfo"}><span
                    className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+3</span><a
                    id={"dsBot_" + SdmsResource.popupLayer.event}
                    className={this.getQuickButtonClassName(SDMS.menu.eventInfo) + " " + 'eventIcon'}
                    onClick={() => this.setVisiblePopups(SDMS.menu.eventInfo)}><span><em>이벤트<br/>정보</em></span></a></li>
                <li key={"liQuickKey_editMode"}><span
                    className={"shortcutKey" + " " + 'shortCut' + " " + 'hideKey'}>Ct+8</span><a
                    id={"dsBot_" + SdmsResource.popupLayer.editModeStatusInfo}
                    className={this.getQuickButtonClassName(SDMS.menu.editMode) + " " + 'editModeIcon'}
                    onClick={() => this.setEditMode()}><span><em>편집<br/>모드</em></span></a></li>
            </ul>
        );
        return siteQuickButtons;
    }

    getAlarmElements() {
        
        const alarmDepth = this.props.selectedAlarm ? this.props.selectedAlarm.alarmDepth : null;
        
        if (!this.props.alarmSound || alarmDepth === null || alarmDepth === undefined) {
            return (
                <></>
            );
        }
        
        if (alarmDepth > 1) {
            return (
                <audio autoPlay={true} loop={true}
                        src="/resource/sound/alarm_level4.mp3">
                </audio>
            );
        }
        
        return (
            <></>
        );
    }
    
    getEdTitle = () => {
        if (this.state.isEditMode) {
            return (
                <EditMenusComponent>
                    <div id={"edTitle"} className="edTitle">
                        <h2>편집모드</h2>
                    </div>
                </EditMenusComponent>
            );
        } 
        
        return (
            <></>
        )
    }

    render() {

        let mainImg = null;

        if (this.state.loading === true && this.imgPath === null) {
            return (
                <></>
            );
        }

        if (this.state.loading === false || this.imgPath) {
            mainImg = <img src={`${this.imgPath}`} onMouseDown={(e) => this.isPanning(e)} className={styles.mainImage} alt="loading" onMouseMove={this.onMouseMove2} />
        }
        
        const siteQuickButtons = this.getSiteQuickButtons();
        
        const tempEditTitle = this.getEdTitle();
        
        return (
            <Contents3DComponent className={'appWrap posi_relative'} $siteID={ProjectResource.SiteID}>
                <div className={style.appWrap}>
                    <div className={style.appContainerWrap + " " + style.clfix}>
                        {tempEditTitle}
                        <TransformWrapper ref={this.scaleRef}
                                          initialScale={1}
                                          maxScale={3}
                                          wheel={{disabled: this.state.isEditMode}}
                                          panning={{disabled: this.state.disabledPanning}}
                                          centerOnInit={true}
                                          doubleClick={{disabled: true}}
                        >
                            <TransformComponent
                                contentClass='imgBox'
                                wrapperStyle={{
                                    width: '100%',
                                    height: '100%',
                                    margin: 'auto',
                                    overflow: 'hidden'
                                }}
                                contentStyle={{
                                    width: '100%',
                                    height: '100%',
                                    margin: 'auto',
                                    display: 'flex',
                                    flexWrap: 'nowrap'
                                }}
                            >

                                {mainImg}
                                {mainImg && this.state.poiList}
                                {/*<Toolbar></Toolbar>*/}
                            </TransformComponent>
                        </TransformWrapper>
                        <>
                            <div id={'dsSoulBot'}></div>
                            {siteQuickButtons}
                        </>
                    </div>
                </div>
                <figure>
                    {
                        this.getAlarmElements()
                    }
                </figure>
            </Contents3DComponent>
        );
    }
}

export default Contents2D;
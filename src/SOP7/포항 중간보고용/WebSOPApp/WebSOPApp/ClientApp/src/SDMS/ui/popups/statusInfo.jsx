import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { StatusInfoComponent } from '../../styled/sdmsPopupsStyled';
import tooltip_icon from '../../images/tooltip_icon.svg';
import SDMSMainMenu from '../sdmsMainMenu';

import alarm_off from '../../images/alarm_off.svg';
import alarm_on from '../../images/alarm_on.svg';
import SdmsResource from '../../resource/id';
    
class StatusInfo extends Component {
    
    static outdoor = 20000;
    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
            searchText: '',
            sortedSensorList: null,
            
            selectedBuildingID: null,
            selectedSensorType: null,
        }
        
        this.mounted = true;
    }
    
    _setState = (state, callback) => {
        if (this.mounted) {
            this.setState(state, callback);
        }
    }
    
    componentWillUnmount() {
        this.mounted = false;
    }

    changePopupOpacity = (value) => {
        this._setState({ opacity: value });
    }

    onChangeVisible(sensorType) {
        this.props.setVisiblePoi(sensorType, !this.props.visibleSensorTypes[sensorType]);
    }

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            this.search();
        }
    }
    
    // Building 클릭시 1depth 트리 On/Off
    onClickBuilding = (e, buildingID) => {
        let target = e.target;
        let className = target.className;
        
        const selectAllBuilding = document.querySelectorAll('[id^=buliding_]');
        for (let i = 0; i < selectAllBuilding.length; i++) {
            let t = selectAllBuilding[i];

            if(t.id.match(/\d+/)[0] === buildingID.toString()) {
                continue;
            }
            
            if (t.className.includes('on')) {
                t.className = t.className.replace(' on', '');
            }
            
        }
        
        const selectAllTree1Depth = document.querySelectorAll('[id^=tree-1depth_]');
        for (let i = 0; i < selectAllTree1Depth.length; i++) {
            let t = selectAllTree1Depth[i];
            
            if ((t.id.match(/_(\d+)/)[0]).replace('_', '') === buildingID.toString()) {
                continue;
            }
            
            if (t.className.includes('on')) 
                t.className = t.className.replace(' on', '');
            
        }
        
        const selectAllTree2Depth = document.querySelectorAll('[id^=tree-2depth_]');
        for (let i = 0; i < selectAllTree2Depth.length; i++) {
            let t = selectAllTree2Depth[i];

            if ((t.id.match(/_(\d+)/)[0]).replace('_', '') === buildingID.toString()) {
                continue;
            }
            
            if (t.className.includes('on'))
                t.className = t.className.replace(' on', '');
        }
        
        
        let temp = window.document.getElementById('buliding_' + buildingID.toString());
        let tempClassName = temp.className;
        
        if (className.includes('on')) {
            target.className = className.replace(' on', '');
        }
        else {
            target.className = className.concat(' on');
        }

        if (tempClassName.includes('on')) {
            // replace tempClassName add ' on'
            temp.className = tempClassName.replace(' on', '');
        }
        else {
            temp.className = tempClassName.concat(' on');
        }
        
        // 1depth 트리 On/Off
        const el = document.getElementById('tree-1depth_' + buildingID.toString());
        
        if (el.className.includes('on'))
            el.className = el.className.replace(' on', '');
        else
            el.className = el.className.concat(' on');
        
        this._setState({selectedBuildingID: buildingID });
    }
    
    // SensorType 클릭시 2depth 트리 On/Off
    onClickSensorType = (e, buildingID, sensorType) => {
        
        let target = e.target;
        let className = target.className;
        
        let el = document.getElementById('tree-2depth_' + buildingID.toString() + '_' + sensorType.toString());
        
        if (el.className.includes('on')) {
            e.target.className = e.target.className.replace('on', '');
            el.className = el.className.replace(' on', '');   
        }
        else {
            e.target.className = e.target.className.concat('on');
            el.className = el.className.concat(' on');   
        }
        
        this._setState({selectedSensorType: sensorType });
    }
    
    getSensorTypeFromZoneID = (zoneID) => {
        const externalSensorTypes = this.props.externalSensorTypes;
        const externalSensors = this.props.externalSensors;
        
        if (externalSensorTypes === null || externalSensorTypes === undefined)
            return;

        const sensor = externalSensors.find(sensor => sensor.zoneID === zoneID);
        const type = sensor.sensorType;

        return externalSensorTypes.find(sensorType => sensorType.id === type);
    }
    
    getSensorUI = () => {
        // sensorList로 트리 데이터 만들기
        const sensorList = this.props.sensorList;
        const buildingGroupList = this.props.buildingGroupList;
        const externalSensors = this.props.externalSensors;
        const externalSensorTypes = this.props.externalSensorTypes;

        if (sensorList === null || sensorList === undefined)
            return;

        if (buildingGroupList === null || buildingGroupList === undefined)
            return;

        if (externalSensors === null || externalSensors === undefined)
            return;

        if (externalSensorTypes === null || externalSensorTypes === undefined)
            return;
        
        let obj = [];
        // Building Depth 
        let buildings = buildingGroupList[0].buildingDatas; // BuildingGroup = 부산TP

        let outdoorBuildings = [];
        
        for (let i = 0; i < buildings.length; i++) {
            let building = buildings[i];
            let buildingName = building.buildingName;

            let zones = building.zoneDatas;

            if (building.maxFloor === 1) {
                outdoorBuildings.push(building);
                continue;
            }
            
            let atmosphereSensors = [];
            let kWeatherSensors = [];
            let weatherSensors = [];
            let electricitySensors = [];
            
            let atmospheresCount = 0;
            let kWeathersCount = 0;
            let weathersCount = 0;
            let electricityCount = 0;
            
            const selectedSensor = this.props.selectedSensor;
            
            for (let j = 0; j < zones.length; j++) {
                let zone = zones[j];
                let zoneName = zone.zoneName;
                
                let sensorData = externalSensors.find(sensor => sensor.zoneID === zone.id);
                if (sensorData === null || sensorData === undefined)
                    continue;
                
                let sensorType = externalSensorTypes.find(sensorType => sensorType.id === sensorData.sensorType);
                if (sensorType === null || sensorType == undefined)
                    continue;
                
                const searchText = this.state.searchText;
                
                if (zoneName.includes(searchText) === false)
                    continue;
                
                let selectedZoneClassName = null;
                if (selectedSensor && zone.id === selectedSensor.zoneID) {
                    selectedZoneClassName = { color: '#1d8bee' };
                }
                
                let temp =
                    <li key={zone.id} onClick={() => this.onClickSensor(zone.id, sensorType)}>
                        <p className={'sensorText'} style={selectedZoneClassName}>{zoneName}</p>
                        <img src={alarm_off} alt='알람 아이콘'/>
                    </li>
                
                if (sensorType.id === SdmsResource.SensorType.atmosphere) {
                    atmosphereSensors.push(temp);
                    atmospheresCount++;
                }
                else if (sensorType.id === SdmsResource.SensorType.kWeather) {
                    kWeatherSensors.push(temp);
                    kWeathersCount++;
                }
                else if (sensorType.id === SdmsResource.SensorType.weather) {
                    weatherSensors.push(temp);
                    weathersCount++;
                }
                else if (sensorType.id === SdmsResource.SensorType.electricity) {
                    electricitySensors.push(temp);
                    electricityCount++;
                }
            }
            
            let isSelectedBuilding = false;
            
            let isSelectedTypeSenko = false;
            let isSelectedTypeKWeather = false;
            let isSelectedTypeWeather = false;
            let isSelectedTypeEmmission = false;
            let isSelectedTypeReduction = false;
            
            let isSelectedZone = false;
            
            let selectedSensorType = null;
            
            // 선택된 센서가 있는경우 -- 알람 이벤트 클릭시
            if (selectedSensor !== null && selectedSensor !== undefined) {
                
                const selectedZoneID = selectedSensor.zoneID;
                const selectedBuildingID = this.getBuildingIDFromZoneID(selectedZoneID);
                
                if (building.id === selectedBuildingID) {
                    isSelectedBuilding = true;
                }
                
                selectedSensorType = this.getSensorTypeFromZoneID(selectedZoneID);
                
                isSelectedTypeSenko = selectedSensorType.id === SdmsResource.SensorType.atmosphere;
                isSelectedTypeKWeather = selectedSensorType.id === SdmsResource.SensorType.kWeather;
                isSelectedTypeWeather = selectedSensorType.id === SdmsResource.SensorType.weather;
                isSelectedTypeEmmission = selectedSensorType.id === SdmsResource.SensorType.reduction;
                isSelectedTypeReduction = selectedSensorType.id === SdmsResource.SensorType.discharge;
                
                if (selectedSensor.zoneID === selectedZoneID) {
                    isSelectedZone = true;
                }
                
            }
            
            isSelectedBuilding = isSelectedBuilding ? " on" : "";

            isSelectedTypeSenko = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.atmosphere ? " on" : "";
            isSelectedTypeKWeather = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.kWeather ? " on" : "";
            isSelectedTypeWeather = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.weather ? " on" : "";
            isSelectedTypeEmmission = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.reduction ? " on" : "";
            isSelectedTypeReduction = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.discharge ? " on" : "";
                

            // building onClick / sensorType onClick
            const sensorUI =
                <li key={'first-li' + building.id}>
                    {/* 트리 닫힌 상태 : className='building' */}
                    {/* 트리 열린 상태 : className='building on' */}
                    <div key={"building_" + building.id} id={'buliding_' + building.id} className={'building' + isSelectedBuilding}>
                        <p onClick={(e) => this.onClickBuilding(e, building.id)}>{buildingName}</p>
                        <button onClick={() => this.onClickMoveToBuilding(building.id)}>이동</button> 
                    </div>

                    {/* 트리 닫힌 상태 : className='tree-1depth' */}
                    {/* 트리 열린 상태 : className='tree-1depth on' */}
                    <ul id={'tree-1depth_' + building.id} className={'tree-1depth' + isSelectedBuilding}>
                        <li key={'second-li' + building.id}>
                            {/* 하위 트리 열리면 : className='on' */}
                            <div onClick={(e) => this.onClickSensorType(e, building.id, SdmsResource.SensorType.atmosphere)}>
                                <p>대기센서</p>
                                <p>{atmospheresCount}</p>
                            </div>
                            {/* 트리 닫힌 상태 : className='tree-2depth' */}
                            {/* 트리 열린 상태 : className='tree-2depth on' */}
                            <ul id={'tree-2depth_' + building.id + "_" + SdmsResource.SensorType.atmosphere} className={'tree-2depth' + isSelectedTypeSenko}>
                                {/* 센서 기본 상태 */}
                                {atmosphereSensors}
                            </ul>

                            <div onClick={(e) => this.onClickSensorType(e, building.id, SdmsResource.SensorType.kWeather)}>
                                <p>케이웨더</p>
                                <p>{kWeathersCount}</p>
                            </div>
                            {/* 트리 닫힌 상태 : className='tree-2depth' */}
                            {/* 트리 열린 상태 : className='tree-2depth on' */}
                            <ul id={'tree-2depth_' + building.id + "_" + SdmsResource.SensorType.kWeather} className={'tree-2depth' + isSelectedTypeKWeather}>
                                {/* 센서 기본 상태 */}
                                {kWeatherSensors}
                            </ul>
                        </li>
                    </ul>
                </li>

            obj.push(sensorUI);
        }
        
        obj.push(this.getOutdoorBuildingUI(outdoorBuildings));

        return obj;
    }
    
    onClickMoveToBuilding = (buildingID) => {
        // 3D 이동
        this.props.moveToBuilding(buildingID);
    }
    
    getOutdoorBuildingUI = (buildings) => {

        // sensorList로 트리 데이터 만들기
        const sensorList = this.props.sensorList;
        const buildingGroupList = this.props.buildingGroupList;
        const externalSensors = this.props.externalSensors;
        const externalSensorTypes = this.props.externalSensorTypes;

        if (sensorList === null || sensorList === undefined)
            return;

        if (buildingGroupList === null || buildingGroupList === undefined)
            return;

        if (externalSensors === null || externalSensors === undefined)
            return;

        if (externalSensorTypes === null || externalSensorTypes === undefined)
            return;
        
        let atmosphereSensors = [];
        let kWeatherSensors = [];
        let weatherSensors = [];
        let electricitySensors = [];

        let atmospheresCount = 0;
        let kWeathersCount = 0;
        let weathersCount = 0;
        let electricityCount = 0;

        let isSelectedBuilding = false;

        let isSelectedTypeSenko = false;
        let isSelectedTypeKWeather = false;
        let isSelectedTypeWeather = false;
        let isSelectedTypeEmmission = false;
        let isSelectedTypeReduction = false;

        let isSelectedZone = false;

        let selectedSensorType = null;

        const selectedSensor = this.props.selectedSensor;
        
        for (let i = 0; i < buildings.length; i++) {
            let building = buildings[i];
            let buildingName = building.buildingName;

            let zones = building.zoneDatas;

            for (let j = 0; j < zones.length; j++) {
                let zone = zones[j];
                let zoneName = zone.zoneName;

                let sensorData = externalSensors.find(sensor => sensor.zoneID === zone.id);
                if (sensorData === null || sensorData === undefined)
                    continue;

                let sensorType = externalSensorTypes.find(sensorType => sensorType.id === sensorData.sensorType);
                if (sensorType === null || sensorType === undefined)
                    continue;

                const searchText = this.state.searchText;

                if (zoneName.includes(searchText) === false)
                    continue;

                let selectedZoneClassName = null;
                if (selectedSensor && zone.id === selectedSensor.zoneID) {
                    selectedZoneClassName = { color: '#1d8bee' };
                }

                let temp =
                    <li key={zone.id} onClick={() => this.onClickSensor(zone.id, sensorType)}>
                        <p className={'sensorText'} style={selectedZoneClassName}>{zoneName}</p>
                        <img src={alarm_off} alt='알람 아이콘'/>
                    </li>

                if (sensorType.id === SdmsResource.SensorType.atmosphere) {
                    atmosphereSensors.push(temp);
                    atmospheresCount++;
                }
                else if (sensorType.id === SdmsResource.SensorType.kWeather) {
                    kWeatherSensors.push(temp);
                    kWeathersCount++;
                }
                else if (sensorType.id === SdmsResource.SensorType.weather) {
                    weatherSensors.push(temp);
                    weathersCount++;
                }
                else if (sensorType.id === SdmsResource.SensorType.electricity) {
                    electricitySensors.push(temp);
                    electricityCount++;
                }
            }

            // 선택된 센서가 있는경우 -- 알람 이벤트 클릭시
            if (selectedSensor !== null && selectedSensor !== undefined) {

                const selectedZoneID = selectedSensor.zoneID;
                const selectedBuildingID = this.getBuildingIDFromZoneID(selectedZoneID);

                if (building.id === selectedBuildingID) {
                    isSelectedBuilding = true;
                }

                selectedSensorType = this.getSensorTypeFromZoneID(selectedZoneID);

                isSelectedTypeSenko = selectedSensorType.id === SdmsResource.SensorType.atmosphere;
                isSelectedTypeKWeather = selectedSensorType.id === SdmsResource.SensorType.kWeather;
                isSelectedTypeWeather = selectedSensorType.id === SdmsResource.SensorType.weather;
                isSelectedTypeEmmission = selectedSensorType.id === SdmsResource.SensorType.reduction;
                isSelectedTypeReduction = selectedSensorType.id === SdmsResource.SensorType.discharge;

                if (selectedSensor.zoneID === selectedZoneID) {
                    isSelectedZone = true;
                }

            }

            isSelectedBuilding = isSelectedBuilding ? " on" : "";

            isSelectedTypeSenko = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.atmosphere ? " on" : "";
            isSelectedTypeKWeather = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.kWeather ? " on" : "";
            isSelectedTypeWeather = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.weather ? " on" : "";
            isSelectedTypeEmmission = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.reduction ? " on" : "";
            isSelectedTypeReduction = selectedSensorType && selectedSensorType.id === SdmsResource.SensorType.discharge ? " on" : "";


        }


        // building onClick / sensorType onClick
        return (
            <li key={'first-li' + StatusInfo.outdoor}>
                {/* 트리 닫힌 상태 : className='building' */}
                {/* 트리 열린 상태 : className='building on' */}
                <div key={"building_" + StatusInfo.outdoor} id={'buliding_' + StatusInfo.outdoor}
                     className={'building' + isSelectedBuilding}>
                    <p onClick={(e) => this.onClickBuilding(e, StatusInfo.outdoor)}>산업단지 외부</p>
                    <button onClick={() => this.onClickMoveToBuilding(StatusInfo.outdoor)}>이동</button>
                </div>

                {/* 트리 닫힌 상태 : className='tree-1depth' */}
                {/* 트리 열린 상태 : className='tree-1depth on' */}
                <ul id={'tree-1depth_' + StatusInfo.outdoor} className={'tree-1depth' + isSelectedBuilding}>
                    <li key={'second-li' + StatusInfo.outdoor}>
                        {/* 하위 트리 열리면 : className='on' */}
                        <div
                            onClick={(e) => this.onClickSensorType(e, StatusInfo.outdoor, SdmsResource.SensorType.atmosphere)}>
                            <p>대기센서</p>
                            <p>{atmospheresCount}</p>
                        </div>
                        {/* 트리 닫힌 상태 : className='tree-2depth' */}
                        {/* 트리 열린 상태 : className='tree-2depth on' */}
                        <ul id={'tree-2depth_' + StatusInfo.outdoor + "_" + SdmsResource.SensorType.atmosphere}
                            className={'tree-2depth' + isSelectedTypeSenko}>
                            {/* 센서 기본 상태 */}
                            {atmosphereSensors}
                        </ul>

                        <div
                            onClick={(e) => this.onClickSensorType(e, StatusInfo.outdoor, SdmsResource.SensorType.kWeather)}>
                            <p>케이웨더</p>
                            <p>{kWeathersCount}</p>
                        </div>
                        {/* 트리 닫힌 상태 : className='tree-2depth' */}
                        {/* 트리 열린 상태 : className='tree-2depth on' */}
                        <ul id={'tree-2depth_' + StatusInfo.outdoor + "_" + SdmsResource.SensorType.kWeather}
                            className={'tree-2depth' + isSelectedTypeKWeather}>
                            {/* 센서 기본 상태 */}
                            {kWeatherSensors}
                        </ul>
                    </li>
                </ul>
            </li>
        )
    }

    getBuildingIDFromZoneID = (zoneID) => {
        let buildingGroupList = this.props.buildingGroupList;
        if (buildingGroupList === null || buildingGroupList === undefined)
            return null;

        buildingGroupList = buildingGroupList[0];
        let buildingDatas = buildingGroupList.buildingDatas;

        for (let i = 0; i < buildingDatas.length; i++) {
            let building = buildingDatas[i];
            let zoneDatas = building.zoneDatas;
            for (let j = 0; j < zoneDatas.length; j++) {
                let zone = zoneDatas[j];
                if (zone.id === zoneID) {
                    return building.id;
                }
            }

        }
    }

    onClickSensor = (zoneID, sensorType) => {
        
        const sensorGIS = this.props.externalSensorGIS;
        const poiInfo = this.props.externalPOIInfo;
        
        if (sensorGIS === null || sensorGIS === undefined)
            return;
        
        if (poiInfo === null || poiInfo === undefined)
            return;
        
        const gis = zoneID > 100 ? sensorGIS.find(gis => gis.id === 20000) : sensorGIS.find(gis => gis.id === zoneID);
        if (gis === null || gis === undefined)
            return;
        
        const poi = poiInfo.find(poi => poi.id === zoneID);
        if (poi === null || poi === undefined)
            return;
        
        this.props.sendSelectPOI(gis.spaceID, poi.id);
        this.props.setSelectedSensor(zoneID, sensorType);
    }

    search = () => {
        const text = document.getElementById('txtSearch').value;
        this._setState({searchText: text});
    }

    render() {
        let opacity = this.state.opacity;

        let visibleAtmospherePOI = !!this.props.visibleSensorTypes[SDMSMainMenu.Atmosphere_Sensor];
        let visibleReductionEquipmentPOI = !!this.props.visibleSensorTypes[SDMSMainMenu.ReductionEquipment_Sensor];
        let visibleEmissionFacilitiesPOI = !!this.props.visibleSensorTypes[SDMSMainMenu.EmissionFacilities_Sensor];
        let visibleWeatherPOI = !!this.props.visibleSensorTypes[SDMSMainMenu.Weather_Sensor];
        //let visibleCCTVPOI = !!this.props.visibleSensorTypes[SDMSMainMenu.CCTV_Sensor];
        let visibleZoneNamePOI = !!this.props.visibleSensorTypes[SDMSMainMenu.ZoneName_Sensor];

        let visibleAtmosphereClassName = (visibleAtmospherePOI) ? 'visibleAtmosphere' : 'disableAtmosphere';
        let visibleReductionEquipmentClassName = (visibleReductionEquipmentPOI) ? 'visibleReductionEquipment' : 'disableReductionEquipment';
        let visibleEmissionFacilitiesClassName = (visibleEmissionFacilitiesPOI) ? 'visibleEmissionFacilities' : 'disableEmissionFacilities';
        let visibleWeatherClassName = (visibleWeatherPOI) ? 'visibleWeather' : 'disableWeather';
        //let visibleCCTVClassName = (visibleCCTVPOI) ? 'visibleCCTV' : 'disableCCTV';
        let visibleZoneNameClassName = (visibleZoneNamePOI) ? 'visibleZoneName' : 'disableZoneName';

        const sensorUI = this.getSensorUI();

        return (
            <StatusInfoComponent id={this.props.popupType} className='UI_Section statusInfo' $opacity={opacity}
                                 $resize={true}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={600}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.statusInfo}
                        </h5>
                        <input
                            type="range"
                            className="rangeInput"
                            min={0.1}
                            max={1}
                            color="gray"
                            step={0.1}
                            defaultValue={opacity}
                            onChange={(e) => {
                                this.changePopupOpacity(e.target.valueAsNumber)
                            }}
                        />
                        <button className='dslX'>닫기</button>
                    </div>

                    <div className={'content'}>
                        <div className="contentBox flex">
                            <div className='poiWrap'>
                                <p className='contentName'>POI뷰어</p>
                                <div id='tooltip' data-tooltip="3D상에 있는 POI(관심지점)를 ON/OFF 할 수 있는 뷰어기능" >
                                    <img src={tooltip_icon} alt='도움말 아이콘' />
                                </div>
                            </div>
                            <ul>
                                <li><label className={visibleAtmosphereClassName} data-title="대기센서" ><input type="checkbox" checked={visibleAtmospherePOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Atmosphere_Sensor)} /></label></li>
                                <li><label className={visibleReductionEquipmentClassName} data-title="저감설비" ><input type="checkbox" checked={visibleReductionEquipmentPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.ReductionEquipment_Sensor)} /></label></li>
                                <li><label className={visibleEmissionFacilitiesClassName} data-title="배출설비" ><input type="checkbox" checked={visibleEmissionFacilitiesPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.EmissionFacilities_Sensor)} /></label></li>
                                <li><label className={visibleWeatherClassName} data-title="기상센서" ><input type="checkbox" checked={visibleWeatherPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.Weather_Sensor)} /></label></li>
                                {/*<li><label className={visibleCCTVClassName} data-title="CCTV" ><input type="checkbox" checked={visibleCCTVPOI} onChange={() => this.onChangeVisible(SDMSMainMenu.CCTV_Sensor)} /></label></li>*/}
                                <li><label className={visibleZoneNameClassName} data-title="구역명" ><input type="checkbox" checked={visibleZoneNamePOI} onChange={() => this.onChangeVisible(SDMSMainMenu.ZoneName_Sensor)} /></label></li>
                            </ul>
                        </div>

                        <div className='contentBox sensor'>
                            <p className='contentName'>센서정보</p>

                            <div className={'searchWrap'}>
                                <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} placeholder='검색어를 입력해주세요.'/>
                                <button onClick={this.search}>검색</button>
                            </div>

                            <div className={'treeWrap scrollbar'}>
                                <ul className={'tree'}>
                                    {sensorUI}
                                </ul>
                            </div>
                        </div>
                    </div>
                </PopupDraggable> 
            </StatusInfoComponent>
        );
    }
}

export default StatusInfo;
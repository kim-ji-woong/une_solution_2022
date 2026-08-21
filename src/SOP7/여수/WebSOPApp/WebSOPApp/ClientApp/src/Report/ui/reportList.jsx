import React, { Component } from 'react';
import { ReportListComponent } from '../styled/ReportStyled';
import $ from 'jquery';
import ReportResource from "../resource/id";
import ReportUtil from "../util/ReportUtil";


class ReportList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: null,
            sensorList: null,
            sensorDatas: null,
            materials: null,
            
            filteredDataSource: null,
            
            curSortedMaterialID: null,
        }

        this.props = props;
        
        this.isUnmount = false;
    }

    // componentDidMount() {
    //     $('.reportArrowIcon').click(function () {
    //         $('.reportTdContents').slideToggle('reportTdContents_On');
    //     });
    // }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataSource !== this.props.dataSource) {
            this.setState({
                dataSource: this.props.dataSource,
                sensorList: this.props.sensorList,
                sensorDatas: this.props.sensorDatas,
                materials: this.props.materials,
                dataPeriodType: this.props.curDataPeriodType,
            });
        }
    }
    
    componentWillUnmount() {
        this.isUnmount = true;
    }

    _setState = (state, callback) => {
        if (!this.isUnmount){
            this.setState(state, callback);   
        }
    }

    onClickReportTableShow = async () => {
        const element = document.getElementById('reportTdContents_');
        const element2 = document.getElementById('reportInnerTable_');
        const element3 = document.getElementById('reportInnerTbody_');
        if (!element || !element2 || !element3)
            return;

        element3.innerHTML = "";

        const divTag = document.createElement("div");
        divTag.setAttribute("class", "reportInnerTbodyTr");
        const pTag = document.createElement("p");
        pTag.innerHTML = ('Test');

        divTag.appendChild(pTag);
    }
    
    getZoneInfo = (zoneID) => {
        const sensorDatas = this.state.sensorDatas;
        for (const key in sensorDatas) {
            const sensorData = sensorDatas[key];
            if (parseInt(sensorData.zoneID) === parseInt(zoneID)) {
                return sensorData;
            }
        }
    }
    splitBySensorID = (data) => {
        let sensorIDs = [];
        for (let i = 0; i < data.length; i++) {
            const sensorID = data[i].sensorID;
            sensorIDs.push(sensorID);
            sensorIDs = sensorIDs.filter((id, index) => sensorIDs.indexOf(id) === index);
        }
        let datas = {};
        for (let i = 0; i < sensorIDs.length; i++) {
            const sensorID = sensorIDs[i];
            let filteredData = [];
            for (let j = 0; j < data.length; j++) {
                if (sensorID === data[j].sensorID) {
                    filteredData.push(data[j]);
                }
            }
            datas[sensorID] = filteredData;
        }
        return datas;
    }
    
    sortedByIndex = (originArray, indexes) => {
        let sortedArray = Array.from(originArray);
        for (let i = 0; i < indexes.length; i++) {
            sortedArray[i] = originArray[indexes[i]];
        }
        return sortedArray;
    }
    
    splitData = (data) => {
        const contents = [];
        if (data === null || data === undefined) {
            return contents;
        }
        let keys = [];
        
        let splitedDatas = this.splitBySensorID(data) ? this.splitBySensorID(data) : [];
        let sensorLength = 0;
        let arr = [];
        
        const sortedMaterialID = this.state.curSortedMaterialID;
        let indexes = [];
        
        for (const key in splitedDatas) {
            let sensors = splitedDatas[key];
            sensors = this.addIndex(sensors);
            // 정렬한 idx 가져오기
            if (this.state.curSortedMaterialID === 0) {
                const prevSensors = sensors;
                sensors.sort((a, b) => {
                    return new Date(b.timeStamp) - new Date(a.timeStamp);
                });
                for (const sensor of sensors) {
                    indexes.push(sensor.index);
                }
                sensors = prevSensors;
                break;
            }
            
            if (sensors.find(function (element) {return element.materialID === sortedMaterialID; })) {
                sensors.sort((a, b) => {
                    if (a.materialID === sortedMaterialID) {
                        return parseFloat(a.sensorValue) - parseFloat(b.sensorValue);
                    }
                });
                for (const sensor of sensors) {
                    indexes.push(sensor.index);
                }
            } 
        }
        
        for (const key in splitedDatas) {
            let sensors = splitedDatas[key];
            if (splitedDatas[key][0].materialID === this.state.curSortedMaterialID) {
                continue;
            }
            if (this.state.curSortedMaterialID === 0) {
                continue;
            }
            sensors = this.sortedByIndex(sensors, indexes);
            splitedDatas[key] = sensors;
        }

        for (const key in splitedDatas) {
            sensorLength = splitedDatas[key].length;
            keys.push(key);
            if (arr.length === 0) {
                {
                    for (let i = 0; i < sensorLength; i++) {
                        arr.push(splitedDatas[key][i]);
                    }
                }
            }
        }
        
        if (arr.length === 0) {
            return contents;
        }
        
        for (let i = 0; i < arr?.length; i++) {
            let tds = [];
            
            for (let j = 0; j < keys.length; j++) {
                const value = splitedDatas[keys[j]][i];
                
                if (tds.length === 0) {
                    const dt = <td id={"timeStamp"}><p>{value?.timeStamp.replace("T", " ")}</p></td>
                    tds.push(dt);
                }
                
                if (value?.materialName === '풍향') {
                    const windDirection = this.props.getStringWindDirection(parseFloat(value?.sensorValue));
                    const td = <td id={value?.sensorID}><p>{windDirection}</p></td>
                    tds.push(td);
                    continue
                }
                
                const td = <td id={value?.sensorID}><p>{value?.sensorValue + " " + value?.materialUOM}</p></td>
                tds.push(td);
            }

            const content =
                <tr className={'reportListTbodyTr'}>
                    {tds}
                </tr>
            contents.push(content);
            
        }
        
        return contents;
    }
    
    addIndex = (objArr) => {
        for (let i = 0; i < objArr.length; i++) {
            objArr[i].index = i+1;
        }
        return objArr;
    }
    
    getMeasureingElement = (zoneInfo) => { 
        
        const sensorList = this.state.sensorList;
        const materials = this.state.materials;

        const measuringElements = [];
        
        if (sensorList === null || sensorList === undefined) {
            return measuringElements;
        }
        
        if (materials === null || materials === undefined) {
            return measuringElements;
        }
        
        const zoneID = zoneInfo.zoneID;
        
        let noneRangeSensorList = [];
        for (const key in sensorList) {
            const rangeSensorList = sensorList[key];
            for (let i = 0; i < rangeSensorList.length; i++) {
                const sensor = rangeSensorList[i];
                noneRangeSensorList.push(sensor);
            }
        }
        let targetSensorList = [];
        for (let i = 0; i < noneRangeSensorList.length; i++) {
            const sensor = noneRangeSensorList[i];
            if (sensor.zoneID === zoneID) {
                targetSensorList.push(sensor);
            }
        }
        
        for (let i = 0; i < targetSensorList.length; i++) {
            const sensor = targetSensorList[i];
            
            const sensors = sensor.sensors;
            for (let j = 0; j < sensors.length; j++) {
                const sensorTypeName = sensors[j].sensorTypeName;
                
                if (sensorTypeName === "풍향") {
                    const element = <th><p>{sensorTypeName}</p></th>
                    measuringElements.push(element);
                    continue;
                }
                
                const isSortedMaterial = this.state.curSortedMaterialID === sensors[j].sensorType;
                const iconStyle = isSortedMaterial ? {transform: 'rotate(180deg)'} : {};
                const element = <th><p>{sensorTypeName}</p><span className={'ascendingOrderIcon'} style={iconStyle} onClick={() => this.getSortedData(sensors[j].sensorType)}></span></th>
                measuringElements.push(element);
            }
        }
        
        return measuringElements;
    }
    
    getSortedData = (materialID) => {
        const curSortedMaterialID = this.state.curSortedMaterialID;
        
        if (curSortedMaterialID === null) {
            this._setState({
                curSortedMaterialID: materialID
            });
            return;
        }
        
        if (curSortedMaterialID === materialID) {
            this._setState({
                curSortedMaterialID: null
            });
            return;
        } else {
            this._setState({
                curSortedMaterialID: materialID
            });
            return;
        }
    }

    handleTableShow = (e) => {
        const element = e.currentTarget;
        const nextSibling = e.currentTarget.nextSibling;

        if(nextSibling.classList.contains('showTable')) {
            nextSibling.classList.remove('showTable');
            element.classList.remove('on');
        }
        else {
            nextSibling.classList.add('showTable');
            element.classList.add('on');
        }
    }
    
    getTableData = () => {
        const tableUI = [];
        
        const dataSources = this.state.dataSource;

        if (dataSources === null || dataSources === undefined) {
            return tableUI;
        }
        let isSortedMaterial = this.state.curSortedMaterialID === 0;
        let iconStyle = !isSortedMaterial ? {transform: 'rotate(180deg)'} : {};
        let timeStampTh = <th><p>측정일시</p><span className={'ascendingOrderIcon'} style={iconStyle} onClick={() => this.getSortedData(0)}></span></th>

        // Zone Depth
        for (const key in dataSources) {
            const dataSource = dataSources[key];
            const zoneInfo = this.getZoneInfo(key)
            let strKey = (key > 9) ? key.toString() : "0" + key.toString();

            const measuredElement = this.getMeasureingElement(zoneInfo);
            const measuringDatas = this.splitData(dataSource, zoneInfo);
            
            tableUI.push(
                <React.Fragment key={key}>
                    <tr className={'reportListTbodyTr'}
                        onClick={(e) => this.handleTableShow(e)}> 
                        <td style={{ width: '80px' }}>{strKey}</td>
                        <td style={{ width: 'calc(100% - 142px)' }}>{zoneInfo.sensorName ? zoneInfo.sensorName : "Position"}</td>
                        <td style={{ width: '50px' }}><span className={'reportArrowIcon'}></span></td>
                    </tr>

                    <div className={'reportTdContents'}>
                        <table className={'reportInnerTable'} id={"reportInnerTable_"}>
                            <thead className={'reportInnerTitle'}>
                            <tr>
                                {timeStampTh}
                                {measuredElement}
                            </tr>
                            </thead>
                            <tbody className={'reportInnerTbody'} id={"reportInnerTbody_"}>
                                {measuringDatas}
                            </tbody>
                        </table>
                    </div>
                </React.Fragment>
            );
        }

        
        return tableUI;
    }


    render() {
        const tableUI = this.getTableData();
        const layout = this.props.layout;
        
        return (
            <>
                <ReportListComponent id={'spLft'} $layout={layout}>
                    <div style={{ width: '100%', height: 'calc(100vh - 360px)' }}>
                        <table className={'reportListTable'}>
                            <thead className={'reportListTitle'}>
                            <tr>
                                <th style={{width: '80px'}}>번호</th>
                                <th style={{width: 'calc(100% - 142px)', flex: '1 1'}}>측정소</th>
                                <th style={{width: '100px'}}>
                                    <span className={'excelIcon'} onClick={this.props.onClickDownloadExcel}></span>
                                    <span className={layout === 1 ? 'downSizeScreenIcon' : 'wideScreenIcon'}
                                        onClick={() => this.props.handleLayout(1)}></span>
                                </th>
                            </tr>
                            </thead>

                            <tbody className={'reportListTbody scrollbar'}>
                            {tableUI}
                            </tbody>
                        </table>
                    </div>

                    {/*<div className={'hscNav'}>*/}
                    {/*    <a className={'prev'} onClick={() => this.setPageIndex(this.state.pageIndex - 1)}>이전</a>*/}
                    {/*    <ul> */}
                    {/*       <li key={'pageIndex_'}  className={'on'}><a>1</a></li> */}
                    {/*       <li key={'pageIndex_'}  ><a>2</a></li> */}
                    {/*    </ul> */}
                    {/*    <a className={'next'} onClick={() => this.setPageIndex(this.state.pageIndex + 1)}>다음</a> */}
                    {/*</div> */}

                </ReportListComponent>
            </>
        );
    }
}

export default ReportList;
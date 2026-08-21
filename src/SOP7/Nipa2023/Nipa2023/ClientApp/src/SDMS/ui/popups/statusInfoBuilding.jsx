import React, { Component } from 'react';

import StatusInfoZone from './statusInfoZone';
import ProjectResource from '../../../Root/resource/id';

class StatusInfoBuilding extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    getZoneUI() {
        let ui = [];
        
        if (this.props.building.zoneDatas) {
            const zoneDatas = this.props.building.zoneDatas;

            if (zoneDatas === undefined || zoneDatas === null || zoneDatas.length === 0)
                return ui;

            this.setZoneUI(zoneDatas, ui, true);
        }
        else {
            const outdoorZones = this.props.building;

            if (outdoorZones === undefined || outdoorZones === null || outdoorZones.length === 0)
                return ui;

            // 외부영역은 첫번째 요소만 나타나게 한다.
            if (outdoorZones.length > 1) {
                const _outdoorZones = [];
                const outdoorZone = { ...outdoorZones[0] };

                const sensors = {};


                for (const zone of outdoorZones) {
                    for (const sensorType in zone.sensors) {
                        const _sensors = zone.sensors[sensorType];

                        let zoneSensors = sensors[sensorType];

                        if (!zoneSensors) {
                            zoneSensors = [];
                            sensors[sensorType] = zoneSensors;
                        }

                        for (const sensor of _sensors) {
                            zoneSensors.push(sensor);
                        }
                    }
                }

                outdoorZone.sensors = sensors;
                _outdoorZones.push(outdoorZone);
                this.setZoneUI(_outdoorZones, ui, false);
            }
            else {
                this.setZoneUI(outdoorZones, ui, true);
            }
        }
        
        return ui;
    }

    setZoneUI(zoneDatas, ui, checkZoneID) {
        const campusID = ProjectResource.campusID;

        for (let i = 0; i < zoneDatas.length; i++) {
            const zone = zoneDatas[i];

            let atmosphereSensors = null, emergencyBells = null, gasSensors = null, cctvs = null, thermalCCTVs = null, workers = null;

            if (this.props.sensorList) {
                const _atmosphereSensors = this.props.sensorList['atmosphereSensors'];
                const _emergencyBells = this.props.sensorList['emergencyBells'];
                const _gasSensors = this.props.sensorList['gasSensors'];
                const _cctvs = this.props.sensorList['cctvs'];
                const _thermalCCTVs = this.props.sensorList['thermalCCTVs'];
                const _workers = this.props.sensorList['aps'];

                if (_atmosphereSensors) {
                    if (checkZoneID) {
                        atmosphereSensors = _atmosphereSensors.filter(x => x.zoneID === zone.id);
                    }
                    else {
                        atmosphereSensors = _atmosphereSensors.filter(x => x.zoneID >= 20000);
                    }
                }
                if (_emergencyBells) {
                    if (checkZoneID) {
                        emergencyBells = _emergencyBells.filter(x => x.zoneID === zone.id);
                    }
                    else {
                        emergencyBells = _emergencyBells.filter(x => x.zoneID >= 20000);
                    }
                }
                if (_gasSensors) {
                    if (checkZoneID) {
                        gasSensors = _gasSensors.filter(x => x.zoneID === zone.id);  
                    }
                    else {
                        gasSensors = _gasSensors.filter(x => x.zoneID >= 20000);
                    }
                }
                if (_cctvs) {
                    if (checkZoneID) {
                        cctvs = _cctvs.filter(x => x.zoneID === zone.id);
                    }
                    else {
                        cctvs = _cctvs.filter(x => x.zoneID >= 20000);
                    }
                }
                if (_thermalCCTVs) {
                    if (checkZoneID) {
                        thermalCCTVs = _thermalCCTVs.filter(x => x.zoneID === zone.id);
                    }
                    else {
                        thermalCCTVs = _thermalCCTVs.filter(x => x.zoneID >= 20000);
                    }
                }
                if (_workers) {
                    if (checkZoneID) {
                        workers = _workers.filter(x => x.zoneID === zone.id);
                    }
                    else {
                        workers = _workers.filter(x => x.zoneID >= 20000);
                    }
                }
            }

            let zoneClass = '';
            let zoneChildClass = '';

            if (this.props.selectedStatusInfo.zone === zone.id || (this.props.selectedStatusInfo.zone > 19999 && zone.id > 19999)) {
                zoneClass = 'on';
                zoneChildClass = 'tree-2depth on';
            }
            else {
                zoneClass = '';
                zoneChildClass = 'tree-2depth';
            }

            ui.push(
                <li key={'zone_' + zone.id}>
                    <div className={zoneClass} onClick={() => this.props.selectZone(zone.id)}>
                        <p>{zone.displayText}</p>
                        {
                            zone.id !== 20000 ?
                                <button onClick={() => this.props.setCurrentView(zone.buildingID, zone.id, zone.displayText)}>이동</button> :
                                <button onClick={() => this.props.moveToOutdoor(campusID, this.props.building)}>이동</button>
                        }
                    </div>
                    <ul className={zoneChildClass} id={"zone_" + zone.id}>
                        <StatusInfoZone
                            key={'zone_' + zone.id}
                            id={'zone_' + zone.id}
                            zone={zone}
                            sensorList={this.props.sensorList}
                            atmosphereSensors={atmosphereSensors}
                            emergencyBells={emergencyBells}
                            gasSensors={gasSensors}
                            cctvs={cctvs}
                            thermalCCTVs={thermalCCTVs}
                            workers={workers}
                            selectedSensor={this.props.selectedSensor}
                            selectSensor={this.props.selectSensor}
                            setVisiblePopups={this.props.setVisiblePopups}
                            selectedStatusInfo={this.props.selectedStatusInfo}
                        />
                    </ul>
                </li>
            );
        }
    }

    render() {
        let zoneUI = this.getZoneUI();
        // console.log(zoneUI);

        return (
            <>
                {zoneUI}
            </>
        )
    }
}

export default StatusInfoBuilding;
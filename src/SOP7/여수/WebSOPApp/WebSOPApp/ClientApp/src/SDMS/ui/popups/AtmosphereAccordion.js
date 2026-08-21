import React, { useState } from 'react';
import { useEffect, useRef } from "react";
import './../../../SDMS/css/popup.css';

import styled from 'styled-components';
import { AtmosphereAccordionComponent, AtmosphereWrapper } from './../../sdmsStyled';
import StatusInfo from './statusInfo';
import SdmsResource from '../../resource/id';


// 이전 State값 저장
function usePrevState(state) {
    const ref = useRef();
    useEffect(() => {
        ref.current = state;
    }, [state]);

    return ref.current;
}

const AtmosphereAccordion = ({ title, btnText, sensors, openStatus, isSelected, selectedSensor, selectSensor, selectedAlarm, isSameAlarm, isSameAlarmTrue, onClick360, materialLinks, searchText, testParam }) => {
    const [open, setOpen] = useState(false);
    const [sensorNum, setSensorNum] = useState(0);

    const prevAlarm = usePrevState(selectedAlarm);
    const prevSensor = usePrevState(selectedSensor);

    let prevScrollSensor = null;

    // 선택된 알람센서로 자동 스크롤
    const element = useRef(null);

    const scrollToElement = () => element.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    useEffect(() => {
        if (openStatus !== StatusInfo.AtmosphereType) {
            setOpen(false);
        }
    }, [openStatus])

    useEffect(() => {
        if (isSameAlarm === false) {
            scrollToElement();
            // sdms의 onClickSameAlarm값 true로 바꿔줘야함
            return isSameAlarmTrue();
        }
        if (selectedSensor) {
            if (selectedSensor.sensor.position === prevScrollSensor) {
                scrollToElement();

                return isSameAlarmTrue();
            }
        }

    }, [selectedSensor])
    
    //const [selectedSensor, setSelectedSensor] = useState(null);
    //const [modalOpen, setModalOpen] = useState(false);

    /*const openModal = (sensor) => {
        setSelectedSensor(sensor);
        setModalOpen(true);
    };*/

    useEffect(() => {

        // 현황판의 센서 갯수 표출
        if (sensors) {
            setSensorNum(sensors.length)
        }

        // selectedAlarm이 변경될때 selectedSensor변경
        if (selectedAlarm) {
            if (selectedAlarm !== prevAlarm && selectedAlarm.isAlarm) {
                setOpen(true);

                for (let i = 0; i < sensors?.length; i++) {
                    const alarmSensor = sensors[i];

                    if (alarmSensor.zoneID === selectedAlarm.zoneID) {

                        scrollToElement();

                        if (selectedSensor !== prevSensor) {
                            selectSensor(StatusInfo.AtmosphereType, alarmSensor, openStatus);
                        }
                        
                    }
                }

            }
        }
    }, [sensors]);

    useEffect(() => {
        if (selectedAlarm) {
            if (selectedAlarm !== prevAlarm) {

                for (let i = 0; i < sensors?.length; i++) {
                    const alarmSensor = sensors[i];

                    if (alarmSensor.zoneID === selectedAlarm.zoneID) {

                        setOpen(true);

                        scrollToElement();

                        selectSensor(StatusInfo.AtmosphereType, alarmSensor, openStatus);

                    }
                }
            }
        }
    }, [selectedAlarm]);

    const handleClick = () => {
        const opened = !getOpenStatus();
        setOpen(opened);

        if (opened) {
            selectSensor(StatusInfo.AtmosphereType, selectedSensor);
        }
        else {

            selectedSensor = null;

            selectSensor(null, selectedSensor);

        }
    };

    const sensorClick = (e, sensor) => {
            setOpen(true);
            selectSensor(StatusInfo.AtmosphereType, sensor, StatusInfo.AtmosphereType);
    }

    const isDanger = (sensor) => {
        const indiSensors = sensor.sensors;

        for (const _sensor of indiSensors) {

            //#region
            //if (parseInt(_sensor.sensorType) === SdmsResource.materialType.Dust_PM10) {
            //    pm10 = _sensor.value;
            //} else if (parseInt(_sensor.sensorType) === SdmsResource.materialType.Dust_PM2) {
            //    pm025 = _sensor.value;
            //} else if (parseInt(_sensor.sensorType) === SdmsResource.materialType.CL2) {
            //    CL2 = _sensor.value;
            //} else if (parseInt(_sensor.sensorType) === SdmsResource.materialType.HCL) {
            //    HCL = _sensor.value;
            //} else if (parseInt(_sensor.sensorType) === SdmsResource.materialType.NH3) {
            //    NH3 = _sensor.value;
            //} else if (parseInt(_sensor.sensorType) === SdmsResource.materialType.TVOC) {
            //    TVOC = _sensor.value;
            //} else if (parseInt(_sensor.sensorType) === SdmsResource.materialType.H2S) {
            //    H2S = _sensor.value;
            //}

            const key = _sensor.sensorType;
            const thresholds = SdmsResource.thresholds;

            //if (thresholds.hasOwnProperty(key)) {

            //    let isReverse = false;

            //    const values = thresholds[key];

            //    sensorValue = _sensor.value;

            //    if (values[0] === 1) {
            //        isReverse = true; // 해당 오염도 기준이 역순인지 판별
            //    }

            //    const standards = thresholds[key];



            //    if (!isReverse) {
            //        for (let i = 2; i < standards.length; i++) {
            //            if (sensorValue === null || sensorValue === undefined)
            //                continue;

            //            if (parseFloat(sensorValue) > standards[i]) {
            //                return true;
            //            }
            //        }
            //    } else {
            //        for (let i = 2; i < standards.length; i++) {
            //            if (sensorValue === null || sensorValue === undefined)
            //                continue;

            //            if (parseFloat(sensorValue) < standards[i]) {
            //                return true;
            //            }
            //        }
            //    }
            //}
            //#endregion
            for (const materialLink of materialLinks) {
                if (materialLink.materialID === _sensor.sensorType) {
                    const direction = materialLink.direction;

                    const min1 = materialLink.min1;
                    const max1 = materialLink.max1;
                    const min2 = materialLink.min2;
                    const max2 = materialLink.max2;

                    if (min1 === null && max1 === null && min2 === null && max2 === null) {
                        return false;
                    }

                    let fValue = null;
                    if (_sensor.value) {
                        fValue = parseFloat(_sensor.value);
                    }

                    if (direction === 0) { // 역방향
                        
                        if (fValue < min1) {
                            return true;
                        }

                    } else {
                        if (fValue > max2) {
                            return true;
                        }
                    }

                }
            }

        }
        return false;
    }

    const onClickTestCase = () => {

        let sensors = [];
        let sensor1 = { id: 1, sensorType: 205, sensorTypeName: '초미세먼지(PM2.5)', enabled: true, status: 0, uoM: 'μg/m3', value: '10.00' };
        let sensor2 = { id: 2, sensorType: 206, sensorTypeName: '초미세먼지(PM10)', enabled: true, status: 0, uoM: 'μg/m3', value: '10.00' };
        let sensor3 = { id: 3, sensorType: 254, sensorTypeName: '염소(Cl2)', enabled: true, status: 0, uoM: 'ppm', value: '10.00' };
        let sensor4 = { id: 4, sensorType: 200, sensorTypeName: '온도', enabled: true, status: 0, uoM: '°C', value: '10.00' };
        let sensor5 = { id: 5, sensorType: 201, sensorTypeName: '습도', enabled: true, status: 0, uoM: '%', value: '10.00' };
        let sensor6 = { id: 6, sensorType: 261, sensorTypeName: '풍향', enabled: true, status: 0, uoM: '°', value: '10.00' };
        let sensor7 = { id: 7, sensorType: 262, sensorTypeName: '풍속', enabled: true, status: 0, uoM: 'm/s', value: '10.00' };
        sensors.push(sensor1, sensor2, sensor3, sensor4, sensor5, sensor6, sensor7);

        const sensor = {
            address: '여수산단2로',
            position: '여수산단2로',
            sensors: sensors,
            uniqueKey: '',
            zoneID: 60
        };

        selectSensor(StatusInfo.AtmosphereType, sensor, StatusInfo.AtmosphereType)

        scrollToElement();
    }

    const getSensorElements = (sensors) => {
        const items = [];

        if (testParam) {
            items.push(
                <div ref={element} className="AtmosList Active activeBack" id="testSensor" onClick={() => onClickTestCase()}>
                    <span className={'C360IconAlarm'} /* onClick={() => onClick360(sensor)} */></span>
                    <span className={'activeRed'} /*onClick={(e) => sensorClick(e, sensor)}*/>여수산단2로</span>
                    <span className={'sensorIconActive'}></span>
                    <p style={{ width: '46px' }}>7/7</p>
                    <span className={'redCircle'}></span>
                </div>
            ) // Test Sensor

            for (const sensor of sensors) {
                if (searchText) {
                    let sensorPosition = sensor.position;

                    if (!sensorPosition.includes(searchText)) {
                        continue;
                    }
                }

                let actSensorNum2

                for (const _sensor of sensor.sensors) {

                    if (_sensor.sensorType === SdmsResource.materialType.Temp ||
                        _sensor.sensorType === SdmsResource.materialType.Humi ||
                        _sensor.sensorType === SdmsResource.materialType.Wind_Dir ||
                        _sensor.sensorType === SdmsResource.materialType.Wind_Speed) {
                        continue;
                    }

                    if (_sensor.enabled) {
                        actSensorNum2 += 1;
                    }
                }

                items.push(
                    <div className="AtmosList Blue">
                        <span className={'C360Icon'}></span>
                        <span /* className="activeBlue" */ id={sensor.zoneID} >{sensor.position}</span>
                        <span className={'sensorIconDisable'}></span>
                        <p style={{ width: '46px' }}>{actSensorNum2}/4</p>
                        {/* <BlueCircle></BlueCircle> */}
                        <span className={'grayCircle'}></span>
                    </div>
                );
            }

        }
        /// TestCase End

        if (sensors) {
            for (const sensor of sensors) {

                if (searchText) {
                    let sensorPosition = sensor.position;

                    if (!sensorPosition.includes(searchText)) {
                        continue;
                    }
                }

                let isDangered = isDanger(sensor);

                const sensorNum = sensor.sensors.length - 4; // 온도 습도 풍향 풍속 제외

                let actSensorNum = 0;
                

                for (const _sensor of sensor.sensors) {

                    if (_sensor.sensorType === SdmsResource.materialType.Temp ||
                        _sensor.sensorType === SdmsResource.materialType.Humi ||
                        _sensor.sensorType === SdmsResource.materialType.Wind_Dir ||
                        _sensor.sensorType === SdmsResource.materialType.Wind_Speed) {
                        continue;
                        }

                    if (_sensor.enabled) {
                        actSensorNum += 1;
                    }
                }

                if (actSensorNum === 0) {
                    isDangered = false;
                }

                if (selectedSensor) {  // 이부분에서 일반 Active면 Blue Text , 상위 컴포넌트에서 항목별 위험도값이 1개라도 3이상이면 Red Text
                    if (sensor.position === selectedSensor?.sensor.position && isDangered === true) {
                        items.push(
                            <div ref={element} className="AtmosList Active activeBack" id={sensor.zoneID} key={sensor.zoneID}>
                                <span className={'C360IconAlarm'} onClick={() => onClick360(sensor)}></span>
                                <span className={'activeRed'} onClick={(e) => sensorClick(e, sensor)}>{sensor.position}</span>
                                <span className={'sensorIconActive'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'redCircle'}></span>
                            </div>
                        );
                        prevScrollSensor = sensor.position;
                    } else if (sensor.position === selectedSensor?.sensor.position && isDangered === false) {
                        items.push(
                            <div ref={element} className="AtmosList Active activeBack" id={sensor.zoneID} key={sensor.zoneID}>
                                <span className={'C360IconAct'} onClick={() => onClick360(sensor)}></span>
                                <span className={'activeBlue'} onClick={(e) => sensorClick(e, sensor)}>{sensor.position}</span>
                                <span className={'sensorIconActive'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'grayCircle'}></span>
                            </div>
                        );
                        prevScrollSensor = sensor.position;
                    } else {
                        if (actSensorNum === 0) {
                            items.push(
                                <div className="AtmosList Gray" key={sensor.zoneID}>
                                    <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                    <span id={sensor.zoneID} onClick={(e) => sensorClick(e, sensor)}>{sensor.position}</span>
                                    <span className={'sensorIconDisable'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'grayCircle'}></span>
                                </div>
                            );
                        } else {
                            if (isDangered) {
                                items.push(
                                    <div className="AtmosList Red" key={sensor.zoneID}>
                                        <span className={'C360IconAlarm'} onClick={() => onClick360(sensor)}></span>
                                        <span className={'activeRed'} id={sensor.zoneID} onClick={(e) => sensorClick(e, sensor)}>{sensor.position}</span>
                                        {/* <SensorIconDisable></SensorIconDisable> */}
                                        <span className={'sensorIconActive'}></span>
                                        <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                        <span className={'redCircle'}></span>
                                    </div>
                                );
                            } else {
                                items.push(
                                    <div className="AtmosList Blue" key={sensor.zoneID}>
                                        <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                        <span /* className="activeBlue" */ id={sensor.zoneID} onClick={(e) => sensorClick(e, sensor)}>{sensor.position}</span>
                                        <span className={'sensorIconDisable'}></span>
                                        <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                        {/* <BlueCircle></BlueCircle> */}
                                        <span className={'grayCircle'}></span>
                                    </div>
                                );
                            }
                        }
                    }
                } else {
                    if (actSensorNum === 0) {
                        items.push(
                            <div className="AtmosList Gray" key={sensor.zoneID}>
                                <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                <span id={sensor.zoneID} onClick={(e) => sensorClick(e, sensor)}>{sensor.position}</span>
                                <span className={'sensorIconDisable'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'grayCircle'}></span>
                            </div>
                        );
                    } else {
                        if (isDangered) {
                            items.push(
                                <div className="AtmosList Red" key={sensor.zoneID}>
                                    <span className={'C360IconAlarm'} onClick={() => onClick360(sensor)}></span>
                                    <span className={'activeRed'} id={sensor.zoneID} onClick={(e) => sensorClick(e, sensor)}>{sensor.position}</span>
                                    {/* <SensorIconDisable></SensorIconDisable> */}
                                    <span className={'sensorIconActive'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'redCircle'}></span>
                                </div>
                            );
                        } else {
                            items.push(
                                <div className="AtmosList Blue" key={sensor.zoneID} >
                                    <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                    <span id={sensor.zoneID} onClick={(e) => sensorClick(e, sensor)}>{sensor.position}</span>
                                    <span className={'sensorIconDisable'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    {/* <BlueCircle></BlueCircle> */}
                                    <span className={'grayCircle'}></span>
                                </div>
                            );
                        }
                    }
                }
            }
        }
        return items;
    }

    const getOpenStatus = () => {
        if (openStatus) {
            if (openStatus === StatusInfo.AtmosphereType) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    return (
        <>
            <AtmosphereAccordionComponent style={{ position : 'relative' }}>
                <div className={'sensorForm'} onClick={handleClick}>
                    {/* <SensorAtmosIcon></SensorAtmosIcon> */}
                    <span>{title}</span>
                    <div className={'sensorNum'}>{sensorNum}</div>
                    {open ?
                        <div className={'arrowUpIcon'}></div> :
                        <div className={'arrowDownIcon'}></div>
                    }
                </div>
                <AtmosphereWrapper $open={getOpenStatus()}>
                    {
                        getSensorElements(sensors)
                    /*<div>
                        <FactoryIcon></FactoryIcon>
                        <span className="active">여수소방서 화학119구조대 옥상</span>
                        <p style={{ width: '46px' }}><BlueCircle></BlueCircle>ON</p>
                        <BellIconActive></BellIconActive>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span className="active">GS칼텍스1</span>
                        <p style={{ width: '46px' }}><BlueCircle></BlueCircle>ON</p>
                        <BellIconActive></BellIconActive>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span>GS칼텍스2</span>
                        <p style={{ width: '46px' }}><GrayCircle></GrayCircle>OFF</p>
                        <BellIconDisable></BellIconDisable>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span>GS칼텍스3</span>
                        <p style={{ width: '46px' }}><GrayCircle></GrayCircle>OFF</p>
                        <BellIconDisable></BellIconDisable>
                    </div>*/
                    }
                </AtmosphereWrapper>
            </AtmosphereAccordionComponent>

            {/* {
            <div style={{ position: 'absolute', top: '500px' , left: '400px' }}>
             {
               isSelected && selectedSensor && <AtmospherePopup sensor={selectedSensor} />
            }
            </div>
            }*/}
        </>
    );
};

AtmosphereAccordion.defaultProps = {
    title: '대기',
    btnText: '      >>'
};

export default AtmosphereAccordion;
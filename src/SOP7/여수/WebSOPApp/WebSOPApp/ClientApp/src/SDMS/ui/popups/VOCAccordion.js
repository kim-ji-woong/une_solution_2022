import React, { useEffect, useState, useRef } from 'react';
import './../../../SDMS/css/popup.css';

import styled from 'styled-components';
import { VOCAccordionComponent, VOCWrapper } from './../../sdmsStyled';
import StatusInfo from './statusInfo';

import VOCInfo from './VOCInfo';
import { SDMSController } from '../../services/sdmsController';
import SdmsResource from '../../resource/id';



// 이전 State값 저장
function usePrevState(state) {
    const ref = useRef();
    useEffect(() => {
        ref.current = state;
    }, [state]);

    return ref.current;
}


const VOCAccordion = ({ title, btnText, sensors, openStatus, isSelected, selectedSensor, selectSensor, selectedAlarm, isSameAlarm, isSameAlarmTrue , materialLinks, searchText }) => {
    const [open, setOpen] = useState(false);
    const [sensorNum, setSensorNum] = useState(0);

    const prevAlarm = usePrevState(selectedAlarm);
    const prevSensor = usePrevState(selectedSensor);

    let prevScrollSensor = null;

    // 선택된 알람센서로 자동 스크롤
    const element = useRef(null);
    const scrollToElement = () => element.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    useEffect(() => {
        if (isSameAlarm === false) {
            scrollToElement();
            return isSameAlarmTrue();
        }
        if (selectedSensor) {
            if (selectedSensor.sensor.position === prevScrollSensor) {
                scrollToElement();

                return isSameAlarmTrue();
            }
        }
    }, [selectedSensor])

    useEffect(() => {

        // 현황판의 센서 갯수 표출
        if (sensors) {
            setSensorNum(sensors.length);
        }

        // selectedAlarm이 변경될때 selectedSensor변경
        if (selectedAlarm) {
            if (selectedAlarm !== prevAlarm && selectedAlarm.isSameAlarm) {
                setOpen(true);

                for (let i = 0; i < sensors?.length; i++) {
                    const alarmSensor = sensors[i];

                    if (alarmSensor.zoneID === selectedAlarm.zoneID) {

                        scrollToElement();

                        if (selectedSensor !== prevSensor) {
                            selectSensor(StatusInfo.VocType, alarmSensor, openStatus);
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

                        selectSensor(StatusInfo.VocType, alarmSensor, openStatus)
                        
                    }
                }
            }
        }
    }, [selectedAlarm]);

    useEffect(() => {
        if (openStatus !== StatusInfo.VocType) {
            setOpen(false);
        }
    }, [openStatus])

    const handleClick = () => {
        const opened = !getOpenStatus();
        setOpen(opened);

        if (opened) {
            selectSensor(StatusInfo.VocType, selectedSensor);
        }
        else {

            selectedSensor = null;

            selectSensor(null, selectedSensor);

        }
    };

    const sensorClick = (sensor) => {
        setOpen(true);
        selectSensor(StatusInfo.VocType, sensor, StatusInfo.VocType);
    }

    const isDanger = (sensor) => {
        const indiSensors = sensor.sensors;

        const _materialLinks = materialLinks;

        if (!indiSensors || !_materialLinks) {
            return false;
        }

        let sensorVal = null;
        let direction = null;
        let min1 = null;
        let max1 = null;
        let min2 = null;
        let max2 = null;

        for (let i = 0; i < indiSensors.length; i++) {
            for (let j = 0; j < _materialLinks.length; j++) {
                if (indiSensors[i].sensorType === _materialLinks[j].materialID) {
                    sensorVal = indiSensors[i].value;
                    direction = _materialLinks[j].direction;
                    min1 = _materialLinks[j].min1;
                    max1 = _materialLinks[j].max1;
                    min2 = _materialLinks[j].min2;
                    max2 = _materialLinks[j].max2;

                    if (min1 === null && max1 === null && min2 === null && max2 === null) {
                        continue;
                    }

                    if (parseInt(direction) === 0) {
                        if (sensorVal < min1) {
                            return true;
                        }
                    } else if (parseInt(direction) === 1) {
                        if (sensorVal > max2) {
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
            }
        }

        return false;

        // 1: 정상 , 2: 관심 , 3: 주의 , 4: 경계

    }

    const getSensorElements = (sensors) => {
        const items = [];

        let sensorsNum = 0;
        
        if (sensors) {
            for (const sensor of sensors) {

                if (searchText) {
                    let sensorPosition = sensor.position;

                    if (!sensorPosition.includes(searchText)) {
                        continue;
                    }
                }

                sensorsNum += sensorsNum;

                const sensorNum = sensor.sensors.length - 4; // 온도 습도 풍향 풍속 제외

                let isDangered = isDanger(sensor);

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

                if (selectedSensor) {
                    if (sensor.position === selectedSensor?.sensor.position && isDangered === true) {
                        items.push(
                            <div ref={element} className="VOCList Active activeBack" key={sensor.zoneID}>
                                <span className={'VOCSIconAlarm'}></span>
                                <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                <span className={'sensorIconActive'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'redCircle'}></span>
                            </div>
                        );
                        prevScrollSensor = sensor.position;
                    } else if (sensor.position === selectedSensor?.sensor.position && isDangered === false) {
                        items.push(
                            <div ref={element} className="VOCList Active activeBack" key={sensor.zoneID}>
                                <span className={'VOCSIconAct'}></span>
                                <span className={'activeBlue'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                <span className={'sensorIconActive'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'grayCircle'}></span>
                            </div>
                        );
                        prevScrollSensor = sensor.position;
                    } else {
                        if (actSensorNum === 0) {
                            items.push(
                                <div className="VOCList Gray" key={sensor.zoneID}>
                                    <span className={'VOCSIcon'}></span>
                                    <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    {/* <SensorIconActive></SensorIconActive> */}
                                    <span className={'sensorIconDisable'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'grayCircle'}></span>
                                </div>
                            );
                        } else {
                            if (isDangered) {
                                items.push(
                                    <div className="VOCList Red" key={sensor.zoneID}>
                                        <span className={'VOCSIconAlarm'}></span>
                                        <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                        <span className={'sensorIconActive'}></span>
                                        <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                        <span className={'redCircle'}></span>
                                    </div>
                                );
                            } else {
                                items.push(
                                    <div className="VOCList Blue" key={sensor.zoneID}>
                                        <span className={'VOCSIcon'}></span>
                                        <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                        <span className={'sensorIconActive'}></span>
                                        <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                        <span className={'grayCircle'}></span>
                                    </div>
                                )
                            }
                        }
                    }
                } else {
                    if (actSensorNum === 0) {
                        items.push(
                            <div className="VOCList Gray" key={sensor.zoneID}>
                                <span className={'VOCSIcon'}></span>
                                <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                {/* <SensorIconActive></SensorIconActive> */}
                                <span className={'sensorIconDisable'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'grayCircle'}></span>
                            </div>
                        );
                    } else {
                        if (isDangered) {
                            items.push(
                                <div className="VOCList Red" key={sensor.zoneID}>
                                    <span className={'VOCSIconAlarm'}></span>
                                    <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    <span className={'sensorIconActive'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'redCircle'}></span>
                                </div>
                            );
                        } else {
                            items.push(
                                <div className="VOCList Blue" key={sensor.zoneID}>
                                    <span className={'VOCSIcon'}></span>
                                    <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    {/* <SensorIconActive></SensorIconActive> */}
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
            if (openStatus === StatusInfo.VocType)
                return true;
            else
                return false;
        } else {
            return false;
        }
    }

    return (
        <>
            <VOCAccordionComponent style={{ position: 'relative' }}>
                <div className={'sensorForm'} onClick={handleClick}>
                    {/* <SensorStatisticsIcon></SensorStatisticsIcon> */}
                    <span>{title}</span>
                    <div className={'sensorNum'}>{sensorNum}</div>
                    {open ?
                        <div className={'arrowUpIcon'}></div> :
                        <div className={'arrowDownIcon'}></div>
                    }
                </div>
                <VOCWrapper $open={getOpenStatus()}>
                    {
                        getSensorElements(sensors)
                    
                    /*<div className="activeBox">
                        <FactoryIcon></FactoryIcon>
                        <span className="active">도성 간이양로원</span>
                        <SensorIconActive></SensorIconActive>
                        <p style={{ width: '46px' }}>3/3</p>
                        <RedCircle></RedCircle>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span>삼일동주민센터</span>
                        <SensorIconDisable></SensorIconDisable>
                        <p style={{ width: '46px' }}>1/3</p>
                        <GrayCircle></GrayCircle>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span>대포3구회관</span>
                        <SensorIconDisable></SensorIconDisable>
                        <p style={{ width: '46px' }}>1/3</p>
                        <GrayCircle></GrayCircle>
                    </div> */}
                </VOCWrapper>
            </VOCAccordionComponent>
            
            {/* <div style={{ position: 'absolute', top: '500px', left: '400px' }}>
                {
                    isSelected && selectedSensor && <VOCInfo sensor={selectedSensor} />
                }
            </div> */}
        </>
    );
};

VOCAccordion.defaultProps = {
    title: 'VOC',
    btnText: '      >>'
};

export default VOCAccordion;
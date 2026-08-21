import React, { useEffect, useState, useRef } from 'react';
import './../../../SDMS/css/popup.css';

import styled from 'styled-components';
import { BacteriaAccordionComponent, BacteriaWrapper } from './../../sdmsStyled';
import StatusInfo from './statusInfo';

//import BacteriaPopup from './BacteriaPopup';
import SdmsResource from '../../resource/id';


// 이전 State값 저장 
function usePrevState(state) {
    const ref = useRef();
    useEffect(() => {
        ref.current = state;
    }, [state]);

    return ref.current;
}

const BacteriaAccordion = ({ title, btnText, sensors, openStatus, isSelected, selectedSensor, selectSensor, selectedAlarm, isSameAlarm, isSameAlarmTrue, onClick360, materialLinks, searchText, testParam }) => {
    const [open, setOpen] = useState(false);
    const [sensorNum, setSensorNum] = useState(0);

    const prevAlarm = usePrevState(selectedAlarm);
    const prevSensor = usePrevState(selectedSensor);

    let prevScrollSensor = null;

    // 선택된 알람센서로 자동 스크롤
    const element = useRef(null);

    const scrollToElement = () => element.current?.scrollIntoView({ behavier: 'smooth', block: 'start' });

    useEffect(() => {
        if (openStatus !== StatusInfo.BacterialType) {
            setOpen(false);
        }
    }, [openStatus]);

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

    }, [selectedSensor]);

    useEffect(() => {
        if (sensors) {
            setSensorNum(sensors.length);
        }

        // selectedAlarm이 변경될때 selectedSensor변경
        if (selectedAlarm) {
            if (selectedAlarm !== prevAlarm && selectedAlarm.isAlarm === true) {
                setOpen(true);

                for (let i = 0; i < sensors?.length; i++) {
                    const alarmSensor = sensors[i];

                    if (alarmSensor.zoneID === selectedAlarm.zoneID) {

                        scrollToElement();

                        if (selectedSensor !== prevSensor) {
                            selectSensor(StatusInfo.BacterialType, alarmSensor, openStatus);
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

                        selectSensor(StatusInfo.BacterialType, alarmSensor, openStatus);
                    }
                }
            }
        }
    }, [selectedAlarm]);

    const handleClick = () => {
        const opened = !getOpenStatus();
        setOpen(opened);

        if (opened) {
            selectSensor(StatusInfo.BacterialType, selectedSensor);
        }
        else {

            selectedSensor = null;

            selectSensor(null, selectedSensor);

        }
    };

    const sensorClick = (sensor) => {
        setOpen(true);
        selectSensor(StatusInfo.BacterialType, sensor, StatusInfo.BacterialType);
    }

    const isDanger = (sensor) => {
        const indiSensors = sensor.sensors;

        for (const _sensor of indiSensors) {

            const key = _sensor.sensorType;
            const thresholds = SdmsResource.thresholds;

            for (const materialLink of materialLinks) {
                if (materialLink.materialID === _sensor.sensorType) {
                    const direction = materialLink.direction;

                    const min1 = materialLink.min1;
                    const max1 = materialLink.max1;
                    const min2 = materialLink.min2;
                    const max2 = materialLink.max2;

                    if (min1 === null && max1 === null && min2 === null && max2 === null) {
                        continue;
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

    const getSensorElements = (sensors) => {
        const items = [];

        if (sensors) {
            for (const sensor of sensors) {
                if (searchText) {
                    let sensorPosition = sensor.position;

                    if (!sensorPosition.includes(searchText)) {
                        continue;
                    }
                }

                let isDangered = isDanger(sensor);

                const sensorNum = sensor.sensors.length - 4;

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
                            <div ref={element} className="BacterialList Active activeBack" key={sensor.zoneID}>
                                <span className={'C360IconAlarm'}></span>
                                <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                <span className={'sensorIconActive'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'redCircle'}></span>
                            </div>
                        );
                        prevScrollSensor = sensor.position;
                    } else if (sensor.position === selectedSensor?.sensor.position && isDangered === false) {
                        items.push(
                            <div ref={element} className="BacterialList Active activeBack" key={sensor.zoneID}>
                                <span className={'C360IconAct'}></span>
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
                                <div className="BacterialList Gray" key={sensor.zoneID}>
                                    <span className={'C360Icon'}></span>
                                    <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    <span className={'sensorIconDisable'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'grayCircle'}></span>
                                </div>
                            );
                        } else {
                            if (isDangered) {
                                items.push(
                                    <div className="BacterialList Red" key={sensor.zoneID}>
                                        <span className={'C360IconAlarm'}></span>
                                        <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                        {/* <SensorIconDisable></SensorIconDisable> */}
                                        <span className={'sensorIconActive'}></span>
                                        <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                        <span className={'redCircle'}></span>
                                    </div>
                                );
                            } else {
                                items.push(
                                    <div className="BacterialList Blue" key={sensor.zoneID}>
                                        <span className={'C360Icon'}></span>
                                        <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
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
                            <div className="BacterialList Gray" key={sensor.zoneID}>
                                <span className={'C360Icon'}></span>
                                <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                <span className={'sensorIconDisable'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'grayCircle'}></span>
                            </div>
                        );
                    } else {
                        if (isDangered) {
                            items.push(
                                <div className="BacterialList Red" key={sensor.zoneID}>
                                    <span className={'C360IconAlarm'}></span>
                                    <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    {/* <SensorIconDisable></SensorIconDisable> */}
                                    <span className={'sensorIconActive'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'redCircle'}></span>
                                </div>
                            );
                        } else {
                            items.push(
                                <div className="BacterialList Blue" key={sensor.zoneID}>
                                    <span className={'C360Icon'}></span>
                                    <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
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
            if (openStatus === StatusInfo.BacterialType)
                return true;
            else
                return false;
        } else {
            return false;
        }
    }

    return (
        <>
            <BacteriaAccordionComponent style={{ position: 'relative' }}>
                <div className={'sensorForm'} onClick={handleClick}>
                    {/* <SensorBacterIcon></SensorBacterIcon> */}
                    <span>{title}</span>
                    <div className={'sensorNum'}>{sensorNum}</div>
                    {open ?
                        <div className={'arrowUpIcon'}></div> :
                        <div className={'arrowDownIcon'}></div>
                    }
                </div>
                <BacteriaWrapper $open={getOpenStatus()}>
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
                    </div>*/}
                </BacteriaWrapper>
            </BacteriaAccordionComponent>
        </>
    );
};

BacteriaAccordion.defaultProps = {
    title: '악취',
    btnText: '      >>'
};

export default BacteriaAccordion;
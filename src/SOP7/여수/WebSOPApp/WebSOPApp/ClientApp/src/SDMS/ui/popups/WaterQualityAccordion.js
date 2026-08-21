import React, { useEffect, useRef, useState } from 'react';
import './../../../SDMS/css/popup.css';

import { WaterQualityAccordionComponent, WaterQualityWrapper } from './../../sdmsStyled';
import StatusInfo from './statusInfo';



function usePrevState(state) {
    const ref = useRef();
    useEffect(() => {
        ref.current = state;
    }, [state]);

    return ref.current;
}

const WaterQualityAccordion = ({ title, btnText, sensors, openStatus, isSelected, selectedSensor, selectSensor, selectedAlarm, isSameAlarm, isSameAlarmTrue,onClick360, materialLinks, searchText, testParam }) => {
    const [open, setOpen] = useState(false);
    const [sensorNum, setSensorNum] = useState(0);

    let isSelectedAlarm = false;

    const prevAlarm = usePrevState(selectedAlarm);
    const prevSensor = usePrevState(selectedSensor);

    let prevScrollSensor = null;

    // 선택된 알람센서로 자동 스크롤
    const element = useRef(null);

    const scrollToElement = () => element.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    useEffect(() => {
        if (sensors) {
            setSensorNum(sensors.length);
        }
    }, [sensors]);

    useEffect(() => {
        if (openStatus !== StatusInfo.WaterType) {
            setOpen(false);
        }
    }, [openStatus])

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
        if (selectedAlarm) {
            if (selectedAlarm !== prevAlarm && selectedAlarm.isAlarm) {

                setOpen(true);
                
                for (let i = 0; i < sensors?.length; i++) {
                    const alarmSensor = sensors[i];

                    if (alarmSensor.zoneID === selectedAlarm.zoneID) {

                        scrollToElement();

                        selectSensor(StatusInfo.WaterType, alarmSensor, openStatus);

                    }
                }
            }
        }
    }, []);

    useEffect(() => {

        isSelectedAlarm = true;

        if (selectedAlarm) {
            if (selectedAlarm !== prevAlarm) { // && selectedAlarm.isAlarm

                for (let i = 0; i < sensors?.length; i++) {
                    const alarmSensor = sensors[i];

                    if (alarmSensor.zoneID === selectedAlarm.zoneID) {

                        setOpen(true);

                        scrollToElement();

                        if (isSelectedAlarm) {
                            selectSensor(StatusInfo.WaterType, alarmSensor, openStatus);
                        }
                    }
                }
            }
        }
    }, [selectedAlarm]);

    const handleClick = () => {
        const opened = !getOpenStatus();
        setOpen(opened);

        if (opened) {
            selectSensor(StatusInfo.WaterType, selectedSensor);
        }
        else {

            selectedSensor = null;

            selectSensor(null, selectedSensor);

        }
    };

    const sensorClick = (sensor) => {

        isSelectedAlarm = false;

        setOpen(true);
        scrollToElement();
        if (!isSelectedAlarm) {
            selectSensor(StatusInfo.WaterType, sensor, StatusInfo.WaterType);
        }
    }

    const isDanger = (sensor) => {
        
        const indiSensors = sensor.sensors;

        let sensorValue = null;

        for (const _sensor of indiSensors) {
            // 4단계만 사용
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

                const sensorNum = sensor.sensors.length;

                let actSensorNum = 0;

                for (const _sensor of sensor.sensors) {
                    if (_sensor.enabled) {
                        actSensorNum += 1;
                    }
                }

                if (actSensorNum === 0) {
                    isDangered = false;
                }

                //if (isSelected) {
                if (selectedSensor) {  
                    if (sensor.position === selectedSensor?.sensor.position && isDangered === true) {
                        items.push(
                            <div ref={element} className="WaterList Active activeBack" key={sensor.zoneID}>
                                <span className={'C360IconAlarm'} onClick={() => onClick360(sensor)}></span>
                                <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                <span className={'sensorIconActive'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'redCircle'}></span>
                            </div>
                        );
                        prevScrollSensor = sensor.position;
                    } else if (sensor.position === selectedSensor?.sensor.position && isDangered === false) {
                        items.push(
                            <div ref={element} className="WaterList Active activeBack" key={sensor.zoneID}>
                                <span className={'C360IconAct'} onClick={() => onClick360(sensor)}></span>
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
                                <div className="WaterList Gray" key={sensor.zoneID}>
                                    <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                    <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    <span className={'sensorIconDisable'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'grayCircle'}></span>
                                </div>
                            );
                        } else {
                            if (isDangered) {
                                items.push(
                                    <div className="WaterList Red" key={sensor.zoneID}>
                                        <span className={'C360IconAlarm'} onClick={() => onClick360(sensor)}></span>
                                        <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                        {/* <SensorIconDisable></SensorIconDisable> */}
                                        <span className={'sensorIconActive'}></span>
                                        <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                        <span className={'redCircle'}></span>
                                    </div>
                                );
                            } else {
                                items.push(
                                    <div className="WaterList Blue" key={sensor.zoneID}>
                                        <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
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
                            <div className="WaterList Gray" key={sensor.zoneID}>
                                <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                <span className={'sensorIconDisable'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'grayCircle'}></span>
                            </div>
                        );
                    } else {
                        if (isDangered) {
                            items.push(
                                <div className="WaterList Red" key={sensor.zoneID}>
                                    <span className={'C360IconAlarm'} onClick={() => onClick360(sensor)}></span>
                                    <span className={'activeRed'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    {/* <SensorIconDisable></SensorIconDisable> */}
                                    <span className={'sensorIconActive'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'redCircle'}></span>
                                </div>
                            );
                        } else {
                            items.push(
                                <div className="WaterList Blue" key={sensor.zoneID}>
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
            if (openStatus === StatusInfo.WaterType) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

        return open;
    }

    return (
        <>
            <WaterQualityAccordionComponent>
                <div className={'sensorForm'} onClick={handleClick}>
                    {/* <SensorWaterIcon></SensorWaterIcon> */}
                    <span>{title}</span>
                    <div className={'sensorNum'}>{sensorNum}</div>
                    {open ?
                        <div className={'arrowUpIcon'}></div> :
                        <div className={'arrowDownIcon'}></div>
                    }
                </div>
                <WaterQualityWrapper $open={getOpenStatus()}>
                    {
                        getSensorElements(sensors)
                    }
                </WaterQualityWrapper>
            </WaterQualityAccordionComponent>
        </>
    );
};

WaterQualityAccordion.defaultProps = {
    title: '수질',
    btnText: '      >>'
};

export default WaterQualityAccordion;

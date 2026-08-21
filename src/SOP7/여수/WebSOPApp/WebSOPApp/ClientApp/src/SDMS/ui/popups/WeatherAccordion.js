import React, { useEffect, useState } from 'react';
import './../../../SDMS/css/popup.css';

import styled from 'styled-components';
import { WeatherAccordionComponent, WeatherWrapper } from './../../sdmsStyled';
import StatusInfo from './statusInfo';

import WeatherPopup from './weatherPopup';
import SdmsResource from '../../resource/id';



const WeatherAccordion = ({ title, btnText, sensors, openStatus, isSelected, selectedSensor, selectSensor, searchText, onClick360 }) => {
    const [open, setOpen] = useState(false);
    //const [selectedSensor, setSelectedSensor] = useState(null);

    const [sensorNum, setSensorNum] = useState(0);

    useEffect(() => {
        if (sensors) {
            setSensorNum(sensors.length);
        }
    }, [sensors]);

    useEffect(() => {
        if (openStatus !== StatusInfo.WeatherType) {
            setOpen(false);
        }
    }, [openStatus])

    const handleClick = () => {
        const opened = !getOpenStatus();
        setOpen(opened);

        if (opened) {
            selectSensor(StatusInfo.WeatherType, selectedSensor);
        }
        else {
            selectedSensor = null;

            selectSensor(null, selectedSensor);
        }
    };

    const sensorClick = (sensor) => {
        setOpen(true);
        //setSelectedSensor(sensor);
        selectSensor(StatusInfo.WeatherType, sensor, StatusInfo.WeatherType);
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

                const sensorNum = sensor.sensors.length - 1; // 날씨 상태값 제외

                let actSensorNum = 0;

                for (const _sensor of sensor.sensors) {

                    if (_sensor.sensorType === SdmsResource.materialType.Temp) {
                        continue;
                    }
                    
                    if (_sensor.enabled) {
                        actSensorNum += 1;
                    }
                }

                if (isSelected) {
                    if (selectedSensor) {
                        if (sensor.position === selectedSensor?.sensor.position) {
                            items.push(
                                <div className="WeatherList activeBox activeBack" key={sensor.zoneID}>
                                    <span className={'C360IconAct'} onClick={() => onClick360(sensor)}></span>
                                    <span className={'activeBlue'} onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    <span className={'sensorIconActive'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'blueCircle'}></span>
                                </div>
                            );
                        } else {
                            if (actSensorNum === 0) {
                                items.push(
                                    <div className="WeatherList" key={sensor.zoneID}>
                                        <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                        <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                        <span className={'sensorIconDisable'}></span>
                                        <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                        <span className={'grayCircle'}></span>
                                    </div>
                                );
                            } else {
                                items.push(
                                    <div className="WeatherList" key={sensor.zoneID}>
                                        {/* <C360IconAct></C360IconAct> */}
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
                    } else {
                        if (actSensorNum === 0) {
                            items.push(
                                <div className="WeatherList" key={sensor.zoneID}>
                                    <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                    <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                    <span className={'sensorIconDisable'}></span>
                                    <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                    <span className={'grayCircle'}></span>
                                </div>
                            );
                        } else {
                            items.push(
                                <div className="WeatherList" key={sensor.zoneID}>
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
                } else {
                    if (actSensorNum === 0) {
                        items.push(
                            <div className="WeatherList" key={sensor.zoneID}>
                                <span className={'C360Icon'} onClick={() => onClick360(sensor)}></span>
                                <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                                <span className={'sensorIconDisable'}></span>
                                <p style={{ width: '46px' }}>{actSensorNum}/{sensorNum}</p>
                                <span className={'grayCircle'}></span>
                            </div>
                        );
                    } else {
                        items.push(
                            <div className="WeatherList" key={sensor.zoneID}>
                                {/* <C360Icon></C360Icon> */}
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
        }

        return items;
    }

    const getOpenStatus = () => {
        if (openStatus) {
            if ((StatusInfo.WeatherType & openStatus) === StatusInfo.WeatherType) {
                return true;
            }
            else {
                return false;
            }
                
        }

        //return open;
    }

    return (
        <>
            <WeatherAccordionComponent style={{ position: 'relative' }}>
                <div className={'sensorForm'} onClick={handleClick}>
                    {/* <SensorWeatherIcon></SensorWeatherIcon> */}
                    <span>{title}</span>
                    <div className={'sensorNum'}>{sensorNum}</div>
                    {open ?
                        <div className={'arrowUpIcon'}></div> :
                        <div className={'arrowDownIcon'}></div>
                    }
                </div>
                <WeatherWrapper $open={getOpenStatus()}>
                    {
                        getSensorElements(sensors)
                    /*<div>
                        <FactoryIcon></FactoryIcon>
                        <span className="active">화치배수장</span>
                        <p style={{ width: '46px' }}><BlueCircle></BlueCircle>ON</p>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span>대림산업 여수공장앞</span>
                        <p style={{ width: '46px' }}><BlueCircle></BlueCircle>ON</p>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span>여수소방서 화학119구조대 옥상</span>
                        <p style={{ width: '46px' }}><GrayCircle></GrayCircle>OFF</p>
                    </div>*/
                    }
                </WeatherWrapper>
            </WeatherAccordionComponent>

            {/* 
            <div style={{ position: 'absolute', top: '600px', left: '400px' }}>
            {
               isSelected && selectedSensor && <WeatherPopup sensor={selectedSensor} /> 
            }
            </div>
            */}
        </>
    );
};

WeatherAccordion.defaultProps = {
    title: '기상',
    btnText: '      >>'
};

export default WeatherAccordion;

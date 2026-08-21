import React, { useEffect, useState } from 'react';
import './../../../SDMS/css/popup.css';

import styled from 'styled-components';
import { ArrowDownIcon } from "./../../styled";
import { ArrowUpIcon } from "./../../styled";
import { SensorForm, SensorCCTVIcon, SensorNum } from "./../../styled";
import { SensorIconActive } from "./../../styled";
import { SensorIconDisable } from "./../../styled";
import { BlueCircle } from "./../../styled";
import { RedCircle } from "./../../styled";
import { GrayCircle } from "./../../styled";
import { C360Icon, C360IconAct } from "./../../styled";
import StatusInfo from './statusInfo';

import CCTVPopup from './cctvPopup';


const AccordionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: var(--Secondary-color-dark);
    border-radius: 5px;
    height: auto;
    /* padding: 2%; */
    transition: all 0.5s ease-in-out;
    color: #fff;
    /* width: 343px; */
    border:solid 1px #FFFFFF7D;
    margin-bottom:10px;
`;

const InternalWrapper = styled.div`
    width: 100%;
    max-height: ${(props) => (props.open ? '108px' : '0')};
    transition: all 0.5s ease-in-out;
    /* background-color: #4d4d4d6e; */
    /* overflow: hidden; */
    overflow-y:scroll;
    &::-webkit-scrollbar {
        width: 2px;
        border-radius: 2px;
        background-color: #666666;
    }
    &::-webkit-scrollbar-thumb {
        width: 2px;
        border-radius: 2px;
        background: #ffffff; /* #19A5FF; */ 
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
    color: #fff;
    > div {
        display:flex;
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-size: 11px;
        font-family: Pretendard;
        font-weight: 100;
        text-align: left;
        /* background-color: #4d4d4d6e; */
        padding-left: 10px;
        margin:0;
        border-bottom: 0.5px dashed #666666;
        align-items: center;
        padding-right: 14px;
    }
    > div > span{
        /* margin-right: 80px; */ 
        width: 100%;
        font-weight: 300;
        font-family: Pretendard;
    }
    > div > span.active{
        /* color:#19A5FF; */
        color: #FF5A5A;
       font-weight: 300;
       font-family: Pretendard;
    }
    > div:hover{
       background-color: #4d4d4d6e;
    }
`;



const CCTVAccordion = ({ title, btnText, sensors, openStatus, isSelected, selectedSensor, selectSensor }) => {
    const [open, setOpen] = useState(false);
    const [sensorNum, setSensorNum] = useState(0);

    useEffect(() => {
        if (openStatus !== StatusInfo.CCTVType) {
            setOpen(false);
        }
    }, [openStatus])

    useEffect(() => {
        if (sensors) {
            setSensorNum(sensors.length);
        }
    }, []);

    const handleClick = () => {
        const opened = !getOpenStatus();
        setOpen(opened);

        if (opened)
            selectSensor(StatusInfo.CCTVType, selectedSensor, StatusInfo.AtmosphereType);
        else
            selectSensor(null, selectedSensor);
    };

    const sensorClick = (sensor) => {
        setOpen(true);
        selectSensor(StatusInfo.CCTVType, sensor);
    }

    const getSensorElements = (sensors) => {
        const items = [];

        if (sensors) {
            for (const sensor of sensors) {
                if (isSelected && sensor === selectedSensor) {
                    items.push(
                        <div className="CCTVList activeBox">
                            <C360IconAct></C360IconAct>
                            <span className="active" onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                            {/* <div>{modalOpen && <AtmospherePopup/>}</div> */}
                            <SensorIconActive></SensorIconActive>
                            <p style={{ width: '46px' }}>3/3</p>
                            <RedCircle></RedCircle>
                        </div>
                    );
                }
                else {
                    items.push(
                        <div className="CCTVList">
                            <C360Icon></C360Icon>
                            <span onClick={() => sensorClick(sensor)}>{sensor.position}</span>
                            <SensorIconDisable></SensorIconDisable>
                            <p style={{ width: '46px' }}>1/3</p>
                            <GrayCircle></GrayCircle>
                        </div>
                    );
                }
            }
        }
        return items;
    }

    const getOpenStatus = () => {
        if (openStatus) {
            if ((StatusInfo.CCTVType & openStatus) === StatusInfo.CCTVType)
                return true;
            else
                return false;
        }

        return open;
    }

    return (
        <>
            <AccordionWrapper style={{ position: 'relative' }}>
                {/*<SensorForm onClick={handleClick}>*/}
                <SensorForm>
                    {/* <SensorCCTVIcon></SensorCCTVIcon> */}
                    <span>{title}</span>
                    <SensorNum>{sensorNum}</SensorNum>
                    {open ?
                        <ArrowUpIcon></ArrowUpIcon> :
                        <ArrowDownIcon></ArrowDownIcon>
                    }
                </SensorForm>
                <InternalWrapper open={getOpenStatus()}>
                    {
                        getSensorElements(sensors)
                    /*<div className="activeBox">
                        <FactoryIcon></FactoryIcon>
                        <span className="active">여수국가산단전망대</span>
                        <SensorIconActive></SensorIconActive>
                        <p style={{ width: '46px' }}>3/3</p>
                        <RedCircle></RedCircle>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span>흥국사역 옥상</span>
                        <SensorIconDisable></SensorIconDisable>
                        <p style={{ width: '46px' }}>1/3</p>
                        <GrayCircle></GrayCircle>
                    </div>
                    <div>
                        <FactoryIcon></FactoryIcon>
                        <span>여수소방서 화학119구조대 옥상</span>
                        <SensorIconDisable></SensorIconDisable>
                        <p style={{ width: '46px' }}>1/3</p>
                        <GrayCircle></GrayCircle>
                    </div> */}
                </InternalWrapper>
            </AccordionWrapper>

            <div style={{ position: 'absolute', top: '600px', left: '400px' }}>
                {
                    isSelected && selectedSensor && <CCTVPopup sensor={selectedSensor} />
                }
            </div>
        </>
    );
};

CCTVAccordion.defaultProps = {
    title: 'CCTV',
    btnText: '      >>'
};

export default CCTVAccordion;

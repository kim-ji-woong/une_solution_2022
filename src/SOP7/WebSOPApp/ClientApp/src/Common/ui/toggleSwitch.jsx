import React from 'react';
import styled from 'styled-components';

export default function ToggleSwitch({ left, right, leftcolor, rightcolor, leftbgcolor, rightbgcolor, circleColor, setChecked, isChecked, sensor, sensorName, disabled }) {

    const handleChecked = () => {
        const checked = isChecked === false ? false : true;
        const type = getSensorType(sensorName);

        setChecked(!checked, sensor, type);
    }

    const getSensorType = (sensor) => {
        let type = null;

        switch(sensor)
        {
            case 'fireSensors' : type = 'fire'; break;
            case 'emergencyBellSensors' : type = 'etc'; break;
            case 'cctvs' : type = 'cctv'; break;
        }

        return type;
    }

    return (
        <Wrapper>
            <CheckBox
                $left={left}
                $right={right}
                $leftcolor={leftcolor}
                $rightcolor={rightcolor}
                $leftbgcolor={leftbgcolor}
                $rightbgcolor={rightbgcolor}
                $circleColor={circleColor}
                $pointer={disabled}
                onChange={() => handleChecked()}
                type="checkbox"
                checked={isChecked === false ? false : true}
                disabled={disabled}
            />
        </Wrapper>
    );
}


// css
const Wrapper = styled.div`
    justify-content: center;
    align-items: center;
    /* display: flex; */
    z-index: 0;
`;

const CheckBox = styled.input`
    width: 46px !important;
    height: 16px !important;
    background: ${(props) => props.$leftbgcolor ?? '#272E42'};
    border-radius: 13px !important;
    border: 0 !important;
    cursor: ${(props) => props.$pointer ? "default" : "pointer"} !important;

    &:disabled {
        background-color: ${(props) => props.$leftbgcolor ?? '#272E42'} !important;
    }

    /* OFF 텍스트 */
    &::before {
        position: absolute;
        content: '${(props) => props.$left ?? 'OFF'}';
        padding-left: 2px;
        /* width: 46px; */
        height: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: ${(props) => props.$leftcolor ?? '#7D7E84'};
        background: #272E42;
        font-weight: 700;
        font-size: 10px;
        left: 22px;

        /* 텍스트 트랜지션 */
        transition: all 0.2s ease-in-out;
    }

    /* OFF 원 */
    &::after {
        position: relative;
        content: '';
        display: block;
        width: 22px;
        height: 22px;
        top: -3px;
        left: 0px;
        border-radius: 50%;
        background: ${(props) => props.circleColor ?? '#fff'};

        /* 원 이동 트랜지션 */
        transition: all 0.2s ease-in-out;
    }

    &:checked {
        width: 46px !important;
        height: 16px !important;
        border-radius: 13px !important;
        border: 0 !important;
        background: ${(props) => props.$rightbgcolor ?? '#272E42'}!important;

        /* 배경색 변경 트랜지션 */
        transition: all 0.2s ease-in-out;

        /* ON 텍스트 */
        &::before {
            position: absolute;
            content: '${(props) => props.$right ?? 'ON'}';
            align-items: center;
            justify-content: flex-end;
            color: ${(props) => props.$rightcolor ?? '#7D7E84'};
            left: 4px;
        }

        /* ON 원 */
        &::after {
            content: '';
            z-index: 2;
            width: 22px;
            height: 22px;
            top: -3px;
            left: 24px;
            display: block;
            border-radius: 50%;
            background: ${(props) => props.circleColor ?? '#5398FF'};
            position: relative;
        }
    }
`;
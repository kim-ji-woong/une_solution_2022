import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Stick } from "../../styled";
import { Text } from "../../styled";
import { ArrowDownIcon } from "../../styled";
import { DisasterForm } from "../../styled";


const AccordionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: var(--Secondary-color-dark);
    border-radius: 10px;
    height: auto;
    /* padding: 2%; */
    text-align: center;
    transition: all 0.6s ease-in-out;
    color: #fff;
    width: 300px;
`;


const InternalWrapper = styled.div`
    width: 100%;
    max-height: ${(props) => (props.open ? '600px' : '0')};
    transition: all 1s ease-in-out;
    overflow: hidden;
    color: #fff;
    > p {
        font-size: 14px;
        text-align: left;
        padding: 16px 50px;
        font-family:  'Pretendard';
    }
    &:hover{
        background: #225789;
    }
`;


const SensorHistoryAccordion = ({ title, subTitle, btnText }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <AccordionWrapper>
            <DisasterForm>
                <Stick></Stick>
                <Text><Link to="/historyYeosu">{title}</Link></Text>
            </DisasterForm>
            <InternalWrapper open={open}>
                <p>전체</p>
                <p>자연재해</p>
                <p>화재</p>
                <p>누출사고</p>
                <p>테러</p>
                <p>인명구조 및 의료지원</p>
                <p>기타</p>
                <p>폭발</p>
            </InternalWrapper>
        </AccordionWrapper>
    );
};

SensorHistoryAccordion.defaultProps = {
    title: '센서탐지 이력',
    subTitle: 'subtitle',
    btnText: '      >>'
};

export default SensorHistoryAccordion;


import React, { useState } from 'react';
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


const SOPInfoAccordion = ({ title, subTitle, btnText }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <AccordionWrapper>
            <DisasterForm>
                <Stick></Stick>
                <Text>{title}</Text>
                <ArrowDownIcon onClick={handleClick}></ArrowDownIcon>
            </DisasterForm>
            <InternalWrapper open={open}>
                <p>위치 :</p>
                <p>발생시간 :</p>
                <p>감지센서 : 수동</p>
                <p>유형 : 기상특보</p>
                <p>단계 : 심각</p>
            </InternalWrapper>
        </AccordionWrapper>
    );
};


SOPInfoAccordion.defaultProps = {
    title: 'SOP 정보',
    subTitle: 'subtitle',
    btnText: '      >>'
};

export default SOPInfoAccordion;
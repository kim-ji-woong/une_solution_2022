
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
    }
    &:hover{
        background: #225789;
    }
`;


const InternalWrapper2 = styled.div`
    width: 100%;
    max-height: ${(props) => (props.open ? '600px' : '0')};
    transition: all 1s ease-in-out;
    overflow: hidden;
    color: #fff;
    > p {
        font-size: 14px;
        text-align: left;
        padding: 16px 50px;
    }
    &:hover{
        background: #225789;
    }
`;

const InternalWrapper3 = styled.div`
    width: 100%;
    max-height: ${(props) => (props.open ? '600px' : '0')};
    transition: all 1s ease-in-out;
    overflow: hidden;
    color: #fff;
    > p {
        font-size: 14px;
        text-align: left;
        padding: 16px 50px;
    }
    &:hover{
        background: #225789;
    }
`;



const SOPAccordion = ({ title, subTitle, btnText }) => {
    const [open, open2, open3, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    const handleClick2 = () => {
        setOpen(!open2);
    };

    const handleClick3 = () => {
        setOpen(!open3);
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

            <DisasterForm>
                <Stick></Stick>
                <Text>SOP 진행내역</Text>
                <ArrowDownIcon onClick={handleClick2}></ArrowDownIcon>
            </DisasterForm>
            <InternalWrapper2 open={open}>
                <p>위치 :</p>
                <p>발생시간 :</p>
                <p>감지센서 : 수동</p>
                <p>유형 : 기상특보</p>
                <p>단계 : 심각</p>
            </InternalWrapper2>

            <DisasterForm>
                <Stick></Stick>
                <Text>SOP 임무추가</Text>
                <ArrowDownIcon onClick={handleClick3}></ArrowDownIcon>
            </DisasterForm>
            <InternalWrapper3 open={open}>
                <p><input type="checkbox" />기상특보</p>
                <p><input type="checkbox" />건물화재</p>
                <p><input type="checkbox" />화재_자동</p>
                <p><input type="checkbox" />화재_수동</p>
                <p><input type="checkbox" />누출_수동</p>
                <p><input type="checkbox" />누출_자동</p>
                <p><input type="checkbox" />안전사고_자동</p>
            </InternalWrapper3>
        </AccordionWrapper>
    );
};


SOPAccordion.defaultProps = {
    title: 'SOP 정보',
    subTitle: 'subtitle',
    btnText: '      >>'
};

export default SOPAccordion;
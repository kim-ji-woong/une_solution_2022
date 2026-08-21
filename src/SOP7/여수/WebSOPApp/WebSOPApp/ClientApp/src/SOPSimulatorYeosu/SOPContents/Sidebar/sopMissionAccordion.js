import React, { useState } from 'react';
import styled from 'styled-components';

import { Stick } from "../../styled";
import { Text } from "../../styled";
import { ArrowDownIcon } from "../../styled";
import { DisasterForm } from "../../styled";
import { SopMissonBox } from "../../styled";


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
       /* background: #225789; */
    }
`;


const SOPMissionAccordion = ({ title, subTitle, btnText }) => {
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
               <SopMissonBox style={{ display: 'flex' }}>
                  <span className="missonFirst">1</span>
                  <div className="missonSecond">
                    <span>안전사고 프로세스 실행</span>
                    <span>08:26:06</span>
                  </div>
                  <span className="missonThird">확인</span>
                </SopMissonBox>
                <SopMissonBox style={{ display: 'flex' }}>
                    <span className="missonFirst">2</span>
                    <div className="missonSecond">
                        <span>상황접수</span>
                        <span>08:26:06</span>
                    </div>
                    <span className="missonThird">확인</span>
                </SopMissonBox>
                <SopMissonBox style={{ display: 'flex' }}>
                    <span className="missonFirst">3</span>
                    <div className="missonSecond">
                        <span>안전사고 프로세스 실행</span>
                        <span>08:26:06</span>
                    </div>
                    <span className="missonThird">확인</span>
                </SopMissonBox>
                <SopMissonBox style={{ display: 'flex' }}>
                    <span className="missonFirst">4</span>
                    <div className="missonSecond">
                        <span>종료</span>
                        <span>08:26:06</span>
                    </div>
                    <span className="missonThird">실행중</span>
                </SopMissonBox>
            </InternalWrapper>
        </AccordionWrapper>
    );
};


SOPMissionAccordion.defaultProps = {
    title: 'SOP 진행 내역',
    subTitle: 'subtitle',
    btnText: '      >>'
};

export default SOPMissionAccordion;
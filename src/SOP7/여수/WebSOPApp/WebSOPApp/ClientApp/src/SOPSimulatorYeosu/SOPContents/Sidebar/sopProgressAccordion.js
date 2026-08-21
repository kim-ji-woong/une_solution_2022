import React, { useState } from 'react';
import styled from 'styled-components';

import { Stick } from "../../styled";
import { Text } from "../../styled";
import { ArrowDownIcon } from "../../styled";
import { DisasterForm } from "../../styled";

import '../../../SDMS/css/popup.css';


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
    > div {
        font-size: 14px;
        text-align: left;
        padding: 16px 34px;
    }
    > div > p {
        margin-left: 10px;
        font-family:  'Pretendard';
    }
    &:hover{
        background: #225789;
    }
`;


const SOPProgressAccordion = ({ title, subTitle, btnText }) => {
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
                <div className="check_wrap">
                  <input type="checkbox" id="check_btn" />
                  <label htmlFor="check_btn" ></label>
                  <p>기상특보</p>
                </div>
                <div className="check_wrap">
                    <input type="checkbox" id="check_btn2" />
                    <label htmlFor="check_btn2" ></label>
                    <p>건물화재</p>
                </div>
                <div className="check_wrap">
                    <input type="checkbox" id="check_btn3" />
                    <label htmlFor="check_btn3" ></label>
                    <p>화재_자동</p>
                </div>
                <div className="check_wrap">
                    <input type="checkbox" id="check_btn4" />
                    <label htmlFor="check_btn4" ></label>
                    <p>화재_수동</p>
                </div>
                <div className="check_wrap">
                    <input type="checkbox" id="check_btn5" />
                    <label htmlFor="check_btn5" ></label>
                    <p>누출_수동</p>
                </div>
                <div className="check_wrap">
                    <input type="checkbox" id="check_btn6" />
                    <label htmlFor="check_btn6" ></label>
                    <p>누출_자동</p>
                </div>
                <div className="check_wrap">
                    <input type="checkbox" id="check_btn7" />
                    <label htmlFor="check_btn7" ></label>
                    <p>안전사고 자동</p>
                </div>
            </InternalWrapper>
       </AccordionWrapper>
    );
};


SOPProgressAccordion.defaultProps = {
    title: 'SOP 임무 추가',
    subTitle: 'subtitle',
    btnText: '      >>'
};

export default SOPProgressAccordion;
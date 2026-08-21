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
    > span{
        padding: 16px 50px;
    }
    > p {
        font-size: 14px;
        text-align: left;
        /* padding: 16px 50px; */
        font-family:  'Pretendard';
    }
    .addText{
       display: inline-block;
       font-size: 10px;
       line-height: 14px;
       margin-right: 6px;
    }
    .deleteText{
       display: inline-block;
       font-size: 10px;
       line-height: 14px;
    }
    .addText:hover{
       text-decoration: underline;
    }
    .deleteText:hover{
       text-decoration: underline;
    }
    &:hover{
        background: #225789;
    }
`;


const TeamHolidayAccordion = ({ title, subTitle, btnText }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <AccordionWrapper>
            <DisasterForm>
                <Stick></Stick>
                <Text><Link to="/teamYeosu">{title}</Link></Text>
                <ArrowDownIcon /* onClick={handleClick} */></ArrowDownIcon>
            </DisasterForm>
            <InternalWrapper open={open}>
                <span style={{ display: 'flex', width: '100%' }}>
                    <p style={{ display: 'inline-flex', flexGrow: '1' }}>조직명A</p>
                    <span>
                        <p className="addText">추가</p>
                        <p className="deleteText">삭제</p>
                    </span>
                </span>
            </InternalWrapper>
        </AccordionWrapper>
    );
};

TeamHolidayAccordion.defaultProps = {
    title: '휴일 비상조직',
    subTitle: 'subtitle',
    btnText: '      >>'
};

export default TeamHolidayAccordion;
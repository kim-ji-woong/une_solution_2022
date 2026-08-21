import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Stick } from "../../styled";
import { Text } from "../../styled";
import { ArrowDownIcon } from "../../styled";
import { DisasterForm } from "../../styled";

//import content from '../../../Common/css/content.module.css';


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
    max-height: ${(props) => (props.open ? '560px' : '0')};
    transition: all 1s ease-in-out;
    overflow: scroll;
    color: #fff;
    &::-webkit-scrollbar {
        width: 5px;
        border-radius: 2px;
        background-color: #26395B;
    }
    &::-webkit-scrollbar-thumb {
        width: 5px;
        border-radius: 2px;
        background: #19A5FF;  /* 0105 */
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
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
    /* .treeBefore:before{
       display: inline-block;
       background: url('../../../resource/image/sdms/edittool_active.png')no-repeat;
       background-position: center;
       width: 18px;
       height: 18px;
    } */
`;


//const TreeBox = styled.div`
//     display: block;
//     border:dashed 1px red;
//     width: 18px;
//     height: 18px;
//     &:before{
//       display: inline-block;
//       background: url('../../../resource/image/sdms/edittool_active.png')no-repeat;
//       background-position: center;
//       width: 18px;
//       height: 18px;
//    }
//`


const TreeAddIcon = styled.div`
    display: inline-block;
    background: url('../../../resource/image/sdms/edittool_disable.png')no-repeat;
    background-size: 20px;
    background-position: center;
    margin-right: 10px;
    width: 14px;
    height: 14px;
`;


function Tree({ treeData }) {
    return (
        <ul>
            {treeData.map((node) => (
                <TreeNode node={node} key={node.key} />
            ))}
        </ul>
    );
}


function TreeNode({ node }) {
    const { children, label } = node;

    const [showChildren, setShowChildren] = useState(false);

    const handleClick = () => {
        setShowChildren(!showChildren);
    };
    return (
        <>
            <div onClick={handleClick} style={{ display: "block", margin: "30px 40px", textAlign: "left" }}>
                <div style={{ display: "flex"}}>
                    {/* <TreeBox className="treeBefore"></TreeBox> */}
                    <TreeAddIcon></TreeAddIcon>
                    <span style={{ display: "inline-flex", flexGrow: "1", fontSize: "14px" }}>{label}</span>
                    <p style={{ fontSize: "8px", lineHeight: "14px" }}>추가</p>
                    <p style={{ fontSize: "8px", lineHeight: "14px", marginLeft: "6px", textDecoration: "solid 1px #fff" }}>삭제</p>
                </div>
            </div>
            <ul style={{ paddingLeft: "20px" }}>
                {showChildren && <Tree treeData={children} />}
            </ul>
        </>
    );
}


const treeData = [
    {
        key: "0",
        label: "조직명A",
        children: [
            {
                key: "0-0",
                label: "부서명A",
                children: [
                    {
                        key: "0-1-1",
                        label: "팀명",
                    },
                    {
                        key: "0-1-2",
                        label: "팀명",
                    },
                    {
                        key: "0-1-3",
                        label: "팀명",
                    },
                ],
            },
            {
                key: "0-1",
                label: "부서명B",
                children: [
                    {
                        key: "0-1-1",
                        label: "팀명",
                    },
                    {
                        key: "0-1-2",
                        label: "팀명",
                    },
                    {
                        key: "0-1-3",
                        label: "팀명",
                    },
                ],
            },
        ],
    },
    {
        key: "1",
        label: "조직명B",
        children: [
            {
                key: "1-0",
                label: "부서명A",
                children: [
                    {
                        key: "1-1-1",
                        label: "팀명",
                    },
                    {
                        key: "1-1-2",
                        label: "팀명",
                    },
                    {
                        key: "1-1-3",
                        label: "팀명",
                    },
                ],
            },
        ],
    },
    {
        key: "2",
        label: "조직명C",
        children: [],
    },
    {
        key: "3",
        label: "조직명D",
        children: [],
    },
    {
        key: "4",
        label: "조직명E",
        children: [],
    },
];



const TeamAccordion = ({ title, subTitle, btnText }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <AccordionWrapper>
            <DisasterForm>
                <Stick></Stick>
                <Text><Link to="/teamYeosu">{title}</Link></Text>
                <ArrowDownIcon onClick={handleClick}></ArrowDownIcon>
            </DisasterForm>
            <InternalWrapper open={open}>

                <Tree treeData={treeData} />

            </InternalWrapper>
        </AccordionWrapper>
    );
};

TeamAccordion.defaultProps = {
    title: '조직',
    subTitle: 'subtitle',
    btnText: '      >>'
};

export default TeamAccordion;
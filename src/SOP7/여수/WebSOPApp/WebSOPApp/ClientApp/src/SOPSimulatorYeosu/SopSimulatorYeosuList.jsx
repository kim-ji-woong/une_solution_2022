import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import { Header } from "./styled";
import { Logo } from "./styled";
import { Contents } from "./styled";
import { SideBar } from "./styled";
import { BeforeBtn } from "./styled";
import { ReturnIcon } from "./styled";

import { SopListBox } from "./styled";
import { TitleFlex } from "./styled";
import { TitleActive } from "./styled";
import { TitleDisable } from "./styled";
//import { PlusIcon } from "./styled";

import { ArrowLeftIcon } from "./styled";
import { ArrowRightIcon } from "./styled";

import MenuBar from './SOPHeader/Menubar/Menubar';
import SOPInfoAccordion from "./SOPContents/Sidebar/sopInfoAccordion";
import SOPMissionAccordion from "./SOPContents/Sidebar/sopMissionAccordion";
import SOPProgressAccordion from "./SOPContents/Sidebar/sopProgressAccordion";

import SopFlowChart from '../SOPSimulatorYeosu/SOPContents/SOPbody/SopFlowChart';
import SopStage from './SOPContents/SOPbody/SopStage/SopStage';


class SopSimulatorYeosuList extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                {/* <Header>
                    <Logo></Logo>
                    <MenuBar />
                </Header> */}
                <Header>
                  <Logo></Logo>
                </Header>

                <Contents>
                    <SideBar>
                        <SOPInfoAccordion />
                        <SOPMissionAccordion />
                        <SOPProgressAccordion />

                        <BeforeBtn>
                            <ReturnIcon></ReturnIcon>
                            이전페이지
                        </BeforeBtn>
                    </SideBar>
                    <SopListBox>
                        <TitleFlex>
                            <span><Link to="/sop-simulatorYeosu">SOP<span /* className="blueColor" */> [SOP 임무목록]</span></Link></span>
                            <TitleActive className="active">기상특보(심각)</TitleActive>
                            <TitleDisable>건물화재(주의)</TitleDisable>
                            <TitleDisable>화재_자동(경계)</TitleDisable>
                            {/* <PlusIcon></PlusIcon> */}
                            <ArrowLeftIcon></ArrowLeftIcon>
                            <ArrowRightIcon></ArrowRightIcon>
                        </TitleFlex>

                        <div style={{ display: "flex", width: "100%", height: "calc(100% - 140px)" }}>
                            <SopFlowChart /> {/* SOP 플로우차트 영역 */}
                            <SopStage /> {/* SOP 수행단계 영역 */}
                        </div>

                    </SopListBox>
                </Contents>
            </>
        );
    }
}

export default SopSimulatorYeosuList;


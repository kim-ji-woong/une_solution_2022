
import React, { Component } from 'react';
//import styled from 'styled-components';

import SdmsResource from '../SDMS/resource/id';
import { Header } from "./styled";
import { Logo } from "./styled";
import { Contents } from "./styled";
import { SideBar } from "./styled";
import { BeforeBtn } from "./styled";
import { ReturnIcon } from "./styled";
import { SopListBox } from "./styled";
import { PageNation } from "./styled";
import { PageLeftArrowIcon } from "./styled";
import { PageRightArrowIcon } from "./styled";


import MenuBar from './SOPHeader/Menubar/Menubar';
import DisasterAccordion from "./SOPContents/Sidebar/disasterAccordion";
import SopTable from "../SOPSimulatorYeosu/SOPContents/SOPbody/SopTable";


class SopSimulatorYeosu extends Component {
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

                <Contents className={SdmsResource.UISection}>
                  <SideBar>
                    <DisasterAccordion />
                    <DisasterAccordion />

                    <BeforeBtn>
                        <ReturnIcon></ReturnIcon> 
                        이전페이지
                    </BeforeBtn>
                  </SideBar>

                  <SopListBox>
                    <span>SOP<span /* className="blueColor" */> [SOP 임무목록]</span></span>

                      <SopTable />

                      <PageNation>
                          <PageLeftArrowIcon></PageLeftArrowIcon>
                          <span className="active">1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                          <PageRightArrowIcon></PageRightArrowIcon>
                      </PageNation>
                  </SopListBox>
                </Contents>
            </>
        );
    }
}

export default SopSimulatorYeosu; 

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
import { PageLeftArrowIconB } from "./styled";
import { PageRightArrowIconB } from "./styled";


//import MenuBar from './SOPHeader/Menubar/Menubar';
import SensorHistoryAccordion from './HistoryContents/Sidebar/sensorHistoryAccordion';
import SensorAnalysisAccordion from './HistoryContents/Sidebar/sensorAnalysisAccordion';
import SopHistoryAccordion from './HistoryContents/Sidebar/sopHistoryAccordion';
import SensorDetectSelect from './HistoryContents/Historybody/SensorDetectSelect';
import HistoryTable from '../HistoryYeosu/HistoryContents/Historybody/HistoryTable';

import HistoryAnalysis from './HistoryAnalysis';


class HistoryYeosu extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                <Header>
                  <Logo></Logo>
                </Header>
                <Contents className={SdmsResource.UISection}>
                    <SideBar>
                        <SensorHistoryAccordion />
                        <SensorAnalysisAccordion />
                        <SopHistoryAccordion />

                        <BeforeBtn>
                            <ReturnIcon></ReturnIcon>
                            이전페이지
                        </BeforeBtn>
                    </SideBar>

                    <SopListBox>
                        <span>센서탐지 이력</span>
                        <SensorDetectSelect />
                        <HistoryTable />

                        <PageNation>
                            <PageLeftArrowIconB></PageLeftArrowIconB>
                            <span className="active">1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <PageRightArrowIconB></PageRightArrowIconB>
                        </PageNation>
                    </SopListBox>
                </Contents>
            </>
        );
    }
}

export default HistoryYeosu;
import React, { Component } from 'react';

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
import SensorSOPSelect from './HistoryContents/Historybody/SensorSOPSelect';
import HistorySOPTable from '../HistoryYeosu/HistoryContents/Historybody/HistorySOPTable';


class HistorySOP extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                <Header>
                  <Logo></Logo>
                </Header>
                <Contents>
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
                        <span>SOP 이력</span>

                        <SensorSOPSelect />
                        <HistorySOPTable />

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

export default HistorySOP;
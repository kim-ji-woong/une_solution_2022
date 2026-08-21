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
import { TeamSelectBox } from "./styled";
import { TeamSearchBtn } from "./styled";
import { AddBtn } from "./styled";
import { DeleteBtn } from "./styled";

import { PageNation } from "./styled";
import { PageLeftArrowIconB } from "./styled";
import { PageRightArrowIconB } from "./styled";


import TeamAccordion from './TeamContents/Sidebar/teamAccordion';
import TeamWeekAccordion from './TeamContents/Sidebar/teamWeekAccordion';
import TeamHolidayAccordion from './TeamContents/Sidebar/teamHolidayAccordion';

import TeamTable from '../TeamEditorYeosu/TeamContents/Teambody/TeamTable';


class Team extends Component {
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
                        <TeamAccordion />
                        <TeamWeekAccordion />
                        <TeamHolidayAccordion /> 

                        <BeforeBtn>
                            <ReturnIcon></ReturnIcon>
                            이전페이지
                        </BeforeBtn>
                    </SideBar>

                    <SopListBox>
                        <span>조직명A</span>
                        <div style={{ display: 'flex', marginBottom: '40px' }}>
                            <TeamSelectBox>
                                <span>검색어 입력</span>
                                <input type="text" name="writer" />
                            </TeamSelectBox>
                            <TeamSearchBtn>검색</TeamSearchBtn>

                            <div style={{ position: 'absolute', right: '40px' }}>
                                <AddBtn>추가</AddBtn>
                                <DeleteBtn>삭제</DeleteBtn>
                            </div>
                        </div>

                        <TeamTable />

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

export default Team;
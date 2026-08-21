import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';

import './css/layout.css';      // LG 화학 관련 추가 CSS
import uneCommon from '../Common/css/uneCommon.module.css';

import TitleBarSB from './titleBarSB';
import uis from '../Common/css/ui.module.css';

import RootResource from './resource/id';
import ProjectResource from './resource/id';

class LayoutSB extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.initSiteID();
    }

    async initSiteID() {
        const user = await ProjectResource.initUserInfo();

        if (user === null || user === undefined) {
            // 로그인 정보가 없으면 로그인 페이지로 이동
            this.props.history.push('/');
        }

    }

    componentDidMount() {
        const path = window.location.pathname;

        // 경로에 따라 타이틀바 css 변경
        if (path.indexOf(RootResource.path.sdms) === 0) {
            $('#layoutContainer').removeClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.sopSimulator) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.teamEditor) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.sopManager) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.dashboard) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.history) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.sensorSimulator) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop60);
        } 
    }

    render() {
        const mode = RootResource.styleMode;
        return (
            <main id="mainSB" className={uis.appWrap} style={{ backgroundColor: mode === 'soulbrain' ? '#1E3142' : '#0E162D' }}>
                <TitleBarSB menuEvent={this.props.menuEvent} target={this.props.target} />
                <Container id="layoutContainer">
                    {this.props.children}
                </Container>
            </main>
        );
    }
}

export default LayoutSB;
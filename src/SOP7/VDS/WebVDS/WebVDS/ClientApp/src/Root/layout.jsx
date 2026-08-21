import React, { Component } from 'react';
import { Container } from 'reactstrap';
import $ from 'jquery';

import './css/layout.css';      // LG 화학 관련 추가 CSS
import uneCommon from '../Common/css/uneCommon.module.css';

import TitleBar from './titleBar';
import uis from '../Common/css/ui.module.css';
import main from '../Main/css/main.module.css';

import RootResource from './resource/id';
//import SDMSResource from '../SDMS/resource/id'

import YeosuLogo from '../Common/image/common/yeosuLogo_W.png';
import CommonResource from '../Common/resource/id';


class Layout extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    componentDidMount() {
        const path = window.location.pathname;

        // 경로에 따라 타이틀바 css 변경
        if (path.indexOf(RootResource.path.sdms) === 0) {
            $('#layoutContainer').removeClass(uneCommon.sdmsBackground);
        } else if (path.indexOf(RootResource.path.main) === 0) {
            $('#layoutContainer').addClass(main.mainBackground);
        /* } else if (path.indexOf(RootResource.path.teamEditor) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50); */
        } else if (path.indexOf(RootResource.path.sopManager) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.dashboard) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.history) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        } else if (path.indexOf(RootResource.path.sensorSimulator) === 0) {
            $('#layoutContainer').addClass(uneCommon.paddingTop50);
        }

    }

    render() {
        return (
            <main id="mainSB" className={uis.appWrap + " " + uis.dragPrevent + " " + CommonResource.UISection}>
                <Container id="layoutContainer">
                    {this.props.children}
                </Container>
            </main>
        );
    }
}

export default Layout;
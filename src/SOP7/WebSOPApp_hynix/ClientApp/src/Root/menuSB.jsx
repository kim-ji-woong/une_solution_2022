import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import SopSimulator from '../SOPSimulator/ui/sopSimulator';
import SDMS from '../SDMS/ui/sdms';
import TeamEditor from '../TeamEditor/ui/teamEditor';
import SopManager from '../SOPManager/ui/sopManager';
import Dashboard from '../Dashboard/ui/dashboard';
import History from '../History/ui/history';

import SessionString from '../Common/js/sessionString';
import LayoutSB from './layoutSB';

import uneCommon from '../Common/css/uneCommon.module.css';

import ProjectResource from './resource/id';
import { SDMSController } from '../SDMS/services/sdmsController';
import SensorSimulator from '../SensorSimulator/sensorSimulator';
import SopManagerResource from '../SOPManager/resource/id';

class MenuSB extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sdmsEvent: {},
            sopSimulatorEvent: {},
            teamEditorEvent: {},
            sopManagerEvent: {},
            dashboardEvent: {},
            historyEvent: {},
            sensorSimulatorEvent: {}
        };

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

    getTargetEvent() {
        const path = window.location.pathname;

        if (path.length > 0) {
            const target = path.substring(1).toLowerCase();

            if (path === ProjectResource.path.sdms)
                return [this.state.sdmsEvent, target];
            else if (path === ProjectResource.path.sopSimulator)
                return [this.state.sopSimulatorEvent, target];
            else if (path === ProjectResource.path.teamEditor)
                return [this.state.teamEditorEvent, target];
            else if (path === ProjectResource.path.sopManager)
                return [this.state.sopManagerEvent, target];
            else if (path === ProjectResource.path.dashboard)
                return [this.state.dashboardEvent, target];
            else if (path === ProjectResource.path.history)
                return [this.state.historyEvent, target];
            else if (path === ProjectResource.path.sensorSimulator)
                return [this.state.sensorSimulatorEvent, target];
        }

        return [null, ""];
    }

    render() {
        const path = this.props.match.path;

        const [targetEvent, target] = this.getTargetEvent();

        let routePath = null;

        // console.log('menuSB siteID : ' + ProjectResource.SiteID);

        return (
            <LayoutSB menuEvent={targetEvent} target={target}>
                {
                    (ProjectResource.SiteID !== ProjectResource.Site.Tlb) && <Route path={ProjectResource.path.sdms} render={() => <SDMS menuEvent={this.state.sdmsEvent} />} />
                }
                <Route path={ProjectResource.path.teamEditor} render={() => <TeamEditor menuEvent={this.state.teamEditorEvent} />} />
                {
                    (ProjectResource.SiteID !== ProjectResource.Site.Tlb && ProjectResource.SiteID !== ProjectResource.Site.SUJAIN) &&
                        <Route path={ProjectResource.path.dashboard} render={() => <Dashboard menuEvent={this.state.teamEditorEvent} />} />
                }
                <Route path={ProjectResource.path.sopSimulator} render={() => <SopSimulator menuEvent={this.state.sopSimulatorEvent} />} />
                <Route path={ProjectResource.path.sopManager} render={() => <SopManager className={uneCommon.paddingTop50} menu={SopManagerResource.menu.SOP_편집} menuEvent={this.state.sopManagerEvent} />} />
                <Route path={ProjectResource.path.history} render={() => <History menuEvent={this.state.historyEvent} />} />
                <Route path={ProjectResource.path.sensorSimulator} render={() => <SensorSimulator menuEvent={this.state.sensorSimulatorEvent} />} />
            </LayoutSB>
        );
    }
}

export default withRouter(MenuSB);
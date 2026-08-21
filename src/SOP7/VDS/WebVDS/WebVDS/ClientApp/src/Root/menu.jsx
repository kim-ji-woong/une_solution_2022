import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
//import SopSimulator from '../SOPSimulator/ui/sopSimulator';
//import SDMS from '../SDMS/ui/sdms';
//import TeamEditor from '../TeamEditor/ui/teamEditor';
//import SopManager from '../SOPManager/ui/sopManager';
import Dashboard from '../Dashboard/ui/dashboard';
//import History from '../History/ui/history';
import Main from '../Main/ui/main';
import Interchange from './interchange';
import Edit from './../PropertyEdit/ui/edit';

import SessionString from '../Common/js/sessionString';
import Layout from './layout';

import uneCommon from '../Common/css/uneCommon.module.css';

import ProjectResource from './resource/id';
//import { SDMSController } from '../SDMS/services/sdmsController';

class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sdmsEvent: {},
            sopSimulatorEvent: {},
            /* teamEditorEvent: {}, */
            sopManagerEvent: {},
            dashboardEvent: {},
            /* historyEvent: {}, */
            mainEvent: {},
            vdsEvent: {},
            editEvent: {},
        };

        this.props = props;
        this.initSiteID();
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
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
            /* else if (path === ProjectResource.path.history)
                return [this.state.historyEvent, target]; */
            else if (path === ProjectResource.path.main)
                return [this.state.mainEvent, target];
            else if (path === ProjectResource.path.vds)
                return [this.state.vdsEvent, target];
            else if (path === ProjectResource.path.edit)
                return [this.state.editEvent, target];
        }

        return [null, ""];
    }

    getRoutePath = () => {
        return (<React.Fragment>
            <Route path={ProjectResource.path.dashboard} render={() => <Dashboard menuEvent={this.state.dashboardEvent} />} />
            {/* <Route path={ProjectResource.path.sopSimulator} render={() => <SopSimulator menuEvent={this.state.sopSimulatorEvent} />} /> */}
            {/* <Route path={ProjectResource.path.sopManager} render={() => <SopManager menu={SopManager.menu.editSOP} menuEvent={this.state.sopManagerEvent} />} /> */}
            {/* <Route path={ProjectResource.path.history} render={() => <History menuEvent={this.state.historyEvent} />} /> */}
            <Route path={ProjectResource.path.main} render={() => <Main menuEvent={this.state.mainEvent} />} />
            <Route path={ProjectResource.path.vds} render={() => <Interchange dashboardEvent={this.state.dashboardEvent} mainEvent={this.state.mainEvent} editEvent={this.state.editEvent} />} />
            <Route path={ProjectResource.path.edit} render={() => <Edit menuEvent={this.state.editEvent}  />} />
        </React.Fragment>);
    }

    render() {

        const path = this.props.match.path;

        const [targetEvent, target] = this.getTargetEvent();

        let routePath = null;

        return (
            <Layout menuEvent={targetEvent} target={target}>
                {this.getRoutePath()}
            </Layout>
        );
    }
}

export default withRouter(Menu);
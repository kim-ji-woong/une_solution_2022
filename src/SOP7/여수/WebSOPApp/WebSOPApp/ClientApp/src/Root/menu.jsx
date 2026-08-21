import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import SopSimulator from '../SOPSimulator/ui/sopSimulator';
import SDMS from '../SDMS/ui/sdms';
import TeamEditor from '../TeamEditor/ui/teamEditor';
import SopManager from '../SOPManager/ui/sopManager';
import Dashboard from '../Dashboard/ui/dashboardNew';
import History from '../History/ui/history';
//import HistoryYeosu from '../HistoryYeosu/HistoryYeosu';
//import HistoryAnalysis from '../HistoryYeosu/HistoryAnalysis';
//import HistorySOP from '../HistoryYeosu/HistorySOP';
//import SopSimulatorYeosu from '../SOPSimulatorYeosu/SopSimulatorYeosu'; /* 1206 */
//import SopSimulatorYeosuList from '../SOPSimulatorYeosu/SopSimulatorYeosuList'; /* 1209 */
import Team from '../TeamEditorYeosu/Team';
import Report from '../Report/ui/report';

import SessionString from '../Common/js/sessionString';
import Layout from './layout';

import uneCommon from '../Common/css/uneCommon.module.css';

import ProjectResource from './resource/id';
import { SDMSController } from '../SDMS/services/sdmsController';
import SensorSimulator from '../SensorSimulator/sensorSimulator';

class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sdmsEvent: {},
            sopSimulatorEvent: {},
           /* sopSimulatorYeosuEvent: {}, */ /* 1206 */
           /* sopSimulatorYeosuListEvent: {}, */ /* 1209 */
            teamEditorEvent: {},
            teamYeosuEvent: {}, 
            sopManagerEvent: {},
            dashboardEvent: {},
            historyEvent: {},
            reportYeosuEvent: {},
           /* historyAnalysisEvent: {}, */
           /* historySOP: {}, */
        };

        this.props = props;
        this.initSiteID();

        this.wsMgr = this.props.getWebSocket();
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
           /* else if (path === ProjectResource.path.sopSimulatorYeosu)  
                return [this.state.sopSimulatorYeosuEvent, target]; */
           /* else if (path === ProjectResource.path.sopSimulatorYeosuList)  
                return [this.state.sopSimulatorYeosuListEvent, target]; */
            else if (path === ProjectResource.path.teamEditor)
                return [this.state.teamEditorEvent, target];
            else if (path === ProjectResource.path.teamYeosuEvent)
                return [this.state.teamYeosuEvent, target]; 
            else if (path === ProjectResource.path.sopManager)
                return [this.state.sopManagerEvent, target];
            else if (path === ProjectResource.path.dashboard)
                return [this.state.dashboardEvent, target];
            else if (path === ProjectResource.path.history)
                return [this.state.historyEvent, target];
         /* else if (path === ProjectResource.path.historyYeosu)
                return [this.state.historyYeosuEvent, target];
            else if (path === ProjectResource.path.historyAnalysis)
                return [this.state.historyAnalysisEvent, target];
            else if (path === ProjectResource.path.historySOP)
                return [this.state.historySOPEvent, target]; */
            else if (path === ProjectResource.path.sensorSimulator)
                return [this.state.sensorSimulatorEvent, target];
            else if (path === ProjectResource.path.reportYeosu)
                return [this.state.reportYeosuEvent, target];
        }

        return [null, ""];
    }

    // GS인증에 따른 표시
    getRoutePath = () => {
        if (ProjectResource.isGSMode !== true) {
            return (<React.Fragment>
                <Route path={ProjectResource.path.dashboard} render={() => <Dashboard menuEvent={this.state.teamEditorEvent} />} />
                <Route path={ProjectResource.path.sopSimulator} render={() => <SopSimulator menuEvent={this.state.sopSimulatorEvent} wsMgr={this.wsMgr} />} />
                <Route path={ProjectResource.path.sopManager} render={() => <SopManager /* className={uneCommon.paddingTop50} */ menu={SopManager.menu.editSOP} menuEvent={this.state.sopManagerEvent} />} />
                <Route path={ProjectResource.path.teamYeosu} render={() => <Team menuEvent={this.state.teamYeosuEvent} />} />
                <Route path={ProjectResource.path.history} render={() => <History menuEvent={this.state.historyEvent} wsMgr={this.wsMgr} />} />
                {/* <Route path={ProjectResource.path.historyYeosu} render={() => <HistoryYeosu menuEvent={this.state.historyYeosuEvent} />} /> */}
                {/* <Route path={ProjectResource.path.historyAnalysis} render={() => <HistoryAnalysis menuEvent={this.state.historyAnalysisEvent} />} /> */}
                {/* <Route path={ProjectResource.path.historySOP} render={() => <HistorySOP menuEvent={this.state.historySOPEvent} />} /> */}
                {/* <Route path={ProjectResource.path.sopSimulatorYeosu} render={() => <SopSimulatorYeosu className={uneCommon.paddingTop0} menuEvent={this.state.sopSimulatorYeosuEvent} />} /> */}
                {/* <Route path={ProjectResource.path.sopSimulatorYeosuList} render={() => <SopSimulatorYeosuList className={uneCommon.paddingTop0} menuEvent={this.state.sopSimulatorYeosuListEvent} />} /> */}
                <Route path={ProjectResource.path.sensorSimulator} render={() => <SensorSimulator menuEvent={this.state.sensorSimulatorEvent} />} />
                <Route path={ProjectResource.path.reportYeosu} render={() => <Report menuEvent={this.state.reportYeosuEvent} />} />
            </React.Fragment>);
        }

        return <></>;
    }

    render() {
        const path = this.props.match.path;

        const [targetEvent, target] = this.getTargetEvent();

        let routePath = null;

        return (
            <Layout menuEvent={targetEvent} target={target} wsMgr={this.wsMgr} >
                <Route path={ProjectResource.path.sdms} render={() => <SDMS menuEvent={this.state.sdmsEvent} wsMgr={this.wsMgr} />} />
                <Route path={ProjectResource.path.teamEditor} render={() => <TeamEditor menuEvent={this.state.teamEditorEvent} wsMgr={this.wsMgr} />} />
                {this.getRoutePath()}
            </Layout>
        );
    }
}

export default withRouter(Menu);
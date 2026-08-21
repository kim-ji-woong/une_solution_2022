import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import SDMS from '../SDMS/ui/sdms';
import SopManager from '../SOPManager/ui/sopManager';

import Layout from './layout';
import uneCommon from '../Common/css/uneCommon.module.css';
import ProjectResource from './resource/id';
import SopSimulator from '../SOPSimulator/ui/sopSimulator';
import TeamEditor from '../TeamEditor/ui/teamEditor';

/*interface Props {
    history: any,
    match: {
        isExact: boolean,
        params: object,
        path: string,
        url: string
    }
}

type NullableObject = object | null;

interface State {
    sdmsEvent: NullableObject
}*/

class Menu extends React.Component/*<Props, State>*/ {
    static titleSopSimulator = "SOP Simulator";
    static titleTeamEditor = "조직 편집기";
    static titleSopManage = "SOP 편집기";
    
    constructor(props/*: Props*/) {
        super(props);

        this.state = {
            sdmsEvent: {},
            sopSimulatorEvent: {},
            teamEditorEvent: {},
            sopManagerEvent: {}/*,
            dashboardEvent: {},
            historyEvent: {}*/
        };
    }

    getTargetEvent()/*: [NullableObject, string]*/ {
        const pathName = window.location.pathname;

        if (pathName.length > 0) {
            const target = pathName.substring(1).toLowerCase();
            //return [this.state.sdmsEvent, "sdms"];

            if (target === "sdms")
                return [this.state.sdmsEvent, target];
            else if (target === "sop-simulator")
                return [this.state.sopSimulatorEvent, target];
            else if (target === "team-editor")
                return [this.state.teamEditorEvent, target];
            else if (target === "sop-manager")
                return [this.state.sopManagerEvent, target];
            /*else if (target === "dashboard")
                return [this.state.dashboardEvent, target];
            else if (target === "history")
                return [this.state.historyEvent, target];*/
        }

        return [null, ""];
    }

    render() {
        const path = this.props.match.path;
        let title = "";

        if (path.indexOf(Menu.pathSOPSimulator) === 0) {
            title = Menu.titleSopSimulator;
        } else if (path.indexOf(Menu.pathTeamEditor) === 0) {
            title = Menu.titleTeamEditor;
        } else if (path.indexOf(Menu.pathSopManager) === 0) {
            title = Menu.titleSopManage;
        } /*else if (path.indexOf(Menu.pathDashboard) === 0) {
            title = Menu.titleDashboard;
        } else if (path.indexOf(Menu.pathHistory) === 0) {
            title = Menu.titleHistory;
        }*/

        const [targetEvent, target] = this.getTargetEvent();

        return (
            <Layout title={title} menuEvent={targetEvent} target={target}>
                <Route path={ProjectResource.path.sdms} render={() => <SDMS menuEvent={this.state.sdmsEvent} />} />
                <Route path={ProjectResource.path.sopManager} render={() => <SopManager className={uneCommon.paddingTop50} menu={SopManager.menu.editSOP} menuEvent={this.state.sopManagerEvent} />} />
                <Route path={ProjectResource.path.sopSimulator} render={() => <SopSimulator menuEvent={this.state.sopSimulatorEvent} />} />
                <Route path={ProjectResource.path.teamEditor} render={() => <TeamEditor menuEvent={this.state.teamEditorEvent} />} />
            </Layout>
        );
    }
}

export default withRouter(Menu);
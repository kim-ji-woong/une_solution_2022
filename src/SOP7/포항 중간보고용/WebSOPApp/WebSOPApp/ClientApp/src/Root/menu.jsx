import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import ProjectResource from './resource/id';

import Layout from './layout';
import SDMS from '../SDMS/ui/sdms';
import History from '../History/ui/history';
import TeamEditor from '../TeamEditor/ui/teamEditor';
import SopSimulator from '../SOPSimulator/ui/sopSimulator';
import SopManager from '../SOPManager/ui/sopManager';

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sdmsEvent: {},
            historyEvent: {},
            teamEditorEvent: {},
            sopSimulatorEvent: {},
            sopManagerEvent: {}
        };
    }


    getTargetEvent() {
        const path = window.location.pathname;

        if (path.length > 0) {
            const target = path.substring(1).toLowerCase();

            if (path === ProjectResource.path.sdms) 
                return [this.state.sdmsEvent, target];
            else if (path === ProjectResource.path.history) 
                return [this.state.historyEvent, target];
            else if (path === ProjectResource.path.teamEditor) 
                return [this.state.teamEditorEvent, target];
            else if (path === ProjectResource.path.sopSimulator) 
                return [this.state.sopSimulatorEvent, target];
            else if (path === ProjectResource.path.sopManager) 
                return [this.state.sopManagerEvent, target];
        }

        return [null, ""];
    }

    getRoutePath = () => {
        return (<React.Fragment>
            <Route path={ProjectResource.path.sdms} render={() => <SDMS menuEvent={this.state.sdmsEvent} getWebSocket={this.props.getWebSocket} setWebSocket={this.props.setWebSocket} wsMgr={this.wsMgr}/>} />
            <Route path={ProjectResource.path.history} render={() => <History menuEvent={this.state.historyEvent} />} />
            <Route path={ProjectResource.path.teamEditor} render={() => <TeamEditor menuEvent={this.state.teamEditorEvent} />} />
            <Route path={ProjectResource.path.sopSimulator} render={() => <SopSimulator menuEvent={this.state.sopSimulatorEvent} />} />
            <Route path={ProjectResource.path.sopManager} render={() => <SopManager menuEvent={this.state.sopManagerEvent} />} />
        </React.Fragment>);
    }

    render() {
        const [targetEvent, target] = this.getTargetEvent();
        
        return (
            <Layout 
                menuEvent={targetEvent} 
                target={target}
                getWebSocket={this.props.getWebSocket}
            >
                {
                    this.getRoutePath()
                }
            </Layout>
        );
    }
}

export default withRouter(Menu);
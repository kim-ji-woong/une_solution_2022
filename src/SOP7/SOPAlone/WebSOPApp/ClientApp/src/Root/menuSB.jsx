import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import SopSimulator from '../SOPSimulator/ui/sopSimulator';
import TeamEditor from '../TeamEditor/ui/teamEditor';
import SopManager from '../SOPManager/ui/sopManager';
import History from '../History/ui/history';

import SessionString from '../Common/js/sessionString';
import LayoutSB from './layoutSB';

import uneCommon from '../Common/css/uneCommon.module.css';

import ProjectResource from './resource/id';

class MenuSB extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sopSimulatorEvent: {},
            teamEditorEvent: {},
            sopManagerEvent: {}
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
            if (path === ProjectResource.path.sopSimulator)
                return [this.state.sopSimulatorEvent, target];
            else if (path === ProjectResource.path.teamEditor)
                return [this.state.teamEditorEvent, target];
            else if (path === ProjectResource.path.sopManager)
                return [this.state.sopManagerEvent, target];
            //else if (path === ProjectResource.path.history)
            //    return [this.state.historyEvent, target];
        }

        return [null, ""];
    }

    render() {
        const path = this.props.match.path;

        const [targetEvent, target] = this.getTargetEvent();

        let routePath = null;

        return (
            <LayoutSB menuEvent={targetEvent} target={target}>
                <Route path={ProjectResource.path.teamEditor} render={() => <TeamEditor menuEvent={this.state.teamEditorEvent} />} />
                <Route path={ProjectResource.path.sopSimulator} render={() => <SopSimulator menuEvent={this.state.sopSimulatorEvent} />} />
                <Route path={ProjectResource.path.sopManager} render={() => <SopManager className={uneCommon.paddingTop50} menu={SopManager.menu.editSOP} menuEvent={this.state.sopManagerEvent} />} />
                {
                    //<Route path={ProjectResource.path.history} render={() => <History menuEvent={this.state.historyEvent} />} />
                }
            </LayoutSB>
        );
    }
}

export default withRouter(MenuSB);
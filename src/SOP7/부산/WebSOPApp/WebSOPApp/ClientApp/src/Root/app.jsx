import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './menu';
import LoginPage from '../Account/ui/loginPage';

import ProjectResource from './resource/id';
import SDMS from "../SDMS/ui/sdms";
import History from "../History/ui/history";
import TeamEditor from "../TeamEditor/ui/teamEditor";
import SopSimulator from "../SOPSimulator/ui/sopSimulator";
import SopManager from "../SOPManager/ui/sopManager";

function App() {
    
    const [ws, setWs] = useState(null);

    const getWebSocket = () => {
        if (ws) {
            return ws;
        }
    }
    
    const setWebSocket = (ws) => {
        setWs(ws);
    }
    
    return (
        <Router>
            <Switch>
                {/*
                <Route exact path={ProjectResource.path.root} component={LoginPage} getWebSocket={getWebSocket} setWebSocket={setWebSocket}/>
                <Route path={ProjectResource.path.sdms} component={Menu} getWebSocket={getWebSocket} setWebSocket={setWebSocket}/>
                <Route path={ProjectResource.path.history} component={Menu} getWebSocket={getWebSocket} setWebSocket={setWebSocket}/>
                <Route path={ProjectResource.path.teamEditor} component={Menu} getWebSocket={getWebSocket} setWebSocket={setWebSocket}/>
                <Route path={ProjectResource.path.sopSimulator} component={Menu} getWebSocket={getWebSocket} setWebSocket={setWebSocket}/>
                <Route path={ProjectResource.path.sopManager} component={Menu} getWebSocket={getWebSocket} setWebSocket={setWebSocket}/>
                */}
                <Route exact path={ProjectResource.path.root} render={() => <LoginPage getWebSocket={getWebSocket} setWebSocket={setWebSocket} />} />
                <Route path={ProjectResource.path.sdms} render={() => <Menu getWebSocket={getWebSocket} setWebSocket={setWebSocket} />} />
                <Route path={ProjectResource.path.history} render={() => <Menu getWebSocket={getWebSocket} setWebSocket={setWebSocket} />} />
                <Route path={ProjectResource.path.teamEditor} render={() => <Menu getWebSocket={getWebSocket} setWebSocket={setWebSocket} />} />
                <Route path={ProjectResource.path.sopSimulator} render={() => <Menu getWebSocket={getWebSocket} setWebSocket={setWebSocket} />} />
                <Route path={ProjectResource.path.sopManager} render={() => <Menu getWebSocket={getWebSocket} setWebSocket={setWebSocket} />} />
            </Switch>
        </Router>

    );
}

export default App;

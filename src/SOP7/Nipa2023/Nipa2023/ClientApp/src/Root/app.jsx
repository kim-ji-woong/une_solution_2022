import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './menu';

import LoginPage from '../Account/ui/loginPage';

//import SwiperCore, { Autoplay, Navigation } from 'swiper';

import RootResource from './resource/id';
import { ContextManager } from './resource/contextManager';
import { AlarmContextManager } from './resource/alarmContextManager';
import { SettingContextManager } from './resource/settingContextManager';
import { UserDispatch } from './resource/userDispatch';
import { SopContextManager } from './resource/sopContextManager';

function App() {
    //SwiperCore.use([Autoplay, Navigation])
    const userValue = useReducer(ContextManager.setActionState, ContextManager.initialState());
    const alarmValue = useReducer(AlarmContextManager.setActionState, AlarmContextManager.initialState());
    const settingValue = useReducer(SettingContextManager.setActionState, SettingContextManager.initialState());
    const sopValue = useReducer(SopContextManager.setActionState, SopContextManager.initialState());

    return (
        <Router>
            <UserDispatch.Provider value={{ user: userValue, alarm: alarmValue, setting: settingValue, sop: sopValue}}>
                <Switch>
                    <Route exact path={RootResource.path.root} component={LoginPage} />
                    <Route path={RootResource.path.sdms} component={Menu} />
                    <Route path={RootResource.path.monitoring} component={Menu} />
                    <Route path={RootResource.path.dashboardMonitoring} component={Menu} />
                    <Route path={RootResource.path.dashboardMes} component={Menu} />
                    <Route path={RootResource.path.teamEditor} component={Menu} />
                    <Route path={RootResource.path.history} component={Menu} />
                    <Route path={RootResource.path.sopManager} component={Menu} />
                    <Route path={RootResource.path.sopSimulator} component={Menu} />
                    <Route path={RootResource.path.tablet} component={Menu} />
                </Switch>
            </UserDispatch.Provider>
        </Router>

    );
}

export default App;

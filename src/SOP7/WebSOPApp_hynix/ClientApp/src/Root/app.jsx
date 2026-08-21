import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MenuSB from './menuSB';

import SpecialReport from '../Dashboard/ui/popups/specialReport';

import LoginPath from '../Account/ui/loginPath';
import AccountFindPwdPath from '../Account/ui/popups/accountFindPwdPath';

import SafetyCheckForm from '../SDMS/ui/safetyCheckForm';

import SampleVideo from '../Dashboard/ui/wonik/sampleVideo';

import AccessWonikSSO from '../Account/ui/wonik/accessWonikSSO';


import SwiperCore, { Autoplay, Navigation } from 'swiper';

import ProjectResource from './resource/id';

function App() {
    SwiperCore.use([Autoplay, Navigation])
    return (  
        <Router>
            <Switch>
                <Route exact path={ProjectResource.path.root} component={LoginPath} />

                <Route path={ProjectResource.path.sopManager} component={MenuSB} />
                <Route path={ProjectResource.path.teamEditor} component={MenuSB} />
                <Route path={ProjectResource.path.sopSimulator} component={MenuSB} />
                <Route path={ProjectResource.path.sensorSimulator} component={MenuSB} />
                <Route path={ProjectResource.path.sdms} component={MenuSB} />
                <Route path={ProjectResource.path.dashboard} component={MenuSB} />

                {/* 원익 대시보드 페이지 */}
                <Route path={ProjectResource.path.dashboardWonik} component={MenuSB} />
                
                <Route path={ProjectResource.path.findPassword} component={AccountFindPwdPath} />
                <Route path={ProjectResource.path.history} component={MenuSB} />
                <Route path={ProjectResource.path.specialReport} component={SpecialReport} />

                {/* 안전평가표 */}
                <Route path={ProjectResource.path.safetyCheckForm} component={SafetyCheckForm} />
                {/* 원익 시현영상 */}
                <Route path={ProjectResource.path.sampleVideo} component={SampleVideo} />
                {/* 원익 SSO */}
                <Route path={ProjectResource.path.accessWonikSSO} component={AccessWonikSSO} />
            </Switch>
        </Router>

  );
}

export default App;

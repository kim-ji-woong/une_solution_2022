import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MenuSB from './menuSB';

import SpecialReport from '../Dashboard/ui/popups/specialReport';

import LoginPath from '../Account/ui/loginPath';
import AccountFindPwdPath from '../Account/ui/popups/accountFindPwdPath';

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
                
                <Route path={ProjectResource.path.findPassword} component={AccountFindPwdPath} />
                <Route path={ProjectResource.path.history} component={MenuSB} />
                <Route path={ProjectResource.path.specialReport} component={SpecialReport} />

            </Switch>
        </Router>

  );
}

export default App;

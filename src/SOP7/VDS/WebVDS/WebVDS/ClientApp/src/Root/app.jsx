import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './menu';

import LoginPage from '../Account/ui/loginPage';
import AccountFindPwd from '../Account/ui/popups/accountFindPwd';

import SwiperCore, { Autoplay, Navigation } from 'swiper';

import RootResource from './resource/id';

function App() {
    SwiperCore.use([Autoplay, Navigation])

    return (  
        <Router>
            <Switch>
                <Route exact path={RootResource.path.root} component={LoginPage} />
                <Route path={RootResource.path.sopManager} component={Menu} />
                {/* <Route path={RootResource.path.teamEditor} component={Menu} /> */}
                <Route path={RootResource.path.sopSimulator} component={Menu} /> 
                <Route path={RootResource.path.sensorSimulator} component={Menu} />
                <Route path={RootResource.path.sdms} component={Menu} />
                <Route path={RootResource.path.dashboard} component={Menu} />
                <Route path={RootResource.path.findPassword} component={AccountFindPwd} />
                <Route path={RootResource.path.history} component={Menu} />
                <Route path={RootResource.path.main} component={Menu} />
                <Route path={RootResource.path.vds} component={Menu} />
                <Route path={RootResource.path.edit} component={Menu} />
            </Switch>
        </Router>

  );
}

export default App;

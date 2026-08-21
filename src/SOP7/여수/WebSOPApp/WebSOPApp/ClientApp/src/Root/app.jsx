import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './menu';

import LoginPageSB from '../Account/ui/loginPageSB';
import AccountFindPwd from '../Account/ui/popups/accountFindPwd';
import SpecialReport from '../Dashboard/ui/popups/specialReport';

import SwiperCore, { Autoplay, Navigation } from 'swiper';

import RootResource from './resource/id';
import wsManager from '../SDMS/services/wsManager';

/*function App() {*/
const App = ({ getWebSocket, setWebSocket }) => {
    SwiperCore.use([Autoplay, Navigation]);

    const [ws, setWs] = useState(null);

    getWebSocket = () => {
        if (ws) {
            return ws;
        }
    }

    setWebSocket = (ws) => {
        setWs(ws);
    }

    //<Route exact path={RootResource.path.root} component={LoginPageSB} getWebSocket={setWebSocket} setWebSocket={setWebSocket} />
    return (  
        <Router>
            <Switch>
                <Route exact path={RootResource.path.root} render={() => <LoginPageSB getWebSocket={getWebSocket} setWebSocket={setWebSocket} />} />
                <Route path={RootResource.path.sopManager} /*component={Menu}*/ render={() => <Menu getWebSocket={getWebSocket} />} />
                <Route path={RootResource.path.teamEditor} /*component={Menu}*/ render={() => <Menu getWebSocket={getWebSocket} />} />
                {/* <Route path={RootResource.path.teamYeosu} */ /*component={Menu}*/ /* render={() => <Menu getWebSocket={getWebSocket} />} /> */}
                <Route path={RootResource.path.sopSimulator} /*component={Menu}*/ render={() => <Menu getWebSocket={getWebSocket} />} /> 
                {/* <Route path={RootResource.path.sopSimulatorYeosu} */ /*component={Menu}*/ /* render={() => <Menu getWebSocket={getWebSocket} />} />  */} {/* 1206 */}
                {/* <Route path={RootResource.path.sopSimulatorYeosuList} */ /*component={Menu}*/ /* render={() => <Menu getWebSocket={getWebSocket} />} />  */} {/* 1208 */}
                <Route path={RootResource.path.sensorSimulator} /*component={Menu}*/ render={() => <Menu getWebSocket={getWebSocket} />} />
                <Route path={RootResource.path.sdms} /*component={Menu}*/ render={() => <Menu getWebSocket={getWebSocket} />} />
                <Route path={RootResource.path.dashboard} /*component={Menu}*/ render={() => <Menu getWebSocket={getWebSocket} />} />
                <Route path={RootResource.path.findPassword} /*component={Menu}*/ render={() => <Menu getWebSocket={getWebSocket} />} />
                <Route path={RootResource.path.history} /*component={Menu}*/ render={() => <Menu getWebSocket={getWebSocket} />} />
                {/* <Route path={RootResource.path.historyYeosu} */ /*component={Menu}*/ /* render={() => <Menu getWebSocket={getWebSocket} />} /> */}
                {/* <Route path={RootResource.path.historyAnalysis} */ /*component={Menu}*/ /* render={() => <Menu getWebSocket={getWebSocket} />} /> */}
                {/* <Route path={RootResource.path.historySOP} */ /*component={Menu}*/ /* render={() => <Menu getWebSocket={getWebSocket} />} /> */}
                <Route path={RootResource.path.specialReport} /*component={SpecialReport}*/ render={() => <SpecialReport getWebSocket={getWebSocket} />} />
                <Route path={RootResource.path.reportYeosu} /*component={SpecialReport}*/ render={() => <Menu getWebSocket={getWebSocket} />} />
            </Switch>
        </Router>

  );
}

export default App;

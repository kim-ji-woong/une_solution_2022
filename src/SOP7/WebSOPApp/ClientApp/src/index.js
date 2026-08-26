//import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './Root/app';
import { unregister } from './registerServiceWorker';
import { initVersionChecker } from './versionChecker';
//import './Root/css/index.css';

//import './Common/css/default.css';
//import './Common/css/slick.css';
//import './Common/css/animate.min.css';
//import './Common/css/common.css';
//import './Common/css/style.css';

//import './Common/css/scroll.css';
//import './Common/css/section.css';
//import './Common/css/treeview.css';

//import './Common/js/jquery-2.2.1.min.js';
//import './Common/js/placeholders.min.js';
//import './Common/js/slick.min.js';
//import './Common/js/common.js';
//import './Common/js/treeview.js';

import { ThemeProvider } from 'styled-components';
import variables from './Root/styled/variables';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter basename={baseUrl}>
        <ThemeProvider theme={{ variables }}>
            <App />
        </ThemeProvider>
    </BrowserRouter>,
    rootElement);

// 서비스워커 캐시로 새 배포가 늦게 반영되던 문제를 없애기 위해 등록을 해제한다.
unregister();

// 새 빌드가 배포되면(=asset-manifest 의 main.js 해시 변경) 자동으로 새로고침한다. (1분 주기)
initVersionChecker(60000);


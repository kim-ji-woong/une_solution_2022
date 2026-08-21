import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import { ThemeProvider } from 'styled-components';
import theme from './Common/styled/theme';
import media from './Common/styled/media';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <ThemeProvider theme={{ ...theme, ...media }}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
    rootElement

); 




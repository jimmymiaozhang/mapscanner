// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import ReactDOM from 'react-dom/client';
import document from 'global/document';
import {Provider} from 'react-redux';
import {browserHistory, Router, Route} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import store from './store';
import App from './app';
import MainPage from './MainPage';
import {buildAppRoutes} from './utils/routes';

const history = syncHistoryWithStore(browserHistory, store);

const appRoute = buildAppRoutes(App);

// Switch between old demo app and new MainPage
// Set to true to use the new MainPage, false to use the original demo app
const USE_NEW_MAIN_PAGE = true;

const Root = () => {
  if (USE_NEW_MAIN_PAGE) {
    return <MainPage />;
  }
  
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          {appRoute}
        </Route>
      </Router>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Root />);

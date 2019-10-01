import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppNavigation from './components/AppNavigation';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import LoginPage from './pages/LoginPage';

window.axios = axios;
axios.defaults.baseURL = 'http://api.mountains.ml:3650/api/v1/';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute exact path='/' component={AppNavigation}/>
          <Route exact path='/login' component={LoginPage}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

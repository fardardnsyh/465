import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Bookshelf from './pages/Bookshelf';
import Header from './components/Header';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/bookshelf" component={Bookshelf} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

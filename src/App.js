import React, { Component } from 'react';
import Main from './components/Main';
import SingleItem from './components/SingleItem';
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom';


class App extends Component {

  render() {
    return (
      <HashRouter>
        <section className="BG">
          <div className="container">
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/search/:searchItem" component={Main} />
              <Route path="/stores/:searchAddress" component={Main} />
              <Route path="/products/:item" component={SingleItem} />
              <Redirect to="/" />
            </Switch>
          </div>
        </section>
      </HashRouter>
    )
  }
}

export default App;



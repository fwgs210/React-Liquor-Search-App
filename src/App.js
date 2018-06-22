import React, { Component } from 'react';
import Main from './components/Main';
import SingleItem from './components/SingleItem';
import { BrowserRouter, Route } from 'react-router-dom';


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <section className="BG">
          <div className="container">
              <Route exact path="/" component={Main} />
              <Route path="/search/:searchItem" component={Main} />
              <Route path="/products/:item" component={SingleItem} />
          </div>
        </section>
      </BrowserRouter>
    )
  }
}

export default App;



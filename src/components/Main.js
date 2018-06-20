import React, { Component } from 'react';
import Loader from './Loader';
import Results from './Results';

class Main extends Component {

  render() {
    return (
          <article className="block">
            <div className="app-header">
              <aside className="header-content">Liquor search app. Powered by LCBO API.</aside>
            </div>
            <div>
              <form className="search-form" onSubmit={this.props.search}>
                <input type="text" className="search-input" onChange={this.props.getSearchItem} placeholder="item name, item type or keywords" required />
                <input type="submit" className="search-button" value="Search"/>
              </form>
            </div>
            <Results results={this.props.results} />
            {!this.props.isFinalPage ? (
                <button className="load-button" onClick={this.props.getMoreItem}>Load More</button>
              ) : this.props.loading ? (
                <Loader />
              ) : (
                <div className="text-center invisible">No more item</div>
              )
            }
          </article>
    );
  }
}

export default Main;

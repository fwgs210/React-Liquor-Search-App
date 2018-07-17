import React, { Component } from 'react';
import PropTypes from "prop-types";
import AutoComplete from './AutoComplete';

class Search extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleSubmit = (e) =>{
    // when someone submits the form, we need to do 3 things.
    // 1. we need to stop the form from submitting
    e.preventDefault();
    // 2. grab the search query from the input box
    const { searchItem, searchAddress, searchForProduct } = this.props.state;
    // 3. change the page to /search/whaterecer-they-search-for
    if (searchForProduct) {
      this.context.router.history.push(`/search/${searchItem}`);
      this.props.search()
    } else {
      this.context.router.history.push(`/stores/${searchAddress}`);
      this.props.getStores()
    }
  }

  render() { 
    return (
      <section>
  			<form className="search-form" onSubmit={this.handleSubmit}>
            <select className="search-select" onChange={this.props.searchSwitch} value={this.props.state.searchForProduct ? ("forProduct") : ("forStore")}>
              <option disabled>Search Types</option>
              <option value="forProduct">Products</option>
              <option value="forStore">Stores</option>
            </select>
            {this.props.state.searchForProduct ? (
              <input type="text" className="search-input" onChange={this.props.getSearchItem} value={this.props.state.searchItem} placeholder="item name, item type or keywords" required />
            ) : (
              <AutoComplete className="search-input" placeholder="city name, intersection or postal code" getAddress={this.props.getAddress} value={this.props.state.searchAddress} />
            )}
            <input type="submit" className="search-button" value="Search"/>
        </form>
        {this.props.state.badRequest ? (
          <p style={{color: '#D31C1D', textAlign: 'center'}}>Please enter a proper search term or address.</p>
          ) : (<span></span>)
        }
      </section>
    )
  }

}

export default Search;
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
    const searchItem = this.props.searchItem;
    // 3. change the page to /search/whaterecer-they-search-for
    if (this.props.searchForProduct) {
      this.context.router.history.push(`/search/${searchItem}`);
    }
    this.props.search(this.props.searchItem)
  }

  render() {
    return (
			<form className="search-form" onSubmit={this.handleSubmit}>
          <select className="search-select" onChange={this.props.searchSwitch}>
            <option disabled>Search Types</option>
            <option value="forProduct">Products</option>
            <option value="forStore">Stores</option>
          </select>
          {this.props.searchForProduct ? (
            <input type="text" className="search-input" onChange={this.props.getSearchItem} value={this.props.searchItem} placeholder="item name, item type or keywords" required />
          ) : (
            <AutoComplete className="search-input" placeholder="city name, intersection or postal code" getAddress={this.props.getAddress} />
          )}
          <input type="submit" className="search-button" value="Search"/>
      </form>
    )
  }

}

export default Search;
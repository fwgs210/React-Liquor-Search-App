import React, { Component } from 'react';
import PropTypes from "prop-types";

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
    this.context.router.history.push(`/search/${searchItem}`);
    this.props.search()
  }

  render() {
    return (
			<form className="search-form" onSubmit={this.handleSubmit}>
                <input type="text" className="search-input" onChange={this.props.getSearchItem} value={this.props.searchItem} placeholder="item name, item type or keywords" required />
                <input type="submit" className="search-button" value="Search"/>
            </form>
    )
  }

}

export default Search;
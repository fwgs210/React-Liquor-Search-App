import React, { Component } from 'react';
import Loader from './Loader';
import Results from './Results';
import PropTypes from "prop-types";
import axios from 'axios';

class Main extends Component {

  componentDidMount() {
    const searchItem = this.props.match.params.searchItem || undefined;
    if (searchItem != undefined) {
      this.search(searchItem)
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state = {
    searchItem: '',
    loading: false,
    isFinalPage: true,
    nextPage: '',
    results: null
  }

  search = (searchItem) => {
    this.setState({loading: !this.state.loading})

    axios.get(`https://lcboapi.com/products?q=${searchItem || this.state.searchItem}`,{
      headers: {
      'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
      }
    }).then(res => {
      if (res.status === 200 && res.data.result != undefined) {
        this.setState({results: res.data.result,loading: !this.state.loading})
        this.checkFinalPage(res.data.pager)
      } else {
        this.setState({loading: !this.state.loading})
      }
      
    })
    .catch(err => {
      console.log(err.message)
    })
  }
  checkFinalPage = (pager) => {
    const {is_final_page, next_page_path} = pager
    if (is_final_page) {
      this.setState({isFinalPage: true})
    } else {
      this.setState({isFinalPage: false, nextPage: next_page_path})
    }
  }

  getSearchItem = (e) => {
    const searchItem = e.target.value;
    this.setState({searchItem})
  }

  getMoreItem = () => {
    if(this.state.isFinalPage != true && this.state.nextPage.length > 0) {
      axios.get(`https://lcboapi.com/${this.state.nextPage}`,{
        headers: {
        'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
        }
      }).then(res => {
        if (res.status === 200 && res.data.result != undefined) {
          const newResults = this.state.results.concat(res.data.result)
          this.setState({results: newResults,loading: !this.state.loading})
          this.checkFinalPage(res.data.pager)
        } else {
          this.setState({loading: !this.state.loading})
        }
        
      })
      .catch(err => {
        console.log(err.message)
      })
    }
  }

  handleSubmit = (e) =>{
    // when someone submits the form, we need to do 3 things.
    // 1. we need to stop the form from submitting
    e.preventDefault();
    // 2. grab the search query from the input box
    const searchItem = this.state.searchItem;
    // 3. change the page to /search/whaterecer-they-search-for
    this.context.router.history.push(`/search/${searchItem}`);
    this.search()
  }

  render() {
    return (
          <article className="block">
            <div className="app-header">
              <aside className="header-content">Liquor search app. Powered by LCBO API.</aside>
            </div>
            <div>
              <form className="search-form" onSubmit={this.handleSubmit}>
                <input type="text" className="search-input" onChange={this.getSearchItem} placeholder="item name, item type or keywords" required />
                <input type="submit" className="search-button" value="Search"/>
              </form>
            </div>
            <Results results={this.state.results} />
            {!this.state.isFinalPage ? (
                <button className="load-button" onClick={this.getMoreItem}>Load More</button>
              ) : this.state.loading ? (
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

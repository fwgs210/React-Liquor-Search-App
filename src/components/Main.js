import React, { Component } from 'react';
import Search from './Search';
import Loader from './Loader';
import Results from './Results';
import axios from 'axios';

export const ProductsContext = React.createContext();

class Main extends Component {

  componentDidMount() {
    const searchItem = this.props.match.params.searchItem || undefined;
    if (searchItem != undefined) {
      this.search(searchItem)
      this.setState({searchItem})
    }
  }

  componentWillReceiveProps(newProps) {
    this.search(newProps.match.params.searchItem)

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



  render() {
    return (
          <article className="block">
            <div className="app-header">
              <aside className="header-content">Liquor search app. Powered by LCBO API.</aside>
            </div>
            <Search getSearchItem={this.getSearchItem} searchItem={this.state.searchItem} search={this.search} />
            <ProductsContext.Provider value={this.state.results}>
              <Results />
            </ProductsContext.Provider>
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

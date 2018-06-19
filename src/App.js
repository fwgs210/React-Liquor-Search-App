import React, { Component } from 'react';
import Main from './components/Main';
import SingleItem from './components/SingleItem';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from 'axios';
import PropTypes from "prop-types";


class App extends Component {
  state = {
    searchItem: '',
    loading: false,
    isFinalPage: true,
    nextPage: '',
    results: null
  }

  search = (e) => {
    e.preventDefault();

    this.setState({loading: !this.state.loading})

    axios.get(`http://lcboapi.com/products?q=${this.state.searchItem}`,{
      headers: {
      'Authorization': 'Token MDpiNmQ4NjcwNi1jOTgyLTExZTctYjNkZC0yZjJiNzgxNTE3OWI6MkF6Z0thVUdMZFRibHV1YUdOWWloSnd3ZFhrNXRPVW1HYzI2'
      }
    }).then(res => {
      if (res.data.result == 0 || !res.data) {
        this.setState({loading: !this.state.loading})
      } else {
        this.setState({results: res.data.result,loading: !this.state.loading})
        this.checkFinalPage(res.data.pager)
        console.log(res.data)
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
      axios.get(`http://lcboapi.com/${this.state.nextPage}`,{
        headers: {
        'Authorization': 'Token MDpiNmQ4NjcwNi1jOTgyLTExZTctYjNkZC0yZjJiNzgxNTE3OWI6MkF6Z0thVUdMZFRibHV1YUdOWWloSnd3ZFhrNXRPVW1HYzI2'
        }
      }).then(res => {
        if (res.data.result == 0 || !res.data) {
          this.setState({loading: !this.state.loading})
        } else {
          const newResults = this.state.results.concat(res.data.result)
          this.setState({results: newResults,loading: !this.state.loading})
          this.checkFinalPage(res.data.pager)
          console.log(res.data)
        }
        
      })
      .catch(err => {
        console.log(err.message)
      })
    }
  }


  componentDidMount() {
    // this.searchJobs()
  }

  render() {
    return (
      <BrowserRouter>
        <section className="BG">
          <div className="container">
              <Route exact path="/" render={() => {
                return (<Main results={this.state.results} loading={this.state.loading} search={this.search} getSearchItem={this.getSearchItem} getMoreItem={this.getMoreItem} isFinalPage={this.state.isFinalPage} />)
              }} />
              <Route path="/products/:item" render={() => {
                return (<SingleItem results={this.state.results} />)
              }} />
          </div>
        </section>
      </BrowserRouter>
    )
  }
}

export default App;



import React, { Component } from 'react';
import Main from './components/Main';
import SingleItem from './components/SingleItem';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from 'axios';


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

    axios.get(`https://lcboapi.com/products?q=${this.state.searchItem}`,{
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



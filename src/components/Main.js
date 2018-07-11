import React, { Component } from 'react';
import Search from './Search';
import Loader from './Loader';
import Results from './Results';
import axios from 'axios';
import MapContainer from './Map';
import Stores from './Stores';


export const ProductsContext = React.createContext();

class Main extends Component {

  componentDidMount() {
    const searchItem = this.props.match.params.searchItem || undefined;
    if (searchItem != undefined) {
      this.search(searchItem)
      this.setState({searchItem})
    }
  }

  // componentWillReceiveProps(newProps) {
  //   this.search(newProps.match.params.searchItem)

  // }

  state = {
    badRequest: false,
    searchItem: '',
    searchAddress: '',
    searchForProduct: true,
    loading: false,
    isFinalPage: true,
    nextPage: '',
    stores: null,
    results: null
  }

  search = (searchItem) => {
    this.setState({loading: !this.state.loading, stores: null, results: null})

    if (this.state.searchForProduct) {
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
    } else {
      this.getStores()
    }
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

  searchSwitch = (e) => {
    if (e.target.value === 'forProduct') {
      this.setState({searchForProduct: true})
    } else {
      this.setState({searchForProduct: false})
    }
  }

  getAddress = (searchAddress) => {
    this.setState({searchAddress})
  }

  getStores = () => {
    if (this.state.searchAddress) {
      this.setState({badRequest: false})
        axios.get(`https://lcboapi.com/stores?geo=${this.state.searchAddress}`,{
          headers: {
          'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
          }
        }).then(res => {
          if (res.status === 200 && res.data.result != undefined) {
            this.setState({stores: res.data.result, loading:false})
          } else if (res.status === 400 || res.status === 403 || res.status === 500) {
            this.setState({badRequest: true})
          } else {
            this.setState({badRequest: true})
          }
        })
        .catch(err => {
          this.setState({badRequest: true})
            console.log(err.message)
        })
    } else {
      this.setState({badRequest: true})
    }
  }


  render() {
    return (
          <article className="block">
            <div className="app-header">
              <aside className="header-content">Liquor search app. Powered by LCBO API.</aside>
            </div>
            <Search getSearchItem={this.getSearchItem} searchItem={this.state.searchItem} search={this.search} searchForProduct={this.state.searchForProduct} getAddress={this.getAddress} searchSwitch={this.searchSwitch}  />
            <ProductsContext.Provider value={this.state.results}>
              <Results />
            </ProductsContext.Provider>
            {!this.state.isFinalPage && this.state.results ? (
                <button className="load-button" onClick={this.getMoreItem}>Load More</button>
              ) : this.state.loading ? (
                <Loader />
              ) : (
                <div className="text-center invisible">No more item</div>
              )
            }
            {this.state.stores ? (
                <div className="row main-map">
                  <div className="col-xs-12 col-sm-4">
                    <Stores stores={this.state.stores} />
                  </div>
                  <div className="col-xs-12 col-sm-8">
                    <article className="map-container">
                      <MapContainer stores={this.state.stores} />
                    </article>
                  </div>
                </div>
              ) : (
                <div></div>
              )
            }
          </article>
    );
  }
}

export default Main;

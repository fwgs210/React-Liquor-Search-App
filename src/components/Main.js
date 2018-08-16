import React, { Component } from 'react';
import Search from './Search';
import Loader from './Loader';
import Results from './Results';
import axios from 'axios';
import MapContainer from './Map';
import Stores from './Stores';
import { mutations } from '../actions';
import { connect } from 'react-redux';


export const ProductsContext = React.createContext();

const mstp = ({state}) => state;

const mdtp = (dispatch) => ({
  updateState(newState) {
    const action = mutations.setState(newState);
    dispatch(action)
  }
})

class Main extends Component {

  componentDidMount() {
    const searchItem = this.props.match.params.searchItem || undefined;
    const searchAddress = this.props.match.params.searchAddress || undefined;
    if (searchItem !== undefined) {
      this.search(searchItem)
      this.setState({searchItem})
    }
    if (searchAddress !== undefined) {
      this.setState({searchForProduct: false, searchAddress: searchAddress})
      this.getStores(searchAddress)
    }
  }
 
  // componentWillReceiveProps(newProps) {
  //   if (newProps.match.params.searchItem) {
  //     this.search(newProps.match.params.searchItem)
  //   }
  //   if (newProps.match.params.searchAddress) {
  //     console.log(newProps)
  //     this.getStores(newProps.match.params.searchAddress)
  //   }
    

  // }
  state = {
    badRequest: false,
    searchItem: '',
    searchAddress: '',
    searchForProduct: true,
    loading: false
  }

  search = (searchItem) => {
      this.setState({loading: true})

      axios.get(`https://lcboapi.com/products?q=${searchItem || this.state.searchItem}`,{
        headers: {
        'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
        }
      }).then(res => {
        if (res.status === 200 && res.data.result !== undefined && res.data.result.length > 0) {
          this.setState({loading: false})
          this.props.updateState({results: res.data.result, stores: null})
          this.checkFinalPage(res.data.pager)
        } else {
          this.setState({loading: false, badRequest: true})
          console.log('error')
        }
      })
      .catch(err => {
        console.log(err.message)
        this.setState({loading: false, badRequest: true})
      })
  }
  checkFinalPage = (pager) => {
    const {is_final_page, next_page_path} = pager
    if (is_final_page) {
      this.props.updateState({isFinalPage: true, nextPage: ''})
    } else {
      this.props.updateState({isFinalPage: false, nextPage: next_page_path})
    }
  }

  getSearchItem = (e) => {
    const searchItem = e.target.value;
    this.setState({searchItem})
  }

  getMoreItem = () => {
    if(!this.props.isFinalPage && this.props.nextPage.length > 0) {
      this.setState({loading: true})
      axios.get(`https://lcboapi.com/${this.props.nextPage}`,{
        headers: {
        'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
        }
      }).then(res => {
        if (res.status === 200 && res.data.result !== undefined && res.data.result.length > 0) {
          const newResults = this.props.results.concat(res.data.result)
          this.setState({loading: false})
          this.props.updateState({results: newResults})
          this.checkFinalPage(res.data.pager)
        } else {
          this.setState({loading: false, badRequest: true})
          console.log('error')
        }
        
      })
      .catch(err => {
        console.log(err.message)
        this.setState({loading: false, badRequest: true})
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
    if (typeof searchAddress === 'string') {
      this.setState({searchAddress})
    } else {
      this.setState({searchAddress: searchAddress.target.value})
    }
    
  }

  getStores = (searchAddress) => {
      this.setState({badRequest: false, loading: true})
        axios.get(`https://lcboapi.com/stores?geo=${searchAddress || this.state.searchAddress}`,{
          headers: {
          'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
          }
        }).then(res => {
          if (res.status === 200 && res.data.result !== undefined) {
            this.setState({loading:false})
            this.props.updateState({stores: res.data.result, results: null})
          } else if (res.status === 400 || res.status === 403 || res.status === 500) {
            this.setState({badRequest: true, loading:false})
            this.props.updateState({stores: null, results: null})
          } else {
            this.setState({badRequest: true, loading:false})
            this.props.updateState({stores: null, results: null})
          }
        })
        .catch(err => {
          this.setState({badRequest: true, loading:false})
            console.log(err.message)
        })
  }


  render() {
    const { results, isFinalPage, stores } = this.props
    return (
          <article className="block">
            <div className="app-header">
              <aside className="header-content">Liquor search app. Powered by LCBO API.</aside>
            </div>
            <Search getSearchItem={this.getSearchItem} search={this.search} getStores={this.getStores} getAddress={this.getAddress} searchSwitch={this.searchSwitch} state={this.state}  />
            <ProductsContext.Provider value={results}>
              <Results />
            </ProductsContext.Provider>
            {!isFinalPage && results ? (
                <button className="load-button" onClick={this.getMoreItem}>Load More</button>
              ) : (
                <div className="text-center invisible">No more item</div>
              )
            }
            {this.state.loading ? (
                <Loader />
              ) : stores ? (
                <div className="row main-map">
                  <div className="col-xs-12 col-sm-4">
                    <Stores stores={stores} />
                  </div>
                  <div className="col-xs-12 col-sm-8">
                    <article className="map-container">
                      <MapContainer stores={stores} />
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

export default connect(mstp,mdtp)(Main);

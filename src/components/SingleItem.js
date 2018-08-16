import React, { Component } from 'react';
import axios from 'axios';
import Loader from './Loader';
import ItemTabs from './ItemTabs';
import { ItemAccordions } from './ItemAccordions';
import AutoComplete from './AutoComplete';
import { mutations } from '../actions';
import { connect } from 'react-redux';


const mstp = state => (state)
const mdtp = (dispatch) => ({
  updateState(newState) {
    const action = mutations.setState(newState);
    dispatch(action)
  }
});

class SingleItem extends Component {

	componentDidMount() {
	    const itemId = this.props.match.params.item || undefined;
	    if (itemId !== undefined) {
	    	this.getItemDetail(itemId)
	    }
	}

	constructor({updateState}) {
		super();
		this.state = {
			city: '',
			tabIndex: 0,
			loading: false,
		}
		this.updateState = updateState;
	}

	getItemDetail = (itemId) => {
		
		this.setState({loading: !this.state.loading})

		// get item info
	    axios.get(`https://lcboapi.com/products/${itemId}`,{
	      headers: {
	      'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
	      }
	    }).then(res => {
	      if (res.status === 200 && res.data.result !== undefined) {
	      	this.updateState({itemInfo: res.data.result})
	      	this.setState({loading: !this.state.loading})
	      } else {
	        this.setState({badRequest: true, loading: !this.state.loading})
	      }
	      
	    })
	    .catch(err => {
	      console.log(err.message)
	    })
	}

	getSearchItem = (city) => {
	  this.setState({city})
	}

	getStores = (e) => {
		e.preventDefault();
		this.setState({loading: !this.state.loading})
		if (this.state.city) {
			this.setState({badRequest: false})
			const url = window.location.href.split('/');
			const itemId = url[url.length - 1]

		    axios.get(`https://lcboapi.com/stores?geo=${this.state.city}?product_id=${itemId}`,{
		      headers: {
		      'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
		      }
		    }).then(res => {
		      if (res.status === 200 && res.data.result !== undefined) {
		      	this.updateState({stores: res.data.result})
		      	this.setState({loading: !this.state.loading})
		      } else if (res.status === 400 || res.status === 403 || res.status === 500) {
		      	this.setState({badRequest: true,loading: !this.state.loading})
		      } else {
		        this.setState({badRequest: true,loading: !this.state.loading})
		      }
		    })
		    .catch(err => {
		    	this.setState({badRequest: true,loading: !this.state.loading})
		      	console.log(err.message)
		    })
		} else {
			this.setState({badRequest: true,loading: !this.state.loading})
		}
	}

	formattedPrice = (price) => {
		let formattedPrice = price / 100;
		formattedPrice = formattedPrice.toLocaleString("en-US", {style:"currency", currency:"CAD"});
		return <h2>{formattedPrice}</h2>
	}
 
	render() {
		if (this.props.state.itemInfo) {
			const { name, origin, image_url, producer_name, serving_suggestion, style, tasting_note, price_in_cents } = this.props.state.itemInfo;
			return (
					<div className="row">
						<div className="col-xs-12 col-sm-8 col-sm-push-2">
							<div className="block full-img">
								{image_url !== null && image_url !== undefined && image_url.length > 0 ? (
			                         	<img src={image_url} alt={name} />
			                        ) : (
			                         	<img src="https://www.novelupdates.com/img/noimagefound.jpg" alt="image not found" />
			                        )
		                        }
								<h1>{name}</h1>
				                <p><em>Origin: {origin}<br/>
				                Style: {style}</em></p>
					            {price_in_cents !== null && price_in_cents !== undefined ? (
					            		this.formattedPrice(price_in_cents)
				                    ) : (
				                        <h2>No price listed!</h2>
				                    )
			                    }
			                    <ItemAccordions producer_name={producer_name} serving_suggestion={serving_suggestion} tasting_note={tasting_note} />
							</div>
						</div>
						<div className="col-xs-12 col-sm-8 col-sm-push-2">
							<div className="block">
								<h3 className="text-center">Find this item in nearby stores:</h3>

								<form className="search-form square" onSubmit={this.getStores}>
									<AutoComplete className="search-input square" placeholder="city name, intersection or postal code" getAddress={this.getSearchItem} />
					                <input type="submit" className="search-button square" value="Find"/>
					            </form>
					            {this.state.badRequest ? (
					            	<p style={{color: '#D31C1D',textAlign: 'center'}}>Please enter a proper address.</p>
					            ) : (<span></span>)}
					            <ItemTabs loading={this.state.loading} />
							</div>
						</div>
					</div>
			)
		} else if (this.state.badRequest) {
			return (
					<div className="row">
						<div className="col-xs-12">
							<div className="block">
								<h1>404. Wrong request!</h1>
							</div>
						</div>
					</div>
			)
		} else {
			// show nothing
			return (
				<Loader />
			)
		}
	}
}

export default connect(mstp, mdtp)(SingleItem);
import React, { Component } from 'react';
import axios from 'axios';
import Stores from './Stores';
import MapContainer from './Map';
import Loader from './Loader';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AutoComplete from './AutoComplete';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

const MapContext = React.createContext();

class SingleItem extends Component {

	componentDidMount() {
	    const itemId = this.props.match.params.item || undefined;
	    if (itemId != undefined) {
	    	this.getItemDetail(itemId)
	    }
	}

	state = {
		badRequest: false,
		itemInfo: null,
		stores: null,
		city: '',
		tabIndex: 0,
		loading: false,
	}

	getItemDetail = (itemId) => {
		
		this.setState({loading: !this.state.loading})

		// get item info
	    axios.get(`https://lcboapi.com/products/${itemId}`,{
	      headers: {
	      'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
	      }
	    }).then(res => {
	      if (res.status === 200 && res.data.result != undefined) {
	      	this.setState({itemInfo: res.data.result,loading: !this.state.loading})
	      	console.log(res.data)
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

		if (this.state.city) {
			this.setState({badRequest: false})
			const url = window.location.href.split('/');
			const itemId = url[url.length - 1]

		    axios.get(`https://lcboapi.com/stores?geo=${this.state.city}?product_id=${itemId}`,{
		      headers: {
		      'Authorization': 'Token MDpkMWEyZmQ1OC03NDA0LTExZTgtYjQ1NS0yYmI2ZmQ0NDk5NzQ6NHRzaHdOdHNvQnh4bEQxTkpFY2twYXBrZnZoSzc5eG1lVTVC'
		      }
		    }).then(res => {
		      if (res.status === 200 && res.data.result != undefined) {
		      	this.setState({stores: res.data.result})
		        console.log(res.data.result)
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

	formattedPrice = (price) => {
		let formattedPrice = price / 100;
		formattedPrice = formattedPrice.toLocaleString("en-US", {style:"currency", currency:"CAD"});
		return <h2>{formattedPrice}</h2>
	}
 
	render() {
		if (this.state.itemInfo) {
			const { name, origin, image_url, producer_name, serving_suggestion, style, tasting_note, price_in_cents } = this.state.itemInfo;
			return (
					<div className="row">
						<div className="col-xs-12 col-sm-8 col-sm-push-2">
							<div className="block full-img">
								{image_url != null && image_url != undefined && image_url.length > 0 ? (
			                         	<img src={image_url} />
			                        ) : (
			                         	<img src="https://www.novelupdates.com/img/noimagefound.jpg" />
			                        )
		                        }
								<h1>{name}</h1>
				                <p><em>Origin: {origin}<br/>
				                Style: {style}</em></p>
					            {price_in_cents != null && price_in_cents != undefined ? (
					            		this.formattedPrice(price_in_cents)
				                    ) : (
				                        <h2>No price listed!</h2>
				                    )
			                    }
							    <Accordion>
							        <AccordionItem>
							            <AccordionItemTitle>
							                <h4 className="u-position-relative">Producer
							                <div className="accordion__arrow" role="presentation"></div>
							                </h4>
							            </AccordionItemTitle>
							            <AccordionItemBody>
							                <p>{producer_name}</p>
							            </AccordionItemBody>
							        </AccordionItem>
							        <AccordionItem>
							            <AccordionItemTitle>
							                <h4 className="u-position-relative">Serving Suggestion
							                <div className="accordion__arrow" role="presentation"></div>
							                </h4>
							            </AccordionItemTitle>
							            <AccordionItemBody>
							                <p>{serving_suggestion}</p>
							            </AccordionItemBody>
							        </AccordionItem>
							        <AccordionItem>
							            <AccordionItemTitle>
							                <h4 className="u-position-relative">Tasting Note
							                <div className="accordion__arrow" role="presentation"></div>
							                </h4>
							            </AccordionItemTitle>
							            <AccordionItemBody>
							                <p>{tasting_note}</p>
							            </AccordionItemBody>
							        </AccordionItem>
							    </Accordion>
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
					            	<p style={{color: '#D31C1D'}}>Please enter a proper address.</p>
					            ) : (<span></span>)}
					            {this.state.stores ? (
						            	<MapContext.Provider value={this.state.stores}>
								           	<Tabs className="store-tabs" selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
												<TabList>
											    	<Tab>List View</Tab>
											    	<Tab>Map View</Tab>
												</TabList>
												<TabPanel>
													<MapContext.Consumer>
      													{stores => (
															<Stores stores={stores} />
														)}
													</MapContext.Consumer>
												</TabPanel>
												<TabPanel>
													<article className="map-container">
														<MapContext.Consumer>
      														{stores => (
																<MapContainer stores={stores} />
															)}
														</MapContext.Consumer>
													</article>
												</TabPanel>
											</Tabs>
										</MapContext.Provider>
									) : this.state.loading ? (
										<Loader />
									) : (
										<div></div>
									)
								}
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

export default SingleItem;
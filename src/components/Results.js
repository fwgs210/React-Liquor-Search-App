import React, { Component } from 'react';
import {ProductsContext} from './Main';
import ProductList from './ProductList';


class Results extends Component {

	render() {
		return (
			<ProductsContext.Consumer>
				{results => (
					typeof results == 'string' ? (
						<div>{this.props.results}</div>
					) : results ? (
						<ProductList results={results} />
					) : (<div></div>)
				)}
			</ProductsContext.Consumer>
		)
	}
}

export default Results;
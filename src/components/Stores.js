import React, { Component } from 'react';


class Stores extends Component {

	render() {
		if (this.props.stores && this.props.stores != undefined && this.props.stores != null) {
			return (
				<div className="store-lists">
					{this.props.stores.map((each, key) => {
							const {name, telephone, address_line_1} = each;
	                          return (
	                          	<article className="store-name" key={key}>
			                        <p><strong>{name}</strong><br/>
			                        {address_line_1}</p>
			                        <a href="tel:{telephone}">{telephone}</a>
		                        </article>
	                          )
	                        })
	                }
				</div>
			)
		} else {
			return (
				// nothing
				<div></div>
			)
		}
	}
}

export default Stores;
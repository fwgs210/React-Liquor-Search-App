import React, { Component } from 'react';
import Autocomplete from 'react-google-autocomplete';

class AutoComplete extends Component {

	render() {
		return	<Autocomplete
					type="text"
					className={this.props.className}
					onPlaceSelected={(place) => {
							if (place.formatted_address) {
								this.props.getAddress(place.formatted_address)
							} else {
								this.props.getAddress(place.name)
							}
					}}
					types={['address']}
					onChange={(e) => this.props.getAddress(e)}
					componentRestrictions={{country: "ca"}}
					placeholder={this.props.placeholder}
					value={this.props.value}
					required
				/>

	}
}

export default AutoComplete;
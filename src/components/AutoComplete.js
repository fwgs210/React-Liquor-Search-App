import React, { Component } from 'react';
import Autocomplete from 'react-google-autocomplete';

class AutoComplete extends Component {
	render() {
		return	<Autocomplete
					type="text"
					className={this.props.className}
					onPlaceSelected={(place) => {
							this.props.getAddress(place.formatted_address)
					}}
					types={['address']}
					componentRestrictions={{country: "ca"}}
					placeholder={this.props.placeholder}
					required
				/>

	}
}

export default AutoComplete;
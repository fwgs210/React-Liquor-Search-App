import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 
export class MapContainer extends Component {

	componentDidMount (){
		if (this.props.stores && this.props.stores != null) {
			this.getMapCenter(this.props.stores[0])
		}
	}

	componentWillReceiveProps(newProps) {
		this.getMapCenter(newProps.stores[0])
	}

	state = {
	    showingInfoWindow: false,
	    activeMarker: {},
	    selectedPlace: {},
	    mapCenter: null
	};

	onMarkerClick = (props, marker, e) =>
	    this.setState({
	      selectedPlace: props,
	      activeMarker: marker,
	      showingInfoWindow: true
	});
	 
	onMapClicked = (props) => {
	    if (this.state.showingInfoWindow) {
	      this.setState({
	        showingInfoWindow: false,
	        activeMarker: null
	      })
	    }
	};

 	getMapCenter = (props) => {
		const {latitude, longitude} = props;
		console.log(latitude, longitude)
		this.setState({mapCenter: {lat: latitude, lng: longitude}})
	}

  	render() {
	  	const style = {
		  	width: '100%',
		  	height: '100%',
		  	position: 'relative'
		}

		if (this.props.stores && this.props.stores != null) {
	    	return (
		      	<Map google={this.props.google} zoom={14} style={style} center={this.state.mapCenter} onClick={this.onMapClicked}>
						{this.props.stores.map((each,key)=> {
							const {name, telephone, address_line_1, latitude, longitude} = each;
			                return <Marker onClick={this.onMarkerClick} name={name} title={name} address={address_line_1} tel={telephone} position={{lat:latitude,lng:longitude}} key={key} />
						})}
						<InfoWindow
				          marker={this.state.activeMarker}
				          visible={this.state.showingInfoWindow}>
				            <div>
				              <h3>{this.state.selectedPlace.name}</h3>
				              {this.state.selectedPlace.address}
				              <p><a href="tel:{this.state.selectedPlace.tel}">{this.state.selectedPlace.tel}</a></p>
				            </div>
				        </InfoWindow>
		      	</Map>
	    	);
		} else {
			return <div></div>
		}


  	}
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyBOhqaXKzYZC3fqsH-KAk2RQ2wdNGMr39M')
})(MapContainer)
import React, { Component } from 'react';
import axios from 'axios';

class SingleItem extends Component {

	componentDidMount() {
	    this.getItemDetail()
	}

	state = {
		badRequest: false,
		itemInfo: null,
		loading: false
	}

	getItemDetail = () => {
		const url = window.location.href.split('/');
		const jobId = url[url.length - 1]
		
		this.setState({loading: !this.state.loading})

		// get job info
	    axios.get(`https://lcboapi.com/products/${jobId}`,{
	      headers: {
	      'Authorization': 'Token MDpiNmQ4NjcwNi1jOTgyLTExZTctYjNkZC0yZjJiNzgxNTE3OWI6MkF6Z0thVUdMZFRibHV1YUdOWWloSnd3ZFhrNXRPVW1HYzI2'
	      }
	    }).then(res => {
	      if (res.data.result.length == 0 || !res.data) {
	        this.setState({badRequest: true, loading: !this.state.loading})
	      } else {
	        this.setState({itemInfo: res.data.result,loading: !this.state.loading})
	        console.log(res.data.result)
	      }
	      
	    })
	    .catch(err => {
	      console.log(err.message)
	    })

	}
 
	render() {
		if (this.state.itemInfo) {
			const { name, origin, image_url, producer_name, serving_suggestion, style, tasting_note } = this.state.itemInfo;
			return (
					<div className="row">
						<div className="col-xs-12 col-sm-6">
							<div className="block full-img">
								<img src={image_url} />
							</div>
						</div>
						<div className="col-xs-12 col-sm-6">
							<div className="block">
								<h1>{name}</h1>
								<h3>Produced by: {producer_name}</h3>
				                <p><strong>Origin: {origin}</strong></p>
				                <p><strong>Strong: {style}</strong></p>
				                <br/>
				                <h4>Serving Suggestion:</h4>
				                <p>{serving_suggestion}</p>
				                <h4>Tasting Note</h4>
				                <p>{tasting_note}</p>
							</div>
						</div>
					</div>
			)
		} else if (this.state.badRequest === true) {
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
				<div></div>
			)
		}
	}
}

export default SingleItem;
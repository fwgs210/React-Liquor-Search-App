import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Results extends Component {
	render() {
			return (
				<div className="row item-lists">
					{this.props.results.map((each, key) => {
							const {id, image_thumb_url, name, tasting_note, origin} = each;
	                          return (
	                          	<article className="col-xs-12 col-sm-6 col-md-3" key={key}>
		                            <Link to={`/products/${id}`} id={id} className="item-list">
		                            	<aside className="thumb">
		                            		{image_thumb_url !== null && image_thumb_url !== undefined && image_thumb_url.length > 0 ? (
			                            			<img src={image_thumb_url} alt={name} />
			                            		) : (
			                            			<img src="https://www.novelupdates.com/img/noimagefound.jpg" alt="not image found" />
			                            		)
		                            		}
		                            	</aside>
		                            	<summary className="detail">
			                            	<h3>{name}</h3>
			                            	<h4>Origin: {origin}</h4>
			                            	<p>
												{tasting_note !== null && tasting_note !== undefined && tasting_note.length > 70 ? (
												        tasting_note.substring(0,69) + ' ...'
												      ) : (
												        tasting_note
												      )
												}
			                            	</p>
			                            </summary>
		                            </Link>
		                        </article>
	                          )
	                        })
	                }
				</div>
			)
	}
}

export default Results;
import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Loader from './Loader';
import Stores from './Stores';
import MapContainer from './Map';

const mstp = ({state}) => state;

const ItemTabs = ({stores, loading}) => {
	if (loading) {
		return <Loader />
	} else if (stores) {
		return <Tabs className="store-tabs"  >
			<TabList>
				<Tab>List View</Tab>
				<Tab>Map View</Tab>
			</TabList>
			<TabPanel>
				<Stores stores={stores} />
			</TabPanel>
			<TabPanel>
				<article className="map-container">
					<MapContainer stores={stores} />
				</article>
			</TabPanel>
		</Tabs>
	} else {return <React.Fragment></React.Fragment>}
}

export default connect(mstp)(ItemTabs);
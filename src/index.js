import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/bootstrap.css'
import './css/style.css'
import { store } from './reducers'
import { Provider } from 'react-redux'


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('app')
);

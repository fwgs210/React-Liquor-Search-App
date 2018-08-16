import { combineReducers, createStore } from 'redux';

const defaultState = {
	state: {
		itemInfo: null,
	    isFinalPage: true,
	    nextPage: '',
	    stores: null,
	    results: null
	},
	loading: false
}

const state = (state = defaultState.state, action) => {
	switch(action.type) {
		case 'SET_STATE':
			return {...state, ...action.newState}
		default:
			return state
	} 
}

const loading = (loading = false, action) => {
	switch(action.type) {
		case 'SET_LOADING':
			return !action.loading;
		default: 
			return loading;
	}
}

const loadingtest = (loadingtest = false, action) => {
	switch(action.type) {
		case 'SET_LOADING':
			return !action.loadingtest;
		default: 
			return loadingtest;
	}
}

const reducer = combineReducers({
  state,
  loading,
  loadingtest
})

export const store = createStore(reducer);
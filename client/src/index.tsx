import React from 'react';
import ReactDOM from 'react-dom/client';

import { applyMiddleware, Store } from 'redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import App from './App';
import reducer from './store/reducer';

import reportWebVitals from './reportWebVitals';

import './index.css';
import { DispatchType, ErrorAction, ErrorState } from './types';

// const store: Store<ErrorState, ErrorAction> & {
// 	dispatch: DispatchType;
// } = createStoreHook(reducer);

const store = configureStore({
  reducer: reducer,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

serviceWorkerRegistration.register();

reportWebVitals();

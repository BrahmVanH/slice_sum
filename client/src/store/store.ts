import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducer';
export * as actionCreators from './actionCreators';

export const store = configureStore({
	reducer: reducers,
});
